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
  const password = formData.get("password") as string;
  
  if (!email || !password) return { error: "Email and password are required" };

  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return { error: error?.message || "Invalid login credentials." };
  }

  // The middleware will handle appropriate routing based on company_id metadata
  redirect("/");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
