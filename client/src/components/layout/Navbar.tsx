import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, INotificationItem } from '../../types';
import { fetchNotificationsApi } from '../../services/api';
import {
  Bell,
  Search,
  Shield,
  UserCheck,
  ChevronDown,
  LogOut,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ROLES: UserRole[] = [
  'Admin',
  'Maintenance Engineer',
  'Plant Operator',
  'Quality Engineer',
  'Safety Officer',
  'Auditor',
];

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);

  useEffect(() => {
    fetchNotificationsApi().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left Search Bar */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search industrial SOPs, equipment tags (e.g. GT-800), incidents..."
            className="w-full bg-[#111724] border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Quick Role Switcher (Evaluation Demo Control) */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-950 to-emerald-950 border border-cyan-500/40 rounded-full px-3 py-1.5 text-xs text-cyan-300 hover:border-cyan-400 transition-all shadow-glow-cyan"
            title="Switch Enterprise Role for Hackathon Evaluation"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-[11px]">{user?.role}</span>
            <ChevronDown className="w-3 h-3 text-cyan-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl p-2 z-50 border border-slate-700">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Role (RBAC Demo)
              </div>
              <div className="py-1 space-y-1">
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      user?.role === r
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 rounded-lg bg-[#111724] border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl p-3 z-50 border border-slate-700">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">Industrial Notifications</span>
                <span className="text-[10px] text-cyan-400 font-medium">{unreadCount} new</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto py-1">
                {notifications.map(n => (
                  <Link
                    key={n._id}
                    to={n.link || '#'}
                    onClick={() => setNotifMenuOpen(false)}
                    className="block py-2.5 px-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      {n.type === 'emergency' ? (
                        <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      ) : n.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-bold text-xs text-black shadow-glow-cyan">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 leading-none">{user?.name}</div>
              <div className="text-[10px] text-slate-400 leading-none mt-1">{user?.department}</div>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl p-2 z-50 border border-slate-700">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
