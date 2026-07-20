import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getOrSeedKnowledgeGraph, addEntityToKnowledgeGraph } from '../services/kgService';

export const getKnowledgeGraph = async (_req: AuthRequest, res: Response) => {
  try {
    const kg = await getOrSeedKnowledgeGraph();
    return res.json({ nodes: kg.nodes, edges: kg.edges });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const addGraphEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { node, edge } = req.body;
    const updatedKg = await addEntityToKnowledgeGraph(node, edge);
    return res.json({ message: 'Knowledge graph updated.', graph: updatedKg });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
