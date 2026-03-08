"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/actions/auth';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-atomicBlack flex flex-col justify-center items-center px-6 relative overflow-hidden text-almostWhite">
      {/* Background ambient effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-vividOrange via-atomicBlack to-atomicBlack"></div>
      
      <div className="z-10 w-full max-w-md flex flex-col items-center">
        <h1 className="font-heading text-4xl mb-4 tracking-tight">PHAM.</h1>
        <p className="font-special text-xl text-center italic mb-12 opacity-90 leading-relaxed">
          "Moments deserve to last longer than the moment itself."
        </p>

        <div className="w-full bg-[#1A1A1A] border border-[#333] p-8 rounded-xl shadow-2xl relative">
          <form action={login} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="email" className="font-mono text-xs text-almostWhite/50 uppercase tracking-wider">
                Client Access Portal
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your work email"
                className="w-full bg-[#0F0F0F] border border-[#333] rounded-md px-4 py-3 font-body text-almostWhite placeholder:text-almostWhite/30 focus:outline-none focus:border-vividOrange transition-colors relative z-10"
                required
                defaultValue="sarah@techsummit.com" // Pre-filled for demo purposes
              />
            </div>
            
            <SubmitButton />
          </form>

          <p className="mt-6 text-center font-mono text-[10px] text-almostWhite/30 uppercase tracking-widest">
            System Alert: Authorized Personnel Only
            <br/><br/>
            (Demo: Try 'sarah@techsummit.com' or 'admin@pham.com')
          </p>
        </div>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-vividOrange text-atomicBlack font-heading font-semibold rounded-md py-3 mt-2 hover:bg-[#ffaa40] transition-colors focus:outline-none focus:ring-2 focus:ring-vividOrange focus:ring-offset-2 focus:ring-offset-atomicBlack relative z-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-atomicBlack/30 border-t-atomicBlack rounded-full animate-spin"></span>
          Authenticating...
        </>
      ) : (
        "Enter Vault"
      )}
    </button>
  );
}
