
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';


import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";


export async function POST(req: NextRequest){
    const formData = await req.formData()

    return signInAction(formData)

}

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};