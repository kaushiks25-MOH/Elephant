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
  imageFile,
  voiceFile, // New
  reportType = 'SIGHTING',
  isClear = false,
  damageDesc = '',
  casualties = 0
}) {
  let imageUrl = null;
  let voiceUrl = null;
  
  // Handle Image Upload
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `img_${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('evidence_photos').upload(fileName, imageFile);
    if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);
    imageUrl = supabase.storage.from('evidence_photos').getPublicUrl(fileName).data.publicUrl;
  }

  // Handle Voice Upload
  if (voiceFile) {
    const fileName = `voice_${Date.now()}.webm`; // Most browsers use webm for MediaRecorder
    const { error: voiceError } = await supabase.storage.from('evidence_photos').upload(fileName, voiceFile);
    if (voiceError) throw new Error('Voice upload failed: ' + voiceError.message);
    voiceUrl = supabase.storage.from('evidence_photos').getPublicUrl(fileName).data.publicUrl;
  }
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      elephant_count: count || 0,
      severity: severity || 'LOW',
      notes: notes,
      latitude: latitude,
      longitude: longitude,
      image_url: imageUrl,
      voice_url: voiceUrl, // New
      report_type: reportType,
      is_clear: isClear,
      damage_desc: damageDesc,
      casualties: casualties
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
  return { totalReports, activeAlerts, highSeverity };
}
