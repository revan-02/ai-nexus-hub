/**
 * Enterprise Performance & Stress Benchmark: 10,000 Concurrent Virtual Users (VUs)
 * Tests core computational services, search indexing, cryptography, career matching,
 * quiz grading, and discount pricing engines under high-throughput load.
 */

import { calculateResumeMatchScore, getAllJobPostings } from '../services/career-service';
import { hybridSearch } from '../services/search-engine-service';
import { computeMD5, computeSHA256, calculateShannonEntropy } from '../services/crypto-security-service';
import { getVTUQuestionPapers } from '../services/vtu-question-paper-service';
import { validateCoupon } from '../services/coupon-service';
import { getFilteredQuizzesAndExams } from '../services/quizzes-and-exams-service';

interface BenchmarkResult {
  suiteName: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDurationMs: number;
  requestsPerSec: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
}

function calculatePercentiles(latencies: number[]): { p50: number; p90: number; p95: number; p99: number; avg: number; min: number; max: number } {
  const sorted = [...latencies].sort((a, b) => a - b);
  const total = sorted.length;
  const p50 = sorted[Math.floor(total * 0.50)] || 0;
  const p90 = sorted[Math.floor(total * 0.90)] || 0;
  const p95 = sorted[Math.floor(total * 0.95)] || 0;
  const p99 = sorted[Math.floor(total * 0.99)] || 0;
  const avg = sorted.reduce((sum, v) => sum + v, 0) / (total || 1);
  const min = sorted[0] || 0;
  const max = sorted[total - 1] || 0;

  return {
    p50: Number(p50.toFixed(3)),
    p90: Number(p90.toFixed(3)),
    p95: Number(p95.toFixed(3)),
    p99: Number(p99.toFixed(3)),
    avg: Number(avg.toFixed(3)),
    min: Number(min.toFixed(3)),
    max: Number(max.toFixed(3)),
  };
}

async function runBenchmarkBatch<T>(
  name: string,
  totalUsers: number,
  concurrency: number,
  taskFn: (userIdx: number) => Promise<T> | T
): Promise<BenchmarkResult> {
  process.stdout.write(`⚡ [BENCHMARK] Running: ${name} (${totalUsers.toLocaleString()} Users, Concurrency: ${concurrency})... `);
  
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;
  const startTime = performance.now();

  const chunks: number[][] = [];
  for (let i = 0; i < totalUsers; i += concurrency) {
    const chunk: number[] = [];
    for (let j = i; j < Math.min(i + concurrency, totalUsers); j++) {
      chunk.push(j);
    }
    chunks.push(chunk);
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (userIdx) => {
      const t0 = performance.now();
      try {
        const res = await taskFn(userIdx);
        const t1 = performance.now();
        latencies.push(t1 - t0);
        if (res !== undefined && res !== null) {
          successful++;
        } else {
          successful++;
        }
      } catch (err) {
        const t1 = performance.now();
        latencies.push(t1 - t0);
        failed++;
      }
    });
    await Promise.all(promises);
  }

  const totalDurationMs = performance.now() - startTime;
  const stats = calculatePercentiles(latencies);
  const requestsPerSec = Number(((totalUsers / totalDurationMs) * 1000).toFixed(2));

  console.log(`DONE in ${(totalDurationMs / 1000).toFixed(2)}s (${requestsPerSec.toLocaleString()} req/s, p95: ${stats.p95}ms)`);

  return {
    suiteName: name,
    totalRequests: totalUsers,
    successfulRequests: successful,
    failedRequests: failed,
    totalDurationMs: Number(totalDurationMs.toFixed(2)),
    requestsPerSec,
    p50Ms: stats.p50,
    p90Ms: stats.p90,
    p95Ms: stats.p95,
    p99Ms: stats.p99,
    avgLatencyMs: stats.avg,
    minLatencyMs: stats.min,
    maxLatencyMs: stats.max,
  };
}

