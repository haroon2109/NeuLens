import { Response, NextFunction } from 'express';
import { HospitalDataStore } from '../models/dataStore';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBaseline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const baseline = await HospitalDataStore.getActiveBaseline(req.user.id);
    if (!baseline) return res.status(404).json({ error: 'No baseline established yet' });

    return res.status(200).json({ baseline });
  } catch (err) {
    next(err);
  }
};

export const establishBaseline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { overallScore, cognitiveScore, functionalScore, eyeScore, voiceScore, faceScore, contextScore } = req.body;

    const baseline = await HospitalDataStore.createBaseline({
      userId: req.user.id,
      overallScore: Number(overallScore),
      cognitiveScore: Number(cognitiveScore),
      functionalScore: Number(functionalScore),
      eyeScore: eyeScore ? Number(eyeScore) : null,
      voiceScore: voiceScore ? Number(voiceScore) : null,
      faceScore: faceScore ? Number(faceScore) : null,
      contextScore: contextScore ? Number(contextScore) : null,
    });

    return res.status(201).json({ baseline });
  } catch (err) {
    next(err);
  }
};