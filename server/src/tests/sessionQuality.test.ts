import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HospitalDataStore } from '../models/dataStore';
import { deriveSessionQuality } from '../services/sessionQuality';
import { evaluateSafetyAccessibility, runAssessmentCompletionWorkflow } from '../services/workflow';
import { submitAssessmentComplete } from '../controllers/assessmentcomplete.controller';
import { summarizePatientChanges } from '../services/changeMonitor';
import type { AssessmentRecord } from '../models/dataStore';

/**
 * A session only reports its own quality if the browser sends it. These tests fix
 * the contract in both directions: a session with quality metadata can establish a
 * baseline and be interpreted, and a session without it cannot.
 */

const functionalCheckIn = (activities: Record<string, number>) => ({
  completedAt: '2026-11-20T09:00:00.000Z',
  activities,
  contextFactors: { sleep: 1, activity: 1, moodStress: 1 },
  assessmentContext: {
    language: 'en' as const,
    ageYears: 70,
    educationYears: 12,
    taskVersion: 'neulens-mvp-0.1',
    accessibility: { vision: 0, hearing: 0, motor: 0, digitalFamiliarity: 0 }
  }
});

const activities = { appointments: 0, medication: 1, finances: 0, household: 2 };

const battery = {
  game1: { score: 80 },
  game2: { score: 90 },
  game3: { score: 85 },
  game4: { score: 85 },
  game5: { score: 88 },
  pianoSequence: { score: 95 }
};

const comparableQuality = {
  comparable: true,
  completion: 'FULL',
  interruptions: 0,
  reasons: [],
  recordedAt: '2026-11-20T09:10:00.000Z'
};

// Stored-session shape. Metrics are absent on purpose: this test is about the
// quality contract, and a missing measurement must stay missing.
const storedSession = (overallScore: number, taskResponses: Record<string, any>) => ({
  overallScore,
  reactionTime: null,
  blinkRate: null,
  fixationScore: null,
  speechRate: null,
  pauseScore: null,
  jitter: null,
  shimmer: null,
  symmetry: null,
  tremorScore: null,
  taskResponses
});

const createPatient = async (name: string, pin: string) =>
  HospitalDataStore.createPatient({
    name,
    age: 70,
    dob: '1956',
    pin,
    gender: 'FEMALE',
    language: 'en',
    educationYears: 12,
    handedness: 'RIGHT'
  });

