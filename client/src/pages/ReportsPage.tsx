import React from 'react';
import { getPDFReportDownloadUrl } from '../services/api';
import { FileText, Download, ShieldCheck, Wrench, AlertTriangle, FileSpreadsheet, Sparkles } from 'lucide-react';

const REPORT_ITEMS = [
  {
    title: 'Gas Turbine GT-800 Maintenance & RCA Report',
    type: 'Maintenance',
    department: 'Maintenance & Reliability',
    date: '2026-07-20',
    description: 'Synthesizes bearing thermal logs, vibration frequency spectrum, and SKF part recommendations.',
    icon: Wrench,
  },
  {
    title: 'ISO 9001:2015 Operations Audit Report',
    type: 'Audit',
    department: 'Operations',
    date: '2026-07-19',
    description: 'Evaluates document control, missing LOTO checklists, and procedural adherence score.',
    icon: ShieldCheck,
  },
  {
    title: 'Refinery Reactor CR-200 Inspection Log',
    type: 'Inspection',
    department: 'Refining',
    date: '2026-07-18',
    description: 'Hydro-cracker vessel wall thickness ultrasonic testing and pressure relief setpoints.',
    icon: FileText,
  },
  {
    title: 'EHS Incident #2025-09 AI Summary Report',
    type: 'Incident',
    department: 'Safety & EHS',
    date: '2026-07-15',
    description: 'Root cause determination for bearing overheating anomaly and corrective actions.',
    icon: AlertTriangle,
  },
];

export const ReportsPage: React.FC = () => {
  const handleDownload = (type: string, title: string, department: string) => {
    const url = getPDFReportDownloadUrl(type, title, department);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INDUSMIND_${type}_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Enterprise PDF Reports Center</h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate downloadable industrial PDF reports formatted for executive review, plant managers, and regulatory auditors.
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPORT_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.type} Report
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <div className="text-[10px] text-cyan-400 font-semibold mb-2">{item.department} • Generated {item.date}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PDF Engine Ready</span>
                </span>

                <button
                  onClick={() => handleDownload(item.type, item.title, item.department)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
