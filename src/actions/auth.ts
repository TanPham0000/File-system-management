"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockCompanies } from "@/lib/mockData";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return;

  // Admin access
  if (email.toLowerCase() === "admin@pham.com") {
    cookies().set("role", "admin", { httpOnly: true, path: "/" });
    redirect("/admin");
  }

  // Client access
  let clientId = "comp-1"; // Default to TechSummit for the mock
  if (email.toLowerCase().includes("innovate.com")) {
    clientId = "comp-2";
  }

  cookies().set("client_id", clientId, { httpOnly: true, path: "/" });
  cookies().set("role", "client", { httpOnly: true, path: "/" });

  redirect("/");
}

export async function logout() {
  cookies().delete("client_id");
  cookies().delete("role");
  redirect("/login");
}
