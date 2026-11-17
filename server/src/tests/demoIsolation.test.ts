import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DEMO_PATIENT, seedDemoAccess } from '../services/demoAccess';
import { HospitalDataStore } from '../models/dataStore';
import { computePlatformInsights } from '../services/platformInsights';
import { isDemoAssessment } from '../services/demoRecords';

/**
 * The jury demo ships a fictional patient with fictional history. That history is
 * useful in the demo workspace and poisonous in every aggregate: a made-up record
 * silently moves patient counts, comparability rates and reliability estimates,
 * and is indistinguishable from real data once it is in there.
 */
describe('Fictional demo records never enter clinical aggregates', () => {
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

  it('does not count demo sessions in dashboard statistics', async () => {
    const clinical = await HospitalDataStore.getDoctorDashboardStats();
    const demoWorkspace = await HospitalDataStore.getDoctorDashboardStats({ includeDemo: true });

    assert.strictEqual(clinical.totalPatients, 0);
    assert.strictEqual(clinical.completedAssessments, 0);
    assert.strictEqual(clinical.pendingReviews, 0);
    assert.deepStrictEqual(clinical.recentAssessments, []);
    assert.deepStrictEqual(clinical.changeReviewQueue, []);

    assert.ok(demoWorkspace.totalPatients >= 1);
    assert.ok(demoWorkspace.completedAssessments >= 1);
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

  it('recognises demo records by their marker as well as by owner', () => {
    assert.strictEqual(isDemoAssessment({ userId: 'someone', taskResponses: { mode: 'DEMO' } }), true);
    assert.strictEqual(isDemoAssessment({ userId: 'someone', taskResponses: { mode: 'COGNITIVE' } }), false);
    assert.strictEqual(isDemoAssessment(null), false);
  });
});
