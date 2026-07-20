import React, { useState, useEffect } from 'react';
import { fetchAdminUsersApi, fetchAuditLogsApi } from '../services/api';
import { IUser, IAuditLogItem, UserRole } from '../types';
import { Settings, Users, Shield, Cpu, Activity, Clock, CheckCircle2, Lock } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [logs, setLogs] = useState<IAuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'ai'>('users');

  useEffect(() => {
    Promise.all([fetchAdminUsersApi(), fetchAuditLogsApi()]).then(([uData, lData]) => {
      setUsers(uData);
      setLogs(lData);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Admin Control & Security Panel</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage enterprise users, role permissions (RBAC), audit logging, and AI token consumption.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'logs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>System Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'ai'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Token Analytics</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#0B0F17]">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">RBAC Rights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{u.department}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-[10px] text-slate-400 font-mono">
                      Full Access
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Audit Trail Logs</h3>
          <div className="space-y-2">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#070A11] border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{log.action} • {log.userName} ({log.role})</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono text-right">
                  <div>{log.ipAddress}</div>
                  <div>{new Date(log.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase">Monthly Token Usage</div>
            <div className="text-3xl font-bold font-display text-cyan-400 mt-2">842,000</div>
            <p className="text-xs text-slate-400 mt-1">Google Gemini API 1.5 Flash</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase">Vector DB Embeddings</div>
            <div className="text-3xl font-bold font-display text-emerald-400 mt-2">4,120 Chunks</div>
            <p className="text-xs text-slate-400 mt-1">ChromaDB / MongoDB Cosine Store</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase">OCR Tesseract Processing</div>
            <div className="text-3xl font-bold font-display text-cyan-400 mt-2">100% Extracted</div>
            <p className="text-xs text-slate-400 mt-1">Scanned PDFs & Manuals</p>
          </div>
        </div>
      )}
    </div>
  );
};
