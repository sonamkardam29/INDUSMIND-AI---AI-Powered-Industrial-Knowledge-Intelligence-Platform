import React, { useState, useEffect } from 'react';
import { fetchKnowledgeGraphApi } from '../services/api';
import { IKGNode, IKGEdge } from '../types';
import { Network, Filter, Info, ShieldCheck, Wrench, AlertTriangle, Layers, Cpu, Search } from 'lucide-react';

export const KnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<IKGNode[]>([]);
  const [edges, setEdges] = useState<IKGEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<IKGNode | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchKnowledgeGraphApi().then(data => {
      setNodes(data.nodes);
      setEdges(data.edges);
      if (data.nodes.length > 0) setSelectedNode(data.nodes[2]); // Default select GT-800
    });
  }, []);

  const filteredNodes = nodes.filter(n => {
    const matchesType = filterType === 'All' || n.type === filterType;
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getConnectedEdges = (nodeId: string) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Interactive Knowledge Graph</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatically extracted industrial entity relationships connecting Gas Turbines, SOPs, Departments, Failure modes, and Incident logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            {nodes.length} Nodes • {edges.length} Graph Connections
          </span>
        </div>
      </div>

      {/* Graph Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entity node (e.g. GT-800, SOP-402, Vibration)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#070A11] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Equipment', 'SOP', 'Department', 'Incident', 'Failure'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                filterType === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Visual Graph Canvas Container */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 relative min-h-[500px] flex flex-col justify-between overflow-hidden bg-[#070A11]/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-4 border-b border-slate-800/80 pb-3">
            <span className="flex items-center space-x-2 text-slate-200">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Entity Relationship Map</span>
            </span>
            <span>Click any node to view relational metadata</span>
          </div>

          {/* Interactive Graph Node Grid Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto p-4">
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              let badgeColor = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
              if (node.type === 'SOP') badgeColor = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
              if (node.type === 'Incident') badgeColor = 'bg-red-500/10 border-red-500/30 text-red-400';
              if (node.type === 'Failure') badgeColor = 'bg-amber-500/10 border-amber-500/30 text-amber-400';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-tr from-cyan-950 to-slate-900 border-cyan-400 shadow-glow-cyan scale-105 z-10'
                      : 'bg-[#0B0F17] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {node.type}
                    </span>
                    <Cpu className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-100 truncate">{node.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{node.details || node.category}</div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Legend: Equipment (Cyan) • SOP (Emerald) • Incident (Red) • Failure (Amber)</span>
            <span className="text-cyan-400 font-semibold">Live Knowledge Network</span>
          </div>
        </div>

        {/* Selected Node Connections Side Drawer */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Node Details</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {selectedNode.type}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedNode.details || 'Industrial entity extracted from RAG SOPs.'}</p>
              </div>

              <div className="bg-[#070A11] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Graph Connections ({getConnectedEdges(selectedNode.id).length})</span>
                </div>

                <div className="space-y-2">
                  {getConnectedEdges(selectedNode.id).map(edge => {
                    const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const targetNode = nodes.find(n => n.id === otherNodeId);
                    return (
                      <div key={edge.id} className="p-2.5 rounded-xl bg-[#0B0F17] border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-cyan-300">{targetNode?.label || otherNodeId}</span>
                          <span className="text-[10px] text-slate-400 block">{targetNode?.type}</span>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {edge.relation}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select any node on the left graph to view its detailed relational graph map.
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Knowledge Graph automatically updates as new SOPs are uploaded.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
