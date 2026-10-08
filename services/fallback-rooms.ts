export interface FallbackTask {
  id: string;
  orderNumber: number;
  title: string;
  instructions: string;
  taskType: 'MULTIPLE_CHOICE' | 'CODE_TASK' | 'SCENARIO' | 'READ' | 'CHALLENGE' | 'SIMULATION' | 'QUIZ';
  codeSnippet?: string | null;
  hint?: string | null;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  explanationWrong: string;
  difficulty: string;
  passingScore: number;
  xpReward: number;
}

export interface FallbackRoom {
  id: string;
  title: string;
  description: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  tier: 'Free' | 'Pro';
  category: string;
  estimatedTime: string;
  xpReward: number;
  iconName: string;
  ageGroup: 'KIDS' | 'ABSOLUTE_BEGINNER' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PROFESSIONAL' | 'RESEARCHER';
  tasks: FallbackTask[];
}

export const FALLBACK_ROOM_CATALOG: Record<string, FallbackRoom> = {
  // ─────────────────────────────────────────────
  // crs-0: Stage 1: AI Foundations & Intelligent Agents
  // ─────────────────────────────────────────────
  'crs-0': {
    id: 'crs-0',
    title: 'Stage 1: AI Foundations & Intelligent Agents',
    description: 'Master Symbolic AI, agent environments (PEAS), search algorithms, logic, and expert systems.',
    level: 'Novice',
    tier: 'Free',
    category: 'AI Foundations',
    estimatedTime: '45 mins',
    xpReward: 300,
    iconName: 'Sparkles',
    ageGroup: 'ABSOLUTE_BEGINNER',
    tasks: [
      {
        id: 'task-crs0-1',
        orderNumber: 1,
        title: 'Task 1: The PEAS Agent Framework',
        instructions: 'When designing an autonomous artificial agent, AI engineers specify the PEAS framework: Performance measure, Environment, Actuators, and Sensors. How do these components interact in autonomous systems?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'For an autonomous self-driving vehicle agent, which component belongs strictly to Actuators?',
        options: [
          'Steering wheel, accelerator, brakes, and indicator signals',
          'LiDAR, ultrasonic sensors, and forward-facing cameras',
          'GPS coordinates and digital map database',
          'Passenger safety score and fuel efficiency metrics',
        ],
        correctAnswer: 'Steering wheel, accelerator, brakes, and indicator signals',
        explanation: 'Actuators are the mechanisms through which an agent executes actions upon its physical or digital environment.',
        explanationWrong: 'Cameras and LiDAR are sensors (inputs); fuel metrics are performance measures.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 75,
        hint: 'Actuators cause physical changes in the environment.',
      },
      {
        id: 'task-crs0-2',
        orderNumber: 2,
        title: 'Task 2: Agent Environmental Properties',
        instructions: 'Agent environments are categorized along dimensions: Fully vs Partially Observable, Deterministic vs Stochastic, Episodic vs Sequential, Static vs Dynamic, and Discrete vs Continuous.',
        codeSnippet: `# Environment classification probe
class VacuumEnvironment:
    def __init__(self):
        self.state = {'A': 'DIRTY', 'B': 'CLEAN'}
        self.agent_location = 'A'
        
    def step(self, action):
        if action == 'SUCK':
            self.state[self.agent_location] = 'CLEAN'
        elif action == 'RIGHT':
            self.agent_location = 'B'`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which combination correctly characterizes the game of Chess?',
        options: [
          'Fully Observable, Deterministic, Sequential, Static, Discrete',
          'Partially Observable, Stochastic, Episodic, Dynamic, Continuous',
          'Fully Observable, Stochastic, Sequential, Dynamic, Continuous',
          'Partially Observable, Deterministic, Episodic, Static, Discrete',
        ],
        correctAnswer: 'Fully Observable, Deterministic, Sequential, Static, Discrete',
        explanation: 'In Chess, all pieces are visible (fully observable), moves succeed predictably (deterministic), earlier moves affect later states (sequential), board stays still while thinking (static), and moves/states are finite (discrete).',
        explanationWrong: 'Chess has no hidden cards or random dice rolls, so it is fully observable and deterministic.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 75,
        hint: 'Can both players see the entire board at all times without hidden information?',
      },
      {
        id: 'task-crs0-3',
        orderNumber: 3,
        title: 'Task 3: Reflex vs Goal-Based vs Utility-Based Agents',
        instructions: 'Simple reflex agents act only on current percepts; model-based reflex agents maintain internal state; goal-based agents evaluate future outcomes; utility-based agents maximize happiness/utility functions under uncertainty.',
        codeSnippet: `def utility_agent_decision(states, utility_fn):
    # Evaluates expected utility across possible future states
    best_action = max(states.keys(), key=lambda a: utility_fn(states[a]))
    return best_action`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why is a utility-based agent superior to a simple goal-based agent in high-stakes environments with conflicting goals?',
        options: [
          'It provides trade-offs between conflicting goals (e.g., speed vs safety) using continuous score metrics',
          'It completely ignores sensory inputs to run faster',
          'It requires zero memory and no state tracking',
          'It replaces logic with random sampling',
        ],
        correctAnswer: 'It provides trade-offs between conflicting goals (e.g., speed vs safety) using continuous score metrics',
        explanation: 'When multiple goals conflict, utility functions measure degree of success, allowing the agent to balance speed, fuel consumption, and passenger safety mathematically.',
        explanationWrong: 'Goal-based agents only know binary success/failure; utility agents quantify preference degrees.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 75,
        hint: 'Consider situations where 100% of goals cannot be satisfied simultaneously.',
      },
      {
        id: 'task-crs0-4',
        orderNumber: 4,
        title: 'Task 4: Production Agent Loop Verification',
        instructions: 'Verify an autonomous agent control loop implemented in Python. Ensure sensors, decision functions, and actuator state updates follow strict non-blocking design.',
        codeSnippet: `class AutonomousAgent:
    def __init__(self, sensors, actuators, policy):
        self.sensors = sensors
        self.actuators = actuators
        self.policy = policy
        self.memory = []

    def cycle(self):
        percept = self.sensors.read()
        self.memory.append(percept)
        action = self.policy.decide(percept, self.memory)
        self.actuators.execute(action)
        return action`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What critical safeguard must be added to prevent unbounded memory growth in long-running autonomous agent loops?',
        options: [
          'Bounded sliding-window memory or state summarization with periodic cleanup',
          'Terminating the agent process after 5 cycles',
          'Disabling sensor reads permanently',
          'Deleting actuator connections',
        ],
        correctAnswer: 'Bounded sliding-window memory or state summarization with periodic cleanup',
        explanation: 'Appending unbounded percepts causes memory leaks in production. Agents must use finite circular buffers, vector summarization, or state compression.',
        explanationWrong: 'Stopping the agent or disabling sensors breaks system continuity.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 75,
        hint: 'Think about what happens to memory usage over days of continuous execution.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-1: Stage 1: Search Problem Solving & Knowledge Systems
  // ─────────────────────────────────────────────
  'crs-1': {
    id: 'crs-1',
    title: 'Stage 1: Search Problem Solving & Knowledge Systems',
    description: 'Informed A* search, Minimax game trees, first-order logic, and rule-based inference engines.',
    level: 'Novice',
    tier: 'Free',
    category: 'AI Foundations',
    estimatedTime: '1 hour',
    xpReward: 300,
    iconName: 'Brain',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs1-1',
        orderNumber: 1,
        title: 'Task 1: A* Heuristic Admissibility & Consistency',
        instructions: 'A* search explores nodes based on evaluation function f(n) = g(n) + h(n), where g(n) is the exact path cost from start to n, and h(n) is heuristic estimate to the goal.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Under what mathematical condition is A* graph search guaranteed to return the optimal (shortest) path?',
        options: [
          'The heuristic h(n) is admissible (never overestimates the true cost to the goal) and consistent (monotonic)',
          'The heuristic h(n) is always strictly greater than g(n)',
          'The graph has zero cycles and uniform edge weights',
          'All edge weights are identical powers of two',
        ],
        correctAnswer: 'The heuristic h(n) is admissible (never overestimates the true cost to the goal) and consistent (monotonic)',
        explanation: 'An admissible heuristic h(n) <= h*(n) guarantees A* tree optimality; consistency ensures the first time a state is expanded, the optimal path to it has already been discovered.',
        explanationWrong: 'Overestimating true cost can cause A* to prune optimal branches prematurely.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 100,
        hint: 'Admissible means optimistic: never overestimate.',
      },
      {
        id: 'task-crs1-2',
        orderNumber: 2,
        title: 'Task 2: Minimax & Alpha-Beta Pruning Efficiency',
        instructions: 'In adversarial game search, Minimax computes the optimal move assuming both players play rationally. Alpha-beta pruning removes branches that cannot influence the final decision.',
        codeSnippet: `def alpha_beta(node, depth, alpha, beta, is_max):
    if depth == 0 or node.is_terminal():
        return node.eval()
    if is_max:
        v = -float('inf')
        for child in node.children():
            v = max(v, alpha_beta(child, depth-1, alpha, beta, False))
            alpha = max(alpha, v)
            if beta <= alpha:
                break  # Beta cutoff
        return v`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'With optimal move ordering, what is the effective time complexity of Alpha-Beta pruning compared to raw Minimax O(b^d)?',
        options: [
          'O(b^(d/2)) — effectively doubling the searchable depth in the same compute time',
          'O(d * log(b))',
          'O(b * d)',
          'O(1) constant time',
        ],
        correctAnswer: 'O(b^(d/2)) — effectively doubling the searchable depth in the same compute time',
        explanation: 'Perfect move ordering prunes the maximum number of branches, reducing the branching factor to the square root of b, doubling search horizon.',
        explanationWrong: 'Minimax search trees still grow exponentially, but alpha-beta halves the effective exponent to d/2.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 100,
        hint: 'Alpha-beta cuts branching factor from b to approximately sqrt(b).',
      },
      {
        id: 'task-crs1-3',
        orderNumber: 3,
        title: 'Task 3: Forward vs Backward Chaining in Expert Systems',
        instructions: 'Rule-based systems use inference engines to deduce new knowledge from known facts and production rules IF <condition> THEN <action>.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'When is Forward Chaining preferable over Backward Chaining in automated diagnostics?',
        options: [
          'When data/symptoms are collected bottom-up and many conclusions are possible (data-driven)',
          'When a single specific hypothesis needs to be validated against facts (goal-driven)',
          'When no rules exist in the knowledge base',
          'When rule evaluation order must be completely random',
        ],
        correctAnswer: 'When data/symptoms are collected bottom-up and many conclusions are possible (data-driven)',
        explanation: 'Forward chaining is data-driven: it starts from available symptoms and infers all possible conclusions. Backward chaining is hypothesis-driven (goal-directed).',
        explanationWrong: 'Backward chaining begins with the target goal and looks for supporting evidence.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 100,
        hint: 'Data-driven (forward) vs goal-driven (backward).',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-2: Stage 2: Classical Machine Learning & Scikit-Learn
  // ─────────────────────────────────────────────
  'crs-2': {
    id: 'crs-2',
    title: 'Stage 2: Classical Machine Learning & Scikit-Learn',
    description: 'Supervised regression/classification, Random Forests, SVMs, K-Means, and model evaluation.',
    level: 'Intermediate',
    tier: 'Pro',
    category: 'Machine Learning',
    estimatedTime: '1.5 hours',
    xpReward: 350,
    iconName: 'Cpu',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs2-1',
        orderNumber: 1,
        title: 'Task 1: Bias-Variance Tradeoff & Regularization',
        instructions: 'High bias causes underfitting; high variance causes overfitting to training noise. Regularization constrains model weights to generalize effectively.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which regularizer adds an L1 penalty to the loss function and encourages sparse weights (automatic feature selection)?',
        options: [
          'Lasso Regularization (L1)',
          'Ridge Regularization (L2)',
          'Batch Normalization',
          'Softmax Normalization',
        ],
        correctAnswer: 'Lasso Regularization (L1)',
        explanation: 'Lasso (L1 norm) drives non-informative feature weights strictly to zero, effectively performing embedded feature selection.',
        explanationWrong: 'Ridge (L2) shrinks weights close to zero without setting them strictly to zero.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
        hint: 'L1 produces diamond-shaped constraint boundaries that intersect axes at zero.',
      },
      {
        id: 'task-crs2-2',
        orderNumber: 2,
        title: 'Task 2: Scikit-Learn Cross-Validation Pipeline',
        instructions: 'Data leakage occurs when test set statistics contaminate preprocessing steps (e.g. StandardScalar fitted on the entire dataset before splitting).',
        codeSnippet: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42))
])

scores = cross_val_score(pipe, X_train, y_train, cv=5, scoring='f1_macro')`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why does wrapping the scaler and model inside a `Pipeline` prevent data leakage during k-fold cross-validation?',
        options: [
          'The scaler is strictly fit ONLY on the k-1 training folds and merely transformed on the validation fold in each split',
          'The pipeline compresses dataset rows into a single vector',
          'It forces the model to ignore outlier samples',
          'It converts all text strings into numerical floats automatically',
        ],
        correctAnswer: 'The scaler is strictly fit ONLY on the k-1 training folds and merely transformed on the validation fold in each split',
        explanation: 'Pipelines ensure that data transformations are fitted strictly within each training fold, preventing test distributions from leaking into training parameters.',
        explanationWrong: 'Pipelines encapsulate preprocessing per fold to maintain strict statistical isolation.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 125,
        hint: 'Fit only on training folds, never on validation folds.',
      },
      {
        id: 'task-crs2-3',
        orderNumber: 3,
        title: 'Task 3: ROC-AUC vs Precision-Recall Curve for Imbalanced Classes',
        instructions: 'In extreme class imbalance (e.g. 99.8% negative, 0.2% fraud), standard accuracy and ROC curves can present an overly optimistic assessment of model quality.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why is the Precision-Recall (PR) Curve superior to the ROC Curve when evaluating heavily imbalanced fraud detection models?',
        options: [
          'PR curves focus exclusively on the minority positive class without being inflated by overwhelming True Negatives',
          'ROC curves cannot handle probabilities between 0 and 1',
          'PR curves require fewer computational cycles to compute',
          'ROC curves are only defined for linear models',
        ],
        correctAnswer: 'PR curves focus exclusively on the minority positive class without being inflated by overwhelming True Negatives',
        explanation: 'ROC False Positive Rate (FP / (FP + TN)) is heavily diluted by large True Negative counts. Precision-Recall curves isolate True Positives, False Positives, and False Negatives.',
        explanationWrong: 'ROC curve calculations are swamped by massive True Negative counts in imbalanced datasets.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 125,
        hint: 'True Negatives dominate the denominator of False Positive Rate.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-3: Stage 3: Deep Learning & PyTorch Neural Networks
  // ─────────────────────────────────────────────
  'crs-3': {
    id: 'crs-3',
    title: 'Stage 3: Deep Learning & PyTorch Neural Networks',
    description: 'Artificial neurons, MLPs, backpropagation, SGD/Adam optimizers, CNNs, and sequence LSTMs.',
    level: 'Intermediate',
    tier: 'Pro',
    category: 'Deep Learning',
    estimatedTime: '2 hours',
    xpReward: 500,
    iconName: 'Network',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs3-1',
        orderNumber: 1,
        title: 'Task 1: Backpropagation & Chain Rule Calculus',
        instructions: 'In a multi-layer perceptron with loss L, linear layer z = W x + b, and activation a = σ(z), we compute gradients of loss with respect to weights W using the multivariable chain rule.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the correct gradient of the loss L with respect to weight matrix W in vector notation?',
        options: [
          '∂L/∂W = (∂L/∂z) · xᵀ',
          '∂L/∂W = ∂L/∂z + x',
          '∂L/∂W = (∂L/∂a) / W',
          '∂L/∂W = σ\'(z) · W',
        ],
        correctAnswer: '∂L/∂W = (∂L/∂z) · xᵀ',
        explanation: 'By the matrix chain rule, ∂L/∂W_ij = (∂L/∂z_i) * (∂z_i/∂W_ij) = (∂L/∂z_i) * x_j, which in matrix form is the outer product (∂L/∂z) xᵀ.',
        explanationWrong: 'Gradients with respect to weights combine error sensitivity with upstream activation inputs.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 150,
        hint: 'Outer product of error sensitivity delta and input transpose.',
      },
      {
        id: 'task-crs3-2',
        orderNumber: 2,
        title: 'Task 2: PyTorch Training Loop Anatomy',
        instructions: 'Inspect the canonical PyTorch forward-backward training step. Identify the crucial step that prevents gradient accumulation across batches.',
        codeSnippet: `for images, labels in dataloader:
    optimizer.zero_grad()           # Line 1
    outputs = model(images)         # Line 2
    loss = criterion(outputs, labels) # Line 3
    loss.backward()                 # Line 4
    optimizer.step()                # Line 5`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What happens if `optimizer.zero_grad()` is omitted before `loss.backward()`?',
        options: [
          'Gradients accumulate (sum up) across consecutive batches, producing erroneous update directions',
          'PyTorch throws a fatal runtime exception and crashes immediately',
          'Weights are automatically reset to zero',
          'Learning rate scales to infinity',
        ],
        correctAnswer: 'Gradients accumulate (sum up) across consecutive batches, producing erroneous update directions',
        explanation: 'PyTorch defaults to accumulating gradients in `.grad` attributes to support multi-step gradient accumulation. Omitting `zero_grad()` compounds gradients across batches.',
        explanationWrong: 'PyTorch does not crash; it silently sums gradients, degrading training dynamics.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 175,
        hint: 'PyTorch buffers gradients by adding to them with += on backward passes.',
      },
      {
        id: 'task-crs3-3',
        orderNumber: 3,
        title: 'Task 3: Vanishing Gradients & Activation Functions',
        instructions: 'Deep feedforward networks using Sigmoid or Tanh activations suffer from vanishing gradients because their derivatives saturate near 0 for large activations.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why does ReLU (Rectified Linear Unit, max(0, x)) effectively prevent vanishing gradients for positive inputs?',
        options: [
          'Its derivative is constant 1.0 for all x > 0, allowing gradients to propagate unattenuated through arbitrarily deep layers',
          'It maps all numbers into an imaginary number field',
          'It eliminates negative numbers before loss calculation',
          'It normalizes tensor dimensions to unit length',
        ],
        correctAnswer: 'Its derivative is constant 1.0 for all x > 0, allowing gradients to propagate unattenuated through arbitrarily deep layers',
        explanation: 'For all positive activations, d/dx[ReLU(x)] = 1, meaning repeated multiplication by the activation derivative does not exponentially diminish gradient magnitude.',
        explanationWrong: 'A constant derivative of 1 preserves signal strength across deep layers.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 175,
        hint: 'The slope of f(x) = x for positive x is always 1.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-4: Stage 3: Transformers, Self-Attention & Embeddings
  // ─────────────────────────────────────────────
  'crs-4': {
    id: 'crs-4',
    title: 'Stage 3: Transformers, Self-Attention & Embeddings',
    description: 'Query-Key-Value self-attention math, multi-head encoders, ResNet skip connections, and representation learning.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Deep Learning',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'Layers',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs4-1',
        orderNumber: 1,
        title: 'Task 1: Softmax Gradient Scaling in Self-Attention',
        instructions: 'In the Scaled Dot-Product Attention formula Attention(Q, K, V) = softmax((Q Kᵀ) / √d_k) V, why is the scaling factor 1/√d_k indispensable?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What occurs if the scaling factor 1/√d_k is omitted when projection dimension d_k is large?',
        options: [
          'Dot products grow excessively large, pushing the softmax function into regions with vanishing gradients',
          'The attention matrix becomes non-square and cannot be multiplied by V',
          'Memory consumption triples on GPU devices',
          'All attention weights collapse to zero',
        ],
        correctAnswer: 'Dot products grow excessively large, pushing the softmax function into regions with vanishing gradients',
        explanation: 'For independent zero-mean unit-variance components, the dot product has variance d_k. Dividing by √d_k normalizes variance to 1, preventing softmax saturation.',
        explanationWrong: 'Unscaled large values cause softmax outputs to saturate into one-hot distributions, yielding near-zero gradients.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
        hint: 'Think about what happens to softmax slope when input logits have high magnitudes.',
      },
      {
        id: 'task-crs4-2',
        orderNumber: 2,
        title: 'Task 2: Multi-Head Attention Representation Diversity',
        instructions: 'Multi-Head Attention projects Queries, Keys, and Values h times with distinct learned linear projections into d_k dimensional subspaces.',
        codeSnippet: `# Multi-Head Attention Projection
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        self.d_k = d_model // num_heads
        self.num_heads = num_heads
        self.q_proj = nn.Linear(d_model, d_model)
        self.k_proj = nn.Linear(d_model, d_model)
        self.v_proj = nn.Linear(d_model, d_model)
        self.out_proj = nn.Linear(d_model, d_model)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What fundamental capability does Multi-Head Attention provide over a single large attention head of equal total dimension?',
        options: [
          'It allows the model to jointly attend to information from different representation subspaces and positions simultaneously',
          'It reduces computation to zero FLOPS',
          'It forces the network to ignore positional encodings',
          'It removes the need for residual connections',
        ],
        correctAnswer: 'It allows the model to jointly attend to information from different representation subspaces and positions simultaneously',
        explanation: 'Different attention heads specialize in distinct linguistic and semantic relationships (e.g., syntactic dependencies, co-reference resolution, sentiment context) simultaneously.',
        explanationWrong: 'Multi-head projections enable parallel semantic subspace specialization.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
        hint: 'Different heads learn different types of relationships simultaneously.',
      },
      {
        id: 'task-crs4-3',
        orderNumber: 3,
        title: 'Task 3: Positional Encodings (RoPE vs Absolute)',
        instructions: 'Because self-attention is permutation-invariant (order-agnostic), Transformers must inject positional information into token representations.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why has Rotary Position Embedding (RoPE) largely superseded absolute sinusoidal embeddings in modern frontier LLMs (Llama, Mistral, Qwen)?',
        options: [
          'RoPE encodes relative token distance via complex rotations in 2D subspaces, providing natural length generalization and query-key inner product decay',
          'RoPE eliminates all attention weights',
          'RoPE converts text into sound waves',
          'RoPE requires no floating point math',
        ],
        correctAnswer: 'RoPE encodes relative token distance via complex rotations in 2D subspaces, providing natural length generalization and query-key inner product decay',
        explanation: 'RoPE applies 2D rotation matrices to Query and Key vectors such that their dot product depends solely on relative token displacement (m - n), enabling superior context extension.',
        explanationWrong: 'RoPE preserves relative distance geometry during inner product computation.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 200,
        hint: 'Rotational embeddings preserve relative distance information.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-5: Stage 4: Generative AI, LLMs & Enterprise RAG Architecture
  // ─────────────────────────────────────────────
  'crs-5': {
    id: 'crs-5',
    title: 'Stage 4: Generative AI, LLMs & Enterprise RAG Architecture',
    description: 'BPE tokenization, pretraining vs instruction tuning, vector databases, chunking, and grounded generation.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'MessageSquare',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs5-1',
        orderNumber: 1,
        title: 'Task 1: Vector Search Distance Metrics',
        instructions: 'When retrieving semantic context from vector databases (Milvus, Pinecone, Qdrant), embedding vectors are normalized before calculating relevance.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'When embedding vectors are L2-normalized to unit length (||u|| = ||v|| = 1), Cosine Similarity is mathematically equivalent to:',
        options: [
          'Inner Dot Product (u · v)',
          'Manhattan Distance (L1)',
          'Hamming Distance',
          'Jaccard Similarity Coefficient',
        ],
        correctAnswer: 'Inner Dot Product (u · v)',
        explanation: 'Cosine Similarity is defined as (u · v) / (||u|| ||v||). When vectors have unit length 1.0, the denominator is 1.0, simplifying directly to the inner dot product.',
        explanationWrong: 'Unit normalization reduces cosine similarity directly to the dot product, enabling SIMD and GPU matrix acceleration.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
        hint: 'Unit vectors have length 1 in the denominator.',
      },
      {
        id: 'task-crs5-2',
        orderNumber: 2,
        title: 'Task 2: Chunking Strategy & Context Lost in the Middle',
        instructions: 'Standard naive chunking (e.g. 500 characters) often splits sentence boundaries and separates headers from table bodies. LLMs also exhibit the "Lost in the Middle" degradation.',
        codeSnippet: `# Recursive Character Text Splitter with Semantic Overlap
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\\n\\n", "\\n", " ", ""]
)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the purpose of configuring `chunk_overlap` (e.g., 64 tokens) between consecutive text chunks?',
        options: [
          'Preserving semantic continuity and context across chunk boundaries so phrases are not truncated abruptly',
          'Multiplying database storage costs by 10x',
          'Encrypting the chunk content with a hash key',
          'Eliminating all numbers from document text',
        ],
        correctAnswer: 'Preserving semantic continuity and context across chunk boundaries so phrases are not truncated abruptly',
        explanation: 'Chunk overlap ensures that key entities and sentence clauses split near the boundary retain full context in at least one retrieved chunk.',
        explanationWrong: 'Overlap bridges semantic gaps at arbitrary split points.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 200,
        hint: 'Think about what happens to a sentence that starts in chunk A and finishes in chunk B.',
      },
      {
        id: 'task-crs5-3',
        orderNumber: 3,
        title: 'Task 3: Hybrid Search & Re-Ranking Architecture',
        instructions: 'In production enterprise RAG, dense vector search is combined with sparse BM25 keyword search, followed by a cross-encoder re-ranking model (e.g. Cohere Rerank / BGE).',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why does fusing BM25 keyword search with dense embeddings solve critical failure modes in enterprise search?',
        options: [
          'Dense embeddings capture high-level semantic meaning while BM25 guarantees exact match for specific part numbers, SKUs, error codes, and acronyms',
          'It eliminates the need for an LLM generator model',
          'It stores all vectors in uncompressed CSV format',
          'It converts all documents into PNG images',
        ],
        correctAnswer: 'Dense embeddings capture high-level semantic meaning while BM25 guarantees exact match for specific part numbers, SKUs, error codes, and acronyms',
        explanation: 'Vector embeddings often blur exact alphanumeric tokens (e.g. error code ERR-502 vs ERR-503); BM25 provides precision for exact identifiers, while dense vectors provide semantic breadth.',
        explanationWrong: 'Hybrid search combines lexical precision with semantic understanding.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
        hint: 'Think about finding an exact product serial code like "XR-9021-V4".',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-6: Stage 4: PEFT, LoRA Fine-Tuning & Autonomous AI Agents
  // ─────────────────────────────────────────────
  'crs-6': {
    id: 'crs-6',
    title: 'Stage 4: PEFT, LoRA Fine-Tuning & Autonomous AI Agents',
    description: 'Parameter-efficient fine-tuning, 4-bit QLoRA, tool calling, ReAct agent loops, and multimodal generation.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2.5 hours',
    xpReward: 700,
    iconName: 'Zap',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-crs6-1',
        orderNumber: 1,
        title: 'Task 1: LoRA Rank Decomposition Math',
        instructions: 'Low-Rank Adaptation freezes base weights W0 (d × k) and computes updates as ΔW = B × A, where B is (d × r) and A is (r × k) with rank r << min(d, k).',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary benefit of decomposing weight updates into rank r matrices?',
        options: [
          'Reduces trainable parameter count and optimizer memory footprint by up to 99% while preserving model capability',
          'Eliminates floating-point numbers completely',
          'Increases total parameter count by 4x to improve reasoning',
          'Disables gradient calculation during training',
        ],
        correctAnswer: 'Reduces trainable parameter count and optimizer memory footprint by up to 99% while preserving model capability',
        explanation: 'By constraining ΔW to an intrinsic low rank r (typically 8 to 64), LoRA only updates rank matrices A and B, drastically cutting VRAM requirements.',
        explanationWrong: 'LoRA reduces rather than increases trainable parameters.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 225,
        hint: 'A low rank matrix requires far fewer parameters to store and optimize.',
      },
      {
        id: 'task-crs6-2',
        orderNumber: 2,
        title: 'Task 2: QLoRA 4-bit NormalFloat & Double Quantization',
        instructions: 'QLoRA quantizes frozen base weights to 4-bit NF4 (NormalFloat4), keeping LoRA adapter gradients in FP16/BF16 precision to enable fine-tuning 70B models on a single 48GB GPU.',
        codeSnippet: `from transformers import BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype=torch.bfloat16
)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the core advantage of the NF4 (NormalFloat4) distribution over standard linear INT4 quantization?',
        options: [
          'It allocates equal information quantiles for zero-mean normally distributed neural network weights, minimizing quantization error',
          'It triples inference latency',
          'It runs exclusively on CPU cores',
          'It replaces matrices with binary hash tables',
        ],
        correctAnswer: 'It allocates equal information quantiles for zero-mean normally distributed neural network weights, minimizing quantization error',
        explanation: 'Neural network weights follow standard normal distributions. NF4 places quantile boundaries such that each 4-bit bin contains an equal number of weight values, minimizing rounding distortion.',
        explanationWrong: 'Information-theoretic quantile allocation minimizes quantization error for normally distributed weights.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 250,
        hint: 'Weights follow a bell curve; NF4 bins match that bell curve shape.',
      },
      {
        id: 'task-crs6-3',
        orderNumber: 3,
        title: 'Task 3: ReAct Agent Loop & Tool Invocation',
        instructions: 'The ReAct (Reason + Act) paradigm interleaves reasoning traces ("Thought") with domain actions ("Action: tool_call") and environment observations ("Observation").',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does explicit Thought-Action-Observation chaining prevent error cascading in autonomous multi-step tasks?',
        options: [
          'The agent formulates a reasoning hypothesis, inspects real tool output, and dynamically adapts subsequent steps if an error occurs',
          'It executes all possible tools simultaneously at random',
          'It skips tool execution and invents fake results',
          'It halts after the first step regardless of outcome',
        ],
        correctAnswer: 'The agent formulates a reasoning hypothesis, inspects real tool output, and dynamically adapts subsequent steps if an error occurs',
        explanation: 'ReAct pairs internal reasoning with real-world feedback, allowing the LLM to verify whether an action succeeded before deciding next steps.',
        explanationWrong: 'Observing action results enables iterative error recovery.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 225,
        hint: 'Reasoning before acting and inspecting results before deciding next steps.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-7: Autonomous Multi-Agent Systems & LangGraph Workflows
  // ─────────────────────────────────────────────
  'crs-7': {
    id: 'crs-7',
    title: 'Autonomous Multi-Agent Systems & LangGraph Workflows',
    description: 'Build stateful multi-agent systems with LangGraph, Model Context Protocol (MCP), human-in-the-loop approvals, and asynchronous tool execution.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Agentic AI',
    estimatedTime: '2 hours',
    xpReward: 650,
    iconName: 'Bot',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs7-1',
        orderNumber: 1,
        title: 'Task 1: Cyclic State Graph Orchestration',
        instructions: 'Unlike linear DAG chains, real-world autonomous agents require cyclic state loops to self-correct and iterate over tool failures.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What fundamental capability distinguishes LangGraph state machines from standard linear LLM chains?',
        options: [
          'Support for cyclic graph loops with state persistence, conditional edges, and human-in-the-loop interrupts',
          'Elimination of Python runtime requirements',
          'Restriction to single-turn prompt templates',
          'Removal of external API tool calling',
        ],
        correctAnswer: 'Support for cyclic graph loops with state persistence, conditional edges, and human-in-the-loop interrupts',
        explanation: 'LangGraph models agent workflows as graphs where nodes represent agent actions/tools and edges route control flow cyclically until exit conditions are satisfied.',
        explanationWrong: 'Cyclic transitions and checkpointed state allow agents to reflect, retry, and request human feedback.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 200,
        hint: 'Real world workflows require retry loops and human approvals.',
      },
      {
        id: 'task-crs7-2',
        orderNumber: 2,
        title: 'Task 2: Model Context Protocol (MCP) Architecture',
        instructions: 'Anthropic Model Context Protocol (MCP) standardizes how AI applications connect to external tools, databases, and context servers via JSON-RPC 2.0.',
        codeSnippet: `// MCP Server Tool Declaration
{
  "name": "query_database",
  "description": "Execute parameterized SQL queries on production database",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "params": { "type": "array" }
    },
    "required": ["query"]
  }
}`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary architectural advantage of MCP over bespoke custom tool implementations?',
        options: [
          'Decouples tool providers from client models, allowing any MCP-compliant agent to consume any MCP server without custom glue code',
          'It compiles Python code directly to assembly language',
          'It removes the need for JSON formatting',
          'It eliminates network latency across the internet',
        ],
        correctAnswer: 'Decouples tool providers from client models, allowing any MCP-compliant agent to consume any MCP server without custom glue code',
        explanation: 'MCP acts like USB-C for AI: an open standard allowing tools (servers) and LLMs (clients) to interoperate seamlessly across ecosystems.',
        explanationWrong: 'Standard protocols eliminate point-to-point integration overhead.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 225,
        hint: 'Standardization allows universal plug-and-play interoperability.',
      },
      {
        id: 'task-crs7-3',
        orderNumber: 3,
        title: 'Task 3: Multi-Agent Supervisor vs Peer Collaboration',
        instructions: 'Compare architectural patterns: Supervisor pattern (central orchestrator delegates sub-tasks to specialized worker agents) vs Peer-to-Peer network (agents pass message state collaboratively).',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why is the Supervisor pattern generally preferred in high-compliance enterprise environments?',
        options: [
          'A centralized orchestrator provides deterministic oversight, auditing, routing enforcement, and safety gatekeeper controls',
          'Worker agents have no ability to write code',
          'Supervisors eliminate the need for GPU servers',
          'P2P networks cannot send strings over HTTP',
        ],
        correctAnswer: 'A centralized orchestrator provides deterministic oversight, auditing, routing enforcement, and safety gatekeeper controls',
        explanation: 'Central supervisors act as a single point of telemetry, governance, and output verification before delivering results to end users.',
        explanationWrong: 'Centralized control simplifies compliance, rate limiting, and observability.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 225,
        hint: 'Compliance requires a central point of accountability and audit.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-8: High-Throughput LLM Inference Serving (vLLM, TensorRT & Triton)
  // ─────────────────────────────────────────────
  'crs-8': {
    id: 'crs-8',
    title: 'High-Throughput LLM Inference Serving (vLLM, TensorRT & Triton)',
    description: 'Optimize GPU memory with PagedAttention, KV-Cache compression, FP8/FP4 quantization, and production Triton Inference clusters.',
    level: 'Expert',
    tier: 'Pro',
    category: 'AI Infrastructure',
    estimatedTime: '3 hours',
    xpReward: 800,
    iconName: 'Cpu',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs8-1',
        orderNumber: 1,
        title: 'Task 1: PagedAttention & Virtual Memory Management',
        instructions: 'In traditional LLM inference, contiguous GPU memory allocation for Key-Value caches causes up to 60-80% memory waste due to internal and external fragmentation.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does vLLM PagedAttention eliminate memory fragmentation in GPU VRAM?',
        options: [
          'It stores continuous Key-Value tokens in non-contiguous physical memory blocks managed by a virtual page table',
          'It deletes the KV cache after every single generated token',
          'It executes models exclusively in CPU RAM to bypass VRAM limits',
          'It restricts batch size strictly to 1 concurrent request',
        ],
        correctAnswer: 'It stores continuous Key-Value tokens in non-contiguous physical memory blocks managed by a virtual page table',
        explanation: 'Inspired by OS virtual memory paging, PagedAttention dynamically allocates fixed-size physical blocks for KV tokens, allowing zero memory waste and near-100% GPU utilization.',
        explanationWrong: 'PagedAttention operates directly on GPU VRAM with non-contiguous paging.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 250,
        hint: 'Virtual memory pages mapped to arbitrary physical blocks.',
      },
      {
        id: 'task-crs8-2',
        orderNumber: 2,
        title: 'Task 2: Continuous Batching vs Static Batching',
        instructions: 'Static batching forces requests to wait until all sequences in a batch finish generating tokens, idling GPU compute units when shorter sequences complete early.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does Continuous (Iteration-Level) Batching solve GPU underutilization in production LLM inference?',
        options: [
          'It inserts new incoming requests into the batch at each token iteration step as completed requests finish, maintaining constant GPU saturation',
          'It buffers requests for 10 minutes before running a giant batch',
          'It skips token generation for long queries',
          'It converts all queries into single-token responses',
        ],
        correctAnswer: 'It inserts new incoming requests into the batch at each token iteration step as completed requests finish, maintaining constant GPU saturation',
        explanation: 'Continuous batching operates at the single-token step level: as soon as one sequence emits an EOS token, a new waiting request immediately joins the batch.',
        explanationWrong: 'Iteration-level scheduling dynamically swaps completed sequences for pending ones.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 275,
        hint: 'Token-by-token scheduling instead of sequence-level waiting.',
      },
      {
        id: 'task-crs8-3',
        orderNumber: 3,
        title: 'Task 3: Tensor Parallelism vs Pipeline Parallelism',
        instructions: 'When a model exceeds the memory capacity of a single GPU (e.g. 70B model requiring ~140GB in FP16), it must be distributed across multiple GPUs using Megatron-style parallelism.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'In Tensor Parallelism (TP), how are matrix multiplications split across GPUs within a single NVLink node?',
        options: [
          'Weight matrices are split along rows or columns, and all-reduce communication synchronizes activation tensors after each layer',
          'Each GPU runs an entirely independent model and averages outputs',
          'Layers 1-10 run on GPU 0, layers 11-20 on GPU 1 with high pipeline bubble latency',
          'Model weights are stored on SSD drives and streamed over PCIe',
        ],
        correctAnswer: 'Weight matrices are split along rows or columns, and all-reduce communication synchronizes activation tensors after each layer',
        explanation: 'Column-parallel linear layers followed by row-parallel linear layers require only a single All-Reduce per Transformer block, achieving low latency across high-bandwidth NVLink interconnects.',
        explanationWrong: 'Tensor parallelism shards individual matrix operations intra-node.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 275,
        hint: 'Matrix rows/columns split with all-reduce over NVLink.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-9: Enterprise GraphRAG & Hybrid Knowledge Retrieval
  // ─────────────────────────────────────────────
  'crs-9': {
    id: 'crs-9',
    title: 'Enterprise GraphRAG & Hybrid Knowledge Retrieval',
    description: 'Eliminate LLM hallucinations by fusing Neo4j knowledge graphs with hybrid BM25 and dense vector embeddings with Cohere re-ranking.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Generative AI',
    estimatedTime: '2 hours',
    xpReward: 650,
    iconName: 'Network',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs9-1',
        orderNumber: 1,
        title: 'Task 1: Graph-Assisted Retrieval vs Flat Vector Embeddings',
        instructions: 'While dense vector embeddings excel at local semantic similarity, they struggle with global multi-hop relational queries across entities.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What key advantage does GraphRAG provide over traditional naive vector RAG?',
        options: [
          'Enables multi-hop relational traversal and structural community summaries across connected entities',
          'Reduces vector dimension size to zero',
          'Requires no indexing or document chunking',
          'Eliminates the need for any embedding model',
        ],
        correctAnswer: 'Enables multi-hop relational traversal and structural community summaries across connected entities',
        explanation: 'GraphRAG constructs knowledge graph relationships and community hierarchical summaries, solving questions that span across hundreds of disconnected documents.',
        explanationWrong: 'GraphRAG augments vector search with structured entity graphs rather than eliminating vector representation.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 325,
        hint: 'Graphs capture relationships between disparate entities.',
      },
      {
        id: 'task-crs9-2',
        orderNumber: 2,
        title: 'Task 2: Knowledge Graph Construction from Unstructured Corpora',
        instructions: 'Building knowledge graphs from raw documents requires entity extraction, relation extraction, and entity resolution (coreference deduplication).',
        codeSnippet: `// Cypher Query for Multi-Hop Context Traversal
MATCH (c:Company {name: "TechCorp"})-[:ACQUIRED]->(sub:Company)
MATCH (sub)-[:DEVELOPS]->(p:Product)-[:VULNERABLE_TO]->(v:CVE)
RETURN c.name, sub.name, p.name, v.id`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'In the Cypher graph query above, how many hops of entity relationships are traversed to discover upstream security vulnerabilities?',
        options: [
          '3 hops: Company -> Company -> Product -> CVE',
          '1 hop: Company -> CVE',
          '0 hops (flat table lookup)',
          'Infinite recursive loop',
        ],
        correctAnswer: '3 hops: Company -> Company -> Product -> CVE',
        explanation: 'The query traverses from Company through :ACQUIRED to subsidiary, through :DEVELOPS to Product, and through :VULNERABLE_TO to CVE—three relational edges.',
        explanationWrong: 'Count the directed arrow transitions in the MATCH clauses.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 325,
        hint: 'Count the relationships in the two chained MATCH statements.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-10: Vision-Language Models, Multimodal AI & YOLOv11 Real-Time Vision
  // ─────────────────────────────────────────────
  'crs-10': {
    id: 'crs-10',
    title: 'Vision-Language Models, Multimodal AI & YOLOv11 Real-Time Vision',
    description: 'Fine-tune CLIP and LLaVA multimodal models, real-time YOLOv11 object segmentation, and agricultural leaf pest diagnosis.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Computer Vision',
    estimatedTime: '2.5 hours',
    xpReward: 700,
    iconName: 'Activity',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs10-1',
        orderNumber: 1,
        title: 'Task 1: Contrastive Language-Image Pretraining (CLIP) Alignment',
        instructions: 'CLIP jointly trains an image encoder and text encoder to predict which images match which texts in a batch using symmetric cross-entropy loss.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does CLIP compute the similarity matrix between N images and N text captions?',
        options: [
          'Cosine similarity of normalized image and text embedding vectors scaled by a learned temperature parameter',
          'Pixel-by-pixel subtraction between the image matrix and text token IDs',
          'Applying binary XOR logic on raw byte representations',
          'Running a recurrent LSTM over image RGB values',
        ],
        correctAnswer: 'Cosine similarity of normalized image and text embedding vectors scaled by a learned temperature parameter',
        explanation: 'CLIP projects both modalities into a shared embedding space where normalized dot product (cosine similarity) measures alignment.',
        explanationWrong: 'Modalities must be mapped into a unified vector representation space before comparing.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 350,
        hint: 'Both encoders project into a unified embedding space.',
      },
      {
        id: 'task-crs10-2',
        orderNumber: 2,
        title: 'Task 2: Vision Transformer (ViT) Patch Projection',
        instructions: 'Unlike standard CNNs that use sliding convolution kernels, ViT splits an image of size H × W into a grid of non-overlapping patches of size P × P.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'For a 224 × 224 RGB image with patch size 16 × 16, how many token sequence patches are fed into the Transformer encoder?',
        options: [
          '196 patches (plus 1 learnable [CLS] classification token = 197 total tokens)',
          '16 patches',
          '224 patches',
          '50,176 patches',
        ],
        correctAnswer: '196 patches (plus 1 learnable [CLS] classification token = 197 total tokens)',
        explanation: 'N = (224 / 16) * (224 / 16) = 14 * 14 = 196 patches. A prepended [CLS] token brings the sequence length to 197 tokens.',
        explanationWrong: 'Divide image dimensions by patch size: 14 horizontal * 14 vertical = 196.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 350,
        hint: '(224/16) * (224/16) = 14 * 14.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-11: AI Safety, Prompt Injection Defense & Enterprise Guardrails
  // ─────────────────────────────────────────────
  'crs-11': {
    id: 'crs-11',
    title: 'AI Safety, Prompt Injection Defense & Enterprise Guardrails',
    description: 'Master OWASP Top 10 for LLMs, adversarial red-teaming, NVIDIA NeMo Guardrails, and automated compliance auditing.',
    level: 'Advanced',
    tier: 'Pro',
    category: 'Security & Governance',
    estimatedTime: '2 hours',
    xpReward: 600,
    iconName: 'Shield',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs11-1',
        orderNumber: 1,
        title: 'Task 1: Indirect Prompt Injection Defense Architecture',
        instructions: 'Indirect prompt injection occurs when an LLM consumes untrusted third-party data (web pages, PDFs, user uploads) that contains embedded adversarial instructions. In production agentic systems, how do you reliably neutralize this vulnerability?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which architectural strategy provides the strongest defense against indirect prompt injection in RAG and agent pipelines?',
        options: [
          'Dual-LLM architecture: Quarantined untrusted reader model separated from a privileged execution model with strict XML delimiter tags',
          'Setting LLM sampling temperature to 0.0',
          'Relying solely on blacklisting specific prohibited keywords in raw strings',
          'Removing system prompts and letting the user prompt govern all behavior',
        ],
        correctAnswer: 'Dual-LLM architecture: Quarantined untrusted reader model separated from a privileged execution model with strict XML delimiter tags',
        explanation: 'Separating unprivileged data processing from privileged tool execution using a Dual-LLM pattern combined with structural delimiters (e.g. <untrusted_content>) prevents untrusted payloads from hijacking execution flow.',
        explanationWrong: 'Keyword blacklists and temperature changes are easily bypassed by character encoding, base64 obfuscation, or roleplay jailbreaks.',
        difficulty: 'Hard',
        passingScore: 100,
        xpReward: 300,
        hint: 'Think about privilege separation in operating systems applied to LLM reasoning.',
      },
      {
        id: 'task-crs11-2',
        orderNumber: 2,
        title: 'Task 2: NeMo Guardrails & Output Safety Firewalls',
        instructions: 'Review the production guardrails snippet below designed to intercept hallucinated personally identifiable information (PII) and compliance violations.',
        codeSnippet: `import nemoguardrails as rails

config = rails.RailsConfig.from_path("guardrails_config")
guardrails_app = rails.LLMRails(config)

# Queries are filtered through semantic input and output safety rails
response = await guardrails_app.generate_async(
    messages=[{"role": "user", "content": user_input}]
)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'When an output rail triggers a safety violation (e.g., detecting leaked confidential tokens or PII), what is the optimal gateway action?',
        options: [
          'Halt the response stream immediately, log the audit telemetry, and return a standardized safe fallback message',
          'Deliver the partial response to the user and log a silent database warning',
          'Automatically restart the GPU inference server',
          'Convert the response to hexadecimal format',
        ],
        correctAnswer: 'Halt the response stream immediately, log the audit telemetry, and return a standardized safe fallback message',
        explanation: 'Enterprise gateways must intercept non-compliant generations pre-delivery, masking sensitive outputs and maintaining immutable audit traces for compliance.',
        explanationWrong: 'Delivering leaked data compromises security; restarting servers creates denial of service.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 300,
        hint: 'Fail-safe defaults require preventing any compromised payload from leaving the gateway perimeter.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-12: Edge AI, Small Language Models (SLMs) & On-Device Deployment
  // ─────────────────────────────────────────────
  'crs-12': {
    id: 'crs-12',
    title: 'Edge AI, Small Language Models (SLMs) & On-Device Deployment',
    description: 'Deploy quantized Phi-4 and Qwen-2.5 models on Apple Silicon, Jetson, and mobile devices using ONNX Runtime, GGUF, and WebGPU.',
    level: 'Intermediate',
    tier: 'Pro',
    category: 'Edge & Mobile AI',
    estimatedTime: '2 hours',
    xpReward: 550,
    iconName: 'Smartphone',
    ageGroup: 'PROFESSIONAL',
    tasks: [
      {
        id: 'task-crs12-1',
        orderNumber: 1,
        title: 'Task 1: GGUF Quantization & VRAM Footprint',
        instructions: 'Deploying large models on edge hardware requires quantizing FP16 weights to lower precision formats like Q4_K_M or Q8_0.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Approximately how much memory does an 8-Billion parameter LLM require when quantized to 4-bit (Q4_K_M)?',
        options: [
          '~5.5 GB to 6.0 GB (enabling execution on consumer laptops and edge devices)',
          '~32 GB',
          '~128 MB',
          'Over 64 GB',
        ],
        correctAnswer: '~5.5 GB to 6.0 GB (enabling execution on consumer laptops and edge devices)',
        explanation: 'At 4 bits per parameter, 8B weights occupy ~4 GB plus ~1.5 GB for context KV cache and runtime activations, fitting within standard 8GB RAM/VRAM.',
        explanationWrong: 'Unquantized FP16 requires ~16 GB; 4-bit quantization reduces this to ~5.5-6 GB.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 275,
        hint: '8 billion * 0.5 bytes = 4 GB for weights + cache.',
      },
      {
        id: 'task-crs12-2',
        orderNumber: 2,
        title: 'Task 2: WebGPU In-Browser Zero-Server Inference',
        instructions: 'Modern client devices can execute models directly in Google Chrome, Edge, and Safari using WebGPU with Transformers.js or ONNX Runtime Web.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary privacy and financial advantage of client-side WebGPU model inference for consumer web apps?',
        options: [
          'User data never leaves the client device, and cloud server GPU hosting costs are reduced to $0.00',
          'It forces users to pay monthly subscription fees',
          'It requires zero internet connection to download model weights on first load',
          'It prevents browsers from rendering HTML',
        ],
        correctAnswer: 'User data never leaves the client device, and cloud server GPU hosting costs are reduced to $0.00',
        explanation: 'Client-side WebGPU runs on the user’s local GPU hardware, keeping sensitive documents local and eliminating expensive cloud GPU inference bills for the provider.',
        explanationWrong: 'Local execution provides complete data sovereignty and zero cloud server inference costs.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 275,
        hint: 'Think about data privacy and server hosting bills.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-13: What is a Computer Brain? Fun Intro to Artificial Intelligence
  // ─────────────────────────────────────────────
  'crs-13': {
    id: 'crs-13',
    title: 'What is a Computer Brain? Fun Intro to Artificial Intelligence',
    description: 'Explore AI through drag-and-drop games, "teach the robot" activities, pattern recognition puzzles, and Teachable Machine experiments.',
    level: 'Novice',
    tier: 'Free',
    category: 'AI for Kids',
    estimatedTime: '30 mins',
    xpReward: 200,
    iconName: 'Sparkles',
    ageGroup: 'KIDS',
    tasks: [
      {
        id: 'task-crs13-1',
        orderNumber: 1,
        title: 'Task 1: How Does a Computer "See" Pictures?',
        instructions: 'When a digital camera takes a photo of a puppy, how does the computer brain store and understand that picture?',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How does a computer represent an image on its screen?',
        options: [
          'As a grid of tiny colored dots called pixels, each with red, green, and blue numbers',
          'By printing real paper drawings inside the screen',
          'By whispering to the monitor glass',
          'By guessing without looking at any data',
        ],
        correctAnswer: 'As a grid of tiny colored dots called pixels, each with red, green, and blue numbers',
        explanation: 'Computers store pictures as grids of numbers representing color brightness for every tiny pixel.',
        explanationWrong: 'Screens use digital numbers and pixel grids to display colors.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
        hint: 'Every digital photo is made of pixels with numbers.',
      },
      {
        id: 'task-crs13-2',
        orderNumber: 2,
        title: 'Task 2: Training a Robot with Examples',
        instructions: 'Instead of writing step-by-step instructions for every dog and cat, machine learning shows a computer thousands of photos so it can spot patterns on its own.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is it called when we teach an AI by showing it lots of labeled examples?',
        options: [
          'Training a Model',
          'Deleting the Hard Drive',
          'Formatting the Internet',
          'Unplugging the Power Cord',
        ],
        correctAnswer: 'Training a Model',
        explanation: 'Training is the process where an AI examines lots of examples to learn patterns and make accurate predictions.',
        explanationWrong: 'Training is how AI systems learn from examples.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
        hint: 'Think about athletic training: practicing with lots of examples.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-14: My First Chatbot: Scratch Programming & AI Conversations
  // ─────────────────────────────────────────────
  'crs-14': {
    id: 'crs-14',
    title: 'My First Chatbot: Scratch Programming & AI Conversations',
    description: 'Build simple chatbots using Scratch blocks, understand how computers "talk", create a quiz bot, and animate an AI story character.',
    level: 'Novice',
    tier: 'Free',
    category: 'AI for Kids',
    estimatedTime: '45 mins',
    xpReward: 250,
    iconName: 'MessageSquare',
    ageGroup: 'KIDS',
    tasks: [
      {
        id: 'task-crs14-1',
        orderNumber: 1,
        title: 'Task 1: If-Then Decision Blocks in Chatbots',
        instructions: 'When a user says "Hello" to your chatbot in Scratch, the chatbot checks its programmed rules using If-Then conditional blocks.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'In block programming, which block allows a chatbot to respond differently when a user types "help"?',
        options: [
          'if <answer = "help"> then [say "How can I assist you?" for 2 secs]',
          'forever [turn 15 degrees]',
          'play sound [meow] until done',
          'change size by -10',
        ],
        correctAnswer: 'if <answer = "help"> then [say "How can I assist you?" for 2 secs]',
        explanation: 'Conditional "if-then" blocks let programs test whether an input matches a condition and respond accordingly.',
        explanationWrong: 'Turning or playing sounds are animations, not input-checking logic.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 125,
        hint: 'Look for the condition checking the user\'s typed answer.',
      },
      {
        id: 'task-crs14-2',
        orderNumber: 2,
        title: 'Task 2: Rules vs Machine Learning Chatbots',
        instructions: 'Rule-based chatbots can only reply to exact phrases they were programmed with. Modern AI chatbots (like ChatGPT) predict the most likely next word using deep learning.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What happens if you ask a simple rule-based chatbot a question it has no rule for?',
        options: [
          'It fails or gives a default fallback message like "Sorry, I don\'t understand that"',
          'It invents a brand new PhD thesis',
          'It rewrites its own operating system',
          'It turns off the computer monitor',
        ],
        correctAnswer: 'It fails or gives a default fallback message like "Sorry, I don\'t understand that"',
        explanation: 'Rule-based systems can only respond to known matching patterns; without a match, they trigger fallback statements.',
        explanationWrong: 'Rule engines cannot generalize beyond their hardcoded logic.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 125,
        hint: 'Without a rule, the chatbot cannot answer.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // crs-15: Python for Young Minds: From Zero to Your First AI Project
  // ─────────────────────────────────────────────
  'crs-15': {
    id: 'crs-15',
    title: 'Python for Young Minds: From Zero to Your First AI Project',
    description: 'Variables, loops, functions, lists → build a number guesser, simple sentiment analyzer, and a data visualization dashboard with Matplotlib.',
    level: 'Novice',
    tier: 'Free',
    category: 'Programming',
    estimatedTime: '1 hour',
    xpReward: 300,
    iconName: 'Code',
    ageGroup: 'ABSOLUTE_BEGINNER',
    tasks: [
      {
        id: 'task-crs15-1',
        orderNumber: 1,
        title: 'Task 1: Python Variables and Lists',
        instructions: 'In Python, lists store collections of items like high scores or word datasets.',
        codeSnippet: `scores = [85, 92, 78, 95]
total = sum(scores)
average = total / len(scores)
print("Average score:", average)`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the value of `average` printed by the script above?',
        options: [
          '87.5',
          '350',
          '4',
          '95.0',
        ],
        correctAnswer: '87.5',
        explanation: 'sum([85, 92, 78, 95]) = 350. len(scores) = 4. 350 / 4 = 87.5.',
        explanationWrong: 'Calculate (85 + 92 + 78 + 95) / 4 = 350 / 4 = 87.5.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 150,
        hint: 'Divide the sum 350 by the count 4.',
      },
      {
        id: 'task-crs15-2',
        orderNumber: 2,
        title: 'Task 2: Rule-Based Sentiment Analysis Function',
        instructions: 'Create a simple sentiment analyzer function in Python that checks for positive and negative keywords in text.',
        codeSnippet: `def analyze_sentiment(text):
    positive_words = ["great", "awesome", "love", "fun", "good"]
    negative_words = ["bad", "terrible", "hate", "boring", "awful"]
    
    score = 0
    words = text.lower().split()
    for w in words:
        if w in positive_words:
            score += 1
        elif w in negative_words:
            score -= 1
    return "POSITIVE" if score > 0 else ("NEGATIVE" if score < 0 else "NEUTRAL")`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What does `analyze_sentiment("This game is awesome and super fun")` return?',
        options: [
          '"POSITIVE"',
          '"NEGATIVE"',
          '"NEUTRAL"',
          'None',
        ],
        correctAnswer: '"POSITIVE"',
        explanation: '"awesome" (+1) and "fun" (+1) result in a score of +2 (> 0), so it returns "POSITIVE".',
        explanationWrong: 'Count the positive words: awesome and fun give score = 2 > 0.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 150,
        hint: 'Both "awesome" and "fun" add +1 to the sentiment score.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // room-0: The Math & Human Brain Behind AI
  // ─────────────────────────────────────────────
  'room-0': {
    id: 'room-0',
    title: 'The Math & Human Brain Behind AI',
    description: 'Discover how the human brain inspires neural networks, how matrices and calculus power AI, and real-time application examples.',
    level: 'Novice',
    tier: 'Free',
    category: 'Foundations & Math',
    estimatedTime: '30 mins',
    xpReward: 200,
    iconName: 'Brain',
    ageGroup: 'ABSOLUTE_BEGINNER',
    tasks: [
      {
        id: 'task-room0-1',
        orderNumber: 1,
        title: 'Task 1: Biological vs Artificial Neurons',
        instructions: 'Biological neurons receive electrical signals through dendrites, sum them in the cell body (soma), and fire an action potential along an axon to neighboring synapses.',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'In an artificial neuron (Perceptron), which mathematical operation corresponds to the biological soma summing inputs?',
        options: [
          'Weighted sum: z = Σ (w_i * x_i) + b',
          'Multiplying by random numbers',
          'Square root of the file size',
          'Sorting alphabetical strings',
        ],
        correctAnswer: 'Weighted sum: z = Σ (w_i * x_i) + b',
        explanation: 'Each input x_i is scaled by its synaptic weight w_i, summed together with a bias b, and passed through an activation function.',
        explanationWrong: 'The core linear operation of a neuron is the dot product of inputs and weights plus bias.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
        hint: 'Inputs are multiplied by weights and added together with bias.',
      },
      {
        id: 'task-room0-2',
        orderNumber: 2,
        title: 'Task 2: Why Matrix Multiplication Accelerates AI on GPUs',
        instructions: 'Modern AI runs on GPUs because neural network operations across millions of tokens can be represented as parallel matrix multiplications (GEMM).',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Why are GPUs thousands of times faster than traditional single-core CPUs at training neural networks?',
        options: [
          'GPUs have thousands of small arithmetic cores designed for massive parallel matrix math simultaneously',
          'GPUs have higher clock speeds in GHz than CPUs',
          'GPUs do not need electricity to run',
          'GPUs only process one number at a time very quickly',
        ],
        correctAnswer: 'GPUs have thousands of small arithmetic cores designed for massive parallel matrix math simultaneously',
        explanation: 'While CPUs optimize for low-latency sequential instructions, GPUs excel at high-throughput parallel compute across thousands of tensor elements simultaneously.',
        explanationWrong: 'CPUs have fewer powerful cores; GPUs have thousands of parallel SIMD cores.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 100,
        hint: 'GPUs contain thousands of parallel tensor processing cores.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // room-1: What is AI? (Novice Foundations)
  // ─────────────────────────────────────────────
  'room-1': {
    id: 'room-1',
    title: 'What is AI? (Novice Foundations)',
    description: 'Zero background required. Understand the difference between AI, Machine Learning, Deep Learning, and Generative AI.',
    level: 'Novice',
    tier: 'Free',
    category: 'AI Foundations',
    estimatedTime: '30 mins',
    xpReward: 200,
    iconName: 'Sparkles',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-101',
        orderNumber: 1,
        title: 'Task 1: What is Artificial Intelligence?',
        instructions: 'Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and iteratively improve based on the information they collect.',
        codeSnippet: '# Example AI Decision Logic\ndef classify_number(n):\n    return "Positive" if n > 0 else "Non-Positive"',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'Which of the following is a direct subfield of Artificial Intelligence?',
        options: ['Machine Learning', 'Quantum Hardware', 'Raw Memory Storage', 'Optical Disks'],
        correctAnswer: 'Machine Learning',
        explanation: 'Machine Learning is a direct subset of AI focusing on statistical learning from data.',
        explanationWrong: 'Hardware components are physical devices, not algorithmic subfields of AI.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 65,
        hint: 'AI encompasses Machine Learning and Deep Learning as subfields.',
      },
      {
        id: 'task-102',
        orderNumber: 2,
        title: 'Task 2: AI vs Machine Learning vs Deep Learning',
        instructions: 'Machine Learning is a subset of AI where systems learn from data without being explicitly programmed. Deep Learning uses multi-layered Neural Networks.',
        codeSnippet: 'import numpy as np\ndata = np.array([1, 2, 3, 4, 5])\nprint("Mean:", data.mean())',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What technology drives Deep Learning models?',
        options: ['Multi-Layer Neural Networks', 'Relational Databases', 'Hard Drives', 'SVG Graphics'],
        correctAnswer: 'Multi-Layer Neural Networks',
        explanation: 'Deep Learning relies specifically on artificial neural networks with multiple representation layers.',
        explanationWrong: 'Databases and storage hold data, but do not compute neural representations.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 65,
        hint: 'Neural Networks drive Deep Learning.',
      },
      {
        id: 'task-103',
        orderNumber: 3,
        title: 'Task 3: Generative AI & Large Language Models',
        instructions: 'Generative AI creates new content (text, images, audio, code) based on patterns learned from vast training datasets.',
        codeSnippet: '# Prompting an AI Model\nprompt = "Explain quantum computing in simple terms"\nresponse = ai_model.generate(prompt)',
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the primary capability of Generative AI?',
        options: ['Generating new original content', 'Formatting disk drives', 'Counting spreadsheet rows', 'Replacing motherboard chips'],
        correctAnswer: 'Generating new original content',
        explanation: 'Generative AI synthesizes novel outputs (text, imagery, audio, code) rather than solely categorizing existing inputs.',
        explanationWrong: 'Disk formatting and hardware operations are standard OS tasks, not Generative AI.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 70,
        hint: 'Generative AI produces original outputs.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // room-2: Python Essentials for AI Beginners
  // ─────────────────────────────────────────────
  'room-2': {
    id: 'room-2',
    title: 'Python Essentials for AI Beginners',
    description: 'Learn variables, lists, NumPy arrays, and Pandas DataFrames with interactive code checks.',
    level: 'Novice',
    tier: 'Free',
    category: 'Programming',
    estimatedTime: '45 mins',
    xpReward: 250,
    iconName: 'Code',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: 'task-room2-1',
        orderNumber: 1,
        title: 'Task 1: NumPy Vectorization vs Python For-Loops',
        instructions: 'NumPy executes operations on arrays in contiguous C memory blocks with SIMD vectorization, running up to 100x faster than pure Python loops.',
        codeSnippet: `import numpy as np
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
c = a * b  # Element-wise vector multiplication`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'What is the output array `c` produced by `a * b`?',
        options: [
          '[4, 10, 18]',
          '[5, 7, 9]',
          '32',
          '[1, 2, 3, 4, 5, 6]',
        ],
        correctAnswer: '[4, 10, 18]',
        explanation: 'In NumPy, `*` computes element-wise multiplication: 1*4=4, 2*5=10, 3*6=18 -> [4, 10, 18].',
        explanationWrong: 'Element-wise multiplication multiplies corresponding array indices.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 125,
        hint: '1*4, 2*5, and 3*6.',
      },
      {
        id: 'task-room2-2',
        orderNumber: 2,
        title: 'Task 2: Pandas DataFrame Filtering',
        instructions: 'Pandas DataFrames allow boolean indexing to filter datasets by feature thresholds.',
        codeSnippet: `import pandas as pd
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'accuracy': [0.95, 0.82, 0.91]
})
high_acc = df[df['accuracy'] > 0.90]`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: 'How many rows are present in the filtered `high_acc` DataFrame?',
        options: [
          '2 rows (Alice and Charlie)',
          '1 row (Alice only)',
          '3 rows (all)',
          '0 rows',
        ],
        correctAnswer: '2 rows (Alice and Charlie)',
        explanation: 'Alice (0.95) and Charlie (0.91) have accuracy > 0.90; Bob (0.82) is excluded.',
        explanationWrong: 'Filter conditions keep only rows where accuracy is strictly greater than 0.90.',
        difficulty: 'Easy',
        passingScore: 100,
        xpReward: 125,
        hint: '0.95 and 0.91 are both strictly greater than 0.90.',
      },
    ],
  },
};

/**
 * Returns a complete, fully featured FallbackRoom for any requested ID,
 * ensuring no learner is ever blocked even when the database is unreachable.
 */
export function getFallbackRoom(id: string): FallbackRoom {
  if (FALLBACK_ROOM_CATALOG[id]) {
    return FALLBACK_ROOM_CATALOG[id];
  }

  // Generate dynamic, rich room from ID name pattern
  const cleanTitle = id
    .replace(/^room-|^crs-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const isAdvanced = id.includes('adv') || id.includes('phd') || id.includes('expert') || id.includes('7') || id.includes('8') || id.includes('9') || id.includes('10') || id.includes('11');
  const isIntermediate = !isAdvanced && (id.includes('2') || id.includes('3') || id.includes('12') || id.includes('18') || id.includes('19') || id.includes('20') || id.includes('21'));
  const level = isAdvanced ? 'Advanced' : (isIntermediate ? 'Intermediate' : 'Novice');
  const tier = (level === 'Novice') ? 'Free' : 'Pro';

  return {
    id,
    title: cleanTitle ? `${cleanTitle} Interactive Lab` : 'Interactive AI Learning Room',
    description: `Master core concepts, real-world implementations, and interactive challenges in ${cleanTitle || 'Applied AI'}.`,
    level,
    tier,
    category: 'Applied AI & Engineering',
    estimatedTime: '1 hour',
    xpReward: 400,
    iconName: 'Brain',
    ageGroup: 'UNDERGRADUATE',
    tasks: [
      {
        id: `task-${id}-1`,
        orderNumber: 1,
        title: `Task 1: Conceptual Foundation (${cleanTitle})`,
        instructions: `Welcome to the ${cleanTitle} interactive lab. Review the problem statement and identify the fundamental architectural principle governing this system.`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: `What is the primary engineering objective when implementing ${cleanTitle}?`,
        options: [
          'Maximizing inference accuracy, reliability, and throughput while minimizing computational latency and resource waste',
          'Deleting all cache and storage layers unconditionally',
          'Replacing mathematical models with random unguided sampling',
          'Disabling all evaluation metrics and telemetry logging',
        ],
        correctAnswer: 'Maximizing inference accuracy, reliability, and throughput while minimizing computational latency and resource waste',
        explanation: 'Production AI engineering balances statistical performance with latency bounds, memory footprints, and computational cost.',
        explanationWrong: 'Review the objectives and select the optimal engineering principle.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 100,
        hint: 'Production AI systems optimize for accuracy, throughput, and low latency.',
      },
      {
        id: `task-${id}-2`,
        orderNumber: 2,
        title: `Task 2: Hands-on Code & Operational Verification`,
        instructions: `Analyze the operational pipeline for ${cleanTitle}. Verify that inputs are validated, errors are caught defensively, and outputs adhere to contractual specifications.`,
        codeSnippet: `# Production Service Pipeline
class PipelineService:
    def __init__(self, config):
        self.config = config

    def execute(self, payload: dict):
        if not payload or "data" not in payload:
            raise ValueError("Invalid input payload")
        return {"status": "SUCCESS", "processed": True}`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: `During production deployment of ${cleanTitle}, which verification step ensures pipeline stability?`,
        options: [
          'Automated input validation, error handling with graceful fallback, and end-to-end regression testing',
          'Bypassing all data sanity checks to maximize raw speed',
          'Ignoring out-of-distribution exceptions and corrupt data',
          'Deploying unversioned and unmonitored code directly to production',
        ],
        correctAnswer: 'Automated input validation, error handling with graceful fallback, and end-to-end regression testing',
        explanation: 'Defensive engineering with strict contract validation ensures system resilience against anomalous inputs.',
        explanationWrong: 'Reliable systems mandate rigorous validation and fallback safeguards.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 150,
        hint: 'Defensive validation and regression testing prevent production crashes.',
      },
      {
        id: `task-${id}-3`,
        orderNumber: 3,
        title: `Task 3: Production System Architecture & Resilience`,
        instructions: `Evaluate disaster recovery and fault tolerance mechanisms for ${cleanTitle}. Ensure high availability (HA) under sudden traffic spikes.`,
        taskType: 'MULTIPLE_CHOICE',
        questionText: `Which pattern best ensures high availability for ${cleanTitle} during cloud API throttling or rate-limiting?`,
        options: [
          'Exponential backoff with jitter and automated failover to an on-device/local cached replica',
          'Immediately crashing the user interface and terminating background workers',
          'Flooding the throttled API with 10,000 rapid retry requests per second',
          'Returning an empty blank page to all connected users',
        ],
        correctAnswer: 'Exponential backoff with jitter and automated failover to an on-device/local cached replica',
        explanation: 'Exponential backoff prevents thundering herds, while cached or edge failovers keep services responsive during cloud outages.',
        explanationWrong: 'Flooding throttled services causes permanent bans; crashing damages user trust.',
        difficulty: 'Medium',
        passingScore: 100,
        xpReward: 150,
        hint: 'Exponential backoff with jitter is the standard resilience pattern.',
      },
    ],
  };
}
