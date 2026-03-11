"use client";

import { useState } from "react";
import { ShieldAlert, Globe, Bell, Zap, Database } from "lucide-react";

export function SystemSettingsToggles() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    publicSignups: false,
    emailNotifications: true,
    edgeCaching: true,
    debugLogging: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-foreground/5 dark:bg-foreground/10 border border-black/10 dark:border-white/10 rounded-sm p-4 md:p-6 mt-6 md:mt-8">
      <h3 className="font-heading text-lg md:text-xl mb-6 flex items-center gap-2">
        <Database size={18} className="text-vividOrange" /> 
        Platform Configuration
      </h3>
      
      <div className="space-y-6">
        <SettingRow 
          icon={<ShieldAlert size={16} />}
          title="Maintenance Mode"
          description="Temporarily disable access to all client vaults. Admins can still log in."
          active={settings.maintenanceMode}
          onClick={() => toggleSetting('maintenanceMode')}
          danger
        />
        
        <SettingRow 
           icon={<Globe size={16} />}
           title="Public Registrations"
           description="Allow new users to sign up without an explicit invitation."
           active={settings.publicSignups}
           onClick={() => toggleSetting('publicSignups')}
        />

        <SettingRow 
           icon={<Zap size={16} />}
           title="Edge Caching"
           description="Cache media assets at edge nodes for faster global delivery. Increases egress costs."
           active={settings.edgeCaching}
           onClick={() => toggleSetting('edgeCaching')}
        />

        <SettingRow 
           icon={<Bell size={16} />}
           title="System Notifications"
           description="Receive daily digest emails for system activity and storage thresholds."
           active={settings.emailNotifications}
           onClick={() => toggleSetting('emailNotifications')}
        />
      </div>
    </div>
  );
}

function SettingRow({ icon, title, description, active, onClick, danger }: { icon: React.ReactNode, title: string, description: string, active: boolean, onClick: () => void, danger?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0">
      <div className="flex gap-4">
        <div className={`mt-1 sm:mt-0 p-2 rounded-sm bg-background border border-black/10 dark:border-white/10 ${danger && active ? 'text-red-500' : 'text-foreground/60'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-heading text-base md:text-lg tracking-tight mb-1">{title}</h4>
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest opacity-50 max-w-md">{description}</p>
        </div>
      </div>
      
      <button 
        onClick={onClick}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 self-start sm:self-auto ${active ? (danger ? 'bg-red-500' : 'bg-vividOrange') : 'bg-black/20 dark:bg-white/20'}`}
      >
        <span 
          className={`absolute top-1 left-1 bg-background w-4 h-4 rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
