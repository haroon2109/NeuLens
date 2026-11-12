import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { inMemoryAssessments } from './screening.controller';

export const getTrends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let assessments: any[];

    try {
      assessments = await prisma.assessment.findMany({
        where: { userId: req.user.id },
        orderBy: { date: 'asc' },
        include: {
          eyeMetrics: true,
          voiceMetrics: true,
          faceMetrics: true,
        }
      });
    } catch (dbError) {
      console.warn('Prisma DB error fetching trends. Falling back to memory:', dbError);
      assessments = inMemoryAssessments
        .filter(s => s.userId === req.user?.id)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    // Map data for easy UI chart ingestion
    const labels = assessments.map(s => {
      const date = new Date(s.date);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    const datasetOverall = assessments.map(s => s.overallScore);
    const datasetReaction = assessments.map(s => s.eyeMetrics?.reactionTime || 0);
    const datasetSymmetry = assessments.map(s => s.faceMetrics?.symmetry || 0);
    const datasetJitter = assessments.map(s => s.voiceMetrics?.jitter || 0);

    return res.status(200).json({
      trends: {
        labels,
        datasets: {
          overall: datasetOverall,
          reactionTime: datasetReaction,
          symmetry: datasetSymmetry,
          jitter: datasetJitter
        },
        rawCount: assessments.length
      }
    });
  } catch (error) {
    next(error);
  }
};
