import React, { useState, useEffect } from 'react';
import { generateMaintenanceGuideApi, fetchMaintenanceRecordsApi } from '../services/api';
import { IMaintenanceRecord } from '../types';
import { Wrench, Zap, Clock, AlertTriangle, CheckCircle2, Package, Shield, FileText, Sparkles } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [records, setRecords] = useState<IMaintenanceRecord[]>([]);
  const [equipmentId, setEquipmentId] = useState('GT-800');
  const [equipmentName, setEquipmentName] = useState('Gas Turbine GT-800');
  const [issueType, setIssueType] = useState('Bearing Overheating & Vibration Anomaly');
  const [description, setDescription] = useState('Drive-end roller bearing temperature reading 98°C with peak vibration 4.8 mm/s RMS.');
  const [loading, setLoading] = useState(false);
  const [activeRecord, setActiveRecord] = useState<IMaintenanceRecord | null>(null);

  useEffect(() => {
    fetchMaintenanceRecordsApi().then(recs => {
      setRecords(recs);
      if (recs.length > 0) setActiveRecord(recs[0]);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rec = await generateMaintenanceGuideApi({
        equipmentId,
        equipmentName,
        issueType,
        description,
        department: 'Maintenance',
      });

      setRecords(prev => [rec, ...prev]);
      setActiveRecord(rec);
    } catch (err: any) {
      alert('Maintenance guide generated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Maintenance Copilot & Root Cause Analysis (RCA)</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated failure diagnosis, step-by-step repair checklists, downtime estimators, and spare parts recommendator derived from equipment SOPs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Generate AI Maintenance Plan</h3>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Equipment ID & Name</label>
              <input
                type="text"
                value={equipmentName}
                onChange={e => setEquipmentName(e.target.value)}
                required
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue / Anomaly Type</label>
              <input
                type="text"
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                required
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Observed Symptoms / Sensor Telemetry</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#070A11] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Generating RCA Plan...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Maintenance RCA</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RCA Output Display Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          {activeRecord ? (
            <div className="space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">RCA Diagnosis Plan</span>
                  <h2 className="text-lg font-bold text-white">{activeRecord.equipmentName} ({activeRecord.equipmentId})</h2>
                  <p className="text-xs text-slate-400">Issue: {activeRecord.issueType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Urgency: {activeRecord.urgency}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Est. Downtime: {activeRecord.downtimeEstimateHours} Hours
                  </span>
                </div>
              </div>

              {/* Diagnosis Summary */}
              <div className="bg-[#070A11] p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
                  <Zap className="w-4 h-4" />
                  <span>AI Root Cause Diagnosis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeRecord.diagnosis}</p>
              </div>

              {/* Step-by-Step Repair Guide */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Step-by-Step Repair Checklist</h4>
                <div className="space-y-2">
                  {activeRecord.repairSteps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#070A11] border border-slate-800 flex items-start space-x-3 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Spare Parts */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Spare Parts</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRecord.spareParts.map((part, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#070A11] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{part.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">PN: {part.partNumber}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Qty: {part.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs">
              Fill in equipment parameters on the left to generate a complete AI Maintenance RCA plan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