describe('Session comparability contract', () => {
  describe('deriveSessionQuality', () => {
    it('treats a session that reported no quality as unverified', () => {
      const quality = deriveSessionQuality({ game1: { score: 80 } });
      assert.strictEqual(quality.comparable, false);
      assert.deepStrictEqual(quality.reasons, ['QUALITY_UNKNOWN']);
    });

    it('accepts a fully completed, low-interruption, explicitly comparable session', () => {
      const quality = deriveSessionQuality({ quality: comparableQuality });
      assert.strictEqual(quality.comparable, true);
      assert.deepStrictEqual(quality.reasons, []);
    });

    it('withholds comparability from a partial or repeatedly interrupted session', () => {
      const partial = deriveSessionQuality({
        quality: { ...comparableQuality, completion: 'PARTIAL' }
      });
      assert.strictEqual(partial.comparable, false);
      assert.deepStrictEqual(partial.reasons, ['INCOMPLETE_SESSION']);

      const interrupted = deriveSessionQuality({
        quality: { ...comparableQuality, interruptions: 3 }
      });
      assert.strictEqual(interrupted.comparable, false);
      assert.deepStrictEqual(interrupted.reasons, ['EXCESSIVE_INTERRUPTIONS']);
    });
  });

  describe('consent record', () => {
    it('reads the consent key the screening flow actually writes', () => {
      const safety = evaluateSafetyAccessibility(
        {
          externalContextConsent: { granted: true, recordedAt: '2026-11-20T09:00:00.000Z' }
        },
        []
      );
      assert.strictEqual(safety.consent.recorded, true);
      assert.strictEqual(safety.consent.missing, false);
      assert.ok(!safety.accessibility.missingContext.includes('consent_record_missing'));
    });

    it('still reads legacy consent keys and reports a session with none', () => {
      const legacy = evaluateSafetyAccessibility(
        { consent: { granted: true, recordedAt: '2026-11-20T09:00:00.000Z' } },
        []
      );
      assert.strictEqual(legacy.consent.recorded, true);

      const none = evaluateSafetyAccessibility({ game1: { score: 80 } }, []);
      assert.strictEqual(none.consent.missing, true);
      assert.ok(none.accessibility.missingContext.includes('consent_record_missing'));
    });
  });

  describe('baseline establishment', () => {
    it('does not let an unreported-quality session become the personal baseline', async () => {
      const { user } = await createPatient('Unverified Quality Patient', '7101');
      const saved = await HospitalDataStore.submitAssessment(user.id, storedSession(88, {
        ...battery,
        functionalCheckIn: functionalCheckIn(activities)
      }));

      const result = await runAssessmentCompletionWorkflow(user.id, saved, saved.taskResponses);
      assert.strictEqual(result.baseline, null);
      assert.strictEqual(result.platform.baselineType, 'NONE_ESTABLISHED');
      assert.strictEqual(result.platform.sessionQuality.comparable, false);
      assert.match(result.message, /excluded from change interpretation/);

      const baselineStage = result.platform.pathway.find((stage: any) => stage.key === 'personal_baseline');
      assert.strictEqual(baselineStage.state, 'NOT_ESTABLISHED');
    });

    it('establishes a provisional baseline from a comparable session', async () => {
      const { user } = await createPatient('Comparable Quality Patient', '7102');
      const saved = await HospitalDataStore.submitAssessment(user.id, storedSession(88, {
        ...battery,
        functionalCheckIn: functionalCheckIn(activities),
        quality: comparableQuality
      }));

      const result = await runAssessmentCompletionWorkflow(user.id, saved, saved.taskResponses);
      assert.ok(result.baseline, 'a comparable session establishes the baseline');
      assert.strictEqual(result.baseline.overallScore, 88);
      assert.strictEqual(result.platform.baselineType, 'PROVISIONAL_PERSONAL_BASELINE');
      assert.strictEqual(result.platform.sessionQuality.comparable, true);
      assert.doesNotMatch(result.message, /excluded from change interpretation/);
      assert.ok(result.longitudinalRecord, 'a scored session still produces its longitudinal point');
    });

    it('replaces a baseline that came from an unverifiable session', async () => {
      const { user } = await createPatient('Legacy Baseline Patient', '7103');

      // A baseline created before sessions reported quality: it can never be
      // verified as comparable, so it must not anchor the patient's history.
      const legacySession = await HospitalDataStore.submitAssessment(user.id, storedSession(66, {
        ...battery,
        functionalCheckIn: functionalCheckIn(activities)
      }));
      const legacyBaseline = await HospitalDataStore.createBaseline({
        userId: user.id,
        overallScore: 66,
        cognitiveScore: 66,
        functionalScore: 50
      });
      await HospitalDataStore.linkAssessmentToBaseline(legacySession.id, legacyBaseline.id);

      const saved = await HospitalDataStore.submitAssessment(user.id, storedSession(90, {
        ...battery,
        functionalCheckIn: functionalCheckIn(activities),
        quality: comparableQuality
      }));

      const result = await runAssessmentCompletionWorkflow(user.id, saved, saved.taskResponses);
      assert.ok(result.baseline);
      assert.notStrictEqual(result.baseline.id, legacyBaseline.id);
      assert.strictEqual(result.baseline.overallScore, 90);
      assert.strictEqual(result.platform.baselineType, 'PROVISIONAL_PERSONAL_BASELINE');
    });
  });

  describe('change summary', () => {
    const historySession = (
      id: string,
      date: string,
      overallScore: number,
      quality: Record<string, any> | null
    ): AssessmentRecord => ({
      id,
      userId: 'quality-history-patient',
      date: new Date(date),
      overallScore,
      reviewState: 'NOT_REVIEWED',
      status: 'COMPLETED',
      reviewStatus: 'PENDING_REVIEW',
      taskResponses: {
        ...battery,
        functionalCheckIn: { ...functionalCheckIn(activities), completedAt: date },
        ...(quality ? { quality } : {})
      }
    });

    it('does not compare a quality-gated session with a comparable one', () => {
      const summary = summarizePatientChanges([
        historySession('q2', '2026-11-20T10:00:00.000Z', 60, {
          comparable: false,
          completion: 'PARTIAL',
          interruptions: 1,
          reasons: ['INCOMPLETE_SESSION']
        }),
        historySession('q1', '2026-11-01T10:00:00.000Z', 88, comparableQuality)
      ]);

      assert.strictEqual(summary.cognitive.comparableAssessments, 1);
      assert.strictEqual(summary.cognitive.change, null, 'no change is computed from a gated session');
      assert.strictEqual(summary.cognitive.declineBeyondReliableChange, false);
      assert.strictEqual(summary.status, 'INSUFFICIENT_DATA');
    });
  });

  describe('browser-shaped submission', () => {
    it('is interpretable when the browser reports the quality it measured', async () => {
      const { user } = await createPatient('Browser Payload Patient', '7104');

      const captured: { status?: number; body?: any } = {};
      const req: any = {
        body: {
          taskResponses: {
            ...battery,
            functionalCheckIn: functionalCheckIn(activities),
            externalContextConsent: { granted: false, recordedAt: '2026-11-20T09:00:00.000Z' },
            quality: comparableQuality
          }
        },
        user: { id: user.id, role: 'PATIENT', email: user.email, patientId: user.patientId },
        headers: {},
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.1' }
      };
      const res: any = {
        status(code: number) { captured.status = code; return res; },
        json(body: unknown) { captured.body = body; return res; }
      };

      await submitAssessmentComplete(req, res, (err?: unknown) => {
        throw err instanceof Error ? err : new Error('unexpected error');
      });

      assert.strictEqual(captured.status, 201);
      assert.strictEqual(captured.body.platform.sessionQuality.comparable, true);
      assert.strictEqual(captured.body.platform.sessionQuality.completion, 'FULL');
      assert.ok(captured.body.baseline, 'the first comparable screening establishes the baseline');
      assert.doesNotMatch(captured.body.message, /excluded from change interpretation/);
      assert.strictEqual(captured.body.assessment.userId, user.id);
    });
  });
});
