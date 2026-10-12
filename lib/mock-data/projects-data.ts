export type ProjectLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectStatus = 'Published' | 'Draft' | 'In Review' | 'Archived';

export interface CodeFile {
  path: string;
  language: string;
  content: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  category: string;
  level: ProjectLevel;
  price: string;
  isFree: boolean;
  whatYouReceive?: string;
  technologies: string[];
  prerequisites: string[];
  softwareRequired: string[];
  setupInstructions: string[];
  implementationSteps: string[];
  expectedOutput: string;
  author: {
    name: string;
    avatar: string;
  };
  status: ProjectStatus;
  views: string;
  downloads: number;
  rating: number;
  updatedAt: string;
  thumbnailIcon: string;
  codeFiles: CodeFile[];
}

export const mockProjectsMetrics = [
  { id: 'total', title: 'Total Projects', value: '389', change: '14.3%', trend: 'up', period: 'vs last month', variant: 'purple' },
  { id: 'published', title: 'Published', value: '213', change: '54.8%', trend: 'flat', period: 'of total', variant: 'blue' },
  { id: 'drafts', title: 'Drafts', value: '96', change: '24.7%', trend: 'flat', period: 'of total', variant: 'orange' },
  { id: 'in-review', title: 'In Review', value: '42', change: '10.8%', trend: 'flat', period: 'of total', variant: 'green' },
  { id: 'archived', title: 'Archived', value: '38', change: '9.7%', trend: 'flat', period: 'of total', variant: 'red' },
  { id: 'views', title: 'Total Views (This Month)', value: '56.2K', change: '19.6%', trend: 'up', period: 'vs last month', variant: 'cyan' },
];

