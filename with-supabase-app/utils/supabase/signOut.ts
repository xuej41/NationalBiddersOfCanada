import { createClient } from '@/utils/supabase/client';
import { encodedRedirect } from '@/utils/utils';

export default async function signOut(){
  const supabase = await createClient();  
  const { error } = await supabase.auth.signOut(); // Correctly call signOut on the Supabase client

  if (error) {
    return encodedRedirect("error", "/sign-out", error.message);
  }

  return encodedRedirect("success", "/", "Signed out successfully");
};