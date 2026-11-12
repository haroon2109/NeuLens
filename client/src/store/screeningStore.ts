import { create } from 'zustand';

export type ScreeningStep =
  | 'language-select'
  | 'intro'
  | 'sensor-check'
  | 'functional-assessment'
  | 'adaptive-practice' // non-clinical, adaptive; never used for scores/baseline/change comparison
  | 'game1'
  | 'game2'
  | 'game3'
  | 'game4'
  | 'game5'
  | 'piano-sequence' // fixed-observation clinical sequencing task
  | 'submitting'
  | 'results';

export interface CognitiveScores {
  memoryScore: number;
  attentionScore: number;
  visuospatialScore: number;
  executiveScore: number;
  compositeScore: number;
  game1Score: number; // Focus Orbit (dot tracking)
  game2Score: number; // Cortex Match (memory match)
  game3Score: number; // Vocal Echo (voice repeat)
  game4Score: number; // Mimic Sync (facial tasks)
  game5Score: number; // Path Mapper (trail making)
  game6Score: number; // Piano Sequence (fixed observation)
}

export interface BiometricMetrics {
  eye: {
    reactionTimes: number[];
    fixationStability: number;
    blinkCount: number;
    avgEAR: number;
    trackingAccuracy: number;
  };
  face: {
    smileIntensity: number;
    jawOpening: number;
    eyebrowsRaising: number;
    stability: number;
    headPose: { yaw: number; pitch: number; roll: number };
  };
  speech: {
    speechRate: number;
    pitch: number;
    jitter: number;
    shimmer: number;
    pauseCount: number;
    mfcc: number[];
    duration: number;
  };
}

interface ScreeningState {
  currentStep: ScreeningStep;
  rawResponses: Record<string, any>;
  scores: CognitiveScores;
  biometricMetrics: BiometricMetrics | null;
  isSubmitting: boolean;
  
  setStep: (step: ScreeningStep) => void;
  saveResponse: (domain: string, data: any) => void;
  setScores: (scores: CognitiveScores) => void;
  setSubmitting: (submitting: boolean) => void;
  resetSession: () => void;
  calculateFinalScores: () => void;
}

const initialScores: CognitiveScores = {
  memoryScore: 0,
  attentionScore: 0,
  visuospatialScore: 0,
  executiveScore: 0,
  compositeScore: 0,
  game1Score: 0,
  game2Score: 0,
  game3Score: 0,
  game4Score: 0,
  game5Score: 0,
  game6Score: 0
};

export const useScreeningStore = create<ScreeningState>((set, get) => ({
  currentStep: 'language-select',
  rawResponses: {},
  scores: initialScores,
  biometricMetrics: null,
  isSubmitting: false,

  setStep: (step: ScreeningStep) => set({ currentStep: step }),

  saveResponse: (domain: string, data: any) => {
    set((state) => ({
      rawResponses: {
        ...state.rawResponses,
        [domain]: data
      }
    }));
  },

  setScores: (scores: CognitiveScores) => set({ scores }),

  setSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),

  resetSession: () => set({
    currentStep: 'language-select',
    rawResponses: {},
    scores: initialScores,
    biometricMetrics: null,
    isSubmitting: false
  }),

  calculateFinalScores: () => {
    const { rawResponses } = get();

    // Fixed-observation clinical activities only. Adaptive practice is explicitly excluded.
    const g1Score = rawResponses.game1?.score ?? 85;
    const g2Score = rawResponses.game2?.score ?? 90;
    const g3Score = rawResponses.game3?.score ?? 80;
    const g4Score = rawResponses.game4?.score ?? 85;
    const g5Score = rawResponses.game5?.score ?? 78;
    const g6Score = rawResponses.pianoSequence?.score ?? rawResponses.game6?.score ?? 80;

    // Map fixed-observation tasks into cognitive domains (standardized observation, not adaptive practice):
    const memory = Math.round((g2Score + g6Score) / 2); // Cortex Match + Piano Sequence (sequencing/recall)
    const attention = Math.round((g1Score + g4Score) / 2); // Dot follow + gesture sync
    const spatial = g5Score; // Trail tracing maps visuospatial orientation
    const executive = Math.round((g5Score + g2Score + g6Score) / 3); // Planning/flexibility/sequencing signals

    const composite = Math.round((memory + attention + spatial + executive) / 4);

    // Extract connected Biometric Metrics (from recorded fixed-observation activities)
    const eye = {
      reactionTimes: rawResponses.game1?.reactionTimes || [],
      fixationStability: rawResponses.game1?.fixationStability || 85,
      blinkCount: rawResponses.game1?.blinkCount || 0,
      avgEAR: rawResponses.game1?.avgEAR || 0.28,
      trackingAccuracy: rawResponses.game1?.trackingAccuracy || 85
    };

    const face = {
      smileIntensity: rawResponses.game4?.smileIntensity || 0,
      jawOpening: rawResponses.game4?.jawOpening || 0,
      eyebrowsRaising: rawResponses.game4?.eyebrowsRaising || 0,
      stability: rawResponses.game4?.stability || 90,
      headPose: rawResponses.game4?.headPose || { yaw: 0, pitch: 0, roll: 0 }
    };

    const speech = {
      speechRate: rawResponses.game3?.speechRate || 140,
      pitch: rawResponses.game3?.pitch || 120,
      jitter: rawResponses.game3?.jitter || 0.12,
      shimmer: rawResponses.game3?.shimmer || 1.1,
      pauseCount: rawResponses.game3?.pauseCount || 2,
      mfcc: rawResponses.game3?.mfcc || [48.1, -12.4, 33.9, 10.2],
      duration: rawResponses.game3?.duration || 4.5
    };

    set({
      scores: {
        memoryScore: memory,
        attentionScore: attention,
        visuospatialScore: spatial,
        executiveScore: executive,
        compositeScore: composite,
        game1Score: g1Score,
        game2Score: g2Score,
        game3Score: g3Score,
        game4Score: g4Score,
        game5Score: g5Score,
        game6Score: g6Score
      },
      biometricMetrics: { eye, face, speech }
    });
  }
}));
