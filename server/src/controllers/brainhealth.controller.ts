import { Response, NextFunction } from 'express';
import { HospitalDataStore } from '../models/dataStore';
import { AuthenticatedRequest } from '../middleware/auth';

export const getBrainHealthProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const profile = await HospitalDataStore.getBrainHealthProfile(req.user.id);
    if (!profile) return res.status(404).json({ error: 'No brain health profile generated yet' });

    return res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

export const createBrainHealthProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { changeDetectionId, profileScore, riskTier, interpretation, nextSteps } = req.body;

    const profile = await HospitalDataStore.createBrainHealthProfile({
      userId: req.user.id,
      changeDetectionId,
      profileScore: Number(profileScore),
      riskTier,
      interpretation,
      nextSteps: Array.isArray(nextSteps) ? nextSteps : [],
    });

    return res.status(201).json({ profile });
  } catch (err) {
    next(err);
  }
};