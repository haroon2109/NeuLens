/**
 * Session signing secret.
 *
 * The previous fallback constant was committed to the repository, so anyone who
 * could read the source could mint a valid clinician token. There is now no
 * usable fallback in production: a token signed with a public string is the
 * same as no authentication at all.
 */
const MIN_SECRET_LENGTH = 32;

/** Only ever used outside production, and never accepted when NODE_ENV=production. */
const DEVELOPMENT_ONLY_SECRET = 'neulens-development-only-secret-not-for-production';

let warnedAboutWeakSecret = false;

export const JWT_MIN_SECRET_LENGTH = MIN_SECRET_LENGTH;

const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Resolves the secret at call time (not import time) so a value loaded later in
 * startup, or by a test, is still honoured.
 */
export function getJwtSecret(): string {
  const configured = (process.env.JWT_SECRET || '').trim();

  if (!configured) {
    if (isProduction()) {
      throw new Error(
        'JWT_SECRET is not configured. Refusing to issue or accept session tokens in production.'
      );
    }
    return DEVELOPMENT_ONLY_SECRET;
  }

  if (configured.length < MIN_SECRET_LENGTH) {
    if (isProduction()) {
      throw new Error(
        `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters in production; the configured value is too short to resist guessing.`
      );
    }
    if (!warnedAboutWeakSecret) {
      warnedAboutWeakSecret = true;
      console.warn(
        `[Auth Warning]: JWT_SECRET is shorter than ${MIN_SECRET_LENGTH} characters. Use a long random value before deploying.`
      );
    }
  }

  return configured;
}

/** Non-throwing form for health checks and startup diagnostics. */
export function describeJwtSecretProblem(): string | null {
  const configured = (process.env.JWT_SECRET || '').trim();
  if (!configured) return 'JWT_SECRET is not configured';
  if (configured.length < MIN_SECRET_LENGTH) {
    return `JWT_SECRET is shorter than ${MIN_SECRET_LENGTH} characters`;
  }
  return null;
}
