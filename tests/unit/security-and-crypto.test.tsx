import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SecurityCenterPage from '@/app/security-center/page';
import {
  performHash,
  performSymmetricCipher,
  performRsaOperation,
  performHmac,
  runFullSecurityAudit,
  computeMD5,
  computeSHA256,
  computeSHA512
} from '@/services/crypto-security-service';

vi.mock('@/components/nexus/nexus-shell', () => ({
  NexusShell: ({ children }: any) => <div>{children}</div>,
}));

describe('Enterprise Security & Cryptographic Engine Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cryptographic Algorithms (SHA-256, SHA-512, MD5, AES-256, DES/3DES, RSA, HMAC)', () => {
    it('computes deterministic SHA-256 hash with 256-bit length and SECURE rating', () => {
      const result = performHash('AI Nexus 2026', 'SHA-256');
      expect(result.algorithm).toBe('SHA-256');
      expect(result.bitLength).toBe(256);
      expect(result.securityRating).toBe('SECURE');
      expect(result.digestHex).toBeDefined();
      expect(result.digestHex.length).toBe(64); // 64 hex characters = 256 bits
    });

    it('computes deterministic SHA-512 hash with 512-bit length and RECOMMENDED rating', () => {
      const result = performHash('AI Nexus 2026', 'SHA-512');
      expect(result.algorithm).toBe('SHA-512');
      expect(result.bitLength).toBe(512);
      expect(result.blockSizeBits).toBe(1024);
      expect(result.securityRating).toBe('RECOMMENDED');
      expect(result.digestHex.length).toBe(128); // 128 hex chars = 512 bits
    });

    it('computes MD5 with DEPRECATED_VULNERABLE rating and collision attack advisory', () => {
      const result = performHash('AI Nexus 2026', 'MD5');
      expect(result.algorithm).toBe('MD5');
      expect(result.bitLength).toBe(128);
      expect(result.securityRating).toBe('DEPRECATED_VULNERABLE');
      expect(result.securityAdvisory).toContain('broken');
      expect(result.digestHex.length).toBe(32); // 32 hex chars = 128 bits
    });

    it('performs AES-256-GCM authenticated encryption with 256-bit key and GMAC tag', () => {
      const result = performSymmetricCipher('Student Record Data', 'Key_99182', 'AES-256-GCM');
      expect(result.algorithm).toBe('AES-256-GCM');
      expect(result.keyLengthBits).toBe(256);
      expect(result.securityRating).toBe('MILITARY_GRADE');
      expect(result.authTagHex).toBeDefined();
      expect(result.encryptionSteps.length).toBeGreaterThan(3);
    });

    it('identifies DES 56-bit key deprecation and 3DES Sweet32 collision vulnerabilities', () => {
      const des = performSymmetricCipher('Test', 'Key', 'DES');
      expect(des.keyLengthBits).toBe(56);
      expect(des.securityRating).toBe('DEPRECATED');

      const tripleDes = performSymmetricCipher('Test', 'Key', '3DES');
      expect(tripleDes.securityRating).toBe('LEGACY_TRANSITIONAL');
      expect(tripleDes.securityAdvisory).toContain('SWEET32');
    });

    it('generates RSA-2048 and RSA-4096 key pairs with Euler totient derivation and PQC advisory', () => {
      const rsa2048 = performRsaOperation('Secret Payload', 2048, 'encrypt_oaep');
      expect(rsa2048.keySizeBits).toBe(2048);
      expect(rsa2048.publicKeyPem).toContain('BEGIN PUBLIC KEY');
      expect(rsa2048.publicExponent).toBe(65537);
      expect(rsa2048.quantumVulnerabilityNotice).toContain("Shor's");

      const rsa4096 = performRsaOperation('Secret Payload', 4096, 'sign_pss');
      expect(rsa4096.keySizeBits).toBe(4096);
    });

    it('computes HMAC-SHA256 authenticated message signature', () => {
      const hmac = performHmac('GET /api/user/1', 'api_secret_key');
      expect(hmac.algorithm).toBe('HMAC-SHA256');
      expect(hmac.verified).toBe(true);
      expect(hmac.hmacDigestHex.length).toBe(64);
    });
  });

  describe('Security Audit & Compliance Engine', () => {
    it('executes full security audit report with optimal grade and zero critical failures', () => {
      const report = runFullSecurityAudit();
      expect(report.overallScore).toBeGreaterThanOrEqual(95);
      expect(report.grade).toBe('A+');
      expect(report.tlsVersion).toContain('TLS 1.3');
      expect(report.items.length).toBeGreaterThanOrEqual(10);
      expect(report.criticalCount).toBe(0);
      expect(report.isoCompliancePercentage).toBe(100);
      expect(report.soc2CompliancePercentage).toBeGreaterThanOrEqual(95);
    });
  });

  describe('Security Center Page UI & Playgrounds', () => {
    it('renders Security Center hero, threat score, and navigation tabs', () => {
      render(<SecurityCenterPage />);

      expect(screen.getByText(/Security Audit & Cryptographic Engine/i)).toBeInTheDocument();
      expect(screen.getByText(/Overall Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Active TLS Cipher/i)).toBeInTheDocument();
      expect(screen.getByText(/Firewall Rules/i)).toBeInTheDocument();
    });

    it('switches to Cryptography Lab tab and computes MD5 vs SHA-256', () => {
      render(<SecurityCenterPage />);

      // Switch to Cryptography tab
      const cryptoTab = screen.getByRole('button', { name: /2. 🔐 Cryptography Lab/i });
      fireEvent.click(cryptoTab);

      expect(screen.getByText(/Cryptographic Hash Function Studio/i)).toBeInTheDocument();

      // Click MD5 button
      const md5Btn = screen.getByRole('button', { name: 'MD5' });
      fireEvent.click(md5Btn);

      expect(screen.getByText(/DEPRECATED_VULNERABLE/i)).toBeInTheDocument();
      expect(screen.getByText(/MD5 is broken/i)).toBeInTheDocument();
    });

    it('switches to AI Red-Teaming tab and evaluates prompt injection threat score', () => {
      render(<SecurityCenterPage />);

      // Switch to AI Red-Teaming tab
      const redteamTab = screen.getByRole('button', { name: /3. 🤖 AI Red-Teaming/i });
      fireEvent.click(redteamTab);

      expect(screen.getByText(/OWASP LLM Top 10 Red-Teaming/i)).toBeInTheDocument();

      // Click Analyze Threat Vector
      const analyzeBtn = screen.getByRole('button', { name: /Analyze Threat Vector/i });
      fireEvent.click(analyzeBtn);

      expect(screen.getByText(/BLOCKED BY AI FIREWALL SENTINEL/i)).toBeInTheDocument();
    });
  });
});