export const mockProjectsList: ProjectItem[] = [
  {
    id: 'prj-1',
    name: 'E-Commerce Dashboard',
    description: 'Responsive merchant administration dashboard with real-time sales telemetry, inventory tracking, order management, and interactive revenue charts.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 'Free',
    isFree: true,
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    prerequisites: ['HTML5 & CSS3 basics', 'JavaScript ES6 fundamentals', 'Basic React component state knowledge'],
    softwareRequired: ['Node.js v18+', 'npm or pnpm package manager', 'Modern Web Browser (Chrome/Firefox/Edge)', 'VS Code or preferred IDE'],
    setupInstructions: [
      'Clone or download the project repository into your local directory.',
      'Run "npm install" to install React, Tailwind, and charting dependencies.',
      'Create an ".env.local" file and configure your API endpoint.',
      'Start the local development server by executing "npm run dev".',
      'Open http://localhost:3000 to preview the live dashboard.'
    ],
    implementationSteps: [
      'Configure Tailwind CSS theme tokens for dark/light dashboard palettes.',
      'Create responsive layout grid featuring sidebar navigation, top metrics bar, and content stage.',
      'Build reusable KPI metric cards for Gross Revenue, Orders, Average Order Value (AOV), and Returns.',
      'Integrate Recharts time-series line chart for weekly sales vs target trajectory.',
      'Implement searchable and paginated recent orders data table with status filtering.'
    ],
    expectedOutput: 'A fully interactive, dark-mode ready web dashboard that displays live revenue metrics, renders responsive SVG charts, and lets users filter order history.',
    author: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '4.2K',
    downloads: 384,
    rating: 4.9,
    updatedAt: 'May 18, 2025',
    thumbnailIcon: 'Layout',
    codeFiles: [
      {
        path: 'src/components/Dashboard.tsx',
        language: 'typescript',
        content: `import React from 'react';\n\nexport function Dashboard() {\n  return (\n    <div className="p-6 bg-slate-900 text-white min-h-screen">\n      <h1 className="text-2xl font-bold">E-Commerce Telemetry</h1>\n      <div className="grid grid-cols-4 gap-4 mt-4">\n        <div className="p-4 bg-slate-800 rounded-xl">Revenue: $128,450</div>\n        <div className="p-4 bg-slate-800 rounded-xl">Orders: 1,842</div>\n        <div className="p-4 bg-slate-800 rounded-xl">AOV: $69.73</div>\n        <div className="p-4 bg-slate-800 rounded-xl">Conversion: 3.4%</div>\n      </div>\n    </div>\n  );\n}`
      }
    ]
  },
  {
    id: 'prj-2',
    name: 'AI Chatbot with RAG',
    description: 'Enterprise Retrieval-Augmented Generation (RAG) assistant combining LangChain, vector similarity embeddings, and small open LLMs to answer questions over custom documents.',
    category: 'Generative AI',
    level: 'Advanced',
    price: 'Free',
    isFree: true,
    technologies: ['Python 3.10', 'LangChain', 'ChromaDB', 'SentenceTransformers', 'FastAPI'],
    prerequisites: ['Python intermediate programming', 'Understanding of vector embeddings & cosine similarity', 'Basic REST API concepts'],
    softwareRequired: ['Python 3.10 or higher', 'pip package manager', 'Local Ollama daemon or HuggingFace account', 'ChromaDB local vector store'],
    setupInstructions: [
      'Create a Python virtual environment: "python -m venv venv".',
      'Activate environment: "source venv/bin/activate" (or ".\\venv\\Scripts\\activate" on Windows).',
      'Run "pip install langchain chromadb sentence-transformers fastapi uvicorn".',
      'Place your source text or PDF manuals in the "/documents" folder.',
      'Launch the API server with "uvicorn app:api --reload --port 8000".'
    ],
    implementationSteps: [
      'Load documents using LangChain RecursiveCharacterTextSplitter with chunk_size=500 and overlap=50.',
      'Generate dense embeddings using SentenceTransformers "all-MiniLM-L6-v2".',
      'Ingest chunk vectors and metadata into ChromaDB vector database.',
      'Build retrieval chain that queries nearest neighbor chunks for each user question prompt.',
      'Inject retrieved context into prompt template and stream generated answer.'
    ],
    expectedOutput: 'A terminal or REST API endpoint that accepts user questions, retrieves the top-3 most relevant document sections, and provides cited, hallucination-free answers.',
    author: { name: 'Dr. Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '3.8K',
    downloads: 512,
    rating: 5.0,
    updatedAt: 'May 17, 2025',
    thumbnailIcon: 'Bot',
    codeFiles: [
      {
        path: 'rag_pipeline.py',
        language: 'python',
        content: `from langchain.text_splitter import RecursiveCharacterTextSplitter\nfrom langchain.vectorstores import Chroma\nfrom langchain.embeddings import SentenceTransformerEmbeddings\n\ndef build_rag(doc_text: str):\n    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)\n    chunks = splitter.split_text(doc_text)\n    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")\n    db = Chroma.from_texts(chunks, embeddings)\n    return db\n\nprint("RAG Vector Index initialized successfully.")`
      }
    ]
  },
  {
    id: 'prj-3',
    name: 'Real-time Chat Application',
    description: 'Full-duplex WebSocket chat platform with persistent rooms, online user presence detection, message receipt acknowledgments, and JWT authentication.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 'Free',
    isFree: true,
    technologies: ['Node.js', 'Express', 'Socket.io', 'React', 'TypeScript'],
    prerequisites: ['JavaScript event loop fundamentals', 'Basic HTTP vs WebSocket protocol differences', 'React hooks (useState, useEffect)'],
    softwareRequired: ['Node.js 18+', 'npm / yarn', 'Modern web browser', 'Postman or WebSocket client for testing'],
    setupInstructions: [
      'Clone repository and navigate into "/server" directory.',
      'Run "npm install" and launch server via "node server.js".',
      'Navigate to "/client" directory, run "npm install", and run "npm start".',
      'Open two browser tabs at http://localhost:3000 to test two-way chat messaging.'
    ],
    implementationSteps: [
      'Initialize Express server with Socket.io server instance attaching HTTP listener.',
      'Define WebSocket events: "join_room", "send_message", "typing_indicator", and "disconnect".',
      'Implement room isolation so messages are only broadcast to clients in the same channel.',
      'Connect React frontend with "socket.io-client" socket hook managing reconnect state.',
      'Store recent room messages in an in-memory queue to backfill new clients joining.'
    ],
    expectedOutput: 'Two distinct browser windows chatting back and forth with instantaneous delivery under 10ms, typing indicators, and room switching.',
    author: { name: 'Michael Smith', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '2.9K',
    downloads: 290,
    rating: 4.8,
    updatedAt: 'May 16, 2025',
    thumbnailIcon: 'MessageSquare',
    codeFiles: [
      {
        path: 'server.js',
        language: 'javascript',
        content: `const express = require('express');\nconst http = require('http');\nconst { Server } = require('socket.io');\n\nconst app = express();\nconst server = http.createServer(app);\nconst io = new Server(server, { cors: { origin: '*' } });\n\nio.on('connection', (socket) => {\n  socket.on('join', (room) => socket.join(room));\n  socket.on('msg', ({ room, text }) => io.to(room).emit('msg', text));\n});\nserver.listen(4000, () => console.log('Socket server on 4000'));`
      }
    ]
  },
  {
    id: 'prj-4',
    name: 'Stock Price Predictor',
    description: 'Deep learning time-series forecasting model using PyTorch LSTM networks to analyze multi-feature historical equity prices and predict rolling price movements.',
    category: 'AI/ML',
    level: 'Advanced',
    price: 'Free',
    isFree: true,
    technologies: ['Python 3.10', 'PyTorch', 'NumPy', 'Pandas', 'Matplotlib', 'yfinance'],
    prerequisites: ['Recurrent neural network theory (RNN / LSTM)', 'Time-series feature scaling (MinMaxScaler)', 'PyTorch dataset loaders'],
    softwareRequired: ['Python 3.10+', 'PyTorch 2.0+', 'Jupyter Notebook or VS Code Python Extension'],
    setupInstructions: [
      'Run "pip install torch numpy pandas matplotlib yfinance scikit-learn".',
      'Open the project notebook "stock_predictor.ipynb" or execute "python train.py".',
      'Select stock ticker symbol (e.g. AAPL, NVDA, INFY) and historical date window.',
      'Run model training for 20 epochs.',
      'Inspect generated prediction vs actual price plot in "/output/forecast.png".'
    ],
    implementationSteps: [
      'Download 5 years of daily OHLCV price bars using yfinance.',
      'Compute technical indicators: 14-day RSI, 50-day Moving Average, and Bollinger Bands.',
      'Construct sliding window sequences (60 lookback days -> predict day 61).',
      'Define PyTorch LSTM model with 2 hidden recurrent layers (hidden_dim=64) and linear readout.',
      'Train using Adam optimizer and MSE loss with early stopping.'
    ],
    expectedOutput: 'Trained model checkpoints and test-set visualization plotting historical test prices vs model predictions with Mean Absolute Percentage Error (MAPE) under 4%.',
    author: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '2.6K',
    downloads: 420,
    rating: 4.9,
    updatedAt: 'May 15, 2025',
    thumbnailIcon: 'TrendingUp',
    codeFiles: [
      {
        path: 'model.py',
        language: 'python',
        content: `import torch\nimport torch.nn as nn\n\nclass LSTMForecaster(nn.Module):\n    def __init__(self, in_features=5, hidden=64, layers=2):\n        super().__init__()\n        self.lstm = nn.LSTM(in_features, hidden, layers, batch_first=True)\n        self.fc = nn.Linear(hidden, 1)\n    def forward(self, x):\n        out, _ = self.lstm(x)\n        return self.fc(out[:, -1, :])\n\nmodel = LSTMForecaster()\nprint("LSTM Model instantiated with parameters:", sum(p.numel() for p in model.parameters()))`
      }
    ]
  },
  {
    id: 'prj-5',
    name: 'Fitness Tracker App',
    description: 'Cross-platform mobile application built with Flutter & Dart for logging workouts, tracking daily caloric expenditure, and visualizing cardio habits.',
    category: 'Mobile Apps',
    level: 'Intermediate',
    price: 'Free',
    isFree: true,
    technologies: ['Flutter', 'Dart', 'Provider', 'SQLite', 'FL Chart'],
    prerequisites: ['Dart language fundamentals', 'Flutter widget tree concepts (Stateful vs Stateless)', 'Basic mobile emulator setup'],
    softwareRequired: ['Flutter SDK 3.19+', 'Android Studio or Xcode for iOS simulation', 'VS Code with Flutter extension'],
    setupInstructions: [
      'Verify Flutter installation with "flutter doctor".',
      'Run "flutter pub get" to install mobile charting and database packages.',
      'Connect a physical device via USB debugging or start an Android / iOS simulator.',
      'Execute "flutter run" to launch the debug app.'
    ],
    implementationSteps: [
      'Define local SQLite database schema for storing workout sets, reps, weight, and cardio minutes.',
      'Create custom Material 3 UI screens: Dashboard, Workout Logger, History, and Profile.',
      'Connect State Management using Provider for reactive calorie counts.',
      'Build interactive bar charts with FL Chart showing weekly workout frequency.',
      'Implement daily step goal progress ring animation.'
    ],
    expectedOutput: 'Smooth 60fps mobile application running on iOS/Android simulating workout logs, storing records locally in SQLite, and animating daily goal rings.',
    author: { name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '1.8K',
    downloads: 215,
    rating: 4.7,
    updatedAt: 'May 14, 2025',
    thumbnailIcon: 'Smartphone',
    codeFiles: [
      {
        path: 'lib/main.dart',
        language: 'dart',
        content: `import 'package:flutter/material.dart';\n\nvoid main() => runApp(const FitnessApp());\n\nclass FitnessApp extends StatelessWidget {\n  const FitnessApp({super.key});\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      theme: ThemeData.dark(),\n      home: const Scaffold(\n        body: Center(child: Text("Daily Steps: 8,420 / 10,000")), \n      ),\n    );\n  }\n}`
      }
    ]
  },
  {
    id: 'prj-6',
    name: 'Interactive Data Visualizer',
    description: 'High-performance web data visualization suite with D3.js and WebGL rendering scatterplots, heatmaps, and geospatial charts from uploaded CSV and Excel datasets.',
    category: 'Data Visualization',
    level: 'Beginner',
    price: 'Free',
    isFree: true,
    technologies: ['React', 'D3.js', 'PapaParse', 'Tailwind CSS'],
    prerequisites: ['Basic HTML/CSS/JS', 'Understanding tabular data (CSV headers and row arrays)'],
    softwareRequired: ['Node.js 18+', 'Modern web browser with SVG & Canvas support'],
    setupInstructions: [
      'Run "npm install" to install D3 and CSV parsers.',
      'Execute "npm run dev" to start visualizer.',
      'Open http://localhost:3000 and drag-and-drop any standard sample CSV file.',
      'Select X-axis and Y-axis columns from the dropdown selector.'
    ],
    implementationSteps: [
      'Implement drag-and-drop file upload zone using HTML5 Drag-and-Drop API.',
      'Parse CSV rows into typed JSON objects using PapaParse with automatic type coercion.',
      'Create D3 linear scales with auto-computed domains based on data min and max.',
      'Render dynamic SVG axes, scatter plot circles, and interactive tooltips on hover.',
      'Add chart export button converting SVG to PNG image download.'
    ],
    expectedOutput: 'Interactive chart canvas that updates instantly on CSV file upload, displaying axis ticks, hovering data tooltips, and responsive zoom.',
    author: { name: 'Olivia Martinez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '1.6K',
    downloads: 180,
    rating: 4.8,
    updatedAt: 'May 13, 2025',
    thumbnailIcon: 'BarChart',
    codeFiles: [
      {
        path: 'src/components/Chart.tsx',
        language: 'typescript',
        content: `import React, { useEffect, useRef } from 'react';\nimport * as d3 from 'd3';\n\nexport function ScatterChart({ data }: { data: { x: number; y: number }[] }) {\n  const ref = useRef<SVGSVGElement>(null);\n  useEffect(() => {\n    const svg = d3.select(ref.current);\n    svg.selectAll('*').remove();\n    svg.selectAll('circle').data(data).enter().append('circle')\n      .attr('cx', d => d.x * 20).attr('cy', d => 200 - d.y * 20).attr('r', 5).attr('fill', '#a855f7');\n  }, [data]);\n  return <svg ref={ref} width={400} height={250} className="bg-slate-900 rounded-xl" />;\n}`
      }
    ]
  },
  {
    id: 'prj-7',
    name: 'NFT Marketplace',
    description: 'Decentralized digital asset exchange on Ethereum/Polygon testnet with Solidity ERC-721 smart contracts, IPFS metadata upload, and Web3 wallet signing.',
    category: 'Blockchain',
    level: 'Advanced',
    price: '$39',
    isFree: false,
    whatYouReceive: 'Full audited Solidity smart contract suite, Next.js frontend, Pinata IPFS metadata pipeline, Hardhat test harness with 100% test coverage, and deployment guide.',
    technologies: ['Solidity 0.8.20', 'Hardhat', 'Ethers.js v6', 'Next.js', 'OpenZeppelin'],
    prerequisites: ['Basic blockchain concepts (transactions, gas, wallets)', 'Solidity syntax & EVM fundamentals', 'React frontend familiarity'],
    softwareRequired: ['Node.js 18+', 'MetaMask browser wallet extension', 'Sepolia testnet ETH from public faucet', 'Infura or Alchemy API key'],
    setupInstructions: [
      'Install Hardhat: "npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox".',
      'Set "SEPOLIA_RPC_URL" and "PRIVATE_KEY" in ".env" file.',
      'Compile smart contracts: "npx hardhat compile".',
      'Run automated unit test suite: "npx hardhat test".',
      'Deploy to testnet: "npx hardhat run scripts/deploy.js --network sepolia".'
    ],
    implementationSteps: [
      'Write ERC-721 contract with safeMint, royalty info (EIP-2981), and tokenURI overrides.',
      'Write Marketplace escrow contract allowing token listing, cancel, and atomic purchase.',
      'Build Next.js Web3 connect button using browser window.ethereum.',
      'Upload NFT image and JSON metadata to IPFS via Pinata gateway.',
      'Trigger MetaMask wallet popup for contract minting and listing approval transactions.'
    ],
    expectedOutput: 'Deployed contract on Sepolia testnet with live web app where users connect MetaMask, mint NFTs with IPFS metadata, and purchase listed items with test ETH.',
    author: { name: 'Daniel Brown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '1.5K',
    downloads: 94,
    rating: 4.9,
    updatedAt: 'May 12, 2025',
    thumbnailIcon: 'Coins',
    codeFiles: [
      {
        path: 'contracts/NFTMarketplace.sol',
        language: 'solidity',
        content: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\n\ncontract NexusNFT is ERC721 {\n    uint256 public nextTokenId;\n    constructor() ERC721("NexusCollectible", "NXNFT") {}\n    function mint(address to) external returns (uint256) {\n        uint256 id = nextTokenId++;\n        _safeMint(to, id);\n        return id;\n    }\n}`
      }
    ]
  },
  {
    id: 'prj-8',
    name: 'IoT Device Monitor',
    description: 'Industrial IoT telemetry monitoring platform connecting MQTT sensor feeds, time-series influx aggregation, and real-time alerts for temperature and pressure anomalies.',
    category: 'IoT',
    level: 'Intermediate',
    price: '$29',
    isFree: false,
    whatYouReceive: 'Complete MQTT broker integration scripts, simulated sensor device harness, React real-time telemetry dashboard, alert rule engine, and production Docker Compose configuration.',
    technologies: ['Node.js', 'MQTT', 'Mosquitto Broker', 'React', 'Docker Compose'],
    prerequisites: ['MQTT publish/subscribe messaging basics', 'Basic Linux or Docker experience', 'JSON data streams'],
    softwareRequired: ['Docker & Docker Compose', 'Node.js 18+', 'Modern web browser'],
    setupInstructions: [
      'Start Mosquitto MQTT broker: "docker compose up -d mosquitto".',
      'Run sensor simulation script: "node simulate_sensors.js".',
      'Install dependencies and run frontend: "npm install && npm run dev".',
      'Open dashboard at http://localhost:3000 to observe real-time sensor dials.'
    ],
    implementationSteps: [
      'Configure Eclipse Mosquitto broker with authenticated MQTT endpoints.',
      'Build Python/Node simulator emitting sensor metrics every 500ms over topic "factory/sensors/temperature".',
      'Construct WebSocket bridge relaying MQTT packets to browser clients in real time.',
      'Implement threshold alert rule: trigger UI red warning if sensor temperature > 85°C.',
      'Render live gauge needles and 60-second scrolling telemetry chart.'
    ],
    expectedOutput: 'Live industrial IoT control screen with moving sensor charts updating twice per second, instant alert notifications, and historical export capability.',
    author: { name: 'Jessica Lee', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    status: 'Published',
    views: '1.2K',
    downloads: 78,
    rating: 4.8,
    updatedAt: 'May 11, 2025',
    thumbnailIcon: 'Cpu',
    codeFiles: [
      {
        path: 'subscriber.js',
        language: 'javascript',
        content: `const mqtt = require('mqtt');\nconst client = mqtt.connect('mqtt://localhost:1883');\n\nclient.on('connect', () => {\n  console.log('Connected to MQTT Broker');\n  client.subscribe('factory/sensors/#');\n});\n\nclient.on('message', (topic, message) => {\n  const data = JSON.parse(message.toString());\n  console.log(\`[\${topic}] Temp: \${data.temp}°C, Status: \${data.status}\`);\n});`
      }
    ]
  },
];
