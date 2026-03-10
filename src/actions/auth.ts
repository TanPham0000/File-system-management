"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ActionState = {
  message?: string;
  error?: string;
  success?: boolean;
};

export async function login(prevState: ActionState | undefined, formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  // const supabase = createClient();
  
  // Note: For Magic Link auth, the user will receive an email.
  // const { error } = await supabase.auth.signInWithOtp({
  //   email,
  //   options: {
  //     // Configure this to match your deployed URL eventually. 
  //     // For local development it should match localhost.
  //     emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  //   },
  // });

  // if (error) {
  //   return { error: error.message };
  // }

  // Bypass mail check for testing purposes
  if (email.includes("admin")) {
    redirect("/admin");
  } else {
    redirect("/vault/cl_001");
  }

  // return { success: true, message: "Check your email for the magic link!" };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
