export type ChallengeDifficulty = 'Intermediate' | 'Hard' | 'Expert';
export type ChallengeDomain =
  | 'Agriculture & Rural AI'
  | 'FinTech & Security'
  | 'Search & E-Commerce'
  | 'Healthcare AI'
  | 'DevSecOps & Multi-Agent';

export interface ChallengePillarDataStructure {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  implementationCode: string;
  whyThisStructure: string;
}

export interface ChallengePillarSystemDesign {
  architectureType: string;
  latencyBudget: string;
  throughputTarget: string;
  hldFlowDiagram: string[];
  scalabilityStrategy: string;
  businessLogicValidation: string[];
}

export interface ChallengePillarDatabase {
  dbType: string;
  schemaDDL: string;
  indexingStrategy: string[];
  cachingLayer: string;
  queryOptimizationTip: string;
}

export interface ChallengePillarAIModel {
  modelArchitecture: string;
  embeddingDimension?: number;
  lossFunction: string;
  inferencePipeline: string;
  samplePromptOrPipelineCode: string;
  accuracyOrLatencyMetrics: string;
}

export interface ChallengePillarFrontend {
  framework: string;
  componentStructure: string[];
  stateManagement: string;
  keyUXHighlights: string[];
  interactiveDemoType:
    | 'agri-crop-leaf'
    | 'agri-irrigation'
    | 'agri-satellite'
    | 'agri-pest'
    | 'agri-drone'
    | 'agri-robot-harvest'
    | 'agri-mandi-price'
    | 'agri-soil-npk'
    | 'agri-hydroponics'
    | 'agri-cattle-vision'
    | 'fraud-radar'
    | 'vector-search'
    | 'health-triage'
    | 'code-remediator';
}

export interface ExpertChallenge {
  id: string;
  title: string;
  domain: ChallengeDomain;
  difficulty: ChallengeDifficulty;
  prizePool: string;
  badgeAwarded: {
    name: string;
    icon: string;
    tier: string;
    description: string;
  };
  summary: string;
  realWorldProblem: string;
  dataStructure: ChallengePillarDataStructure;
  systemDesign: ChallengePillarSystemDesign;
  database: ChallengePillarDatabase;
  aiModel: ChallengePillarAIModel;
  frontend: ChallengePillarFrontend;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
    timeLimitMs: number;
  }[];
  activeParticipantsCount: number;
  deadlineHoursRemaining: number;
}

export interface ChallengeSubmissionResult {
  passed: boolean;
  score: number;
  executionTimeMs: number;
  memoryUsedMb: number;
  testCasesPassed: number;
  totalTestCases: number;
  feedback: string;
  badgeEarned?: {
    name: string;
    icon: string;
    issuedDate: string;
    verificationId: string;
  };
}

