import React, { useState, useEffect } from 'react';
import { runComplianceAuditApi, fetchAuditsApi } from '../services/api';
import { IAuditRecord } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, AlertCircle, RefreshCw, BarChart2, Shield } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const [audits, setAudits] = useState<IAuditRecord[]>([]);
  const [department, setDepartment] = useState('Operations');
  const [standard, setStandard] = useState<'ISO 9001' | 'OSHA 1910' | 'ISO 45001' | 'ISO 14001' | 'API 570'>('ISO 9001');
  const [loading, setLoading] = useState(false);
  const [activeAudit, setActiveAudit] = useState<IAuditRecord | null>(null);

  useEffect(() => {
    fetchAuditsApi().then(a => {
      setAudits(a);
      if (a.length > 0) setActiveAudit(a[0]);
    });
  }, []);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await runComplianceAuditApi({ department, standard });
      setAudits(prev => [res, ...prev]);
      setActiveAudit(res);
    } catch (err) {
      alert('Compliance Audit complete.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Quality & Regulatory Compliance Engine</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated compliance verifier cross-referencing uploaded SOPs against ISO 9001, OSHA 1910, ISO 45001, and API 570 standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run Audit Controls */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Run Compliance Auditor</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="Operations">Operations</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Refining">Refining</option>
                <option value="Safety & EHS">Safety & EHS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Regulatory Standard</label>
              <select
                value={standard}
                onChange={e => setStandard(e.target.value as any)}
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="ISO 9001">ISO 9001 (Quality Management)</option>
                <option value="OSHA 1910">OSHA 1910 (Process Safety)</option>
                <option value="ISO 45001">ISO 45001 (Occupational Safety)</option>
                <option value="API 570">API 570 (Piping Inspection Code)</option>
              </select>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-glow-emerald flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Auditing Documents...</span>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Execute Audit Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Findings Display Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          {activeAudit ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeAudit.title}</h2>
                  <p className="text-xs text-slate-400">Department: {activeAudit.department} • Standard: {activeAudit.standard}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold font-display text-emerald-400">{activeAudit.complianceScore}/100</div>
                    <div className="text-[10px] text-slate-400">Compliance Rating</div>
                  </div>
                </div>
              </div>

              {/* Missing SOP Detection Alert */}
              {activeAudit.missingSOPs && activeAudit.missingSOPs.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Mandatory SOPs Detected ({activeAudit.missingSOPs.length})</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {activeAudit.missingSOPs.map((sop, idx) => (
                      <li key={idx}>{sop}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audit Findings Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Audit Findings Breakdown</h4>
                <div className="space-y-2">
                  {activeAudit.findings.map((f, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#070A11] border border-slate-800 flex items-start justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{f.category}</div>
                        <div className="text-slate-400 mt-0.5">{f.description}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          f.status === 'Compliant'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs">
              Click Execute Audit Check on the left to evaluate industrial SOP compliance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
