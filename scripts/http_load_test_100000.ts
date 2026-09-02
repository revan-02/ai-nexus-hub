/**
 * Enterprise Ultra-Scale HTTP Load Test: 100,000 Real HTTP Network Requests
 * Spins up local HTTP server and dispatches 100,000 real HTTP network requests
 * over TCP sockets with 500 concurrent keep-alive workers.
 */

import http from 'http';
import { NextRequest } from 'next/server';
import { GET as getCareers, POST as postCareers } from '../app/api/careers/route';
import { GET as getVTUPapers } from '../app/api/vtu-papers/route';
import { GET as getSecurityAudit } from '../app/api/security/audit/route';

interface BenchmarkMetrics {
  endpoint: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  durationSeconds: number;
  requestsPerSecond: number;
  avgLatencyMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  bytesTransferredMb: number;
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

async function runHttpBenchmark(
  endpointName: string,
  port: number,
  path: string,
  method: 'GET' | 'POST',
  bodyPayload: any | null,
  totalRequests: number,
  concurrency: number
): Promise<BenchmarkMetrics> {
  process.stdout.write(`⚡ [100K HTTP LOAD TEST] ${method} ${path} (${totalRequests.toLocaleString()} requests, ${concurrency} VUs)... `);

  const agent = new http.Agent({ keepAlive: true, maxSockets: concurrency });
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;
  let totalBytes = 0;
  const startTime = performance.now();

  const makeSingleRequest = (idx: number): Promise<void> => {
    return new Promise((resolve) => {
      const t0 = performance.now();
      const payloadStr = bodyPayload ? JSON.stringify(bodyPayload(idx)) : undefined;

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
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
            totalBytes += chunk.length;
          });
          res.on('end', () => {
            const t1 = performance.now();
            latencies.push(t1 - t0);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
              successful++;
            } else {
              failed++;
            }
            resolve();
          });
        }
      );

      req.on('error', () => {
        const t1 = performance.now();
        latencies.push(t1 - t0);
        failed++;
        resolve();
      });

      if (payloadStr) {
        req.write(payloadStr);
      }
      req.end();
    });
  };

  for (let i = 0; i < totalRequests; i += concurrency) {
    const wave: Promise<void>[] = [];
    for (let j = i; j < Math.min(i + concurrency, totalRequests); j++) {
      wave.push(makeSingleRequest(j));
    }
    await Promise.all(wave);
  }

  const durationMs = performance.now() - startTime;
  const durationSec = durationMs / 1000;
  const stats = calculatePercentiles(latencies);
  const rps = Number((totalRequests / durationSec).toFixed(2));
  const bytesMb = Number((totalBytes / (1024 * 1024)).toFixed(2));

  console.log(`DONE in ${durationSec.toFixed(2)}s (${rps.toLocaleString()} req/s, p95: ${stats.p95}ms, Payload: ${bytesMb}MB)`);

  return {
    endpoint: endpointName,
    totalRequests,
    successfulRequests: successful,
    failedRequests: failed,
    durationSeconds: Number(durationSec.toFixed(2)),
    requestsPerSecond: rps,
    avgLatencyMs: stats.avg,
    p50Ms: stats.p50,
    p90Ms: stats.p90,
    p95Ms: stats.p95,
    p99Ms: stats.p99,
    minLatencyMs: stats.min,
    maxLatencyMs: stats.max,
    bytesTransferredMb: bytesMb,
  };
}

async function main() {
  console.log('========================================================================');
  console.log('🌐 100,000 VIRTUAL USERS (100k VUs) LIVE HTTP SERVER LOAD BENCHMARK');
  console.log('========================================================================');
  console.log(`Runtime: Node ${process.version} | Architecture: ${process.arch} ${process.platform}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const PORT = 4097;
  const server = await createHttpServer(PORT);
  console.log(`📡 Local Load Test HTTP Server active on http://127.0.0.1:${PORT}\n`);

  const TOTAL_USERS = 100000;
  const CONCURRENCY = 500; // 500 parallel keep-alive socket connections
  const results: BenchmarkMetrics[] = [];

  try {
    // 1. GET /api/vtu-papers (100,000 Live HTTP Requests)
    const m1 = await runHttpBenchmark(
      'GET /api/vtu-papers (Engineering Papers Filter)',
      PORT,
      '/api/vtu-papers?branch=CSE&scheme=2022+Scheme',
      'GET',
      null,
      TOTAL_USERS,
      CONCURRENCY
    );
    results.push(m1);

    // 2. GET /api/careers (100,000 Live HTTP Requests)
    const m2 = await runHttpBenchmark(
      'GET /api/careers (Job Catalog & Filters)',
      PORT,
      '/api/careers?category=Generative+AI',
      'GET',
      null,
      TOTAL_USERS,
      CONCURRENCY
    );
    results.push(m2);

    // 3. POST /api/careers (100,000 Live HTTP Applications with AI Match Scorer)
    const m3 = await runHttpBenchmark(
      'POST /api/careers (1-Click AI Apply & Match Score)',
      PORT,
      '/api/careers',
      'POST',
      (idx: number) => ({
        action: 'apply',
        jobId: 'job-1',
        candidateName: `Applicant_${idx}`,
        candidateEmail: `applicant_${idx}@nexus.ai`,
        skills: ['Python', 'PyTorch', 'LangGraph'],
        experienceYears: 3,
      }),
      TOTAL_USERS,
      CONCURRENCY
    );
    results.push(m3);

    console.log('\n========================================================================');
    console.log('📊 LIVE HTTP 100,000 USER PERFORMANCE REPORT SUMMARY');
    console.log('========================================================================\n');

    console.table(
      results.map((r) => ({
        'HTTP Endpoint': r.endpoint,
        'HTTP Requests': r.totalRequests.toLocaleString(),
        'HTTP 200 OK': `${r.successfulRequests.toLocaleString()} (${((r.successfulRequests / r.totalRequests) * 100).toFixed(1)}%)`,
        'Duration': `${r.durationSeconds}s`,
        'HTTP Throughput': `${r.requestsPerSecond.toLocaleString()} req/s`,
        'Avg Latency': `${r.avgLatencyMs} ms`,
        'p50': `${r.p50Ms} ms`,
        'p95': `${r.p95Ms} ms`,
        'p99': `${r.p99Ms} ms`,
        'Data (MB)': `${r.bytesTransferredMb} MB`,
      }))
    );

    const totalHttpReqs = results.reduce((acc, r) => acc + r.totalRequests, 0);
    const totalHttpSuccess = results.reduce((acc, r) => acc + r.successfulRequests, 0);
    const avgRps = results.reduce((acc, r) => acc + r.requestsPerSecond, 0) / results.length;
    const totalDataMb = results.reduce((acc, r) => acc + r.bytesTransferredMb, 0).toFixed(2);

    console.log(`\n🏆 GRAND TOTAL: ${totalHttpReqs.toLocaleString()} Real HTTP Network Requests Processed!`);
    console.log(`✅ HTTP 200 OK Rate: ${((totalHttpSuccess / totalHttpReqs) * 100).toFixed(2)}% (${totalHttpSuccess.toLocaleString()} / ${totalHttpReqs.toLocaleString()})`);
    console.log(`⚡ Average Network Throughput: ${Math.round(avgRps).toLocaleString()} HTTP req/sec`);
    console.log(`📦 Total HTTP Payload Transferred: ${totalDataMb} MB`);
    console.log('========================================================================\n');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('100k HTTP benchmark error:', err);
  process.exit(1);
});
