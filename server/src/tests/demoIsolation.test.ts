import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DEMO_PATIENT, seedDemoAccess } from '../services/demoAccess';
import { HospitalDataStore } from '../models/dataStore';
import { computePlatformInsights } from '../services/platformInsights';
import { DEMO_PATIENT_USER_ID, isDemoAssessment } from '../services/demoRecords';

/**
 * The jury demo ships fictional sign-in accounts. No screening history is
 * seeded for them: a made-up record is indistinguishable from a real one once
 * it is in the store, so the portals must only ever show measured sessions.
 */
describe('Fictional demo accounts never enter clinical aggregates', () => {
  seedDemoAccess();

  it('hides the demo patient from a clinical patient directory by default', async () => {
    const clinical = await HospitalDataStore.listPatients('', 'ALL');
    assert.ok(
      !clinical.some((patient) => patient.patientId === DEMO_PATIENT.patientId),
      'the fictional patient must not appear in a clinical directory'
    );

    const demoWorkspace = await HospitalDataStore.listPatients('', 'ALL', { includeDemo: true });
    assert.ok(
      demoWorkspace.some((patient) => patient.patientId === DEMO_PATIENT.patientId),
      'the demo workspace still needs its fictional patient'
    );
  });

  it('seeds no assessments, scores or sensor measurements for the demo accounts', async () => {
    const clinical = await HospitalDataStore.getDoctorDashboardStats();
    const demoWorkspace = await HospitalDataStore.getDoctorDashboardStats({ includeDemo: true });

    assert.strictEqual(clinical.totalPatients, 0);
    assert.strictEqual(clinical.completedAssessments, 0);
    assert.strictEqual(clinical.pendingReviews, 0);
    assert.deepStrictEqual(clinical.recentAssessments, []);
    assert.deepStrictEqual(clinical.changeReviewQueue, []);

    assert.strictEqual(demoWorkspace.completedAssessments, 0);
    assert.deepStrictEqual(demoWorkspace.recentAssessments, []);
  });

  it('keeps platform insights empty when only demo data exists', async () => {
    const insights = await computePlatformInsights();

    assert.strictEqual(insights.population.patients, 0);
    assert.strictEqual(insights.population.completedAssessments, 0);
    assert.strictEqual(insights.safetyGates.comparabilityRate, null);
    assert.strictEqual(insights.measurementProperties.repeatSessionPairs, 0);
    assert.strictEqual(insights.measurementProperties.icc21, null);
    assert.deepStrictEqual(insights.fairnessMeasurement.byLanguage, []);
  });

  it('adds a demo screening to the doctor portal only after the demo patient completes one', async () => {
    const before = await HospitalDataStore.getDoctorDashboardStats({ includeDemo: true });
    assert.strictEqual(before.completedAssessments, 0, 'nothing may be recorded before a screening');

    const submittedAt = Date.now();
    const assessment = await HospitalDataStore.submitAssessment(DEMO_PATIENT_USER_ID, {
      overallScore: 78,
      reactionTime: 245,
      blinkRate: 15,
      fixationScore: 84,
      speechRate: 128,
      pauseScore: 80,
      jitter: 0.15,
      shimmer: 1.4,
      symmetry: 92,
      tremorScore: 9,
      taskResponses: { quality: { status: 'GOOD' } }
    });

    const after = await HospitalDataStore.getDoctorDashboardStats({ includeDemo: true });
    assert.strictEqual(after.completedAssessments, 1);
    assert.strictEqual(after.recentAssessments.length, 1);

    const record = after.recentAssessments[0];
    assert.strictEqual(record.id, assessment.id);
    assert.strictEqual(record.patientId, DEMO_PATIENT.patientId);
    assert.strictEqual(record.patientName, DEMO_PATIENT.name);
    assert.strictEqual(record.reviewStatus, 'PENDING_REVIEW');
    assert.ok(!Number.isNaN(new Date(record.date).getTime()), 'the record must carry a valid date and time');
    assert.ok(Math.abs(new Date(record.date).getTime() - submittedAt) < 60_000);

    // The patient portal reads the same record from its own detail view.
    const patientView = await HospitalDataStore.getPatientDetail(DEMO_PATIENT_USER_ID);
    assert.ok(patientView, 'the demo patient must exist for the patient portal');
    assert.strictEqual(patientView.assessments.length, 1);
    assert.strictEqual(patientView.assessments[0].id, assessment.id);
    assert.strictEqual(patientView.assessments[0].date.toISOString(), record.date);

    const directory = await HospitalDataStore.listPatients(DEMO_PATIENT.patientId, 'ALL', { includeDemo: true });
    assert.strictEqual(directory.length, 1);
    assert.strictEqual(directory[0].assessmentCount, 1);
    assert.strictEqual(directory[0].lastScreeningDate, record.date);

    // The same measured session stays out of a real clinician's aggregates.
    const clinical = await HospitalDataStore.getDoctorDashboardStats();
    assert.strictEqual(clinical.completedAssessments, 0);
    assert.deepStrictEqual(clinical.recentAssessments, []);
  });

  it('recognises demo records by their marker as well as by owner', () => {
    assert.strictEqual(isDemoAssessment({ userId: 'someone', taskResponses: { mode: 'DEMO' } }), true);
    assert.strictEqual(isDemoAssessment({ userId: 'someone', taskResponses: { mode: 'COGNITIVE' } }), false);
    assert.strictEqual(isDemoAssessment(null), false);
  });
});
