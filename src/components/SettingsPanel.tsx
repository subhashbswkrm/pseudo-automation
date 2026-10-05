import React, { useState } from 'react';
import {
  Bell,
  Building2,
  ChevronRight,
  Globe,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  SunMedium,
  Users,
} from 'lucide-react';

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
  { id: 'security', label: 'Security' },
  { id: 'database', label: 'Database Management' },
] as const;

export const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]['id']>('profile');

  const dbRows = [
    { name: 'Recruitment DB', status: 'Connected', records: '12,482', health: 'Healthy' },
    { name: 'Company Memory', status: 'Connected', records: '8,231', health: 'Healthy' },
    { name: 'Analytics DB', status: 'Connected', records: '3,781', health: 'Warning' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">Settings</h2>
            <p className="mt-1 text-xs text-slate-400">
              Profile, account, security controls, and database administration.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`rounded-lg px-3 py-2 text-[11px] font-medium transition-colors ${
                  activeSection === id ? 'bg-purple-500/15 text-purple-200 ring-1 ring-purple-500/40' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.6fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-500 text-lg font-bold text-white">
                AD
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Alicia Dev</h3>
                <p className="text-xs text-slate-400">@alicia.dev</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Account status
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span>Organization</span>
                <span className="text-slate-300">Northstar Labs</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span>Subscription</span>
                <span className="text-emerald-300">Pro • Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Profile</h3>
                <p className="mt-1 text-xs text-slate-400">Manage the identity shown across the platform.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-xs text-slate-300">
                  <span>Name</span>
                  <input defaultValue="Alicia Dev" className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-purple-500/60 focus:outline-none" />
                </label>
                <label className="space-y-2 text-xs text-slate-300">
                  <span>Username</span>
                  <input defaultValue="alicia.dev" className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-purple-500/60 focus:outline-none" />
                </label>
                <label className="space-y-2 text-xs text-slate-300 md:col-span-2">
                  <span>Email</span>
                  <input defaultValue="alicia@northstarlabs.ai" className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-purple-500/60 focus:outline-none" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
                    <SunMedium className="h-3.5 w-3.5 text-amber-400" /> Theme
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Appearance</span>
                    <span className="text-emerald-300">Dark</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" /> Language
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Default</span>
                    <span className="text-slate-300">English</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
                  <Bell className="h-3.5 w-3.5 text-purple-400" /> Notification preferences
                </div>
                <div className="space-y-2 text-sm text-slate-200">
                  {['Workflow alerts', 'Approval reminders', 'System health updates'].map((item) => (
                    <label key={item} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                      <span>{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-purple-500" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Account</h3>
                <p className="mt-1 text-xs text-slate-400">Manage the workspace and plan details.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="text-sm text-slate-200">Organization</div>
                      <div className="text-xs text-slate-400">Northstar Labs</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="text-sm text-slate-200">Account status</div>
                      <div className="text-xs text-slate-400">Verified and enabled</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono uppercase text-emerald-300">Active</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="text-sm text-slate-200">Subscription</div>
                      <div className="text-xs text-slate-400">Pro plan • Renewal in 18 days</div>
                    </div>
                  </div>
                  <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-200">Manage</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Security</h3>
                <p className="mt-1 text-xs text-slate-400">Secure access and workspace governance.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Two-factor authentication', value: 'Enabled', icon: Lock },
                  { label: 'Single sign-on', value: 'Google Workspace', icon: ShieldCheck },
                  { label: 'Connected accounts', value: '3 active links', icon: Mail },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-sm text-slate-200">{label}</div>
                        <div className="text-xs text-slate-400">{value}</div>
                      </div>
                    </div>
                    <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-200">Configure</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Database Management</h3>
                <p className="mt-1 text-xs text-slate-400">Connect, inspect, and administer workspace data stores.</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="mb-3 flex items-center justify-between px-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">Database list</span>
                  <button type="button" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">Add database</button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="min-w-full text-left">
                    <thead className="bg-slate-900/80 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                      <tr>
                        <th className="px-3 py-2.5">Database</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5">Records</th>
                        <th className="px-3 py-2.5">Health</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-200">
                      {dbRows.map((row) => (
                        <tr key={row.name} className="border-t border-slate-800 bg-slate-950/25">
                          <td className="px-3 py-3 font-medium">{row.name}</td>
                          <td className="px-3 py-3">
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-300">
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-mono text-xs text-slate-300">{row.records}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${
                              row.health === 'Healthy'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                            }`}>
                              {row.health}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
