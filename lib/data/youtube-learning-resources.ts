/**
 * AI Nexus — Enterprise AI Knowledge Platform
 * Data-Driven YouTube Educational Resources & Structured Curriculum Catalog
 * 
 * COPYRIGHT & USAGE POLICY:
 * - All YouTube videos referenced are embedded using YouTube's official player functionality.
 * - No video files (.mp4, .webm, etc.) are downloaded, stored, hosted, or modified on AI Nexus servers.
 * - Every resource provides full creator attribution, channel links, and direct "Watch on YouTube" links.
 * - All rights and monetization remain with original video creators and copyright holders.
 */

export interface YouTubeLearningResource {
  id: string;
  topicId: string;
  title: string;
  youtubeVideoId: string;
  channelName: string;
  channelUrl: string;
  sourceUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  creatorBio?: string;
  publishDate?: string;
  duration: string; // e.g. "15:42"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  relevanceReason: string;
  keyTakeaways: string[];
  license: 'Standard YouTube License' | 'Creative Commons (CC-BY)';
  copyrightNotice: string;
  embedAllowed: boolean;
  tags: string[];
}

export interface PracticeQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface CodeWalkthroughNote {
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyPoints: string[];
}

export interface RealWorldEnterpriseChallenge {
  title: string;
  companyContext: string;
  problemStatement: string;
  requirements: string[];
  starterCode?: string;
  solutionGuide: string;
}

export interface PlacementInterviewPrep {
  companyNames: string[];
  interviewQuestions: {
    question: string;
    answer: string;
    rubric: string;
  }[];
  practicalCodingTask: {
    title: string;
    description: string;
    expectedOutput: string;
  };
}

