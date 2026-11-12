import { Response, NextFunction } from 'express';
import { HospitalDataStore } from '../models/dataStore';
import { AuthenticatedRequest } from '../middleware/auth';
import { runAssessmentCompletionWorkflow } from '../services/workflow';

export const submitAssessmentComplete = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const {
      overallScore,
      riskLevel,
      reactionTime,
      blinkRate,
      fixationScore,
      speechRate,
      pauseScore,
      jitter,
      shimmer,
      symmetry,
      tremorScore,
      taskResponses,
      recommendation
    } = req.body;

    const assessmentData = {
      overallScore: Number(overallScore),
      riskLevel: String(riskLevel),
      reactionTime: Number(reactionTime),
      blinkRate: Number(blinkRate),
      fixationScore: Number(fixationScore),
      speechRate: Number(speechRate),
      pauseScore: Number(pauseScore),
      jitter: Number(jitter),
      shimmer: Number(shimmer),
      symmetry: Number(symmetry),
      tremorScore: Number(tremorScore),
      taskResponses,
      recommendation: recommendation || 'Clinical review pending.',
    };

    // 1. Persist assessment (creates assessment record)
    const savedAssessment = await HospitalDataStore.submitAssessment(req.user.id, assessmentData);

    // 2. Run deterministic NeuLens workflow:
    //    Safety & Accessibility -> History/Baseline -> Longitudinal Intelligence (change/evidence/uncertainty)
    //    -> Clinical Documentation (source-linked draft) -> Follow-up Coordination (clinician-owned actions).
    const result = await runAssessmentCompletionWorkflow(req.user.id, savedAssessment, taskResponses);

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
