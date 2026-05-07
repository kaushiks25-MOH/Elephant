import { supabase } from './supabase';

export async function registerUser(email, password, name, role, rangeDivision) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: role,
        range_division: rangeDivision
      }
    }
  });
  
  if (error) throw new Error(error.message);
  return data;
}

export async function login(username, password) {
  // Supabase Auth requires an email. We assume username is an email here.
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password,
  });
  
  if (error) throw new Error(error.message);
  
  // Fetch user profile to get role and name
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profileError) throw new Error('Failed to fetch user profile');
  
  return { token: data.session.access_token, user: profileData };
}

export async function fetchReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, users!inner(name, range_division)')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error('Failed to fetch reports');
  
  // Format to match old structure
  return data.map(r => ({
    ...r,
    officer_name: r.users.name,
    range_division: r.users.range_division
  }));
}

export async function fetchActiveAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, reports!inner(latitude, longitude, severity, users!inner(range_division))')
    .eq('status', 'UNREAD')
    .order('created_at', { ascending: false });
    
  if (error) throw new Error('Failed to fetch alerts');
  
  // Format
  return data.map(a => ({
    ...a,
    latitude: a.reports.latitude,
    longitude: a.reports.longitude,
    severity: a.reports.severity,
    range_division: a.reports.users.range_division
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

export async function submitReport(count, severity, notes, latitude, longitude, imageFile) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  
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
      user_id: userData.user.id,
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
