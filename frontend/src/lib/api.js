import { supabase } from './supabase';

/**
 * Submits a report (Sighting or Clearance) with optional Voice Note
 */
export async function submitReport({ 
  count, 
  severity, 
  notes, 
  latitude, 
  longitude, 
  range,
  image,
  voice,
  reportType = 'SIGHTING',
  isClear = false,
  damageDesc = '',
  casualties = 0,
  // New Detailed Fields
  officerName = '',
  designation = '',
  teamMembers = '',
  bullCount = 0,
  makhnaCount = 0,
  maleGroupCount = 0,
  femaleGroupCount = 0,
  femaleCalfCount = 0,
  singleFemaleCount = 0,
  isDamageCaused = false,
  damageType = '',
  chaseStartTime = '',
  chaseResult = '',
  remarks = ''
}) {
  let imageUrl = null;
  let voiceUrl = null;
  
  // Handle Image Upload
  if (image) {
    const fileExt = image.name?.split('.').pop() || 'jpg';
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('evidence_photos').upload(fileName, image);
    if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);
    imageUrl = supabase.storage.from('evidence_photos').getPublicUrl(fileName).data.publicUrl;
  }

  // Handle Voice Upload
  if (voice) {
    const fileName = `voice_${Date.now()}.webm`; 
    const { error: voiceError } = await supabase.storage.from('evidence_photos').upload(fileName, voice);
    if (voiceError) throw new Error('Voice upload failed: ' + voiceError.message);
    voiceUrl = supabase.storage.from('evidence_photos').getPublicUrl(fileName).data.publicUrl;
  }
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: null,
      elephant_count: count || 0,
      severity: severity || 'LOW',
      notes: notes,
      latitude: latitude,
      longitude: longitude,
      range: range,
      image_url: imageUrl,
      voice_url: voiceUrl,
      report_type: reportType,
      is_clear: isClear,
      damage_desc: damageDesc,
      casualties: casualties,
      // Mapping Detailed Fields
      officer_name: officerName,
      designation: designation,
      team_members: teamMembers,
      bull_count: bullCount,
      makhna_count: makhnaCount,
      male_group_count: maleGroupCount,
      female_group_count: femaleGroupCount,
      female_calf_count: femaleCalfCount,
      single_female_count: singleFemaleCount,
      is_damage_caused: isDamageCaused,
      damage_type: damageType,
      chase_start_time: chaseStartTime || null,
      chase_result: chaseResult,
      remarks: remarks
    })
    .select()
    .single();
    
  if (error) throw new Error('Failed to save report: ' + error.message);
  return data;
}

export async function fetchReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error('Failed to fetch reports');
  return data;
}

export async function fetchActiveAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, reports!inner(*)')
    .eq('status', 'UNREAD')
    .order('created_at', { ascending: false });
  if (error) throw new Error('Failed to fetch alerts');
  return data.map(a => ({
    ...a,
    latitude: a.reports.latitude,
    longitude: a.reports.longitude,
    severity: a.reports.severity
  }));
}

export async function fetchAnalytics() {
  const [{ count: totalReports }, { count: activeAlerts }, { count: highSeverity }] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'UNREAD'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('severity', 'HIGH')
  ]);

  // Fetch range-wise status
  const { data: rangeData } = await supabase
    .from('reports')
    .select('range, severity, created_at')
    .order('created_at', { ascending: false });

  const ranges = ['Coimbatore', 'Mettupalayam', 'Sirumugai', 'Periyanaickenpalayam', 'Karamadai', 'Madukkarai'];
  const rangeStatus = ranges.map(r => {
    const rangeReports = rangeData?.filter(rd => rd.range === r) || [];
    const hasActiveAlert = rangeReports.some(rd => rd.severity === 'HIGH' && (new Date() - new Date(rd.created_at)) < 86400000); // Active if < 24h
    return {
      name: r,
      status: hasActiveAlert ? 'Alert' : (rangeReports.length > 0 ? 'Active' : 'Clear'),
      count: rangeReports.length,
      lastSync: rangeReports[0] ? new Date(rangeReports[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      color: hasActiveAlert ? 'bg-red-500' : (rangeReports.length > 0 ? 'bg-orange-500' : 'bg-green-500')
    };
  });

  return { totalReports, activeAlerts, highSeverity, rangeStatus };
}
