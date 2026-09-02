/**
 * 10,000 Complete Multi-Step User Journeys Load Test
 * Simulates 10,000 concurrent students/developers executing a full 6-step lifecycle journey:
 * Step 1: Search Catalog -> Step 2: Browse VTU Papers -> Step 3: Architecture Exploration ->
 * Step 4: Security Audit -> Step 5: 1-Click Job Apply -> Step 6: Coding Challenge Arena.
 */

import http from 'http';
import { NextRequest } from 'next/server';
import { GET as getCareers, POST as postCareers } from '../app/api/careers/route';
import { GET as getVTUPapers } from '../app/api/vtu-papers/route';
import { GET as getChallenges } from '../app/api/expert-challenges/route';
import { GET as getSecurityAudit } from '../app/api/security/audit/route';
import { hybridSearch } from '../services/search-engine-service';
import { validateCoupon } from '../services/coupon-service';

interface UserJourneyMetrics {
  journeyId: number;
  totalDurationMs: number;
  stepLatencies: number[];
  success: boolean;
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

function createHttpServer(port: number): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = `http://localhost:${port}${req.url}`;
      const method = req.method || 'GET';

      let bodyData = '';
      req.on('data', (chunk) => {
        bodyData += chunk;
      });

      req.on('end', async () => {
        try {
          const nextReq = new NextRequest(url, {
            method,
            headers: req.headers as any,
            body: method === 'POST' ? bodyData : undefined,
          });

          let response;
          if (url.includes('/api/careers')) {
            response = method === 'POST' ? await postCareers(nextReq) : await getCareers(nextReq);
          } else if (url.includes('/api/vtu-papers')) {
            response = await getVTUPapers(nextReq);
          } else if (url.includes('/api/expert-challenges')) {
            response = await getChallenges(nextReq);
          } else if (url.includes('/api/security/audit')) {
            response = await getSecurityAudit(nextReq);
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
            return;
          }

          const responseText = await response.text();
          res.writeHead(response.status, {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
          });
          res.end(responseText);
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

function httpRequest(
  port: number,
  path: string,
  method: 'GET' | 'POST',
  bodyPayload: any | null,
  agent: http.Agent
): Promise<{ status: number; bytes: number; duration: number }> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const payloadStr = bodyPayload ? JSON.stringify(bodyPayload) : undefined;

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        agent,
        headers: {
          'Content-Type': 'application/json',
          ...(payloadStr ? { 'Content-Length': Buffer.byteLength(payloadStr) } : {}),
        },
      },
      (res) => {
        let length = 0;
        res.on('data', (chunk) => {
          length += chunk.length;
        });
        res.on('end', () => {
          const t1 = performance.now();
          resolve({ status: res.statusCode || 200, bytes: length, duration: t1 - t0 });
        });
      }
    );

    req.on('error', () => {
      const t1 = performance.now();
      resolve({ status: 500, bytes: 0, duration: t1 - t0 });
    });

    if (payloadStr) req.write(payloadStr);
    req.end();
  });
}

