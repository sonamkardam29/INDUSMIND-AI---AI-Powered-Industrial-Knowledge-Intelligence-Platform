import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Bot,
  Network,
  Wrench,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Cpu,
  Zap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Document Hub', path: '/documents', icon: FileText },
    { name: 'AI Knowledge Copilot', path: '/copilot', icon: Bot, badge: 'RAG v2.4' },
    { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
    { name: 'Maintenance Copilot', path: '/maintenance', icon: Wrench },
    { name: 'Quality & Compliance', path: '/compliance', icon: ShieldCheck },
    { name: 'PDF Reports', path: '/reports', icon: FileSpreadsheet },
    ...(user?.role === 'Admin' || user?.role === 'Auditor'
      ? [{ name: 'Admin Panel', path: '/admin', icon: Settings }]
      : []),
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30 shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-glow-cyan">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="font-display font-bold text-base tracking-tight text-white block leading-none">
            INDUS<span className="text-cyan-400">MIND</span> AI
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1 block">
            ET AI Hackathon 2026
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Industrial Intelligence
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-cyan-500/20 text-cyan-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 m-3 rounded-xl glass-panel border border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold text-slate-200">Gemini RAG Online</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Grounding: <span className="text-emerald-400 font-bold">100% Anti-Hallucination</span>
        </p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[96%]" />
        </div>
      </div>
    </aside>
  );
};