export interface TopicEducationalCurriculum {
  topicId: string;
  topicTitle: string;
  category: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedHours: string;
  aiNexusExplanation: string;
  learningObjectives: string[];
  recommendedVideos: YouTubeLearningResource[];
  whatYouShouldLearn: string[];
  aiNexusNotes: CodeWalkthroughNote[];
  practiceQuestions: PracticeQuizQuestion[];
  realWorldChallenge: RealWorldEnterpriseChallenge;
  placementPrep: PlacementInterviewPrep;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC CURRICULA REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

export const TOPIC_CURRICULA: Record<string, TopicEducationalCurriculum> = {
  // ── ROOM 1: What is AI? (Novice Foundations) ──
  'room-1': {
    topicId: 'room-1',
    topicTitle: 'What is AI? Foundations, Machine Learning vs Deep Learning & GenAI',
    category: 'AI Foundations & Machine Learning',
    level: 'Novice',
    estimatedHours: '1.5 Hours',
    aiNexusExplanation:
      'Artificial Intelligence (AI) is the overarching scientific discipline of creating algorithmic systems capable of tasks that typically require human cognition: pattern recognition, language comprehension, and adaptive decision-making. Within AI lies Machine Learning (statistical learning from empirical data) and Deep Learning (hierarchical representation learning using multi-layered neural networks). Understanding these boundary distinctions is foundational before architecting enterprise LLMs and production RAG pipelines.',
    learningObjectives: [
      'Deconstruct the hierarchical relationship between AI, Machine Learning, Deep Learning, and Generative AI.',
      'Differentiate between rule-based expert systems and data-driven statistical learning models.',
      'Analyze how training data, loss functions, and optimization algorithms govern model behavior.',
      'Identify enterprise use cases for predictive models versus generative large language models (LLMs).',
      'Understand ethical guardrails, copyright respect, and AI safety principles.',
    ],
    recommendedVideos: [
      {
        id: 'yt-room1-01',
        topicId: 'room-1',
        title: 'What is Artificial Intelligence? How Does AI Work?',
        youtubeVideoId: 'ad79nYk2keg',
        channelName: 'IBM Technology',
        channelUrl: 'https://www.youtube.com/@IBMTechnology',
        sourceUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg',
        embedUrl: 'https://www.youtube-nocookie.com/embed/ad79nYk2keg',
        thumbnailUrl: 'https://img.youtube.com/vi/ad79nYk2keg/hqdefault.jpg',
        creatorBio: 'IBM Technology provides expert whiteboard tutorials on AI, cloud computing, hybrid cloud, and enterprise architecture.',
        publishDate: '2023-04-18',
        duration: '08:34',
        difficulty: 'Beginner',
        relevanceReason:
          'This video provides an industry-standard visual breakdown of how modern AI functions, separating Narrow AI from General AI and demonstrating practical enterprise data workflows.',
        keyTakeaways: [
          'Narrow AI (Weak AI) solves targeted operational problems; Artificial General Intelligence (AGI) remains theoretical.',
          'Machine Learning shifts programming from writing explicit rules to training models on paired inputs and outputs.',
          'Feature engineering and data quality dictate 80% of model reliability in production.',
          'Enterprise adoption centers around automation, predictive analytics, and natural language interfaces.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© IBM Technology. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['AI Foundations', 'Machine Learning', 'IBM', 'Enterprise AI'],
      },
      {
        id: 'yt-room1-02',
        topicId: 'room-1',
        title: 'AI vs Machine Learning vs Deep Learning vs Generative AI',
        youtubeVideoId: '2ePf9rue1Ao',
        channelName: 'IBM Technology',
        channelUrl: 'https://www.youtube.com/@IBMTechnology',
        sourceUrl: 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
        embedUrl: 'https://www.youtube-nocookie.com/embed/2ePf9rue1Ao',
        thumbnailUrl: 'https://img.youtube.com/vi/2ePf9rue1Ao/hqdefault.jpg',
        creatorBio: 'Jeff Crume and the IBM Technology team deliver clear conceptual architectural breakdowns for engineers and decision makers.',
        publishDate: '2023-09-12',
        duration: '07:22',
        difficulty: 'Beginner',
        relevanceReason:
          'Directly addresses the primary question of Room 1: clearly mapping how Generative AI builds upon Deep Learning, which builds upon Machine Learning, which lives inside Artificial Intelligence.',
        keyTakeaways: [
          'Artificial Intelligence is the broad umbrella of machines mimicking human cognitive abilities.',
          'Machine Learning focuses on algorithms learning statistical patterns from data without hand-crafted heuristics.',
          'Deep Learning uses artificial neural networks with multiple hidden layers to extract hierarchical abstractions.',
          'Generative AI produces novel synthesis (code, text, imagery, audio) rather than purely classifying existing inputs.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© IBM Technology. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['Deep Learning', 'Generative AI', 'Comparison', 'Hierarchy'],
      },
      {
        id: 'yt-room1-03',
        topicId: 'room-1',
        title: 'Intro to Large Language Models',
        youtubeVideoId: 'zjkBMFhNj_g',
        channelName: 'Andrej Karpathy',
        channelUrl: 'https://www.youtube.com/@AndrejKarpathy',
        sourceUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        embedUrl: 'https://www.youtube-nocookie.com/embed/zjkBMFhNj_g',
        thumbnailUrl: 'https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg',
        creatorBio: 'Former Director of AI at Tesla and OpenAI founding researcher, creator of micrograd and nanoGPT.',
        publishDate: '2023-11-22',
        duration: '59:58',
        difficulty: 'Intermediate',
        relevanceReason:
          'Widely regarded as the premier masterclass explaining what LLMs actually are (compressed text predictors acting as operating system kernels) and how pretraining and fine-tuning work in practice.',
        keyTakeaways: [
          'An LLM is fundamentally two files on a disk: a parameters file (e.g. 140GB) and an evaluation code file (e.g. 500 lines of C).',
          'Pretraining compresses ~10TB of internet text into weights using thousands of GPUs running for months.',
          'Fine-tuning with Reinforcement Learning from Human Feedback (RLHF) transforms raw text autocomplete into an assistant.',
          'LLMs are emerging as the CPU/Kernel of new software stacks, orchestrating memory, search, and tools.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© Andrej Karpathy. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['LLMs', 'Karpathy', 'OpenAI', 'Transformers', 'GenAI'],
      },
    ],
    whatYouShouldLearn: [
      'How to explain the difference between classical algorithmic software (deterministic rules) and AI models (probabilistic representations).',
      'The exact mathematical definition of training: adjusting numeric weight parameters to minimize an objective loss function.',
      'Why deep learning replaced manual feature engineering in computer vision and natural language processing.',
      'How large language models generate next-token probabilities rather than recalling static memorized text.',
      'Key considerations for building safe, compliant, and well-attributed enterprise AI systems.',
    ],
    aiNexusNotes: [
      {
        title: 'Architectural Blueprint: From Deterministic Code to Machine Learning',
        content:
          'In traditional software engineering, developers write deterministic logic (Rules) that processes Inputs to produce Outputs. If business rules change, code must be manually updated.\n\nIn Machine Learning, this paradigm is inverted: we feed Inputs and historical Outputs (ground truth labels) into a learning algorithm, which synthesizes a Model (statistical rules). The model can then predict outputs on novel, unseen data.',
        codeSnippet: `# Traditional Deterministic Programming
def calculate_credit_risk(income, debt, credit_score):
    if credit_score > 750 and (debt / income) < 0.35:
        return "LOW_RISK"
    elif credit_score > 650:
        return "MEDIUM_RISK"
    return "HIGH_RISK"

# Machine Learning Paradigm (Scikit-Learn Classifier)
from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Training data: [Income, Debt, CreditScore]
X_train = np.array([[85000, 15000, 780], [42000, 28000, 610], [120000, 20000, 810]])
y_train = np.array([0, 2, 0]) # 0=Low, 1=Medium, 2=High

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Inference on unseen borrower
applicant = np.array([[72000, 18000, 720]])
risk_prediction = model.predict(applicant)
print("Predicted Risk Class:", risk_prediction)`,
        codeLanguage: 'python',
        keyPoints: [
          'Deterministic code requires humans to manually encode all edge cases.',
          'Machine learning infers decision hyperplanes directly from high-dimensional feature distributions.',
          'Supervised learning relies on paired features (X) and ground-truth targets (y).',
        ],
      },
      {
        title: 'The Modern Generative AI Stack: Pretraining, Fine-Tuning & In-Context Grounding',
        content:
          'Modern generative systems like ChatGPT, Claude, and Gemini operate across three distinct stages:\n\n1. Self-Supervised Pretraining: Models ingest trillions of tokens, learning grammatical structures, factual patterns, and semantic reasoning by predicting the next token.\n2. Supervised Fine-Tuning (SFT) & RLHF: Alignment algorithms tune the raw text generator into a secure, instruction-following assistant.\n3. In-Context Grounding (RAG): Enterprise databases inject proprietary facts into the prompt context window to eliminate hallucinations.',
        codeSnippet: `// Conceptual Tokenizer & Generation Loop
interface TokenPrediction {
  token: string;
  probability: number;
}

function sampleNextToken(
  distribution: TokenPrediction[], 
  temperature: number = 0.7
): string {
  // Apply softmax temperature scaling
  const scaled = distribution.map(d => ({
    ...d,
    weight: Math.exp(Math.log(d.probability) / temperature)
  }));
  const totalWeight = scaled.reduce((acc, curr) => acc + curr.weight, 0);
  
  // Weighted roulette selection
  let random = Math.random() * totalWeight;
  for (const item of scaled) {
    if (random < item.weight) return item.token;
    random -= item.weight;
  }
  return distribution[0].token;
}`,
        codeLanguage: 'typescript',
        keyPoints: [
          'Base models are pure next-token predictors, not reasoning databases.',
          'Temperature controls entropy: low temp (0.0 - 0.2) is deterministic; high temp (0.7 - 1.0) is creative.',
          'Retrieval-Augmented Generation (RAG) is essential for enterprise compliance because weights cannot be dynamically updated per user request.',
        ],
      },
    ],
    practiceQuestions: [
      {
        id: 'q-room1-1',
        question: 'Which of the following best defines the core distinction between traditional programming and Machine Learning?',
        options: [
          'Traditional programming processes rules and data to generate answers; Machine Learning processes data and answers to discover patterns/rules.',
          'Traditional programming works on computers while Machine Learning requires biological neural implants.',
          'Traditional programming cannot manipulate numbers, only text.',
          'Machine Learning does not require any CPU or GPU execution.',
        ],
        correctAnswer: 'Traditional programming processes rules and data to generate answers; Machine Learning processes data and answers to discover patterns/rules.',
        explanation: 'In Arthur Samuel\'s classic definition, machine learning enables computers to learn patterns from examples without being explicitly programmed with hand-crafted if-else logic.',
        hint: 'Consider where the "logic rules" originate: from human programmers or inferred from data.',
      },
      {
        id: 'q-room1-2',
        question: 'What is the role of the loss function in training an Artificial Neural Network?',
        options: [
          'It deletes bad training examples from the SSD.',
          'It quantifies the mathematical difference between the model\'s prediction and the ground-truth target.',
          'It prevents the GPU from consuming electricity.',
          'It converts text tokens into audio signals.',
        ],
        correctAnswer: 'It quantifies the mathematical difference between the model\'s prediction and the ground-truth target.',
        explanation: 'The loss function (e.g., Cross-Entropy, Mean Squared Error) computes the numeric penalty for mistakes. Gradients are then computed with backpropagation to adjust weights in the direction of lower loss.',
        hint: 'Think of the loss function as an automated grading test that tells the model how far off it was.',
      },
      {
        id: 'q-room1-3',
        question: 'Why do enterprise AI teams deploy Retrieval-Augmented Generation (RAG) instead of relying solely on base model parameters?',
        options: [
          'Base models cannot generate human language without internet search.',
          'RAG grounds the model in authoritative, live company data, reducing hallucinations and enabling verifiable citations.',
          'RAG makes GPUs 100x cheaper by turning off transformer attention layers.',
          'RAG prevents users from typing prompts in English.',
        ],
        correctAnswer: 'RAG grounds the model in authoritative, live company data, reducing hallucinations and enabling verifiable citations.',
        explanation: 'Model weights are static and have a knowledge cutoff. RAG dynamically fetches relevant source documents and includes them in the prompt context window for accurate, attributable synthesis.',
        hint: 'Think about how a lawyer prepares for a case using reference books rather than relying solely on memory.',
      },
    ],
    realWorldChallenge: {
      title: 'Enterprise AI Architecture: Designing the Customer Intelligence Pipeline',
      companyContext: 'FinSecure Global Bank (Tier-1 Financial Institution)',
      problemStatement:
        'FinSecure wants to deploy an AI agent to assist loan officers in analyzing corporate loan requests. The system must process quarterly financial PDFs, check for regulatory compliance (Basel III), predict default risk probability, and draft an audit report for underwriters.',
      requirements: [
        'Classify which subfield of AI handles each component (e.g., OCR vision vs predictive risk scoring vs generative audit reports).',
        'Specify how to prevent confidential borrower data from leaking into public training sets.',
        'Design a fallback mechanism for when the model confidence score drops below 85%.',
        'Ensure all generation outputs include verifiable citations to source balance sheets.',
      ],
      starterCode: `# Production Pipeline Blueprint
class LoanEvaluationPipeline:
    def __init__(self, risk_model, rag_client, audit_logger):
        self.risk_model = risk_model
        self.rag = rag_client
        self.logger = audit_logger

    def evaluate_applicant(self, borrower_id: str, financials_doc: str):
        # Step 1: Secure Ingestion & Compliance Masking
        # TODO: Implement PII scrubbing
        
        # Step 2: Predictive Credit Scoring
        # TODO: Compute default risk probability
        
        # Step 3: Retrieval-Augmented Report Generation
        # TODO: Ground synthesis in audited financials
        pass`,
      solutionGuide:
        'Architectural Solution:\n1. Ingestion: Use local OCR with privacy-preserving NER to redact employee SSNs and Tax IDs.\n2. Predictive Tier: Random Forest / XGBoost ensemble on tabular ratios (Quick Ratio, Debt-to-Equity) yields a deterministic probability score.\n3. Generative Tier: RAG with vector search (Pinecone/Milvus) pulls exact clauses from the borrower\'s 10-K filing.\n4. Human-In-The-Loop: If model uncertainty > 15%, route the packet to a Senior Credit Underwriter with flagged discrepancies.',
    },
    placementPrep: {
      companyNames: ['Google', 'Microsoft', 'Goldman Sachs', 'Amazon AWS', 'Databricks'],
      interviewQuestions: [
        {
          question: 'How do you determine whether a business problem requires Machine Learning versus traditional heuristics?',
          answer:
            'If the problem has deterministic logic with a small set of clearly defined edge cases (e.g., calculating tax brackets), deterministic rules are faster, cheaper, and 100% auditable. If the data is high-dimensional (images, free-form text, multi-factor behavioral fraud) with complex non-linear patterns that humans cannot write explicit rules for, Machine Learning is required.',
          rubric: 'Candidate must mention complexity, dimensionality, maintenance cost, and rule combinatorial explosion.',
        },
        {
          question: 'Explain the difference between Overfitting and Underfitting, and name three techniques to prevent Overfitting.',
          answer:
            'Underfitting occurs when a model is too simple to capture the underlying trend (high bias). Overfitting occurs when a model memorizes noise in the training set and fails to generalize to unseen test data (high variance). Three prevention techniques: 1) Regularization (L1/L2, Dropout), 2) Cross-validation and early stopping, 3) Data augmentation or collecting more diverse training data.',
          rubric: 'Candidate must connect concepts to bias-variance tradeoff and name specific regularization methods.',
        },
        {
          question: 'Why can Large Language Models hallucinate, and what architectural safeguards do you apply in production?',
          answer:
            'LLMs are probabilistic token estimators trained to produce linguistically plausible continuations, not to verify epistemological truth. When prompt context is ambiguous or outside training distributions, the model outputs probable sounding but factually inaccurate tokens. Production safeguards: 1) Strict RAG with cosine similarity thresholds, 2) Output guardrails (NeMo Guardrails, JSON schema validators), 3) Hallucination evaluation metrics (Faithfulness & Answer Relevance in Ragas), 4) Human-in-the-loop escalation.',
          rubric: 'Candidate must distinguish token probability from factual truth and detail defense-in-depth mitigations.',
        },
      ],
      practicalCodingTask: {
        title: 'Build a Vector Cosine Similarity Search Engine in Pure Python',
        description:
          'Implement a vectorized cosine similarity function without third-party frameworks to match user queries with document embeddings.',
        expectedOutput:
          'Returns top-k document indices sorted by cosine similarity score in range [-1.0, 1.0].',
      },
    },
  },

  // ── ROOM 0: Math, Vectors & Biological Foundations ──
  'room-0': {
    topicId: 'room-0',
    topicTitle: 'Mathematics of AI: Linear Algebra, Calculus, Tensors & Biological Neurons',
    category: 'Deep Learning & Applied Mathematics',
    level: 'Novice',
    estimatedHours: '2.0 Hours',
    aiNexusExplanation:
      'Every state-of-the-art neural network — from tiny computer vision classifiers to 1-trillion parameter LLMs — operates entirely on multi-dimensional linear algebra (matrix dot products) and multivariable calculus (chain rule gradient descent). Demystifying these fundamentals equips engineers with the intuition needed to debug exploding gradients, optimize memory bandwidth, and accelerate training throughput.',
    learningObjectives: [
      'Understand how biological synapses map to artificial weights and additive bias parameters.',
      'Perform matrix multiplications and tensor dot products that power GPU parallel computing.',
      'Visualize loss landscapes and how gradient descent navigates multivariable error surfaces.',
      'Differentiate between activation functions (ReLU, GELU, Sigmoid) and their gradient propagation properties.',
    ],
    recommendedVideos: [
      {
        id: 'yt-room0-01',
        topicId: 'room-0',
        title: 'But what is a neural network? | Chapter 1, Deep Learning',
        youtubeVideoId: 'aircAruvnKk',
        channelName: '3Blue1Brown',
        channelUrl: 'https://www.youtube.com/@3blue1brown',
        sourceUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
        embedUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk',
        thumbnailUrl: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg',
        creatorBio: 'Grant Sanderson creates world-renowned visual mathematics animations explaining core computer science and machine learning concepts.',
        publishDate: '2017-10-05',
        duration: '19:13',
        difficulty: 'Beginner',
        relevanceReason:
          'The definitive visual explanation of how biological inspirations translate into matrix operations, activations, and layer-by-layer feature extraction.',
        keyTakeaways: [
          'A neuron holds a single floating-point number (activation between 0 and 1).',
          'Layers extract increasingly abstract features (pixels -> edges -> loops -> digits).',
          'Matrix multiplication W · a + b packages millions of simultaneous scalar operations into single vector instructions.',
          'Sigmoid and ReLU compress unbounded linear transformations into non-linear activations.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© 3Blue1Brown. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['Neural Networks', '3Blue1Brown', 'Linear Algebra', 'Math'],
      },
      {
        id: 'yt-room0-02',
        topicId: 'room-0',
        title: 'Gradient descent, how neural networks learn | Chapter 2',
        youtubeVideoId: 'IHZwWFHWa-w',
        channelName: '3Blue1Brown',
        channelUrl: 'https://www.youtube.com/@3blue1brown',
        sourceUrl: 'https://www.youtube.com/watch?v=IHZwWFHWa-w',
        embedUrl: 'https://www.youtube-nocookie.com/embed/IHZwWFHWa-w',
        thumbnailUrl: 'https://img.youtube.com/vi/IHZwWFHWa-w/hqdefault.jpg',
        creatorBio: 'Grant Sanderson creates world-renowned visual mathematics animations explaining core computer science and machine learning concepts.',
        publishDate: '2017-10-15',
        duration: '21:01',
        difficulty: 'Intermediate',
        relevanceReason:
          'Essential mathematical foundation explaining how the multivariable gradient vector points downhill toward minimum cost.',
        keyTakeaways: [
          'The cost function takes all network weights and biases and outputs a single metric of performance.',
          'The negative gradient -∇C points in the direction of steepest descent.',
          'Stochastic Gradient Descent (SGD) computes loss across mini-batches for efficient GPU computation.',
          'Learning rates control step sizes; too large causes divergence, too small causes slow convergence.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© 3Blue1Brown. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['Gradient Descent', 'Calculus', 'Optimization', 'Loss Function'],
      },
    ],
    whatYouShouldLearn: [
      'Why non-linear activation functions are mathematically mandatory to prevent deep networks from collapsing into linear regression.',
      'How GPU Tensor Cores accelerate fused multiply-add (FMA) instructions.',
      'The step-by-step calculus chain rule behind backward error backpropagation.',
    ],
    aiNexusNotes: [
      {
        title: 'The Linear Layer Equation: Z = WX + b',
        content:
          'Every dense layer in an artificial neural network executes an affine transformation followed by a point-wise non-linear activation function σ(z). Without non-linearity, stacking 100 layers would be mathematically identical to a single linear equation because W₂ · (W₁ · X) = (W₂W₁) · X = W_combined · X.',
        codeSnippet: `import numpy as np

# Input vector X (3 input features)
X = np.array([[0.5], [1.2], [-0.3]])

# Weight matrix W (2 neurons, 3 inputs each)
W = np.array([
    [0.15, -0.42, 0.88],
    [0.91,  0.33, -0.12]
])

# Bias vector b (2 neurons)
b = np.array([[0.10], [-0.05]])

# Affine transformation: Z = WX + b
Z = np.dot(W, X) + b

# ReLU Activation: a = max(0, Z)
a = np.maximum(0, Z)

print("Pre-activation Z:\n", Z)
print("Activated Output a:\n", a)`,
        codeLanguage: 'python',
        keyPoints: [
          'Weights scale feature significance; biases shift the decision threshold.',
          'ReLU (Rectified Linear Unit) avoids vanishing gradient issues common in Sigmoid and Tanh.',
        ],
      },
    ],
    practiceQuestions: [
      {
        id: 'q-room0-1',
        question: 'If you stack 10 neural network layers without any activation functions, what is the mathematical capacity of the network?',
        options: [
          'Equivalent to a single linear regression model',
          'Exponentially more powerful than any non-linear network',
          'Capable of solving arbitrary non-convex polynomial manifolds',
          'It will crash the GPU due to infinite recursion',
        ],
        correctAnswer: 'Equivalent to a single linear regression model',
        explanation: 'The composition of any number of linear transformations is strictly another linear transformation. Non-linear activations are required to approximate non-linear functions.',
        hint: 'Remember that multiplying matrices together produces another matrix of the same dimension.',
      },
    ],
    realWorldChallenge: {
      title: 'CUDA Kernel Speedup: Vector Dot Product Optimization',
      companyContext: 'NVIDIA Hardware & AI Systems Division',
      problemStatement:
        'A team is observing slow training times on large hidden layers. Profile the matrix dot product and explain why memory bandwidth to HBM (High Bandwidth Memory) often throttles matrix multiplication more than floating-point math throughput.',
      requirements: [
        'Analyze memory access patterns between SRAM (cache) and HBM.',
        'Propose tiling or kernel fusion to minimize memory roundtrips.',
      ],
      solutionGuide:
        'Solution: Standard matrix multiplication reads inputs repeatedly from global memory. Implementing block tiling (as in FlashAttention and cuBLAS) loads sub-matrices into on-chip SRAM, performs fused multiply-adds locally, and writes back only the final accumulated sum.',
    },
    placementPrep: {
      companyNames: ['NVIDIA', 'Apple Silicon', 'Meta AI', 'Google DeepMind'],
      interviewQuestions: [
        {
          question: 'Derive the gradient of the Cross-Entropy loss with respect to Softmax logits.',
          answer:
            'For a Softmax output p_i = exp(z_i) / Σ exp(z_j) and Cross-Entropy loss L = -Σ y_i log(p_i), the derivative simplifies elegantly to ∂L/∂z_i = p_i - y_i. This means the gradient is simply the predicted probability minus the true one-hot label.',
          rubric: 'Candidate should show the chain rule application and state the clean p - y result.',
        },
      ],
      practicalCodingTask: {
        title: 'Implement Softmax with Numerical Stability in NumPy',
        description: 'Subtract max(z) before exponentiation to prevent overflow errors.',
        expectedOutput: 'Probabilities summing strictly to 1.0 without NaN values for large inputs.',
      },
    },
  },

  // ── ROOM 5: Generative AI, RAG & Vector Databases ──
  'room-5': {
    topicId: 'room-5',
    topicTitle: 'Generative AI, Enterprise RAG Architecture & Vector Indexing',
    category: 'Generative AI Systems',
    level: 'Expert',
    estimatedHours: '2.5 Hours',
    aiNexusExplanation:
      'Retrieval-Augmented Generation (RAG) combines dense semantic vector retrieval (using embedding models like OpenAI text-embedding-3 or BGE-M3) with parametric large language models. By grounding LLM inference with dynamic document chunks retrieved from vector indices (HNSW, IVF-Flat), RAG prevents hallucinations, respects document access control lists (ACLs), and enables continuous knowledge updates without costly model fine-tuning.',
    learningObjectives: [
      'Design chunking strategies (semantic, recursive, hierarchical parent-child) for unstructured enterprise data.',
      'Configure vector search indices using Hierarchical Navigable Small World (HNSW) graphs.',
      'Implement hybrid search fusing BM25 sparse lexical search with dense vector embeddings.',
      'Deploy cross-encoder rerankers (Cohere Rerank, BGE-Reranker) to elevate retrieval precision.',
      'Evaluate RAG pipelines using Ragas metrics (Faithfulness, Answer Relevance, Context Recall).',
    ],
    recommendedVideos: [
      {
        id: 'yt-room5-01',
        topicId: 'room-5',
        title: 'What is Retrieval-Augmented Generation (RAG)?',
        youtubeVideoId: 'T-D1OfcDW1M',
        channelName: 'IBM Technology',
        channelUrl: 'https://www.youtube.com/@IBMTechnology',
        sourceUrl: 'https://www.youtube.com/watch?v=T-D1OfcDW1M',
        embedUrl: 'https://www.youtube-nocookie.com/embed/T-D1OfcDW1M',
        thumbnailUrl: 'https://img.youtube.com/vi/T-D1OfcDW1M/hqdefault.jpg',
        creatorBio: 'IBM Technology delivers authoritative tutorials on enterprise AI architecture, hybrid cloud, and AI governance.',
        publishDate: '2023-10-17',
        duration: '06:45',
        difficulty: 'Intermediate',
        relevanceReason:
          'Comprehensive architectural overview of how RAG bridges the gap between public LLM knowledge and proprietary enterprise data lakes.',
        keyTakeaways: [
          'RAG decouples foundational reasoning capabilities from dynamic knowledge storage.',
          'Embeddings convert paragraphs into 1536-dimensional coordinate points where semantic similarity equals spatial proximity.',
          'Prompt injection of retrieved context allows models to answer domain-specific questions with audit citations.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© IBM Technology. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['RAG', 'Vector Databases', 'IBM', 'Enterprise AI'],
      },
      {
        id: 'yt-room5-02',
        topicId: 'room-5',
        title: 'Attention in transformers, visually explained',
        youtubeVideoId: 'wjZofJX0v4U',
        channelName: '3Blue1Brown',
        channelUrl: 'https://www.youtube.com/@3blue1brown',
        sourceUrl: 'https://www.youtube.com/watch?v=wjZofJX0v4U',
        embedUrl: 'https://www.youtube-nocookie.com/embed/wjZofJX0v4U',
        thumbnailUrl: 'https://img.youtube.com/vi/wjZofJX0v4U/hqdefault.jpg',
        creatorBio: 'Grant Sanderson creates world-renowned visual mathematics animations.',
        publishDate: '2024-04-07',
        duration: '26:44',
        difficulty: 'Advanced',
        relevanceReason:
          'Mastering RAG context windows requires understanding how the attention mechanism processes retrieved tokens.',
        keyTakeaways: [
          'Attention calculates affinity between every token pair in the context window.',
          'Query and Key dot products determine how much weight is placed on specific context passages.',
          'Value vectors are aggregated into contextualized representations.',
        ],
        license: 'Standard YouTube License',
        copyrightNotice:
          '© 3Blue1Brown. Content belongs to original creator. Embedded for educational reference under YouTube Terms of Service.',
        embedAllowed: true,
        tags: ['Transformers', 'Self-Attention', '3Blue1Brown', 'Deep Learning'],
      },
    ],
    whatYouShouldLearn: [
      'How to structure embedding ingestion pipelines with deduplication and metadata filtering.',
      'How to balance chunk overlap to preserve conversational context across split boundaries.',
      'Techniques to diagnose retrieval failures versus generation failures using evaluation frameworks.',
    ],
    aiNexusNotes: [
      {
        title: 'Hybrid Search Architecture: Combining BM25 and Dense Vectors',
        content:
          'Dense vector retrieval excels at semantic similarity ("cardiac infarction" matches "heart attack"), but struggles with exact alphanumeric identifiers (part numbers like "SKU-9402X" or legal case numbers). Production enterprise RAG combines BM25 sparse keyword scores with dense vector cosine similarity via Reciprocal Rank Fusion (RRF).',
        codeSnippet: `def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    """
    RRF score = sum(1 / (k + rank_i))
    """
    rrf_scores = {}
    for rank, doc_id in enumerate(dense_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
        
    for rank, doc_id in enumerate(sparse_ranks):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
        
    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs`,
        codeLanguage: 'python',
        keyPoints: [
          'RRF is hyperparameter-free and prevents dense vector score drift across different query types.',
          'A cross-encoder reranker should be applied to the top 25 RRF candidates before feeding the prompt to the LLM.',
        ],
      },
    ],
    practiceQuestions: [
      {
        id: 'q-room5-1',
        question: 'In a production RAG system, what is the primary benefit of adding a Cross-Encoder Reranker after the initial vector retrieval stage?',
        options: [
          'It scores query-document pairs jointly with full cross-attention, drastically improving precision over bi-encoder cosine similarity.',
          'It compresses the PDF into a smaller file size.',
          'It translates the query into multiple foreign languages.',
          'It eliminates the need for an LLM generator.',
        ],
        correctAnswer: 'It scores query-document pairs jointly with full cross-attention, drastically improving precision over bi-encoder cosine similarity.',
        explanation: 'Bi-encoders embed queries and documents independently for fast sub-5ms lookup, sacrificing token-level interaction. Cross-encoders attend across both query and document tokens simultaneously, providing superior relevance ranking.',
        hint: 'Consider the difference between comparing pre-computed embeddings versus analyzing query and document words together.',
      },
    ],
    realWorldChallenge: {
      title: 'Architecting a Multi-Tenant GraphRAG System for Healthcare Records',
      companyContext: 'MedVanguard Health Systems',
      problemStatement:
        'MedVanguard manages 10M patient electronic health records. The system must support clinical queries while strictly enforcing HIPAA access controls so doctors only view data for patients in their department.',
      requirements: [
        'Implement metadata filtering at the vector index layer (pre-filtering, not post-filtering).',
        'Incorporate knowledge graph links between medications, dosages, and contraindications.',
      ],
      solutionGuide:
        'Solution: Use single-stage filtered vector search (e.g. Pinecone metadata filter or pgvector with row-level security). Combine patient history nodes with a medical knowledge graph (UMLS ontology) to catch adverse drug interactions.',
    },
    placementPrep: {
      companyNames: ['OpenAI', 'Anthropic', 'Cohere', 'Palantir', 'Snowflake'],
      interviewQuestions: [
        {
          question: 'How do you prevent the "Lost in the Middle" phenomenon when injecting 20+ retrieved documents into an LLM context window?',
          answer:
            'Transformers exhibit a U-shaped attention curve: they pay highest attention to tokens at the very beginning and very end of the prompt. Solutions: 1) Place the most critical retrieved chunks at the start and end of the context, 2) Use rerankers to keep context concise (top 3-5 chunks rather than 20), 3) Use map-reduce or recursive summarization across chunks before final generation.',
          rubric: 'Candidate must mention position bias and concrete context restructuring tactics.',
        },
      ],
      practicalCodingTask: {
        title: 'Implement Chunk Overlap Splitting with Recursive Delimiters',
        description: 'Split long text by paragraphs, sentences, and words while maintaining an exact 50-token sliding overlap.',
        expectedOutput: 'List of text chunks where each chunk preserves contiguous semantic boundaries.',
      },
    },
  },
};

/**
 * Returns curriculum for a given topic ID, with intelligent fallback to room-1
 */
export function getTopicCurriculum(topicId: string): TopicEducationalCurriculum {
  if (TOPIC_CURRICULA[topicId]) {
    return TOPIC_CURRICULA[topicId];
  }

  // If a generic room requested (e.g. room-2, room-3), generate an appropriate curriculum
  const cleanName = topicId
    .replace(/^room-|^crs-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    topicId,
    topicTitle: `${cleanName || 'Applied AI'} Educational Masterclass`,
    category: 'Applied Artificial Intelligence',
    level: topicId.includes('adv') || topicId.includes('5') ? 'Advanced' : 'Intermediate',
    estimatedHours: '1.5 Hours',
    aiNexusExplanation: `This interactive learning room covers foundational principles, mathematical formulations, and production architectural patterns for ${cleanName || 'modern AI engineering'}. Study the verified YouTube resources below, review the code walkthroughs, and complete the placement challenges.`,
    learningObjectives: [
      `Master core theoretical and architectural mechanisms of ${cleanName || 'the topic'}.`,
      'Analyze real-world enterprise engineering tradeoffs and latency bounds.',
      'Implement defensive validation and evaluation metrics in Python and TypeScript.',
      'Prepare for Tier-1 technology placement and systems design interviews.',
    ],
    recommendedVideos: TOPIC_CURRICULA['room-1'].recommendedVideos.slice(0, 2),
    whatYouShouldLearn: [
      'How to translate theoretical concepts into scalable, containerized software.',
      'Key metrics for verifying model quality, latency, and operational cost.',
      'Production failure modes and defensive design patterns.',
    ],
    aiNexusNotes: [
      {
        title: `Enterprise Architectural Blueprint for ${cleanName}`,
        content: `When deploying ${cleanName} in production environments, teams must balance model capability against operational compute costs, telemetry monitoring, and fallback reliability.`,
        codeSnippet: `# Production Service Interface\nclass ProductionEngine:\n    def __init__(self, config):\n        self.config = config\n        \n    def process_request(self, payload: dict):\n        # 1. Validation\n        assert "input" in payload, "Missing input"\n        # 2. Execution\n        return {"status": "SUCCESS", "result": "Optimized Output"}`,
        codeLanguage: 'python',
        keyPoints: [
          'Always implement graceful fallback strategies for downstream service outages.',
          'Monitor P99 latency and token throughput metrics continuously.',
        ],
      },
    ],
    practiceQuestions: [
      {
        id: `q-${topicId}-1`,
        question: `What is the primary engineering objective when deploying ${cleanName} to production?`,
        options: [
          'Maximizing reliability, throughput, and accuracy within specified latency and cost constraints',
          'Eliminating all software testing and telemetry logging',
          'Deploying unversioned models directly without verification',
          'Restricting access exclusively to a single hardcoded machine',
        ],
        correctAnswer: 'Maximizing reliability, throughput, and accuracy within specified latency and cost constraints',
        explanation: 'Enterprise AI engineering requires balancing statistical performance with infrastructure cost, latency bounds, and system resilience.',
        hint: 'Think about what production SLA (Service Level Agreement) requirements demand.',
      },
    ],
    realWorldChallenge: {
      title: `${cleanName} Production Reliability Challenge`,
      companyContext: 'Enterprise Cloud Infrastructure Corp',
      problemStatement: `Design a high-throughput processing pipeline for ${cleanName} capable of handling 5,000 requests per second with sub-50ms latency SLAs.`,
      requirements: [
        'Incorporate asynchronous queuing (Redis/Kafka) for spike mitigation.',
        'Implement structured telemetry and health-check heartbeats.',
        'Provide automated failover to a lightweight local model if cloud endpoints degrade.',
      ],
      solutionGuide:
        'Solution: Utilize a fast caching tier (Redis vector cache) for repeat queries, an asynchronous queue for smoothing traffic spikes, and a local quantized model (ONNX Runtime) for fallback execution when primary cloud APIs exceed latency thresholds.',
    },
    placementPrep: {
      companyNames: ['Google Cloud', 'Microsoft Azure', 'Amazon AWS', 'Meta'],
      interviewQuestions: [
        {
          question: `How do you measure and optimize P99 latency in a ${cleanName} production pipeline?`,
          answer:
            'Measure latency distributions across every sub-component (network transit, tokenization, model inference, post-processing). Optimize P99 by applying connection pooling, batch scheduling, model quantization (FP8/INT4), and caching high-frequency queries.',
          rubric: 'Candidate must address P99 tail latency causes and cite multi-layer optimization techniques.',
        },
      ],
      practicalCodingTask: {
        title: `Implement an LRU Cache with TTL for ${cleanName} Inference`,
        description: 'Design a thread-safe cache to eliminate redundant computation for identical inputs.',
        expectedOutput: 'Sub-millisecond retrieval on cache hit with automatic expiration after TTL.',
      },
    },
  };
}

export function getAllCurricula(): TopicEducationalCurriculum[] {
  return Object.values(TOPIC_CURRICULA);
}
