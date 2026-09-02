type LogLevel = 'info' | 'warn' | 'error' | 'security';

interface LogPayload {
  event: string;
  userId?: string;
  target?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

/**
 * Structured Security & Observability Logger.
 * Ensures NO sensitive credentials, tokens, or passwords are logged.
 */
export function logEvent(level: LogLevel, payload: LogPayload): void {
  const timestamp = new Date().toISOString();
  
  // Sanitize metadata to strip any sensitive fields if present
  const sanitizedMetadata = { ...payload.metadata };
  delete sanitizedMetadata.password;
  delete sanitizedMetadata.token;
  delete sanitizedMetadata.secret;
  delete sanitizedMetadata.creditCard;

  const logEntry = JSON.stringify({
    timestamp,
    level,
    event: payload.event,
    userId: payload.userId || 'anonymous',
    target: payload.target,
    metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : undefined,
    error: payload.error,
  });

  switch (level) {
    case 'error':
    case 'security':
      console.error(`[SECURITY/ERROR] ${logEntry}`);
      break;
    case 'warn':
      console.warn(`[WARN] ${logEntry}`);
      break;
    default:
      console.log(`[INFO] ${logEntry}`);
      break;
  }
}