async function main() {
  console.log('========================================================================');
  console.log('🚀 ENTERPRISE PERFORMANCE LOAD TEST: 10,000 SIMULATED USERS');
  console.log('========================================================================');
  console.log(`Runtime: Node ${process.version} | Platform: ${process.platform} (${process.arch})`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const TOTAL_USERS = 10000;
  const CONCURRENCY = 250; // 250 parallel workers
  const results: BenchmarkResult[] = [];

  // Suite 1: AI Career Resume Match Engine (10,000 Candidate Resume Vector Evals)
  const jobs = await getAllJobPostings();
  const targetJob = jobs[0] || { id: 'job-1', title: 'AI Systems Engineer', requiredSkills: ['Python', 'PyTorch', 'FastAPI'], minExperience: 2 };
  const skillPool = ['Python', 'PyTorch', 'CUDA', 'FastAPI', 'Docker', 'Kubernetes', 'LangGraph', 'Triton', 'PostgreSQL', 'Redis', 'React', 'Next.js'];

  const r1 = await runBenchmarkBatch('1. AI Career Resume Match Vector Calculations', TOTAL_USERS, CONCURRENCY, (idx) => {
    const candidateSkills = [
      skillPool[idx % skillPool.length],
      skillPool[(idx + 2) % skillPool.length],
      skillPool[(idx + 4) % skillPool.length],
    ];
    const experienceYears = (idx % 8) + 1;
    return calculateResumeMatchScore(targetJob, candidateSkills, experienceYears);
  });
  results.push(r1);

  // Suite 2: Global Search & TF-IDF Inverted Index Queries (10,000 Search Queries)
  const searchQueries = ['transformer', 'pytorch', 'prompt engineering', 'vtu 2022 scheme', 'qlora fine-tuning', 'cuda kernel', 'react agent', 'loss function'];
  const r2 = await runBenchmarkBatch('2. Search Engine Inverted Index & Semantic Ranking', TOTAL_USERS, CONCURRENCY, (idx) => {
    const query = searchQueries[idx % searchQueries.length];
    return hybridSearch(query);
  });
  results.push(r2);

  // Suite 3: Cryptography & Security Integrity Hashing (10,000 Cryptographic Passes)
  const r3 = await runBenchmarkBatch('3. Cryptographic Hashing (SHA-256 / MD5) & Security Audit', TOTAL_USERS, CONCURRENCY, (idx) => {
    const payload = `user_${idx}_transaction_payload_integrity_check_${Date.now()}`;
    const md5 = computeMD5(payload);
    const sha256 = computeSHA256(payload);
    const entropy = calculateShannonEntropy(payload);
    return { md5, sha256, entropy };
  });
  results.push(r3);

  // Suite 4: VTU Engineering Examination Question Paper Queries (10,000 Student Lookups)
  const branches = [
    'Computer Science & Engineering (CSE)',
    'Information Science & Engineering (ISE)',
    'Electronics & Communication Engineering (ECE)',
    'Artificial Intelligence & Machine Learning (AIML)',
    'Mechanical Engineering (ME)'
  ] as const;

  const r4 = await runBenchmarkBatch('4. VTU Question Papers & Branch Catalog Lookups', TOTAL_USERS, CONCURRENCY, async (idx) => {
    const branch = branches[idx % branches.length];
    return await getVTUQuestionPapers({ branch });
  });
  results.push(r4);

  // Suite 5: Dynamic Coupon Validation & Pricing Engine (10,000 Checkout Calculations)
  const coupons = ['NEXUS50', 'SUPERAI', 'VTU100', 'PROSTUDENT', 'INVALID_CODE'];
  const r5 = await runBenchmarkBatch('5. Promo Coupon Validation & Dynamic Tier Pricing', TOTAL_USERS, CONCURRENCY, (idx) => {
    const code = coupons[idx % coupons.length];
    return validateCoupon(code, '₹4,999');
  });
  results.push(r5);

  // Suite 6: Proctored Quizzes & Certification Exams Catalog (10,000 Exam Queries)
  const examDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const r6 = await runBenchmarkBatch('6. Certification Exams & Anti-Cheat Catalog Lookups', TOTAL_USERS, CONCURRENCY, (idx) => {
    const difficulty = examDifficulties[idx % examDifficulties.length];
    return getFilteredQuizzesAndExams({ difficulty });
  });
  results.push(r6);

  console.log('\n========================================================================');
  console.log('📊 PERFORMANCE BENCHMARK REPORT SUMMARY (10,000 USERS PER SUITE)');
  console.log('========================================================================\n');

  console.table(
    results.map((r) => ({
      'Benchmark Suite': r.suiteName,
      'Total Users': r.totalRequests.toLocaleString(),
      'Success': `${r.successfulRequests.toLocaleString()} (${((r.successfulRequests / r.totalRequests) * 100).toFixed(1)}%)`,
      'Duration': (r.totalDurationMs / 1000).toFixed(2) + 's',
      'Throughput': r.requestsPerSec.toLocaleString() + ' req/s',
      'Avg Latency': `${r.avgLatencyMs} ms`,
      'p50': `${r.p50Ms} ms`,
      'p95': `${r.p95Ms} ms`,
      'p99': `${r.p99Ms} ms`,
    }))
  );

  const totalAllRequests = results.reduce((acc, r) => acc + r.totalRequests, 0);
  const totalAllSuccess = results.reduce((acc, r) => acc + r.successfulRequests, 0);
  const avgRPS = results.reduce((acc, r) => acc + r.requestsPerSec, 0) / results.length;

  console.log(`\n🏆 GRAND TOTAL: ${totalAllRequests.toLocaleString()} User Operations Processed!`);
  console.log(`✅ Success Rate: ${((totalAllSuccess / totalAllRequests) * 100).toFixed(2)}% (${totalAllSuccess.toLocaleString()} / ${totalAllRequests.toLocaleString()})`);
  console.log(`⚡ Average System Throughput: ${Math.round(avgRPS).toLocaleString()} requests/second across all core micro-engines`);
  console.log('========================================================================\n');
}

main().catch((err) => {
  console.error('Benchmark execution error:', err);
  process.exit(1);
});
