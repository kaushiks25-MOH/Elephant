import { supabase } from './supabase';

// No longer needs auth
export async function submitReport(count, severity, notes, latitude, longitude, imageFile) {
  let imageUrl = null;
  
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence_photos')
      .upload(fileName, imageFile);
      
    if (uploadError) throw new Error('Failed to upload image: ' + uploadError.message);
    
    const { data: publicUrlData } = supabase.storage
      .from('evidence_photos')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrlData.publicUrl;
  }
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000000', // Default guest ID or omit if nullable
      elephant_count: count,
      severity: severity,
      notes: notes,
      latitude: latitude,
      longitude: longitude,
      image_url: imageUrl
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
  
  // Format for UI
  return data.map(r => ({
    ...r,
    officer_name: 'Field Report',
    range_division: 'Public Entry'
  }));
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
    severity: a.reports.severity,
    range_division: 'Public Entry'
  }));
}

export async function fetchAnalytics() {
  const [{ count: totalReports }, { count: activeAlerts }, { count: highSeverity }] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'UNREAD'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('severity', 'HIGH')
  ]);
  
  return {
    totalReports: totalReports || 0,
    activeAlerts: activeAlerts || 0,
    highSeverity: highSeverity || 0
  };
}