async function main() {
  console.log('========================================================================');
  console.log('🌟 10,000 END-TO-END MULTI-STEP USER JOURNEYS LOAD TEST');
  console.log('========================================================================');
  console.log(`Runtime: Node ${process.version} | Architecture: ${process.arch} ${process.platform}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const PORT = 4098;
  const server = await createHttpServer(PORT);
  const agent = new http.Agent({ keepAlive: true, maxSockets: 300 });

  const TOTAL_USERS = 10000;
  const CONCURRENCY = 250; // 250 parallel active user sessions
  const journeyResults: UserJourneyMetrics[] = [];
  const step1Latencies: number[] = [];
  const step2Latencies: number[] = [];
  const step3Latencies: number[] = [];
  const step4Latencies: number[] = [];
  const step5Latencies: number[] = [];
  const step6Latencies: number[] = [];

  const overallStartTime = performance.now();
  console.log(`⚡ Executing 10,000 Full User Journeys (6 Steps/User = 60,000 Actions) with 250 Concurrent Sessions...`);

  const executeSingleUserJourney = async (userIdx: number): Promise<void> => {
    const journeyStart = performance.now();
    const stepLats: number[] = [];

    // Step 1: Inverted Index Search
    const t0 = performance.now();
    hybridSearch(['transformer', 'pytorch', 'prompt engineering', 'vtu'][userIdx % 4]);
    const d1 = performance.now() - t0;
    step1Latencies.push(d1);
    stepLats.push(d1);

    // Step 2: Browse VTU Question Papers
    const branch = ['CSE', 'ISE', 'ECE', 'AIML'][userIdx % 4];
    const r2 = await httpRequest(PORT, `/api/vtu-papers?branch=${branch}&scheme=2022+Scheme`, 'GET', null, agent);
    step2Latencies.push(r2.duration);
    stepLats.push(r2.duration);

    // Step 3: Validate Promo & Dynamic Pricing
    const t3 = performance.now();
    validateCoupon('NEXUS50', '₹4,999');
    const d3 = performance.now() - t3;
    step3Latencies.push(d3);
    stepLats.push(d3);

    // Step 4: Run Security & Threat Audit
    const r4 = await httpRequest(PORT, '/api/security/audit', 'GET', null, agent);
    step4Latencies.push(r4.duration);
    stepLats.push(r4.duration);

    // Step 5: 1-Click Job Application & Resume Match
    const r5 = await httpRequest(
      PORT,
      '/api/careers',
      'POST',
      {
        action: 'apply',
        jobId: 'job-1',
        candidateName: `Learner_${userIdx}`,
        candidateEmail: `learner_${userIdx}@nexus.ai`,
        skills: ['Python', 'PyTorch', 'FastAPI'],
        experienceYears: 2,
      },
      agent
    );
    step5Latencies.push(r5.duration);
    stepLats.push(r5.duration);

    // Step 6: Fetch Coding Challenges
    const r6 = await httpRequest(PORT, '/api/expert-challenges?pillar=ai', 'GET', null, agent);
    step6Latencies.push(r6.duration);
    stepLats.push(r6.duration);

    const journeyDuration = performance.now() - journeyStart;
    const isSuccess = r2.status < 400 && r4.status < 400 && r5.status < 400 && r6.status < 400;

    journeyResults.push({
      journeyId: userIdx,
      totalDurationMs: journeyDuration,
      stepLatencies: stepLats,
      success: isSuccess,
    });
  };

  for (let i = 0; i < TOTAL_USERS; i += CONCURRENCY) {
    const wave: Promise<void>[] = [];
    for (let j = i; j < Math.min(i + CONCURRENCY, TOTAL_USERS); j++) {
      wave.push(executeSingleUserJourney(j));
    }
    await Promise.all(wave);
  }

  const totalTimeSec = (performance.now() - overallStartTime) / 1000;
  const successfulJourneys = journeyResults.filter((j) => j.success).length;
  const totalJourneyLatencies = journeyResults.map((j) => j.totalDurationMs);
  const journeyStats = calculatePercentiles(totalJourneyLatencies);

  console.log(`\n========================================================================`);
  console.log(`📊 10,000 USER JOURNEYS PERFORMANCE SUMMARY REPORT`);
  console.log(`========================================================================\n`);

  console.log(`⏱️ Total Execution Time: ${totalTimeSec.toFixed(2)}s`);
  console.log(`👤 Completed Full User Journeys: ${successfulJourneys.toLocaleString()} / ${TOTAL_USERS.toLocaleString()} (${((successfulJourneys / TOTAL_USERS) * 100).toFixed(2)}%)`);
  console.log(`🔄 Total Discrete User Operations: ${(TOTAL_USERS * 6).toLocaleString()} Operations`);
  console.log(`⚡ Overall System Throughput: ${Number(((TOTAL_USERS * 6) / totalTimeSec).toFixed(2)).toLocaleString()} user actions/sec`);
  console.log(`🚀 Complete End-to-End Session Rate: ${Number((TOTAL_USERS / totalTimeSec).toFixed(2)).toLocaleString()} full user journeys/sec\n`);

  const stepStats = [
    { Step: 'Step 1: Inverted Index Search', ...calculatePercentiles(step1Latencies) },
    { Step: 'Step 2: VTU Question Papers Filter', ...calculatePercentiles(step2Latencies) },
    { Step: 'Step 3: Promo & Pricing Engine', ...calculatePercentiles(step3Latencies) },
    { Step: 'Step 4: Security & Crypto Audit', ...calculatePercentiles(step4Latencies) },
    { Step: 'Step 5: 1-Click AI Job Application', ...calculatePercentiles(step5Latencies) },
    { Step: 'Step 6: Coding Challenge Arena', ...calculatePercentiles(step6Latencies) },
    { Step: '★ TOTAL FULL JOURNEY (All 6 Steps)', ...journeyStats },
  ];

  console.table(
    stepStats.map((s) => ({
      'Journey Lifecycle Stage': s.Step,
      'Avg Latency': `${s.avg} ms`,
      'p50': `${s.p50} ms`,
      'p95': `${s.p95} ms`,
      'p99': `${s.p99} ms`,
      'Min': `${s.min} ms`,
      'Max': `${s.max} ms`,
    }))
  );

  console.log('========================================================================\n');
  server.close();
}

main().catch((err) => {
  console.error('Journey test error:', err);
  process.exit(1);
});