export const EXPERT_CHALLENGES_DATABASE: ExpertChallenge[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // ── 10 INNOVATIVE AGRICULTURE & RURAL AI CHALLENGES (FOR FARMERS) ──
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'agri-ch-1',
    title: 'Edge-Vision Crop Leaf Disease Scanner & Vernacular Voice Advisory (Offline-First)',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Expert',
    prizePool: '₹2,50,000 + National AgriTech Fellowship',
    badgeAwarded: {
      name: 'Agri-Vision Edge Master',
      icon: '🌿',
      tier: 'Diamond Master',
      description: 'Built zero-internet edge INT8 YOLO crop pathology and multilingual voice advisory engine for smallholder farmers.'
    },
    summary:
      'Engineered a 4.2MB offline-first neural model executing on low-end smartphones in remote villages, detecting 48 leaf diseases (Blight, Rust, Blast) with localized voice treatment remedies in regional languages.',
    realWorldProblem:
      'Smallholder farmers in remote Indian villages have unreliable 2G/3G mobile connectivity and low literacy rates. When rice blast or cotton bollworm strikes, waiting 4 days for an agronomist leads to 60-80% crop loss. The solution must run 100% offline on Android devices and speak in regional languages (Kannada, Hindi, Telugu, Tamil, Marathi).',
    dataStructure: {
      name: 'Prefix Trie for Vernacular Phoneme Indexing + Depthwise Separable 2D Tensor Buffer',
      timeComplexity: 'O(L) vocabulary phoneme lookup (L = string length) | O(1) frame inference memory buffer',
      spaceComplexity: 'O(V) bounded memory vocabulary cache under 2MB RAM footprint',
      description:
        'A compact Prefix Tree indexes localized remedies and agronomy remedies by audio phoneme keys, while a circular image tensor buffer enables real-time camera viewfinder inference without garbage collection lag.',
      implementationCode: `class VernacularPhonemeTrie:
    def __init__(self):
        self.root = {}
        
    def insert(self, disease_code: str, language: str, audio_remedy_path: str):
        node = self.root
        for char in f"{disease_code}_{language}":
            if char not in node:
                node[char] = {}
            node = node[char]
        node['__audio__'] = audio_remedy_path
        
    def get_remedy_audio(self, disease_code: str, language: str) -> str:
        node = self.root
        for char in f"{disease_code}_{language}":
            if char not in node:
                return "default_agri_helpline.wav"
            node = node[char]
        return node.get('__audio__', "default_agri_helpline.wav")`,
      whyThisStructure:
        'Trie guarantees deterministic sub-millisecond audio remedy resolution on $60 Android phones without requiring network database lookups.'
    },
    systemDesign: {
      architectureType: 'Offline-First Progressive Web App (PWA) with Background Store-and-Forward SQLite Sync',
      latencyBudget: 'P95: 35ms on-device CPU inference | Zero network dependency for diagnosis',
      throughputTarget: '30 FPS camera preview scanning with INT8 quantization',
      hldFlowDiagram: [
        '1. Farmer opens camera in village field (No 4G/Internet required)',
        '2. WebAssembly/ONNX Runtime loads 4.2MB quantized YOLOv10-Nano model from IndexedDB',
        '3. Video frame captures leaf -> bounding box localized in 32ms',
        '4. Vernacular Trie resolves treatment audio in selected language (e.g. Kannada)',
        '5. Audio remedy plays aloud: "Apply 2g Copper Oxychloride per liter within 48 hours."',
        '6. When farmer enters cellular zone, background Service Worker syncs outbreak GPS to PostGIS'
      ],
      scalabilityStrategy:
        '100% decentralized edge execution prevents cloud server bottlenecks during seasonal disease outbreaks.',
      businessLogicValidation: [
        'Mandatory organic biological treatment alternative provided alongside chemical pesticides.',
        'Confidence score threshold >= 85% before recommending chemical intervention.'
      ]
    },
    database: {
      dbType: 'SQLite 3 (Client Offline Store) + PostgreSQL 16 PostGIS (Central Outbreak Cloud)',
      schemaDDL: `CREATE TABLE IF NOT EXISTS regional_disease_outbreaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_anon_id VARCHAR(64) NOT NULL,
    crop_type VARCHAR(32) NOT NULL,
    disease_identified VARCHAR(64) NOT NULL,
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    location GEOMETRY(Point, 4326) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbreak_spatial ON regional_disease_outbreaks USING GIST(location);
CREATE INDEX idx_crop_disease ON regional_disease_outbreaks(crop_type, disease_identified);`,
      indexingStrategy: [
        'GiST Spatial Index on outbreak GPS coordinates for real-time 10km radius contagion cluster alerts.'
      ],
      cachingLayer: 'Client IndexedDB caching compressed audio remedy files (MP3/OGG).',
      queryOptimizationTip:
        'Use ST_DWithin(location, ST_MakePoint(lon, lat)::geography, 10000) for instant neighbor warning triggers.'
    },
    aiModel: {
      modelArchitecture: 'YOLOv10-Nano (INT8 Quantized, 4.2MB) + MobileNetV4 Pathology Backbone',
      lossFunction: 'Complete IoU (CIoU) Loss + Focal Classification Loss',
      inferencePipeline:
        'Converts 224x224 RGB image to INT8 tensor, executes depthwise separable convolutions on Mobile CPU in 32ms.',
      samplePromptOrPipelineCode: `import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("crop_disease_yolov10n_int8.onnx", providers=['CPUExecutionProvider'])

def scan_crop_leaf(image_tensor: np.ndarray) -> dict:
    outputs = session.run(None, {"images": image_tensor})
    # outputs[0]: [batch, boxes, (x, y, w, h, confidence, class_id)]
    top_detection = outputs[0][0][0]
    return {
        "disease": "Tomato_Early_Blight",
        "confidence": float(top_detection[4]),
        "recommended_spray": "Mancozeb 75 WP @ 2g/L or Trichoderma viride biological spray"
    }`,
      accuracyOrLatencyMetrics: 'mAP@50: 92.4% | Model Size: 4.2MB | Inference: 32ms on ARM Cortex-A53'
    },
    frontend: {
      framework: 'Next.js 16 + WebAssembly ONNX Runtime + Web Speech Audio Synthesis',
      componentStructure: [
        'CameraViewfinderScanner: Live camera canvas drawing animated target reticle over infected leaf patches.',
        'VernacularVoicePlayer: One-click audio synthesizer reciting remedies in Kannada, Hindi, Telugu, or Tamil.',
        'OrganicPrescriptionCard: Visual dosage breakdown with simple water-bucket mixing illustrations.'
      ],
      stateManagement: 'React Zustand with Offline IndexedDB persistence.',
      keyUXHighlights: [
        'High-contrast sunlight readable UI for outdoor field visibility.',
        'Zero-text mode with full voice instruction prompts for illiterate farmers.'
      ],
      interactiveDemoType: 'agri-crop-leaf'
    },
    testCases: [
      {
        id: 'tc-agri-1',
        input: '{"crop": "Rice", "symptom": "spindle_shaped_lesions_brown_margin", "language": "kannada"}',
        expectedOutput: '{"diagnosis": "Rice Blast (Magnaporthe oryzae)", "confidence": 0.94, "audioTriggered": true}',
        timeLimitMs: 40
      }
    ],
    activeParticipantsCount: 312,
    deadlineHoursRemaining: 72
  },
  {
    id: 'agri-ch-2',
    title: 'Autonomous Precision Drip Irrigation & Soil Moisture Deep RL Controller',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Expert',
    prizePool: '₹2,00,000 + Smart Farming IoT Kit',
    badgeAwarded: {
      name: 'Precision Irrigation Grandmaster',
      icon: '💧',
      tier: 'Diamond Master',
      description: 'Designed Closed-Loop Deep Reinforcement Learning irrigation saving 45% fresh water.'
    },
    summary:
      'Constructed an IoT sensor mesh controller using Reinforcement Learning (PPO) that predicts evapotranspiration and actuates sub-plot drip solenoids to conserve 45% water while boosting crop yields.',
    realWorldProblem:
      'Agricultural irrigation consumes 70% of global accessible freshwater. Over-watering causes root rot, nutrient leaching, and depletes groundwater tables, while under-watering wilts crops during heatwaves.',
    dataStructure: {
      name: 'Dynamic Segment Tree for Fast Multi-Zone Soil Moisture Range Queries',
      timeComplexity: 'O(log N) moisture range query across 1,000 field sub-plots | O(log N) sensor update',
      spaceComplexity: 'O(N) memory allocation for tree nodes',
      description:
        'A Segment Tree maintains min/max/average volumetric water content (VWC) across all farm zones to trigger valve bursts in sub-millisecond intervals.',
      implementationCode: `class SoilMoistureSegmentTree:
    def __init__(self, size: int):
        self.n = size
        self.tree = [0.0] * (4 * size)
        
    def update(self, node: int, start: int, end: int, idx: int, val: float):
        if start == end:
            self.tree[node] = val
            return
        mid = (start + end) // 2
        if idx <= mid:
            self.update(2 * node, start, mid, idx, val)
        else:
            self.update(2 * node + 1, mid + 1, end, idx, val)
        self.tree[node] = min(self.tree[2 * node], self.tree[2 * node + 1])
        
    def query_min_moisture(self, node: int, start: int, end: int, l: int, r: int) -> float:
        if r < start or end < l:
            return float('inf')
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        return min(self.query_min_moisture(2 * node, start, mid, l, r),
                   self.query_min_moisture(2 * node + 1, mid + 1, end, l, r))`,
      whyThisStructure:
        'Enables instantaneous O(log N) detection of drought stress zones across thousands of multi-acre sub-plots.'
    },
    systemDesign: {
      architectureType: 'LoRaWAN IoT Gateway Mesh + Edge RL Dosing Controller + TimescaleDB',
      latencyBudget: 'Sensor telemetry parsed in <10ms | Valve actuation in <50ms',
      throughputTarget: '5,000 LoRa telemetry packets per second',
      hldFlowDiagram: [
        '1. Capacitive Soil VWC Sensors transmit moisture + solar radiation over LoRaWAN',
        '2. Gateway calculates Penman-Monteith reference evapotranspiration (ET0)',
        '3. PPO Policy Network receives [VWC, Temp, Humidity, Weather_Forecast_Rain_Prob]',
        '4. Agent outputs discrete action: [Open Valve Zone 3 for 12 mins @ 2.5 L/hr]',
        '5. Relay triggers solar-powered solenoid switch'
      ],
      scalabilityStrategy:
        'Mesh-based LoRa repeater nodes allow a single gateway to cover a 15-kilometer rural radius.',
      businessLogicValidation: [
        'Never irrigate if weather API predicts >15mm rain within the next 4 hours.',
        'Enforce minimum soil aeration index to prevent root asphyxiation.'
      ]
    },
    database: {
      dbType: 'TimescaleDB (PostgreSQL Extension) for Hypertable Sensor Telemetry',
      schemaDDL: `CREATE TABLE soil_sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    farm_id VARCHAR(32) NOT NULL,
    zone_id INT NOT NULL,
    volumetric_water_pct FLOAT NOT NULL,
    soil_temp_celsius FLOAT NOT NULL,
    electric_conductivity FLOAT,
    solar_radiation_w_m2 FLOAT,
    valve_state BOOLEAN DEFAULT FALSE
);

SELECT create_hypertable('soil_sensor_telemetry', 'time');
CREATE INDEX idx_zone_time ON soil_sensor_telemetry(zone_id, time DESC);`,
      indexingStrategy: ['Timescale hypertable chunking by 7-day intervals with automated columnar compression.'],
      cachingLayer: 'Redis in-memory store tracking latest valve status and soil saturation threshold.',
      queryOptimizationTip:
        'Use Timescale continuous aggregates (time_bucket) to compute hourly moving moisture deltas in <2ms.'
    },
    aiModel: {
      modelArchitecture: 'Proximal Policy Optimization (PPO) Actor-Critic Reinforcement Learning Network',
      lossFunction: 'PPO Clipped Surrogate Loss + Value Function MSE: L^{CLIP}(θ) - c_1 L^{VF}(θ)',
      inferencePipeline:
        'Lightweight PyTorch C++ LibTorch model evaluates state vector and returns optimal water volume dosage.',
      samplePromptOrPipelineCode: `import torch

class IrrigationPPOActor(torch.nn.Module):
    def __init__(self, state_dim=6, action_dim=3):
        super().__init__()
        self.net = torch.nn.Sequential(
            torch.nn.Linear(state_dim, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, action_dim), # [0=OFF, 1=LOW_DRIP, 2=FULL_DRIP]
            torch.nn.Softmax(dim=-1)
        )
    def forward(self, state):
        return self.net(state)`,
      accuracyOrLatencyMetrics: 'Water Savings: 44.8% vs scheduled timers | Crop Yield Gain: +18.2% | Latency: 3.8ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + SVG Farm Grid Canvas',
      componentStructure: [
        'FarmMoistureHeatmap: 2D interactive grid showing color-coded moisture levels for every plot (0-100%).',
        'WeatherForecastForecaster: Live widget displaying upcoming precipitation and solar irradiance.',
        'SolenoidActuationControls: Manual override toggles and automated AI dosing scheduler.'
      ],
      stateManagement: 'React useState + WebSockets for real-time sensor updates.',
      keyUXHighlights: [
        'Visual water savings counter in Liters and Currency (₹ saved in pumping diesel/electricity).',
        'Emergency drought alert badge.'
      ],
      interactiveDemoType: 'agri-irrigation'
    },
    testCases: [
      {
        id: 'tc-agri-2',
        input: '{"vwc": 18.2, "temp": 38.5, "rain_forecast_4h": 0.0, "crop_stage": "flowering"}',
        expectedOutput: '{"valveAction": "OPEN_FULL", "durationMinutes": 18, "waterLiters": 45.0}',
        timeLimitMs: 20
      }
    ],
    activeParticipantsCount: 248,
    deadlineHoursRemaining: 84
  },
  {
    id: 'agri-ch-3',
    title: 'Satellite Multispectral NDVI & Hyper-Spectral Crop Harvest Yield Forecaster',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Hard',
    prizePool: '₹2,00,000 + Geospatial Cloud Grant',
    badgeAwarded: {
      name: 'Agri-Satellite Geospatial Titan',
      icon: '🛰️',
      tier: 'Platinum Architect',
      description: 'Engineered Sentinel-2 multispectral band math, Quadtree spatial indexing, and 3D ConvNet yield predictors.'
    },
    summary:
      'Processed Sentinel-2 multispectral 10-meter satellite raster bands to compute NDVI, NDRE, and EVI indices, predicting harvest yield (tons/acre) 45 days before harvest for crop insurance.',
    realWorldProblem:
      'Crop loss claims for smallholder farmers take 6 to 9 months to settle because manual physical field verification is slow and corrupt. Automated satellite AI provides tamper-proof historical yield estimates.',
    dataStructure: {
      name: 'Quadtree Spatial Index for 2D Farm Parcel Polygon Queries',
      timeComplexity: 'O(log N) spatial polygon intersection search | O(K) pixel raster extraction',
      spaceComplexity: 'O(N) quadtree node subdivision storage',
      description:
        'A Quadtree recursively partitions satellite coordinate tiles into four quadrants, allowing rapid retrieval of multi-band spectral reflectance for any cadastral survey number.',
      implementationCode: `class GeoQuadtreeNode:
    def __init__(self, boundary_box, capacity=4):
        self.bbox = boundary_box # [min_lat, min_lon, max_lat, max_lon]
        self.capacity = capacity
        self.parcels = []
        self.divided = False
        
    def subdivide(self):
        min_lat, min_lon, max_lat, max_lon = self.bbox
        mid_lat = (min_lat + max_lat) / 2
        mid_lon = (min_lon + max_lon) / 2
        self.nw = GeoQuadtreeNode([mid_lat, min_lon, max_lat, mid_lon])
        self.ne = GeoQuadtreeNode([mid_lat, mid_lon, max_lat, max_lon])
        self.sw = GeoQuadtreeNode([min_lat, min_lon, mid_lat, mid_lon])
        self.se = GeoQuadtreeNode([min_lat, mid_lon, mid_lat, max_lon])
        self.divided = True`,
      whyThisStructure:
        'Handles millions of irregular land record polygons across entire districts with log-time geographical lookups.'
    },
    systemDesign: {
      architectureType: 'Asynchronous Geospatial Cloud Ingestion Pipeline (COGs + PostGIS + PyTorch)',
      latencyBudget: 'Sub-second NDVI compute on 500-acre farm boundary | Batch yield prediction in 1.4s',
      throughputTarget: '1,000 satellite raster tiles per pipeline job',
      hldFlowDiagram: [
        '1. Copemicus Sentinel-2 L2A raster (10m resolution) ingested via Cloud-Optimized GeoTIFF',
        '2. Band Math Pipeline extracts Red (B4), NIR (B8), and RedEdge (B5)',
        '3. Normalized Difference Vegetation Index computed: NDVI = (NIR - Red) / (NIR + Red)',
        '4. 3D Temporal ConvNet aggregates 90-day time-series curve to forecast final harvest yield (tons/acre)',
        '5. Automated PMFBY Crop Insurance settlement report generated'
      ],
      scalabilityStrategy:
        'Parallel raster window streaming without loading multi-gigabyte GeoTIFF files into memory.',
      businessLogicValidation: [
        'Mask out cloud, shadow, and water pixels using Sentinel-2 Scene Classification Layer (SCL).'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + PostGIS Spatial Engine',
      schemaDDL: `CREATE TABLE farmer_land_parcels (
    parcel_id VARCHAR(64) PRIMARY KEY,
    survey_number VARCHAR(32) NOT NULL,
    farmer_name VARCHAR(128) NOT NULL,
    crop_season VARCHAR(20) NOT NULL,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    area_acres NUMERIC(8, 2) NOT NULL,
    avg_ndvi_score FLOAT,
    predicted_yield_tons NUMERIC(10, 2)
);

CREATE INDEX idx_parcel_geom ON farmer_land_parcels USING GIST(boundary);`,
      indexingStrategy: ['GiST spatial index on polygon boundaries.'],
      cachingLayer: 'Redis caching pre-computed NDVI GeoJSON color ramps.',
      queryOptimizationTip:
        'Use ST_SimplifyPreserveTopology(boundary, 0.0001) for ultra-fast vector map rendering.'
    },
    aiModel: {
      modelArchitecture: '3D Spatio-Temporal ResNet + Temporal Fusion Transformer (TFT)',
      lossFunction: 'Root Mean Squared Error (RMSE) + Huber Loss for yield outlier robustness',
      inferencePipeline:
        'Ingests a 12-channel time-series tensor of reflectance bands and outputs expected quintals per hectare with 95% confidence intervals.',
      samplePromptOrPipelineCode: `import numpy as np

def compute_vegetation_indices(nir: np.ndarray, red: np.ndarray, red_edge: np.ndarray) -> dict:
    ndvi = (nir - red) / (nir + red + 1e-6)
    ndre = (nir - red_edge) / (nir + red_edge + 1e-6)
    return {"ndvi_mean": float(np.nanmean(ndvi)), "ndre_mean": float(np.nanmean(ndre))}`,
      accuracyOrLatencyMetrics: 'R² Score: 0.894 | Yield Prediction RMSE: ±1.8 quintals/acre'
    },
    frontend: {
      framework: 'Next.js 16 + Leaflet.js / OpenLayers + Tailwind CSS',
      componentStructure: [
        'SatelliteNDVIMapViewer: Multi-spectral map with interactive NDVI color ramp slider (Brown -> Green).',
        'YieldForecastHistogram: Time-series biomass growth trajectory curve vs 5-year historical average.',
        'InsuranceClaimExportButton: 1-Click PDF certificate generator for bank credit & claim filing.'
      ],
      stateManagement: 'React Zustand geospatial state.',
      keyUXHighlights: [
        'Satellite imagery time-slider: Compare field biomass from June to October.',
        'Anomaly highlighting on damaged sub-plots.'
      ],
      interactiveDemoType: 'agri-satellite'
    },
    testCases: [
      {
        id: 'tc-agri-3',
        input: '{"parcelId": "KA-DWR-2024-881", "nir": 0.58, "red": 0.12, "days_after_sowing": 65}',
        expectedOutput: '{"ndvi": 0.657, "cropVigor": "EXCELLENT", "yieldForecastTonsAcre": 3.4}',
        timeLimitMs: 30
      }
    ],
    activeParticipantsCount: 195,
    deadlineHoursRemaining: 96
  },
  {
    id: 'agri-ch-4',
    title: 'Real-Time Insect Pest Swarm Trapping & Automated Biological Dispenser',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Hard',
    prizePool: '₹1,80,000 + Smart Pheromone Trap Hardware',
    badgeAwarded: {
      name: 'Agri-Pest Bio-Defense Sentinel',
      icon: '🦟',
      tier: 'Gold Specialist',
      description: 'Constructed spatial KD-Tree pest density clusters and edge Tiny-YOLOv8 insect species counters.'
    },
    summary:
      'Solar-powered smart insect traps classify fall armyworms, whiteflies, and bollworms, triggering automated biological pheromone dispensers before swarm outbreaks occur.',
    realWorldProblem:
      'Pest swarms can destroy 10 acres of maize or cotton in 48 hours. Farmers spray heavy toxic organophosphates reactively. Early detection via automated optical pheromone traps allows targeted biological control.',
    dataStructure: {
      name: '2D Spatial KD-Tree for Rapid Nearest-Neighbor Pest Cluster Density Computation',
      timeComplexity: 'O(log N) nearest neighbor search | O(N log N) tree construction',
      spaceComplexity: 'O(N) node storage',
      description:
        'A 2-dimensional KD-Tree maps physical trap coordinates and pest counts to identify the epicenter of swarm migrations in real-time.',
      implementationCode: `import math

class PestKDTree:
    def __init__(self, points, depth=0):
        if not points:
            self.node = None
            return
        k = 2
        axis = depth % k
        points.sort(key=lambda x: x['coords'][axis])
        median = len(points) // 2
        self.point = points[median]
        self.left = PestKDTree(points[:median], depth + 1)
        self.right = PestKDTree(points[median + 1:], depth + 1)`,
      whyThisStructure:
        'Finds the 3 highest pest density clusters across thousands of traps in sub-millisecond time to dispatch biological drone sprays.'
    },
    systemDesign: {
      architectureType: 'Edge Camera Microcontroller + Zigbee Mesh + Cloud Outbreak Visualizer',
      latencyBudget: 'Image classification in <60ms on ESP32-CAM / Raspberry Pi Zero',
      throughputTarget: '1,000 automated trap checks per hour',
      hldFlowDiagram: [
        '1. Insects attracted by pheromone lure enter solar optical chamber',
        '2. IR beam breaks -> Triggers macro camera snapshot',
        '3. Edge Tiny-YOLO classifies species: Spodoptera frugiperda (Fall Armyworm)',
        '4. Count exceeds Economic Threshold Level (ETL: >8 moths/night)',
        '5. Microcontroller actuates micro-dispenser spraying Trichogramma biological repellent'
      ],
      scalabilityStrategy:
        'Low-power Zigbee mesh transmits only species ID and counts (16 bytes per event), preserving battery for 12 months.',
      businessLogicValidation: [
        'Distinguish beneficial pollinator insects (Honeybees, Ladybugs) from agricultural pests with 99% accuracy.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 with JSONB Telemetry + TimescaleDB',
      schemaDDL: `CREATE TABLE smart_pest_traps (
    trap_id VARCHAR(32) PRIMARY KEY,
    farm_id VARCHAR(32) NOT NULL,
    species_detected VARCHAR(64) NOT NULL,
    count_last_24h INT NOT NULL,
    etl_exceeded BOOLEAN DEFAULT FALSE,
    pheromone_level_pct INT NOT NULL,
    battery_pct INT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      indexingStrategy: ['B-Tree index on (farm_id, etl_exceeded) for critical farmer warning broadcasts.'],
      cachingLayer: 'Redis caching active trap cluster outbreak maps.',
      queryOptimizationTip: 'Use JSONB containment queries @> for flexible multi-species breakdown.'
    },
    aiModel: {
      modelArchitecture: 'Tiny-YOLOv8-Nano (Specialized for 24 Insect Agricultural Taxonomies)',
      lossFunction: 'Varifocal Loss (VFL) to balance rare invasive pest classes',
      inferencePipeline:
        '8-bit quantized TFLite model running on edge microcontrollers, segmenting and counting overlapping insect bodies.',
      samplePromptOrPipelineCode: `# Edge insect counter pipeline
def count_pests_in_trap(bounding_boxes: list) -> dict:
    species_counts = {}
    for box in bounding_boxes:
        label = box['label']
        species_counts[label] = species_counts.get(label, 0) + 1
    is_etl_breached = species_counts.get("fall_armyworm", 0) > 8
    return {"counts": species_counts, "alert": is_etl_breached}`,
      accuracyOrLatencyMetrics: 'Precision: 96.1% | Recall: 93.8% | Inference: 48ms on ARM Cortex-M7'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + SVG Trap Map',
      componentStructure: [
        'PestDensityMap: Visual field layout highlighting traps in Green (Safe), Amber (Caution), and Red (ETL Breach).',
        'SpeciesBreakdownDonut: Real-time pie chart of pest vs beneficial insects.',
        'BiologicalDispenserTrigger: Manual and automated pheromone release switch.'
      ],
      stateManagement: 'React Context with Live Pollen/Pest Data.',
      keyUXHighlights: [
        'Flashing visual siren on traps exceeding economic threshold limits.',
        'Zero-toxicity biological bio-control recommendation sheet.'
      ],
      interactiveDemoType: 'agri-pest'
    },
    testCases: [
      {
        id: 'tc-agri-4',
        input: '{"trapId": "TRP-88", "species": "fall_armyworm", "night_count": 14}',
        expectedOutput: '{"status": "ETL_BREACH_CRITICAL", "action": "DISPENSE_BIOLOGICAL_PHEROMONE"}',
        timeLimitMs: 15
      }
    ],
    activeParticipantsCount: 164,
    deadlineHoursRemaining: 60
  },
  {
    id: 'agri-ch-5',
    title: 'Autonomous Drone Swarm Pathfinding for Targeted Chemical Micro-Dosing',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Expert',
    prizePool: '₹2,50,000 + Drone Pilot Certification Grant',
    badgeAwarded: {
      name: 'Agri-Drone Swarm Flight Architect',
      icon: '🚁',
      tier: 'Diamond Master',
      description: 'Formulated 3D Voxel A* Pathfinding and real-time weed segmentation for ultra-targeted micro-spraying.'
    },
    summary:
      'Coordinated a multi-drone flight swarm using 3D A* obstacle avoidance to selectively micro-spray herbicide only on detected weed pixels, cutting chemical waste by 72%.',
    realWorldProblem:
      'Broad-acre blanket pesticide spraying poisons groundwater and beneficial earthworms. Precision agricultural drones need real-time flight path optimization to hover only over weed infestations.',
    dataStructure: {
      name: '3D Voxel Grid + Priority Queue (Min-Heap) for A* Swarm Trajectory Planning',
      timeComplexity: 'O(V log V) trajectory optimization over 3D terrain space',
      spaceComplexity: 'O(X × Y × Z) voxel occupancy map',
      description:
        'A 3D Voxel grid represents altitude, tree obstacles, and wind drift vectors to ensure collision-free multi-drone swarm routes.',
      implementationCode: `import heapq

def a_star_drone_path(start: tuple, goal: tuple, obstacle_grid: set) -> list:
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}
    
    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1]
            
        for dx, dy, dz in [(1,0,0), (-1,0,0), (0,1,0), (0,-1,0), (0,0,1), (0,0,-1)]:
            neighbor = (current[0]+dx, current[1]+dy, current[2]+dz)
            if neighbor in obstacle_grid:
                continue
            tentative_g = g_score[current] + 1
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + abs(neighbor[0]-goal[0]) + abs(neighbor[1]-goal[1])
                heapq.heappush(open_set, (f_score, neighbor))
    return []`,
      whyThisStructure:
        'A* with 3D Manhattan heuristics guarantees the shortest, most battery-efficient flight trajectory for spraying payload drones.'
    },
    systemDesign: {
      architectureType: 'MAVLink Drone Protocol + Edge GPU Jetson Orin Nano + WebSockets',
      latencyBudget: 'Real-time weed segmentation at 30 FPS (<33ms) | Trajectory replanning in 12ms',
      throughputTarget: '8 coordinated autonomous drones per field flight mission',
      hldFlowDiagram: [
        '1. Drone swarm launches from autonomous docking station',
        '2. Downward 4K camera streams frames to onboard Jetson Orin Nano',
        '3. Semantic Segmentation model detects broadleaf weeds among crop rows',
        '4. Nozzle micro-valves actuate for 50 milliseconds directly over weed coordinates',
        '5. Chemical usage reduced by 72% compared to tractor blanket spraying'
      ],
      scalabilityStrategy:
        'Decentralized peer-to-peer collision avoidance between drones using Wi-Fi 6 mesh.',
      businessLogicValidation: [
        'Automatic Return-To-Home (RTH) failsafe triggered if battery drops below 22% or wind gusts exceed 30 km/h.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + PostGIS for Precision Spraying Flight Logs',
      schemaDDL: `CREATE TABLE drone_spray_missions (
    mission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drone_id VARCHAR(32) NOT NULL,
    farm_id VARCHAR(32) NOT NULL,
    area_covered_acres NUMERIC(8, 2) NOT NULL,
    chemical_saved_liters NUMERIC(8, 2) NOT NULL,
    flight_duration_minutes INT NOT NULL,
    weed_count_treated INT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      indexingStrategy: ['B-Tree index on (drone_id, completed_at DESC) for fleet telemetry management.'],
      cachingLayer: 'Redis caching real-time GPS telemetry coordinates of all active drones.',
      queryOptimizationTip: 'Use ST_Union to merge individual spray swathes into a unified mission coverage polygon.'
    },
    aiModel: {
      modelArchitecture: 'DeepLabV3+ with MobileNetV3-Large Encoder (TensorRT Quantized)',
      lossFunction: 'Dice Loss + Binary Cross-Entropy Loss for weed-crop pixel segmentation',
      inferencePipeline:
        'Takes 512x512 downsampled camera frame, outputs binary mask separating crop rows from invasive weeds at 35 FPS.',
      samplePromptOrPipelineCode: `# Real-time spray nozzle actuation logic
def calculate_nozzle_firing(mask_tensor: np.ndarray) -> list[int]:
    # mask_tensor: [512, 512] binary weed mask
    # 4 individual nozzle zones across 2-meter spray boom
    quadrants = np.array_split(mask_tensor, 4, axis=1)
    nozzle_triggers = [1 if np.sum(q) > 50 else 0 for q in quadrants]
    return nozzle_triggers # e.g. [0, 1, 1, 0]`,
      accuracyOrLatencyMetrics: 'Mean IoU: 88.6% on weeds | Chemical Saving: 72.4% | FPS: 34 FPS'
    },
    frontend: {
      framework: 'Next.js 16 + Three.js / Canvas 3D Drone Flight Visualizer',
      componentStructure: [
        'DroneFlightPathCanvas: Real-time 3D rendering of field topography with active drone markers.',
        'WeedInfestationOverlay: Color-coded heatmap showing detected weed patches.',
        'BatteryAndPayloadGauges: Live monitoring of battery % and remaining chemical tank capacity.'
      ],
      stateManagement: 'React Three Fiber state.',
      keyUXHighlights: [
        'Interactive 3D flight mission path preview with altitude adjustments.',
        'Total chemical cost savings summary card.'
      ],
      interactiveDemoType: 'agri-drone'
    },
    testCases: [
      {
        id: 'tc-agri-5',
        input: '{"droneId": "DRN-01", "weedDensity": "MODERATE_CLUSTER", "windSpeedKmh": 12.0}',
        expectedOutput: '{"flightSpeedMs": 4.5, "sprayRateMlSec": 8.2, "nozzleStatus": "ACTIVE_PULSE"}',
        timeLimitMs: 25
      }
    ],
    activeParticipantsCount: 220,
    deadlineHoursRemaining: 70
  },
  {
    id: 'agri-ch-6',
    title: 'Computer Vision Soft-Grip Robotic Fruit Ripeness & Post-Harvest Harvester',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Hard',
    prizePool: '₹2,00,000 + Agri-Robotics Innovation Trophy',
    badgeAwarded: {
      name: 'Agri-Robotics Harvest Architect',
      icon: '🍎',
      tier: 'Platinum Architect',
      description: 'Programmed soft-gripper inverse kinematics and Brix sugar ripeness instance segmentation.'
    },
    summary:
      'Autonomous orchard harvesting robot equipped with soft-pneumatic grippers and Mask R-CNN, detecting fruit ripeness (Brix index) and picking delicate fruits (apples, tomatoes, mangoes) without bruising.',
    realWorldProblem:
      'Agricultural labor shortages during harvest seasons lead to rotting produce on branches. Traditional rigid mechanical harvesters crush 30% of soft fruits. Soft-touch AI robotics ensures damage-free harvesting.',
    dataStructure: {
      name: 'Minimum Bounding Rectangle (MBR) + Spatial Graph for Fruit Cluster Occlusion Ordering',
      timeComplexity: 'O(N log N) topological occlusion sorting | O(1) grip centroid calculation',
      spaceComplexity: 'O(N) fruit centroid storage',
      description:
        'Maintains a directed graph where edges represent physical branch/leaf occlusions, ensuring the robot picks outermost unobstructed fruits first.',
      implementationCode: `class FruitHarvestScheduler:
    def __init__(self):
        self.fruits = [] # list of {"id": str, "x": float, "y": float, "z": float, "depth": float, "ripeness": float}
        
    def add_detected_fruit(self, fruit_data: dict):
        self.fruits.append(fruit_data)
        
    def get_optimal_picking_sequence(self) -> list:
        # Sort by depth (closest first) and filter only ripe fruits (ripeness >= 0.85)
        ripe_fruits = [f for f in self.fruits if f['ripeness'] >= 0.85]
        return sorted(ripe_fruits, key=lambda f: f['depth'])`,
      whyThisStructure:
        'Prevents robotic arm collisions with foreground branches by strictly ordering picking operations from foreground to background.'
    },
    systemDesign: {
      architectureType: 'ROS2 (Robot Operating System) + PyTorch ONNX + Soft-Pneumatic Gripper Controller',
      latencyBudget: 'Fruit detection in <45ms | Kinematics trajectory calculation in <20ms',
      throughputTarget: '1 fruit harvested every 2.8 seconds',
      hldFlowDiagram: [
        '1. RGB-D RealSense 3D camera captures fruit tree canopy',
        '2. Mask R-CNN outputs 3D bounding boxes and point-cloud centroids',
        '3. ResNet ripeness classifier predicts sugar Brix index from color hue/texture',
        '4. Inverse Kinematics solver computes 6-DOF arm angle trajectories',
        '5. Soft pneumatic silicone fingers inflate gently at 15 kPa pressure, detaching fruit'
      ],
      scalabilityStrategy:
        'Dual-arm mobile robotic rover doubles orchard harvesting speed per unit.',
      businessLogicValidation: [
        'Tactile pressure sensors cap grip force at 20 Newtons to guarantee zero peel bruising.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 for Harvest Batch & Quality Traceability',
      schemaDDL: `CREATE TABLE orchard_harvest_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    robot_id VARCHAR(32) NOT NULL,
    fruit_type VARCHAR(32) NOT NULL,
    grade_a_count INT NOT NULL,
    grade_b_count INT NOT NULL,
    rejected_unripe_count INT NOT NULL,
    avg_brix_sugar_index FLOAT NOT NULL,
    harvested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      indexingStrategy: ['B-Tree index on (fruit_type, harvested_at DESC).'],
      cachingLayer: 'Redis caching real-time rover harvest tally.',
      queryOptimizationTip: 'Use aggregation summaries for daily pack-house shipping forecasts.'
    },
    aiModel: {
      modelArchitecture: 'Mask R-CNN + Depth Estimation Network + Brix Ripeness Regressor',
      lossFunction: 'Mask Loss + Smooth L1 Bounding Box Loss',
      inferencePipeline:
        'Extracts pixel mask, overlays point cloud depth to compute 3D coordinate (X, Y, Z), and computes ripeness color index.',
      samplePromptOrPipelineCode: `def evaluate_fruit_harvest(mask: np.ndarray, rgb_crop: np.ndarray) -> dict:
    # Color ratio: Red/Green balance for tomato/apple
    r_mean = np.mean(rgb_crop[:, :, 0])
    g_mean = np.mean(rgb_crop[:, :, 1])
    ripeness_index = r_mean / (g_mean + 1e-5)
    is_ready = ripeness_index > 1.4
    return {"ready_to_harvest": is_ready, "ripeness_score": min(1.0, ripeness_index / 2.0)}`,
      accuracyOrLatencyMetrics: 'Picking Success Rate: 94.2% | Zero Bruising: 98.6% | Cycle Time: 2.8s'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Interactive Fruit Ripeness Inspector',
      componentStructure: [
        'RoboticViewfinder: Interactive camera stream displaying segmented fruit contours with ripeness meters.',
        'HarvestBinStatistics: Live bar charts showing Grade-A vs Grade-B count tally.',
        'GripPressureGauge: Real-time sensor readout of pneumatic gripper force in Newtons.'
      ],
      stateManagement: 'React useState for active fruit inspection.',
      keyUXHighlights: [
        'Interactive ripeness slider: Simulate fruit turning from green to red with automated harvest trigger.',
        'Grade-A export pricing estimation.'
      ],
      interactiveDemoType: 'agri-robot-harvest'
    },
    testCases: [
      {
        id: 'tc-agri-6',
        input: '{"fruit": "Tomato", "depth_mm": 420, "r_g_ratio": 1.62}',
        expectedOutput: '{"decision": "HARVEST_NOW", "grade": "GRADE_A_EXPORT", "gripPressureKpa": 14}',
        timeLimitMs: 30
      }
    ],
    activeParticipantsCount: 178,
    deadlineHoursRemaining: 80
  },
  {
    id: 'agri-ch-7',
    title: 'Fair Mandi (APMC) Real-Time AI Price Forecaster & Direct Buyer Matcher',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Intermediate',
    prizePool: '₹1,50,000 + FinTech Agri-Trading Fellowship',
    badgeAwarded: {
      name: 'Agri-Market Fair Trade Titan',
      icon: '📈',
      tier: 'Gold Specialist',
      description: 'Engineered Maximum Bipartite Matching and multi-horizon Temporal Fusion Transformer price predictors.'
    },
    summary:
      'Empowers farmers with explainable 7-day and 30-day crop market price forecasts across 2,500 APMC mandis, using Bipartite Matching to connect farmers directly to bulk institutional buyers without middleman cuts.',
    realWorldProblem:
      'Middlemen exploit price information asymmetry, buying onions or tomatoes at ₹8/kg from distressed farmers and selling at ₹40/kg in cities. Farmers need predictive price intelligence to decide when and where to sell.',
    dataStructure: {
      name: 'Hopcroft-Karp Maximum Bipartite Matching Algorithm for Buyer-Farmer Pairings',
      timeComplexity: 'O(E √V) bipartite matching between farmer harvest lots and institutional buyers',
      spaceComplexity: 'O(V + E) adjacency graph',
      description:
        'Constructs an unweighted bipartite graph connecting farmer produce lots to verified buyers based on distance, quantity, and minimum acceptable price thresholds.',
      implementationCode: `from collections import deque

class MandiBipartiteMatcher:
    def __init__(self, farmers: list, buyers: list, max_distance_km=100):
        self.farmers = farmers # list of {"id": str, "crop": str, "min_price": float, "qty": float}
        self.buyers = buyers   # list of {"id": str, "crop": str, "bid_price": float, "demand": float}
        self.max_dist = max_distance_km
        
    def find_direct_matches(self) -> list:
        matches = []
        for f in self.farmers:
            for b in self.buyers:
                if f['crop'] == b['crop'] and b['bid_price'] >= f['min_price']:
                    matches.append({
                        "farmer_id": f['id'],
                        "buyer_id": b['id'],
                        "clearing_price": (f['min_price'] + b['bid_price']) / 2.0,
                        "matched_qty_tons": min(f['qty'], b['demand'])
                    })
        return matches`,
      whyThisStructure:
        'Maximizes total agricultural trade volume while guaranteeing zero farmer exploitation below cost of production.'
    },
    systemDesign: {
      architectureType: 'Microservices Architecture with National Agmarknet Data Ingestion + Temporal AI',
      latencyBudget: 'Price forecast rendered in <25ms | Buyer matching in <40ms',
      throughputTarget: '10,000 concurrent farmer queries during morning harvest auctions',
      hldFlowDiagram: [
        '1. Daily Agmarknet wholesale prices + weather data + diesel logistics rates ingested',
        '2. Temporal Fusion Transformer predicts price trajectory for next 7/14/30 days',
        '3. Recommendation generated: "Hold Onion harvest for 5 days: Expected price rise +₹4.50/kg"',
        '4. Direct Bipartite matching engine alerts institutional buyers (e.g. food processors/supermarkets)',
        '5. Digital escrow agreement locked with UPI payout'
      ],
      scalabilityStrategy:
        'Redis caching pre-computed price trend vectors for top 50 crops across all major districts.',
      businessLogicValidation: [
        'Automatic Minimum Support Price (MSP) floor protection: No trade allowed below statutory MSP.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + Redis Caching Layer',
      schemaDDL: `CREATE TABLE mandi_price_history (
    id BIGSERIAL PRIMARY KEY,
    mandi_name VARCHAR(64) NOT NULL,
    state VARCHAR(32) NOT NULL,
    crop_name VARCHAR(64) NOT NULL,
    modal_price_per_quintal NUMERIC(10, 2) NOT NULL,
    arrival_quantity_tons NUMERIC(10, 2) NOT NULL,
    recorded_date DATE NOT NULL,
    UNIQUE (mandi_name, crop_name, recorded_date)
);

CREATE INDEX idx_mandi_crop_date ON mandi_price_history(crop_name, recorded_date DESC);`,
      indexingStrategy: ['Composite B-Tree index on (crop_name, recorded_date DESC).'],
      cachingLayer: 'Redis caching 30-day forecast curves for instant mobile load.',
      queryOptimizationTip: 'Use partition tables by state to localize query scans.'
    },
    aiModel: {
      modelArchitecture: 'Temporal Fusion Transformer (TFT) with Multi-Horizon Quantile Output',
      lossFunction: 'Quantile Loss (P10, P50, P90) capturing upper and lower market price uncertainties',
      inferencePipeline:
        'Combines historical arrival volumes, festival calendar dates, and rainfall anomalies to predict modal price per quintal.',
      samplePromptOrPipelineCode: `def forecast_mandi_price(historical_prices: list[float], arrival_volume: float) -> dict:
    # TFT simplified inference
    current_price = historical_prices[-1]
    predicted_7d = current_price * (1.0 + (0.05 if arrival_volume < 500 else -0.03))
    return {
        "current_price": current_price,
        "predicted_7d_price": round(predicted_7d, 2),
        "advice": "HOLD_STOCK" if predicted_7d > current_price else "SELL_IMMEDIATELY"
    }`,
      accuracyOrLatencyMetrics: 'Mean Absolute Percentage Error (MAPE): 4.6% | Latency: 12ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Recharts + Tailwind CSS',
      componentStructure: [
        'MandiPriceTrendChart: Interactive line graph showing historical prices and 30-day AI forecast envelope.',
        'DirectBuyerBiddingTable: List of verified direct institutional buyers with 1-click deal accept button.',
        'ProfitSimulatorSlider: Calculates expected net profit after transportation logistics costs.'
      ],
      stateManagement: 'React useState for active crop selection.',
      keyUXHighlights: [
        'Color-coded "Sell Now vs Store in Cold Storage" recommendation badge.',
        'Regional language numeral support.'
      ],
      interactiveDemoType: 'agri-mandi-price'
    },
    testCases: [
      {
        id: 'tc-agri-7',
        input: '{"crop": "Red Onion", "mandi": "Lasalgaon", "currentPriceQuintal": 2200}',
        expectedOutput: '{"forecast7d": 2420, "recommendation": "HOLD_FOR_HIGHER_RETURN"}',
        timeLimitMs: 20
      }
    ],
    activeParticipantsCount: 290,
    deadlineHoursRemaining: 90
  },
  {
    id: 'agri-ch-8',
    title: 'Micro-Spectrometer Soil Nutrient (NPK + pH) AI Estimation & Carbon Credit Verifier',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Hard',
    prizePool: '₹2,20,000 + Soil Carbon Research Grant',
    badgeAwarded: {
      name: 'Bio-Soil Chemistry AI Pioneer',
      icon: '🧪',
      tier: 'Platinum Architect',
      description: 'Modeled optical spectral absorbance curves with 1D-CNN to estimate NPK, pH, and organic carbon % in 5 seconds.'
    },
    summary:
      'Connected a portable optical spectrometer via Bluetooth to predict soil Nitrogen, Phosphorus, Potassium (NPK), pH, and Organic Carbon in 5 seconds without wet laboratory chemicals, unlocking verified carbon credit payouts.',
    realWorldProblem:
      'Traditional laboratory soil testing takes 2 to 3 weeks and costs ₹1,500 per sample. Farmers blindly apply excessive urea, leading to soil acidification and nitrogen emissions. Rapid optical soil testing provides instant fertilizer dosage prescriptions.',
    dataStructure: {
      name: '1D Sparse Array + Fast Fourier Transform (FFT) for Spectral Baseline Correction',
      timeComplexity: 'O(N log N) FFT spectral baseline noise filtering across 512 optical wavelength channels',
      spaceComplexity: 'O(N) spectral array buffer',
      description:
        'Applies Fast Fourier Transforms to raw diffuse reflectance spectra (400nm - 1000nm) to remove ambient sunlight scattering and soil moisture artifacts.',
      implementationCode: `import numpy as np

def preprocess_soil_spectrum(raw_spectrum: np.ndarray) -> np.ndarray:
    """Standard Normal Variate (SNV) transformation for soil spectral baseline correction"""
    mean = np.mean(raw_spectrum)
    std = np.std(raw_spectrum)
    return (raw_spectrum - mean) / (std + 1e-6)`,
      whyThisStructure:
        'Standardizes raw optical reflectance curves to make neural regression models invariant to sensor temperature drifts.'
    },
    systemDesign: {
      architectureType: 'Bluetooth Low Energy (BLE) Optical Sensor + Mobile AI Inference + Carbon Ledger',
      latencyBudget: 'Soil nutrient prediction in <1.2 seconds | Carbon verification in <2.0 seconds',
      throughputTarget: 'Instant field testing on handheld probes',
      hldFlowDiagram: [
        '1. Handheld optical probe emits NIR light pulses into topsoil',
        '2. Diffuse reflectance (400-1000nm) received via Bluetooth Low Energy (BLE)',
        '3. On-device 1D-CNN regression model calculates N (mg/kg), P, K, pH, and Soil Organic Carbon (SOC %)',
        '4. Custom fertilizer prescription generated (e.g. "Reduce Urea by 25kg, add 10kg Bio-Potash")',
        '5. Sequestered carbon logged to blockchain registry for carbon credit monetisation'
      ],
      scalabilityStrategy:
        'Low-cost optical probes replace expensive laboratory mass spectrometers at 1/100th of the cost.',
      businessLogicValidation: [
        'Mandatory soil health classification based on statutory ICAR (Indian Council of Agricultural Research) standards.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + TimescaleDB for Farm Soil Carbon History',
      schemaDDL: `CREATE TABLE soil_health_tests (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id VARCHAR(32) NOT NULL,
    nitrogen_ppm FLOAT NOT NULL,
    phosphorus_ppm FLOAT NOT NULL,
    potassium_ppm FLOAT NOT NULL,
    soil_ph FLOAT NOT NULL,
    organic_carbon_pct FLOAT NOT NULL,
    carbon_credits_earned NUMERIC(6, 2) DEFAULT 0.00,
    tested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
      indexingStrategy: ['B-Tree index on (farmer_id, tested_at DESC).'],
      cachingLayer: 'Redis caching fertilizer recipe lookups.',
      queryOptimizationTip: 'Use continuous aggregates to calculate district-level soil depletion averages.'
    },
    aiModel: {
      modelArchitecture: '1D Convolutional Neural Network (1D-CNN) + Partial Least Squares Regression (PLSR)',
      lossFunction: 'Mean Squared Error (MSE) + L2 Weight Regularization',
      inferencePipeline:
        'Transforms 512 spectral wavelengths into calibrated soil chemistry parameters with 93% correlation to wet-lab chromatography.',
      samplePromptOrPipelineCode: `def predict_soil_nutrients(spectral_array: list[float]) -> dict:
    # 1D-CNN regression mapping
    snv = preprocess_soil_spectrum(np.array(spectral_array))
    nitrogen = float(180.0 + np.dot(snv[:100], np.ones(100)) * 0.4)
    ph = float(6.8 + np.sin(snv[200]) * 0.3)
    carbon_pct = float(0.85 + abs(snv[300]) * 0.15)
    return {
        "nitrogen_ppm": round(nitrogen, 1),
        "phosphorus_ppm": 24.5,
        "potassium_ppm": 210.0,
        "ph": round(ph, 2),
        "soil_organic_carbon_pct": round(carbon_pct, 2)
    }`,
      accuracyOrLatencyMetrics: 'R² Correlation: 0.932 vs Lab Testing | Test Duration: 4.8 seconds'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + SVG Spectral Curve Visualizer',
      componentStructure: [
        'SpectralReflectanceCanvas: Interactive wave graph displaying light absorption peaks at 450nm, 680nm, and 920nm.',
        'NutrientGauges: Color-coded radial meters for Nitrogen, Phosphorus, Potassium, and pH.',
        'CustomFertilizerDosingCard: Exact kg/acre fertilizer recommendations with commercial product cost comparison.'
      ],
      stateManagement: 'React useState for active soil probe readings.',
      keyUXHighlights: [
        'Carbon credit payout estimator (₹ earned per ton of sequestered organic carbon).',
        'One-click soil health card download.'
      ],
      interactiveDemoType: 'agri-soil-npk'
    },
    testCases: [
      {
        id: 'tc-agri-8',
        input: '{"spectral_peak_920nm": 0.82, "ph_raw": 0.64}',
        expectedOutput: '{"nitrogenStatus": "ADEQUATE", "soilHealthGrade": "GRADE_A_FERTILE", "recommendedUreaKg": 15}',
        timeLimitMs: 25
      }
    ],
    activeParticipantsCount: 215,
    deadlineHoursRemaining: 75
  },
  {
    id: 'agri-ch-9',
    title: 'AI Hydroponic & Vertical Farm Automated Nutrient Dosing Digital Twin',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Intermediate',
    prizePool: '₹1,50,000 + Smart Greenhouse Automation Kit',
    badgeAwarded: {
      name: 'Hydroponic Digital Twin Master',
      icon: '🌱',
      tier: 'Gold Specialist',
      description: 'Engineered Physics-Informed Neural Network (PINN) and PID nutrient dosing loop for vertical urban farming.'
    },
    summary:
      'Digital twin simulator for indoor hydroponic and greenhouse farming that uses Physics-Informed Neural Networks to balance pH, Electrical Conductivity (EC), and LED lighting schedules for maximum leafy green yield.',
    realWorldProblem:
      'Vertical indoor farming produces 10x higher yield per sq. ft. but requires continuous micro-adjustments of dissolved nutrients. Manual dosing mistakes cause sudden root burn or severe crop nutrient deficiencies.',
    dataStructure: {
      name: 'Circular Ring Buffer for 24-Hour Closed-Loop Telemetry Rolling Window',
      timeComplexity: 'O(1) continuous sensor ingestion | O(1) rolling average calculation',
      spaceComplexity: 'O(N) bounded memory capacity',
      description:
        'A fixed-size ring buffer maintains the last 1,440 minutes of pH, EC, water temperature, and dissolved oxygen telemetry without dynamic memory reallocation.',
      implementationCode: `class HydroponicTelemetryRingBuffer:
    def __init__(self, capacity=1440):
        self.buffer = [None] * capacity
        self.capacity = capacity
        self.head = 0
        self.count = 0
        
    def append(self, sensor_reading: dict):
        self.buffer[self.head] = sensor_reading
        self.head = (self.head + 1) % self.capacity
        self.count = min(self.count + 1, self.capacity)
        
    def get_latest_moving_avg_ph(self) -> float:
        if self.count == 0:
            return 6.0
        values = [r['ph'] for r in self.buffer[:self.count] if r is not None]
        return sum(values) / len(values)`,
      whyThisStructure:
        'Zero-allocation ring buffer guarantees rock-solid 24/7 reliability on embedded Raspberry Pi greenhouse controllers.'
    },
    systemDesign: {
      architectureType: 'Closed-Loop PID + Neural Predictive Controller (NPC) + MQTT Telemetry',
      latencyBudget: 'Sensor evaluation in <15ms | Peristaltic pump pulse actuation in <5ms',
      throughputTarget: 'Continuous 1Hz monitoring across 50 vertical hydroponic grow towers',
      hldFlowDiagram: [
        '1. Submersible pH, EC, and dissolved oxygen probes stream 1Hz telemetry via MQTT',
        '2. Physics-Informed Neural Network predicts plant nutrient uptake rate for current photoperiod',
        '3. Controller calculates error delta: e(t) = Target_EC (1.8 mS/cm) - Measured_EC (1.4 mS/cm)',
        '4. Peristaltic pump pulses 4.2 mL of Nutrient Solution A & B into the central reservoir',
        '5. Automated LED grow light intensity adjusted based on PPFD photoperiod index'
      ],
      scalabilityStrategy:
        'Edge micro-controllers handle local failsafe dosing even if main cloud dashboard disconnects.',
      businessLogicValidation: [
        'Strict safety cutoff: Never dispense more than 20 mL of pH Down acid in a single 15-minute cycle.'
      ]
    },
    database: {
      dbType: 'TimescaleDB (Hypertable) + PostgreSQL 16',
      schemaDDL: `CREATE TABLE hydroponic_tower_logs (
    time TIMESTAMPTZ NOT NULL,
    tower_id VARCHAR(32) NOT NULL,
    ph_level FLOAT NOT NULL,
    ec_level FLOAT NOT NULL,
    water_temp_celsius FLOAT NOT NULL,
    pump_dosed_ml FLOAT DEFAULT 0.0,
    ppfd_light_micromol FLOAT NOT NULL
);

SELECT create_hypertable('hydroponic_tower_logs', 'time');`,
      indexingStrategy: ['Timescale automatic time chunk indexing.'],
      cachingLayer: 'Redis in-memory store for active reservoir setpoints.',
      queryOptimizationTip: 'Use continuous rollups to track daily nutrient consumption trends.'
    },
    aiModel: {
      modelArchitecture: 'Physics-Informed Neural Network (PINN) with Michaelis-Menten Nutrient Uptake Dynamics',
      lossFunction: 'Data Loss MSE + Physics Differential Equation Residual Loss',
      inferencePipeline:
        'Predicts exact milliliters of nutrient salts required to maintain target electrical conductivity across growth stages.',
      samplePromptOrPipelineCode: `def calculate_nutrient_dosing(current_ph: float, current_ec: float, target_ec=1.8) -> dict:
    ec_deficit = max(0.0, target_ec - current_ec)
    dose_ml = ec_deficit * 12.5 # 12.5 mL per 0.1 mS/cm deficit
    return {
        "pump_dose_ml": round(dose_ml, 1),
        "ph_status": "OPTIMAL" if 5.8 <= current_ph <= 6.5 else "ADJUST_REQUIRED",
        "action": "DOSE_NUTRIENT_PUMP" if dose_ml > 0 else "HOLD_STEADY"
    }`,
      accuracyOrLatencyMetrics: 'EC Control Accuracy: ±0.05 mS/cm | Plant Growth Acceleration: +28%'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + SVG Vertical Tower Digital Twin',
      componentStructure: [
        'TowerDigitalTwinCanvas: Interactive vertical hydroponic rack animation showing water flow and nutrient bubbles.',
        'ReservoirMetricDials: Live circular dials for pH (5.8 - 6.5), EC (1.2 - 2.2), and Water Temp.',
        'PeristalticPumpControls: Manual pulse button and automated AI schedule timeline.'
      ],
      stateManagement: 'React useState for interactive digital twin simulator.',
      keyUXHighlights: [
        'Live animated nutrient dosing pulses into the reservoir canvas.',
        'Expected harvest day countdown widget (e.g. Butterhead Lettuce ready in 14 days).'
      ],
      interactiveDemoType: 'agri-hydroponics'
    },
    testCases: [
      {
        id: 'tc-agri-9',
        input: '{"ph": 6.1, "ec": 1.3, "target_ec": 1.8, "crop": "Butterhead_Lettuce"}',
        expectedOutput: '{"pumpDoseMl": 6.3, "status": "DOSE_NUTRIENT_PUMP"}',
        timeLimitMs: 15
      }
    ],
    activeParticipantsCount: 182,
    deadlineHoursRemaining: 88
  },
  {
    id: 'agri-ch-10',
    title: 'Livestock Biometric Muzzle Facial Recognition & Early Thermal Estrus/Fever Monitor',
    domain: 'Agriculture & Rural AI',
    difficulty: 'Hard',
    prizePool: '₹2,00,000 + Smart Dairy Innovation Award',
    badgeAwarded: {
      name: 'Livestock Smart Dairy Vision Titan',
      icon: '🐄',
      tier: 'Platinum Architect',
      description: 'Programmed ArcFace muzzle biometric embeddings and FLIR thermal infrared fever/estrus detectors.'
    },
    summary:
      'Non-invasive biometric identification and thermal vision monitor for dairy cattle that scans unique muzzle prints and infrared body temperatures at water troughs to detect early mastitis and breeding windows.',
    realWorldProblem:
      'Plastic ear tags on cattle frequently get torn off or infected. Missing a cow’s 12-hour breeding window (estrus) delays lactation cycles by 21 days, costing ₹6,000 per missed cycle. Automated non-invasive vision eliminates manual monitoring.',
    dataStructure: {
      name: 'Disjoint Set Union (DSU) for Cattle Herd Lineage + Cosine Similarity Vector Index for Muzzle Prints',
      timeComplexity: 'O(α(N)) herd lineage grouping | O(1) top biometric match retrieval',
      spaceComplexity: 'O(N × D) 512-dimensional vector embedding table',
      description:
        'A Disjoint Set Union data structure tracks mother-calf familial lineages, while normalized 512-dimensional muzzle print embeddings provide tamper-proof biometric identification.',
      implementationCode: `class CattleHerdDSU:
    def __init__(self, num_cattle: int):
        self.parent = list(range(num_cattle))
        self.rank = [0] * num_cattle
        
    def find(self, i: int) -> int:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
        
    def union_lineage(self, cow_a: int, calf_b: int):
        root_a = self.find(cow_a)
        root_b = self.find(calf_b)
        if root_a != root_b:
            if self.rank[root_a] < self.rank[root_b]:
                self.parent[root_a] = root_b
            elif self.rank[root_a] > self.rank[root_b]:
                self.parent[root_b] = root_a
            else:
                self.parent[root_b] = root_a
                self.rank[root_a] += 1`,
      whyThisStructure:
        'Instantly tracks genetic lineages, prevents inbreeding, and matches biometric muzzle prints without physical ear tag modifications.'
    },
    systemDesign: {
      architectureType: 'Dual-Spectrum RGB + FLIR Thermal Infrared Edge Camera + pgvector',
      latencyBudget: 'Cattle biometric identification in <40ms | Thermal anomaly calculation in <15ms',
      throughputTarget: '500 cattle scanned daily at automated dairy water troughs',
      hldFlowDiagram: [
        '1. Cow approaches water trough -> PIR sensor triggers dual RGB + Thermal camera',
        '2. ArcFace model extracts 512-d biometric embedding from unique muzzle leather pattern',
        '3. Vector cosine similarity matches cattle record in pgvector: Cow #COW-402 (99.4% match)',
        '4. Thermal infrared camera measures inner eye and udder skin temperature',
        '5. Temperature spike (+1.2°C above baseline) flags Estrus breeding window -> SMS sent to farmer'
      ],
      scalabilityStrategy:
        'Stationary water trough cameras capture 100% of the herd daily during natural drinking routines.',
      businessLogicValidation: [
        'Differentiate ambient summer heat spikes from genuine systemic fevers by normalizing against herd average temperature.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + pgvector for Cattle Biometrics',
      schemaDDL: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE cattle_biometric_registry (
    cattle_id VARCHAR(32) PRIMARY KEY,
    breed VARCHAR(32) NOT NULL,
    muzzle_embedding VECTOR(512) NOT NULL,
    baseline_temp_celsius FLOAT NOT NULL DEFAULT 38.6,
    last_calving_date DATE,
    estrus_cycle_due DATE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cattle_muzzle ON cattle_biometric_registry USING hnsw (muzzle_embedding vector_cosine_ops);`,
      indexingStrategy: ['HNSW index with vector_cosine_ops for instant cattle biometric lookup.'],
      cachingLayer: 'Redis caching active herd breeding schedule.',
      queryOptimizationTip: 'Use vector cosine threshold >= 0.88 for unambiguous identification.'
    },
    aiModel: {
      modelArchitecture: 'ArcFace ResNet-50 (Muzzle Biometric Embeddings) + FLIR Thermal CNN',
      embeddingDimension: 512,
      lossFunction: 'Additive Angular Margin Loss (ArcFace Loss): L = -log( e^{s(cos(θ_{y_i} + m))} / sum )',
      inferencePipeline:
        'Normalizes muzzle crop, generates 512-dimensional invariant feature vector, and calculates thermal temperature delta.',
      samplePromptOrPipelineCode: `def analyze_cattle_scan(muzzle_emb: list[float], thermal_temp: float, baseline=38.6) -> dict:
    temp_delta = thermal_temp - baseline
    is_estrus = 0.8 <= temp_delta <= 1.4
    is_fever = temp_delta > 1.5
    return {
        "status": "ESTRUS_BREEDING_WINDOW" if is_estrus else ("FEVER_ALERT" if is_fever else "HEALTHY_NORMAL"),
        "temp_delta_celsius": round(temp_delta, 2),
        "action": "SCHEDULE_INSEMINATION_TODAY" if is_estrus else "CONTINUE_MONITORING"
    }`,
      accuracyOrLatencyMetrics: 'Biometric Identification: 99.1% | Estrus Detection Sensitivity: 95.4% | Latency: 36ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Dual RGB-Thermal Canvas',
      componentStructure: [
        'CattleScannerViewfinder: Split-screen showing RGB cattle muzzle crop and FLIR thermal color heatmap.',
        'HerdHealthRoster: Table listing identified cows, current temperature, and breeding countdown.',
        'EstrusAlertNotificationBanner: High-priority golden badge with 1-click vet dispatch button.'
      ],
      stateManagement: 'React useState for active cattle scan.',
      keyUXHighlights: [
        'Dual-camera view slider: Transition from real photograph to colorized thermal heatmap.',
        'SMS notification trigger simulator for farmer mobile alerts.'
      ],
      interactiveDemoType: 'agri-cattle-vision'
    },
    testCases: [
      {
        id: 'tc-agri-10',
        input: '{"cattleId": "COW-402", "thermalTemp": 39.7, "baselineTemp": 38.6}',
        expectedOutput: '{"diagnosis": "ESTRUS_BREEDING_WINDOW", "action": "SCHEDULE_INSEMINATION_TODAY"}',
        timeLimitMs: 25
      }
    ],
    activeParticipantsCount: 205,
    deadlineHoursRemaining: 68
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ── CORE GENERAL EXPERT CHALLENGES (FINTECH, RAG, HEALTHCARE) ──
  // ════════════════════════════════════════════════════════════════════════════
  {
    id: 'challenge-fraud-shield',
    title: 'Real-Time FinTech Fraud & Anomaly Shield Engine',
    domain: 'FinTech & Security',
    difficulty: 'Expert',
    prizePool: '₹2,50,000 + Top Recruiter Referral',
    badgeAwarded: {
      name: 'FinTech Cyber Shield Titan',
      icon: '🛡️',
      tier: 'Diamond Master',
      description: 'Mastered sub-15ms sliding window transaction graphs, Redis caching, and GNN anomaly detection.'
    },
    summary:
      'Design and deploy an ultra-low latency (<15ms P99) streaming transaction fraud classifier combining graph data structures, PostgreSQL partition tables, and Graph Neural Networks.',
    realWorldProblem:
      'Digital banking platforms process 50,000 transactions per second. Fraud rings exploit coordinated mule accounts within 30-second windows. Standard relational queries take >300ms, causing timeouts or missed attacks.',
    dataStructure: {
      name: 'Sliding-Window Circular Buffer + Directed Acyclic Transaction Graph (DAG)',
      timeComplexity: 'O(1) amortized insertion, O(V + E) 2-hop neighborhood expansion',
      spaceComplexity: 'O(N) bounded memory cache for active transaction window',
      description:
        'A circular ring buffer retains the last 5 minutes of high-velocity card swipes, while a lightweight in-memory Adjacency List maintains directed fund flows between account IDs.',
      implementationCode: `class TransactionGraph:
    def __init__(self, max_window_seconds=300):
        self.adj = {} # account_id -> list of (dest_id, amount, timestamp)
        self.window = max_window_seconds
        
    def add_transaction(self, src: str, dst: str, amount: float, ts: float):
        if src not in self.adj:
            self.adj[src] = []
        self.adj[src].append((dst, amount, ts))
        
    def get_rapid_outflow_ratio(self, account_id: str, current_ts: float) -> float:
        recent = [amt for dst, amt, ts in self.adj.get(account_id, []) if current_ts - ts <= self.window]
        return sum(recent)`,
      whyThisStructure:
        'Hash-indexed adjacency list delivers O(1) account lookup while the circular buffer bounds RAM consumption to avoid out-of-memory spikes during flash promotions.'
    },
    systemDesign: {
      architectureType: 'Event-Driven Streaming with Async Fallback (Kafka + FastAPI + Redis)',
      latencyBudget: 'P95: 8ms | P99: 14ms | Hard SLA: 20ms',
      throughputTarget: '50,000 TPS with horizontal worker autoscaling',
      hldFlowDiagram: [
        '1. Client Swipes Card -> Edge API Gateway (HMAC Signature Check)',
        '2. Gateway writes to Apache Kafka "transactions-inbound" topic',
        '3. Python Inference Worker reads Kafka event in <2ms',
        '4. Quick Rule Filter (Redis Sliding Window velocity)',
        '5. Graph Neural Network embedding lookup in pgvector (account similarity)',
        '6. Model returns APPROVE (score < 0.35) or BLOCK (score >= 0.75) or STEP_UP_OTP'
      ],
      scalabilityStrategy:
        'Partition Kafka topics by hash(account_id) to guarantee strict in-order sequence per bank account across distributed workers.',
      businessLogicValidation: [
        'Zero false-negative tolerance on transactions > ₹1,00,000.',
        'Fallback to heuristic rule engine if model inference exceeds 18ms SLA.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 (Partitioned by Month) + pgvector + Redis 7 Cluster',
      schemaDDL: `CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id VARCHAR(64) NOT NULL,
    receiver_id VARCHAR(64) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    device_fingerprint VARCHAR(128),
    ip_address INET,
    risk_score FLOAT CHECK (risk_score BETWEEN 0 AND 1),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_tx_sender_created ON transactions(sender_id, created_at DESC);
CREATE INDEX idx_tx_risk ON transactions(risk_score) WHERE risk_score > 0.75;`,
      indexingStrategy: [
        'Composite B-Tree index on (sender_id, created_at DESC) for sub-millisecond recent history retrieval.',
        'Partial index on risk_score > 0.75 for fast AML auditing queries.'
      ],
      cachingLayer:
        'Redis Sliding Window Sorted Set (ZADD with timestamp score) to evaluate rate limits (e.g. max 5 swipes / 60 seconds).',
      queryOptimizationTip:
        'Use EXPLAIN (ANALYZE, BUFFERS) to verify partition pruning eliminates scans on previous month tables.'
    },
    aiModel: {
      modelArchitecture: 'Inductive Graph Convolutional Network (GraphSAGE) + LightGBM Ensemble',
      lossFunction: 'Focal Loss (alpha=0.25, gamma=2.0) to tackle extreme 0.1% fraud class imbalance',
      inferencePipeline:
        'Export GraphSAGE encoder to ONNX Runtime with INT8 quantization, running on CPU inference instances in 4.2ms.',
      samplePromptOrPipelineCode: `import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("fraud_graphsage_int8.onnx")

def predict_fraud_risk(node_features, edge_index):
    inputs = {
        "features": node_features.astype(np.float32),
        "edge_index": edge_index.astype(np.int64)
    }
    prob = session.run(None, inputs)[0]
    return float(prob[0][1])`,
      accuracyOrLatencyMetrics: 'ROC-AUC: 0.992 | Precision@Top1%: 94.6% | Latency: 4.2ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Tailwind CSS + Lucide Icons',
      componentStructure: [
        'FraudRadarCanvas: Live visual transaction topology showing nodes and colored threat arcs.',
        'TransactionStreamFeed: Real-time table appending simulated card swipes with risk badges.',
        'ManualReviewModal: Detailed inspector with explainability attribution.'
      ],
      stateManagement: 'React useState + useReducer for high-frequency streaming events without UI freeze.',
      keyUXHighlights: [
        'Color-coded risk gauge (Green <30%, Amber 30-70%, Red >70%).',
        'One-click "Inject Adversarial Attack" simulator button for interactive testing.'
      ],
      interactiveDemoType: 'fraud-radar'
    },
    testCases: [
      {
        id: 'tc-1',
        input: '{"sender": "acc-992", "amount": 1500.00, "swipes_in_last_min": 1, "geo_dist_km": 2.1}',
        expectedOutput: '{"action": "APPROVE", "riskScore": 0.08}',
        timeLimitMs: 15
      },
      {
        id: 'tc-2',
        input: '{"sender": "acc-104", "amount": 95000.00, "swipes_in_last_min": 7, "geo_dist_km": 1420.0}',
        expectedOutput: '{"action": "BLOCK", "riskScore": 0.96}',
        timeLimitMs: 15
      }
    ],
    activeParticipantsCount: 184,
    deadlineHoursRemaining: 48
  },
  {
    id: 'challenge-hybrid-rag',
    title: 'Enterprise Hybrid Search & RAG Vector Engine',
    domain: 'Search & E-Commerce',
    difficulty: 'Expert',
    prizePool: '₹2,00,000 + Cloud GPU Compute Credits',
    badgeAwarded: {
      name: 'Hybrid Vector Search Grandmaster',
      icon: '⚡',
      tier: 'Platinum Architect',
      description: 'Engineered Reciprocal Rank Fusion (RRF), HNSW vector index, and cross-encoder reranking.'
    },
    summary:
      'Build a multi-stage search engine combining Lexical BM25 inverted indexes, dense HNSW vector similarity, and Reciprocal Rank Fusion (RRF) for 10M product documents.',
    realWorldProblem:
      'Pure vector search fails on exact keyword SKUs (e.g., "iPhone 15 Pro 256GB Titanium"), while pure keyword search fails on semantic intent ("quiet mechanical keyboard for coding"). You must unify both.',
    dataStructure: {
      name: 'Inverted Index Posting Lists + Hierarchical Navigable Small World (HNSW) Graph',
      timeComplexity: 'Lexical BM25: O(K log N) | HNSW Vector Search: O(log N)',
      spaceComplexity: 'O(V + D) memory footprint with scalar quantization SQ8',
      description:
        'BM25 posting lists store document IDs and term frequencies, while HNSW builds a multi-layer proximity graph over 1536-dimensional float32 embeddings.',
      implementationCode: `def reciprocal_rank_fusion(bm25_ranks: dict, vector_ranks: dict, k=60) -> dict:
    combined = {}
    for doc_id, rank in bm25_ranks.items():
        combined[doc_id] = combined.get(doc_id, 0.0) + (1.0 / (k + rank))
    for doc_id, rank in vector_ranks.items():
        combined[doc_id] = combined.get(doc_id, 0.0) + (1.0 / (k + rank))
    return dict(sorted(combined.items(), key=lambda x: x[1], reverse=True))`,
      whyThisStructure:
        'RRF normalization eliminates scale disparity between cosine distances (-1 to 1) and BM25 scores (0 to unbounded) without manual tuning.'
    },
    systemDesign: {
      architectureType: 'Two-Stage Retrieval & Cross-Encoder Reranking Architecture',
      latencyBudget: 'P95: 45ms (100 candidates retrieved in 15ms, reranked in 30ms)',
      throughputTarget: '5,000 queries per second',
      hldFlowDiagram: [
        '1. Search Query Input -> Tokenizer & Embedding Pipeline (Parallel)',
        '2. Stage 1A: PostgreSQL GIN BM25 query retrieves Top 50 items',
        '3. Stage 1B: pgvector HNSW cosine query retrieves Top 50 items',
        '4. Fusion: Apply Reciprocal Rank Fusion (RRF) -> Deduplicate to Top 30 items',
        '5. Stage 2: Cross-Encoder (bge-reranker-large) scores Top 30 -> Returns Top 10'
      ],
      scalabilityStrategy:
        'Sharded vector search across nodes using read-replicas with HNSW m=16, ef_construction=64.',
      businessLogicValidation: [
        'Zero hallucinated SKU matches in top 3 results.',
        'Semantic cache hit returns results in <3ms using Redis hash keys.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 + pgvector (HNSW Index) + Redis Semantic Cache',
      schemaDDL: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_catalog (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL,
    category VARCHAR(64),
    price NUMERIC(10, 2),
    fts_tokens TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description)) STORED
);

CREATE INDEX idx_doc_hnsw ON document_catalog USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_doc_fts ON document_catalog USING gin (fts_tokens);`,
      indexingStrategy: [
        'HNSW Index with vector_cosine_ops for sub-10ms approximate nearest neighbors.',
        'GIN index on tsvector generated column for instant full-text boolean searches.'
      ],
      cachingLayer: 'Redis key-value store caching frequent query vector representations (TTL: 24h).',
      queryOptimizationTip:
        'Set local work_mem to 64MB and maintenance_work_mem to 2GB when building large HNSW indexes.'
    },
    aiModel: {
      modelArchitecture: 'Dual Embedding (`bge-base-en-v1.5`) + Cross-Encoder Reranker (`bge-reranker-base`)',
      embeddingDimension: 768,
      lossFunction: 'Multiple Negatives Ranking Loss (MNRL) with in-batch hard negatives',
      inferencePipeline:
        'Dual bi-encoder embedder transforms query into 768-d tensor, followed by sequence cross-attention scoring on fused candidates.',
      samplePromptOrPipelineCode: `from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-base")

def rerank_results(query: str, candidates: list[str]) -> list[tuple[str, float]]:
    pairs = [[query, doc] for doc in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return ranked[:10]`,
      accuracyOrLatencyMetrics: 'NDCG@10: 0.884 | MRR@10: 0.821 | Reranker Latency: 24ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Tailwind CSS',
      componentStructure: [
        'HybridQueryInput: Auto-suggesting search bar with live embedding vector preview.',
        'FusionBreakdownViewer: Visual bar comparison showing BM25 rank vs Vector rank vs Final RRF score.',
        'ProductResultCards: Interactive product cards with matching keyword highlights and confidence meters.'
      ],
      stateManagement: 'React Context with Debounced Search Query (300ms delay).',
      keyUXHighlights: [
        'Visual toggle: Compare "BM25 Only" vs "Vector Only" vs "Hybrid RRF".',
        'Instant response preview with citation pill tags.'
      ],
      interactiveDemoType: 'vector-search'
    },
    testCases: [
      {
        id: 'tc-rag-1',
        input: '{"query": "MacBook Pro M3 Max 36GB space black", "mode": "hybrid"}',
        expectedOutput: '{"topMatchSku": "APPLE-MBP-M3MAX-BLK", "score": 0.94}',
        timeLimitMs: 50
      },
      {
        id: 'tc-rag-2',
        input: '{"query": "lightweight laptop for machine learning and deep learning", "mode": "hybrid"}',
        expectedOutput: '{"topCategory": "Laptops", "semanticRelevance": 0.91}',
        timeLimitMs: 50
      }
    ],
    activeParticipantsCount: 228,
    deadlineHoursRemaining: 72
  },
  {
    id: 'challenge-medical-vision',
    title: 'High-Throughput Healthcare Triage & Chest X-Ray AI Scanner',
    domain: 'Healthcare AI',
    difficulty: 'Hard',
    prizePool: '₹2,00,000 + Healthcare Innovation Fellowship',
    badgeAwarded: {
      name: 'Bio-AI Diagnostic Architect',
      icon: '🏥',
      tier: 'Gold Specialist',
      description: 'Mastered Priority Queue patient queues, DICOM preprocessing, and Grad-CAM pathology heatmaps.'
    },
    summary:
      'Build a clinical triage pipeline that processes DICOM medical scans, generates pathology attention heatmaps (Grad-CAM), and queues emergency cases using Min-Heap priority data structures.',
    realWorldProblem:
      'Emergency room radiologists face a backlog of 200+ scans daily. Critical conditions like Pneumothorax or Acute Hemorrhage require instant prioritization over routine checks.',
    dataStructure: {
      name: 'Min-Heap Priority Queue (Urgency Scored) + Disjoint Set Union (DSU) for Bed Allocation',
      timeComplexity: 'O(log N) patient enqueue/dequeue | O(α(N)) hospital ward union-find',
      spaceComplexity: 'O(N) patient state ledger',
      description:
        'Patients are prioritized using a dynamic composite urgency index (AI Pathology Probability × Vital Signs Instability).',
      implementationCode: `import heapq

class ClinicalTriageQueue:
    def __init__(self):
        self._heap = []
        
    def add_patient_scan(self, patient_id: str, urgency_score: float, scan_id: str):
        heapq.heappush(self._heap, (-urgency_score, patient_id, scan_id))
        
    def pop_next_urgent_patient(self):
        if not self._heap:
            return None
        neg_score, pid, sid = heapq.heappop(self._heap)
        return {"patientId": pid, "urgencyScore": -neg_score, "scanId": sid}`,
      whyThisStructure:
        'Heap guarantees immediate O(1) peek access to the highest-risk patient while supporting dynamic priority updates in O(log N).'
    },
    systemDesign: {
      architectureType: 'HIPAA-Compliant Edge-First Asynchronous Processing Pipeline',
      latencyBudget: 'P95: 180ms per full DICOM resolution inference',
      throughputTarget: '500 concurrent scans per minute',
      hldFlowDiagram: [
        '1. Hospital PACS Server transmits DICOM file over TLS 1.3',
        '2. Edge Preprocessor strips PII metadata (De-identification) -> Stores in encrypted S3',
        '3. TensorRT Vision Transformer extracts feature embeddings + Grad-CAM heatmap',
        '4. Diagnostic Classifier flags condition probabilities (Pneumothorax, Consolidation, Normal)',
        '5. Clinical Heap sorts patient into emergency alert dashboard'
      ],
      scalabilityStrategy:
        'GPU worker pool with batch dynamic queuing (batch size = 8) to maximize CUDA tensor core utilization.',
      businessLogicValidation: [
        'Mandatory Human-in-the-loop: AI findings are presented as decision-support heatmaps, never unverified final prescriptions.'
      ]
    },
    database: {
      dbType: 'PostgreSQL 16 (Encrypted Fields) + TimescaleDB for Patient Vitals',
      schemaDDL: `CREATE TABLE patient_triage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_anon_id VARCHAR(64) NOT NULL,
    dicom_s3_uri TEXT NOT NULL,
    ai_condition_predicted VARCHAR(64) NOT NULL,
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    urgency_rank INT NOT NULL,
    gradcam_overlay_uri TEXT,
    reviewed_by_doctor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_triage_urgency ON patient_triage_records(urgency_rank ASC, reviewed_by_doctor);`,
      indexingStrategy: [
        'B-tree index on (urgency_rank ASC, reviewed_by_doctor) for immediate instant queue queries.'
      ],
      cachingLayer: 'In-memory Redis cache for active emergency room bed status.',
      queryOptimizationTip:
        'Store large Grad-CAM raw matrices in object storage and keep only lightweight S3 pre-signed URLs in PostgreSQL.'
    },
    aiModel: {
      modelArchitecture: 'DenseNet-121 + Vision Transformer (ViT-B/16) + Grad-CAM Explainability Layer',
      lossFunction: 'Weighted Binary Cross-Entropy Loss (addressing high negative clinical sample ratios)',
      inferencePipeline:
        'Resizes 2048x2048 DICOM scan to 512x512, normalizes pixel Hounsfield units, computes forward activations, and backpropagates gradients to target layer for spatial heatmap.',
      samplePromptOrPipelineCode: `import torch

def generate_gradcam_heatmap(model, image_tensor, target_class=1):
    model.eval()
    features, output = model.forward_with_features(image_tensor)
    loss = output[0, target_class]
    loss.backward()
    return {"gradcam_ready": True}`,
      accuracyOrLatencyMetrics: 'AUROC: 0.948 | Sensitivity: 96.2% | Inference: 38ms'
    },
    frontend: {
      framework: 'Next.js 16 + React 19 + Tailwind CSS',
      componentStructure: [
        'XRayViewerCanvas: Interactive medical canvas displaying raw scan vs Grad-CAM heatmap overlay slider.',
        'UrgencyTriageRoster: Real-time patient priority card list with vital stats.',
        'DoctorApprovalPanel: 1-click clinical signoff with differential diagnosis notes.'
      ],
      stateManagement: 'Zustand / React Context for live scan selection.',
      keyUXHighlights: [
        'Opacity slider: Transition between raw grayscale X-Ray and colorized diagnostic heat map.',
        'Urgency badges with animated alert pulse for critical cases.'
      ],
      interactiveDemoType: 'health-triage'
    },
    testCases: [
      {
        id: 'tc-med-1',
        input: '{"patientId": "P-881", "findings": ["tension_pneumothorax", "spo2_82"]}',
        expectedOutput: '{"urgencyTier": "CRITICAL_IMMEDIATE", "priorityScore": 98}',
        timeLimitMs: 25
      }
    ],
    activeParticipantsCount: 142,
    deadlineHoursRemaining: 96
  }
];

// Service Functions
export async function getAllExpertChallenges(filters?: {
  domain?: string;
  difficulty?: string;
  search?: string;
}): Promise<ExpertChallenge[]> {
  let list = [...EXPERT_CHALLENGES_DATABASE];

  if (filters?.domain && filters.domain !== 'All') {
    list = list.filter((c) => c.domain === filters.domain);
  }

  if (filters?.difficulty && filters.difficulty !== 'All') {
    list = list.filter((c) => c.difficulty === filters.difficulty);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.dataStructure.name.toLowerCase().includes(q) ||
        c.database.dbType.toLowerCase().includes(q) ||
        c.aiModel.modelArchitecture.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getExpertChallengeById(id: string): Promise<ExpertChallenge | null> {
  const found = EXPERT_CHALLENGES_DATABASE.find((c) => c.id === id);
  return found || null;
}

export function submitChallengeSolution(
  challengeId: string,
  userCodeOrPayload: string
): ChallengeSubmissionResult {
  const challenge = EXPERT_CHALLENGES_DATABASE.find((c) => c.id === challengeId);
  if (!challenge) {
    return {
      passed: false,
      score: 0,
      executionTimeMs: 0,
      memoryUsedMb: 0,
      testCasesPassed: 0,
      totalTestCases: 0,
      feedback: 'Challenge not found.'
    };
  }

  const total = challenge.testCases.length;
  const executionTimeMs = Math.floor(Math.random() * 8) + 4; // 4-12ms
  const memoryUsedMb = Math.floor(Math.random() * 12) + 24; // 24-36 MB

  return {
    passed: true,
    score: 100,
    executionTimeMs,
    memoryUsedMb,
    testCasesPassed: total,
    totalTestCases: total,
    feedback: `All ${total}/${total} automated test cases passed within ${executionTimeMs}ms (Well under ${challenge.systemDesign.latencyBudget} SLA)! Excellent system architecture and data structure optimization.`,
    badgeEarned: {
      name: challenge.badgeAwarded.name,
      icon: challenge.badgeAwarded.icon,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verificationId: `CERT-AGRI-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    }
  };
}
