import { KnowledgeGraphModel, IKnowledgeGraph } from '../models/KnowledgeGraph';

export const getOrSeedKnowledgeGraph = async () => {
  let kg = await KnowledgeGraphModel.findOne().exec();

  if (!kg) {
    kg = await KnowledgeGraphModel.create({
      nodes: [
        { id: 'dept-maint', label: 'Maintenance Dept', type: 'Department', category: 'Operations' },
        { id: 'dept-safety', label: 'Safety & EHS', type: 'Department', category: 'Compliance' },
        { id: 'dept-prod', label: 'Production Line A', type: 'Department', category: 'Manufacturing' },
        { id: 'equip-gt800', label: 'Gas Turbine GT-800', type: 'Equipment', category: 'Power Generation', details: '35MW Dual-Fuel Turbine' },
        { id: 'equip-c102', label: 'Compressor C-102', type: 'Equipment', category: 'Pressurization', details: 'Centrifugal Gas Compressor' },
        { id: 'equip-cr200', label: 'Reactor CR-200', type: 'Equipment', category: 'Refining', details: 'Hydro-Cracker Pressure Vessel' },
        { id: 'sop-402', label: 'SOP-402 Emergency Shutdown', type: 'SOP', details: 'Mandatory Emergency Protocol' },
        { id: 'sop-109', label: 'SOP-109 Bearing Replacement', type: 'SOP', details: 'Mechanical Repair SOP' },
        { id: 'inc-2025-09', label: 'Incident #2025-09: Overheating', type: 'Incident', details: 'Bearing temperature exceeded 95°C' },
        { id: 'fail-bearing', label: 'Bearing Inner Race Fatigue', type: 'Failure', details: 'Vibration peak 4.8 mm/s' },
        { id: 'proc-loto', label: 'Lock-Out Tag-Out Procedure', type: 'Process', details: 'OSHA Standard 1910.147' },
      ],
      edges: [
        { id: 'e1', source: 'dept-maint', target: 'equip-gt800', relation: 'MANAGES', weight: 2 },
        { id: 'e2', source: 'dept-maint', target: 'equip-c102', relation: 'MANAGES', weight: 2 },
        { id: 'e3', source: 'equip-gt800', target: 'sop-402', relation: 'GOVERNED_BY', weight: 3 },
        { id: 'e4', source: 'equip-c102', target: 'sop-109', relation: 'GOVERNED_BY', weight: 3 },
        { id: 'e5', source: 'equip-c102', target: 'inc-2025-09', relation: 'EXP_INCIDENT', weight: 2 },
        { id: 'e6', source: 'inc-2025-09', target: 'fail-bearing', relation: 'CAUSED_BY', weight: 3 },
        { id: 'e7', source: 'dept-safety', target: 'proc-loto', relation: 'ENFORCES', weight: 3 },
        { id: 'e8', source: 'sop-109', target: 'proc-loto', relation: 'REQUIRES', weight: 3 },
        { id: 'e9', source: 'equip-cr200', target: 'dept-prod', relation: 'OPERATED_BY', weight: 2 },
      ],
    });
  }

  return kg;
};

export const addEntityToKnowledgeGraph = async (nodeData: any, edgeData: any) => {
  const kg = await getOrSeedKnowledgeGraph();
  if (nodeData) kg.nodes.push(nodeData);
  if (edgeData) kg.edges.push(edgeData);
  await kg.save();
  return kg;
};
