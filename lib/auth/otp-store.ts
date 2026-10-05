export interface OtpEntry {
  code: string;
  expiresAt: number;
}

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const globalForOtp = globalThis as unknown as {
  nexusOtpStore?: Map<string, OtpEntry>;
  nexusRateLimitStore?: Map<string, RateLimitEntry>;
};

export const otpStore: Map<string, OtpEntry> =
  globalForOtp.nexusOtpStore || new Map<string, OtpEntry>();

export const rateLimitStore: Map<string, RateLimitEntry> =
  globalForOtp.nexusRateLimitStore || new Map<string, RateLimitEntry>();

globalForOtp.nexusOtpStore = otpStore;
globalForOtp.nexusRateLimitStore = rateLimitStore;
