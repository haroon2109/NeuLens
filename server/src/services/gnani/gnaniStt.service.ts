/**
 * Gnani AI Prisma v2.5 / v3 Speech-to-Text (STT) Service
 * Official endpoint: POST https://api.vachana.ai/stt/v3
 */

import { GNANI_LANGUAGE_CATALOG, GnaniSttOptions, GnaniSttResult, SupportedLanguageCode } from './types';

export class GnaniSttService {
  private baseUrl: string;
  private apiKey: string | null;
  private timeoutMs: number;

  constructor() {
    this.baseUrl = (process.env.GNANI_API_BASE_URL || 'https://api.vachana.ai').replace(/\/+$/, '');
    this.apiKey = process.env.GNANI_API_KEY ? process.env.GNANI_API_KEY.replace(/^["']|["']$/g, '').trim() : null;
    this.timeoutMs = parseInt(process.env.GNANI_TIMEOUT_MS || '15000', 10);
  }

  public getApiKey(): string | null {
    const raw = process.env.GNANI_API_KEY || this.apiKey;
    return raw ? raw.replace(/^["']|["']$/g, '').trim() : null;
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.length > 0);
  }

  /**
   * Resolve language code to standard Gnani BCP-47 tag (e.g., 'ta' -> 'ta-IN')
   */
  public resolveBcp47(lang: string): string {
    const key = lang.toLowerCase() as SupportedLanguageCode;
    if (GNANI_LANGUAGE_CATALOG[key]) {
      return GNANI_LANGUAGE_CATALOG[key].bcp47;
    }
    // If already in BCP-47 format (e.g. 'ta-IN', 'en-US')
    if (lang.includes('-')) {
      return lang;
    }
    return 'en-IN';
  }

  /**
   * Transcribe pre-recorded audio buffer using Gnani Prisma v3 REST API
   *
   * @param audioBuffer Audio file buffer (WAV, WebM, MP3, OGG up to 60s)
   * @param originalFilename Original file name for MIME hint
   * @param mimeType Audio MIME type (e.g., 'audio/webm', 'audio/wav')
   * @param options Language and formatting options
   */
  public async transcribe(
    audioBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    options: GnaniSttOptions
  ): Promise<GnaniSttResult> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      return {
        success: false,
        transcript: '',
        language: options.languageCode,
        requestId: undefined,
        latencyMs: Date.now() - startTime
      };
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error('Audio payload is empty or invalid.');
    }

    // Enforce 60s / 15MB upper safety boundary for REST
    const maxSizeBytes = 15 * 1024 * 1024;
    if (audioBuffer.length > maxSizeBytes) {
      throw new Error(`Audio file exceeds maximum allowed size of 15MB.`);
    }

    const bcp47 = this.resolveBcp47(options.languageCode);
    const targetUrl = `${this.baseUrl}/stt/v3`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      // Build standard multipart/form-data payload via native Node 20 FormData & Blob
      const formData = new FormData();
      const audioBlob = new Blob([audioBuffer], { type: mimeType || 'audio/wav' });
      
      formData.append('audio_file', audioBlob, originalFilename || 'recording.wav');
      formData.append('language_code', bcp47);
      formData.append('preferred_language', bcp47);
      formData.append('format', options.format || 'transcribe');
      formData.append('itn_native_numerals', options.itnNativeNumerals !== false ? 'true' : 'false');

      const apiKey = this.getApiKey();
      if (!apiKey) {
        return {
          success: false,
          transcript: '',
          language: options.languageCode,
          requestId: undefined,
          latencyMs: Date.now() - startTime
        };
      }

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'X-API-Key-ID': apiKey
        },
        body: formData,
        signal: controller.signal
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.warn(`[GnaniSttService]: Upstream returned HTTP ${response.status}: ${response.statusText}`);

        if (response.status === 401 || response.status === 403) {
          throw new Error('Gnani speech service authentication failed (401/403).');
        }
        if (response.status === 429) {
          throw new Error('Gnani speech service rate limit exceeded (429).');
        }
        if (response.status === 400) {
          throw new Error(`Unsupported audio format or malformed request parameters: ${errorText || 'Bad Request'}`);
        }
        throw new Error(`Upstream Gnani STT service error: HTTP ${response.status}`);
      }

      const json = await response.json() as any;

      // Extract transcript according to documented schema
      // Response format: { success: true, request_id: "...", transcript: "..." }
      const transcript = (json.transcript || json.text || json.result || '').trim();
      const requestId = json.request_id || json.requestId || undefined;
      const confidence = typeof json.confidence === 'number' ? json.confidence : undefined;

      return {
        success: true,
        transcript,
        language: bcp47,
        requestId,
        confidence,
        latencyMs
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Gnani STT request timed out after ${this.timeoutMs}ms.`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const gnaniSttService = new GnaniSttService();
