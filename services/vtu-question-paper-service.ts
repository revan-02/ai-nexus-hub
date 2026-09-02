export type VTUScheme = '2022 Scheme' | '2021 Scheme' | '2018 Scheme' | '2017 Scheme';
export type VTUSemester = '3rd Sem' | '4th Sem' | '5th Sem' | '6th Sem' | '7th Sem' | '8th Sem';
export type BloomsLevel = 'L1: Remember' | 'L2: Understand' | 'L3: Apply' | 'L4: Analyze' | 'L5: Evaluate';
export type VTUBranch =
  | 'AI & ML (AIML)'
  | 'Computer Science (CSE)'
  | 'AI & Data Science (AIDS)'
  | 'Information Science (ISE)'
  | 'Electronics & Communication (ECE)';

export interface VTUQuestion {
  id: string;
  questionNumber: string;
  isOrOption?: boolean;
  text: string;
  marks: number;
  bloomsLevel: BloomsLevel;
  courseOutcome: string;
  detailedSolution: {
    steps: string[];
    mathematicalDerivation?: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
    keyDiagramDescription?: string;
    examMarksTip: string;
  };
}

export interface VTUModule {
  moduleNumber: 1 | 2 | 3 | 4 | 5;
  moduleTitle: string;
  syllabusTopics: string[];
  questions: VTUQuestion[];
}

export interface VTUQuestionPaper {
  id: string;
  subjectName: string;
  subjectCode: string;
  scheme: VTUScheme;
  semester: VTUSemester;
  branch: VTUBranch;
  examSession: string;
  maxMarks: number;
  duration: string;
  featured?: boolean;
  syllabusOverview: string;
  modules: VTUModule[];
}

const VTU_QUESTION_PAPERS_DB: VTUQuestionPaper[] = [
  // ═════════════════════════════════════════════════════════════════════════════
  // BRANCH 1: ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (AIML)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'vtu-21ai54-jul2024',
    subjectName: 'Artificial Intelligence & Machine Learning',
    subjectCode: '21AI54',
    scheme: '2021 Scheme',
    semester: '5th Sem',
    branch: 'AI & ML (AIML)',
    examSession: 'July/August 2024',
    maxMarks: 100,
    duration: '3 Hours',
    featured: true,
    syllabusOverview: 'State space search, Heuristics, Concept learning, Decision trees, Backpropagation, Bayesian learning, and Instance-based methods.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: State Space Search & Heuristic Search Strategies',
        syllabusTopics: ['State Space Search', 'BFS & DFS', 'Heuristic Search', 'A* Algorithm', 'AO* Algorithm'],
        questions: [
          {
            id: 'q1a',
            questionNumber: 'Q1.a',
            text: 'Explain A* Search algorithm with an illustrative state graph. Prove that A* algorithm is admissible if the heuristic function h(n) is admissible.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Definition: A* is a best-first search algorithm evaluating nodes via f(n) = g(n) + h(n), where g(n) is exact cost from start to node n, and h(n) is estimated cost from n to goal.',
                '2. Admissibility Property: A heuristic h(n) is admissible if ∀n, 0 ≤ h(n) ≤ h*(n), where h*(n) is the true optimal cost to goal.',
                '3. Admissibility Proof (by contradiction): Suppose A* terminates at a sub-optimal goal G2 with f(G2) = g(G2) > C* (where C* is optimal cost).',
                '4. Since the optimal path has some unexpanded open node n, f(n) = g(n) + h(n) ≤ g(n) + h*(n) = C*.',
                '5. Thus f(n) ≤ C* < g(G2) = f(G2). A* must select n before G2, contradicting that G2 was selected.'
              ],
              mathematicalDerivation: 'f(n) = g(n) + h(n) \\le g(n) + h^*(n) = C^* < f(G_2)',
              examMarksTip: 'Give state space equation f(n) = g(n) + h(n) (2m), step-by-step OPEN/CLOSED list trace (4m), and admissibility proof (4m).'
            }
          },
          {
            id: 'q1b',
            questionNumber: 'Q1.b',
            text: 'Differentiate between Informed (Heuristic) and Uninformed (Blind) search techniques with time and space complexity comparison.',
            marks: 10,
            bloomsLevel: 'L2: Understand',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Uninformed Search (BFS, DFS, Uniform Cost Search): Explores state space without domain-specific knowledge about distance to goal.',
                '2. Informed Search (Greedy Best-First, A*): Uses heuristic evaluation function h(n) to guide frontier expansion.',
                '3. Complexity Matrix:\n   - BFS: Time O(b^d), Space O(b^d)\n   - DFS: Time O(b^m), Space O(bm)\n   - A*: Time O(b^d), Space O(b^d) with optimal admissible heuristic.'
              ],
              examMarksTip: 'Draw comparison table covering 5 points: Knowledge, Heuristics, Space, Time, and Completeness (2m each).'
            }
          }
        ]
      },
      {
        moduleNumber: 2,
        moduleTitle: 'Module 2: Concept Learning & Decision Trees',
        syllabusTopics: ['Concept Learning', 'Find-S Algorithm', 'Candidate Elimination', 'Decision Tree (ID3)', 'Information Gain & Entropy'],
        questions: [
          {
            id: 'q3a',
            questionNumber: 'Q3.a',
            text: 'Define Entropy and Information Gain. For the given dataset (PlayTennis with Attributes: Outlook, Temperature, Humidity, Wind), calculate Information Gain for Humidity and show the root node selection in ID3.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO2',
            detailedSolution: {
              steps: [
                '1. Entropy Formulation: Entropy(S) = -p_+ log_2(p_+) - p_- log_2(p_-).',
                '2. For PlayTennis (9 Yes, 5 No): Entropy(S) = -(9/14)log_2(9/14) - (5/14)log_2(5/14) = 0.940 bits.',
                '3. Information Gain: Gain(S, A) = Entropy(S) - ∑_{v∈Values(A)} (|S_v|/|S|) Entropy(S_v).',
                '4. For Humidity (High: 3+, 4-, Normal: 6+, 1-):\n   - Entropy(S_High) = -(3/7)log_2(3/7) - (4/7)log_2(4/7) = 0.985\n   - Entropy(S_Normal) = -(6/7)log_2(6/7) - (1/7)log_2(1/7) = 0.592\n   - Gain(S, Humidity) = 0.940 - [ (7/14)(0.985) + (7/14)(0.592) ] = 0.940 - 0.7885 = 0.151 bits.',
                '5. Outlook yields Gain(S, Outlook) = 0.246 bits, hence Outlook is selected as the Root Node.'
              ],
              mathematicalDerivation: '\\text{Gain}(S, A) = \\text{Entropy}(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} \\text{Entropy}(S_v)',
              examMarksTip: 'State exact log2 formulas (2m), calculate Total Entropy (2m), calculate Gain for attributes (4m), and root decision (2m).'
            }
          }
        ]
      },
      {
        moduleNumber: 3,
        moduleTitle: 'Module 3: Neural Networks & Backpropagation Algorithm',
        syllabusTopics: ['Perceptrons', 'Multilayer Networks', 'Backpropagation Derivation', 'Chain Rule', 'Activation Functions'],
        questions: [
          {
            id: 'q5a',
            questionNumber: 'Q5.a',
            text: 'Derive the weight update equations for output and hidden layers in the Error Backpropagation algorithm using Sigmoid activation function and Chain Rule.',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO3',
            detailedSolution: {
              steps: [
                '1. Total Squared Error: E = (1/2) ∑_{k∈outputs} (t_k - y_k)^2, where y_k = σ(net_k) = 1/(1 + e^{-net_k}).',
                '2. Derivative of Sigmoid: dσ(z)/dz = σ(z)(1 - σ(z)) = y_k(1 - y_k).',
                '3. Output Layer Weight Update: ∂E/∂w_{jk} = (∂E/∂y_k) ⋅ (∂y_k/∂net_k) ⋅ (∂net_k/∂w_{jk}) = -(t_k - y_k) ⋅ y_k(1 - y_k) ⋅ h_j = -δ_k ⋅ h_j, where δ_k = (t_k - y_k)y_k(1 - y_k).',
                '4. Weight Update Rule: w_{jk}^{new} = w_{jk}^{old} + η δ_k h_j.',
                '5. Hidden Layer Weight Update: δ_j = h_j(1 - h_j) ∑_{k} δ_k w_{jk}, yielding w_{ij}^{new} = w_{ij}^{old} + η δ_j x_i.'
              ],
              mathematicalDerivation: '\\frac{\\partial E}{\\partial w_{jk}} = - (t_k - y_k) \\cdot y_k(1 - y_k) \\cdot h_j = - \\delta_k h_j',
              examMarksTip: 'Draw 3-layer network diagram (2m), derive output delta δ_k (4m), derive hidden delta δ_j (4m).'
            }
          }
        ]
      },
      {
        moduleNumber: 4,
        moduleTitle: 'Module 4: Bayesian Learning & Naive Bayes Classifier',
        syllabusTopics: ['Bayes Theorem', 'Maximum A Posteriori (MAP)', 'Maximum Likelihood (ML)', 'Naive Bayes', 'EM Algorithm'],
        questions: [
          {
            id: 'q7a',
            questionNumber: 'Q7.a',
            text: 'State Bayes Theorem. Explain the Naive Bayes classification algorithm and calculate the posterior probability for a test sample with conditional independence assumption.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO4',
            detailedSolution: {
              steps: [
                '1. Bayes Theorem: P(h|D) = [ P(D|h) ⋅ P(h) ] / P(D).',
                '2. MAP Hypothesis: h_MAP = argmax_{h∈H} P(D|h)P(h).',
                '3. Naive Bayes Conditional Independence: P(a_1, a_2, ..., a_n | v_j) = ∏_{i=1}^n P(a_i | v_j).',
                '4. Classification Rule: v_NB = argmax_{v_j ∈ V} P(v_j) ∏_{i=1}^n P(a_i | v_j).',
                '5. Zero Probability Mitigation: Use m-estimate Laplace Smoothing: P(a_i|v_j) = (n_c + m p)/(n + m).'
              ],
              mathematicalDerivation: 'v_{NB} = \\arg\\max_{v_j \\in V} P(v_j) \\prod_{i=1}^n P(a_i | v_j)',
              examMarksTip: 'State formula & conditional independence assumption clearly (4m), write step-by-step algorithm (4m), explain Laplace smoothing (2m).'
            }
          }
        ]
      },
      {
        moduleNumber: 5,
        moduleTitle: 'Module 5: Instance-Based Learning & Reinforcement Learning',
        syllabusTopics: ['k-Nearest Neighbors (k-NN)', 'Locally Weighted Regression', 'Radial Basis Functions', 'Q-Learning', 'Bellman Equation'],
        questions: [
          {
            id: 'q9a',
            questionNumber: 'Q9.a',
            text: 'Explain k-Nearest Neighbor (k-NN) algorithm. Discuss distance metrics (Euclidean, Manhattan, Minkowski) and how to handle the curse of dimensionality.',
            marks: 10,
            bloomsLevel: 'L2: Understand',
            courseOutcome: 'CO5',
            detailedSolution: {
              steps: [
                '1. Algorithm: Given a query instance xq, compute distance d(xq, xi) to all training points. Select k nearest neighbors. Classify by majority vote (or mean value for regression).',
                '2. Distance Metrics:\n   - Euclidean: d(x, y) = √[ ∑ (xi - yi)^2 ]\n   - Manhattan: d(x, y) = ∑ |xi - yi|\n   - Minkowski (Lp): d(x, y) = [ ∑ |xi - yi|^p ]^(1/p).',
                '3. Curse of Dimensionality: In high dimensions, all pairwise distances become equidistant; resolve via PCA dimensionality reduction or distance weighting.'
              ],
              examMarksTip: 'State algorithm steps (3m), write 3 distance formulas (4m), discuss curse of dimensionality & solutions (3m).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'vtu-21ai61-jan2024',
    subjectName: 'Deep Learning',
    subjectCode: '21AI61',
    scheme: '2021 Scheme',
    semester: '6th Sem',
    branch: 'AI & ML (AIML)',
    examSession: 'January/February 2024',
    maxMarks: 100,
    duration: '3 Hours',
    featured: true,
    syllabusOverview: 'Deep feedforward networks, CNN architectures, RNN & LSTM cells, Autoencoders, GANs, and Transformers.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Deep Feedforward Networks & Optimization',
        syllabusTopics: ['Feedforward Networks', 'Vanishing & Exploding Gradients', 'Adam Optimizer', 'Dropout', 'Batch Normalization'],
        questions: [
          {
            id: 'dl-q1a',
            questionNumber: 'Q1.a',
            text: 'Explain the Vanishing and Exploding Gradient problems in deep neural networks. How do ReLU activation, He/Xavier weight initialization, and Residual skip connections mitigate them?',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Vanishing Gradient: During backprop through L layers, gradients multiply by ∂hl/∂hl-1. For Sigmoid, max derivative is 0.25; (0.25)^L → 0 exponentially for L ≥ 10.',
                '2. Exploding Gradient: When weights W > 1, repeated matrix multiplication causes gradient norms to grow exponentially (inf/NaN).',
                '3. Mitigations:\n   - ReLU: Gradient is constant 1.0 for z > 0, preventing derivative decay.\n   - He Normal Init: Var(W) = 2/nin, maintaining constant activation variance across layers.\n   - ResNet Skip Connections: Adds identity shortcut xl+1 = F(xl) + xl, enabling direct gradient highway ∂E/∂xl = ∂E/∂xl+1 (1 + ∂F/∂xl).'
              ],
              mathematicalDerivation: '∂E / ∂xl = (∂E / ∂xl+1) * (1 + ∂F / ∂xl)',
              examMarksTip: 'Explain mathematical cause with chain rule (4m), show ReLU & He initialization formulas (3m), explain ResNet gradient highway (3m).'
            }
          }
        ]
      },
      {
        moduleNumber: 2,
        moduleTitle: 'Module 2: Convolutional Neural Networks (CNNs)',
        syllabusTopics: ['Convolution Operation', 'Stride & Padding', 'Pooling', 'ResNet', 'Vision Transformers'],
        questions: [
          {
            id: 'dl-q3a',
            questionNumber: 'Q3.a',
            text: 'Calculate the output spatial dimensions and total parameter count for a Convolution layer given input size 224×224×3, 64 filters of size 7×7 with Stride s=2 and Padding p=3.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO2',
            detailedSolution: {
              steps: [
                '1. Formula for Output Dimension: O = ⌊(W - K + 2P) / S⌋ + 1',
                '2. Spatial Dimension: O = ⌊(224 - 7 + 2(3)) / 2⌋ + 1 = ⌊(224 - 7 + 6) / 2⌋ + 1 = ⌊223 / 2⌋ + 1 = 111 + 1 = 112. Output feature map is 112 × 112 × 64.',
                '3. Trainable Parameters: Each filter has (Kh × Kw × Cin + 1 bias) = (7 × 7 × 3 + 1) = 147 + 1 = 148 weights. Total parameters = 64 × 148 = 9,472.'
              ],
              mathematicalDerivation: 'O = ⌊ (W - K + 2P) / S ⌋ + 1 = 112,   Params = (7 * 7 * 3 + 1) * 64 = 9,472',
              examMarksTip: 'State dimension formula (2m), calculate 112×112 (4m), calculate total parameters 9,472 (4m).'
            }
          }
        ]
      },
      {
        moduleNumber: 3,
        moduleTitle: 'Module 3: Recurrent Neural Networks & Transformers',
        syllabusTopics: ['RNN Architecture', 'LSTM Cell Equations', 'Scaled Dot-Product Attention', 'Multi-Head Attention', 'Positional Encoding'],
        questions: [
          {
            id: 'dl-q5a',
            questionNumber: 'Q5.a',
            text: 'Explain the internal gating architecture of an LSTM cell with mathematical equations for Forget Gate, Input Gate, Candidate Memory, Cell State, and Output Gate.',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO3',
            detailedSolution: {
              steps: [
                '1. Forget Gate: ft = σ(Wf * [ht-1, xt] + bf) — decides what percentage of old cell state to discard.',
                '2. Input Gate: it = σ(Wi * [ht-1, xt] + bi) — decides which candidate values will be updated.',
                '3. Candidate State: C~t = tanh(Wc * [ht-1, xt] + bc) — creates new vector of candidate values.',
                '4. Cell State Update: Ct = ft * Ct-1 + it * C~t — linear constant error carousel preventing vanishing gradient.',
                '5. Output Gate & Hidden State: ot = σ(Wo * [ht-1, xt] + bo); ht = ot * tanh(Ct).'
              ],
              mathematicalDerivation: 'Ct = ft * Ct-1 + it * C~t',
              examMarksTip: 'Draw LSTM cell block diagram (3m), write all 6 governing equations (5m), explain why linear cell state prevents vanishing gradient (2m).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'vtu-21ai71-jan2024',
    subjectName: 'Natural Language Processing & LLMs',
    subjectCode: '21AI71',
    scheme: '2021 Scheme',
    semester: '7th Sem',
    branch: 'AI & ML (AIML)',
    examSession: 'January/February 2024',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'Statistical NLP, Word Embeddings, BERT & GPT Transformers, Low-Rank Adaptation (LoRA), and RAG Systems.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Word Embeddings & Language Modeling',
        syllabusTopics: ['N-Gram Models', 'Word2Vec CBOW', 'Skip-Gram', 'GloVe', 'Perplexity'],
        questions: [
          {
            id: 'nlp-q1a',
            questionNumber: 'Q1.a',
            text: 'Explain Continuous Bag of Words (CBOW) and Skip-Gram architectures in Word2Vec. Derive the objective function with Hierarchical Softmax / Negative Sampling.',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. CBOW: Predicts target word wt given context words (wt-c, ..., wt+c). Context embeddings are averaged and passed to output layer.',
                '2. Skip-Gram: Predicts surrounding context words given center word wt. Objective: Maximize log probability ∑ ∑ log P(wt+j|wt).',
                '3. Negative Sampling: Converts expensive softmax over entire vocabulary V into binary logistic regression with k noise samples: log σ(v\'wO^T vwI) + ∑ E [ log σ(-v\'wi^T vwI) ].'
              ],
              mathematicalDerivation: 'L_SGNS = log σ((v\'wO)^T vwI) + ∑ E [ log σ(-(v\'wi)^T vwI) ]',
              examMarksTip: 'Draw CBOW vs Skip-Gram network diagrams (3m), write objective functions (4m), derive Negative Sampling reduction from O(|V|) to O(k) (3m).'
            }
          }
        ]
      }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // BRANCH 2: COMPUTER SCIENCE & ENGINEERING (CSE)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'vtu-18cs71-jul2023',
    subjectName: 'Artificial Intelligence & Machine Learning (CSE)',
    subjectCode: '18CS71',
    scheme: '2018 Scheme',
    semester: '7th Sem',
    branch: 'Computer Science (CSE)',
    examSession: 'July/August 2023',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'AI problem formulations, Production systems, SVM, Decision trees, Genetic algorithms, and Reinforcement learning.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Introduction to AI & Search Techniques',
        syllabusTopics: ['Problem Formulation', 'Production Systems', 'Water Jug Problem', 'Heuristic Search', 'Hill Climbing'],
        questions: [
          {
            id: 'cs-q1a',
            questionNumber: 'Q1.a',
            text: 'Formulate the 4-Gallon and 3-Gallon Water Jug Problem with State Space, Production Rules, and find a sequence of steps to measure exactly 2 gallons in the 4-gallon jug.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. State Space: Ordered pair (x, y) where x ∈ {0,1,2,3,4} and y ∈ {0,1,2,3}. Initial state: (0,0), Goal state: (2, y).',
                '2. Production Rules: R1: Fill 4-gal, R2: Fill 3-gal, R3: Empty 4-gal, R4: Empty 3-gal, R5: Pour 3 to 4, R6: Pour 4 to 3.',
                '3. Solution Sequence: (0,0) → (0,3) → (3,0) → (3,3) → (4,2) → (0,2) → (2,0) (Goal reached!).'
              ],
              examMarksTip: 'Define State Space & Goal (2m), write all production rules (4m), show step-by-step state transition table (4m).'
            }
          }
        ]
      },
      {
        moduleNumber: 2,
        moduleTitle: 'Module 2: Support Vector Machines (SVM) & Kernel Methods',
        syllabusTopics: ['Maximum Margin Hyperplane', 'Lagrangian Multipliers', 'Soft Margin SVM', 'Kernel Trick'],
        questions: [
          {
            id: 'cs-q3a',
            questionNumber: 'Q3.a',
            text: 'Formulate the quadratic optimization problem for Maximum Margin Support Vector Machines (SVM). How does the Kernel Trick map non-linearly separable data into higher dimensions?',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO2',
            detailedSolution: {
              steps: [
                '1. Primal Formulation: Minimize (1/2)||w||^2 subject to yi(w^T xi + b) ≥ 1.',
                '2. Dual Formulation: Maximize LD(α) = ∑ αi - (1/2) ∑∑ αi αj yi yj (xi^T xj).',
                '3. Kernel Trick: Replace dot product xi^T xj with Kernel function K(xi, xj) = ⟨ϕ(xi), ϕ(xj)⟩.',
                '4. Common Kernels: RBF Gaussian K(x, z) = exp(-γ||x - z||^2), Polynomial K(x, z) = (x^T z + c)^d.'
              ],
              mathematicalDerivation: 'K(xi, xj) = exp( -γ ||xi - xj||^2 )',
              examMarksTip: 'State primal objective & constraints (3m), dual formulation (3m), kernel trick and Mercer condition with formulas (4m).'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'vtu-21cs63-jul2024',
    subjectName: 'Machine Learning & Applications (CSE)',
    subjectCode: '21CS63',
    scheme: '2021 Scheme',
    semester: '6th Sem',
    branch: 'Computer Science (CSE)',
    examSession: 'July/August 2024',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'Supervised classification, Regression, Ensemble techniques, Unsupervised clustering, and Reinforcement learning.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Ensemble Learning & Boosting',
        syllabusTopics: ['Ensemble Methods', 'Bagging', 'Random Forests', 'AdaBoost Algorithm', 'Gradient Boosting'],
        questions: [
          {
            id: 'cse-ens-q1a',
            questionNumber: 'Q1.a',
            text: 'Explain the AdaBoost algorithm step-by-step. Derive the sample weight update rule and the weak learner importance score αt.',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Initialize uniform weights: wi(1) = 1/N.',
                '2. For each round t: Train weak classifier ht(x) and compute weighted error εt.',
                '3. Calculate classifier weight: αt = (1/2) ln((1 - εt)/εt).',
                '4. Update sample weights: wi(t+1) = (wi(t) / Zt) * exp(-αt yi ht(xi)).',
                '5. Final Ensemble: H(x) = sign(∑ αt ht(x)).'
              ],
              mathematicalDerivation: 'αt = (1/2) ln((1 - εt) / εt),   wi(t+1) = (wi(t) / Zt) * exp(-αt yi ht(xi))',
              examMarksTip: 'State initialization (2m), calculate epsilon and alpha (4m), derive sample weight updates & normalization (4m).'
            }
          }
        ]
      }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // BRANCH 3: ARTIFICIAL INTELLIGENCE & DATA SCIENCE (AIDS)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'vtu-21ad53-jan2024',
    subjectName: 'Foundations of Data Science & Machine Learning',
    subjectCode: '21AD53',
    scheme: '2021 Scheme',
    semester: '5th Sem',
    branch: 'AI & Data Science (AIDS)',
    examSession: 'January/February 2024',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'Statistical inference, Linear models, Logistic regression, PCA, Feature engineering, and Clustering.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Dimensionality Reduction & PCA',
        syllabusTopics: ['Covariance Matrix', 'Eigenvalues & Eigenvectors', 'PCA Derivation', 'Singular Value Decomposition (SVD)', 't-SNE'],
        questions: [
          {
            id: 'ad-q1a',
            questionNumber: 'Q1.a',
            text: 'Derive Principal Component Analysis (PCA) by maximizing the variance of projected data. Explain how to compute principal components using Eigen decomposition of the Covariance Matrix.',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Given zero-mean dataset X, Covariance Matrix Σ = (1/N) X^T X.',
                '2. Projection on unit vector u: Variance of projected points is Var(Xu) = u^T Σ u.',
                '3. Optimization using Lagrange Multipliers: L(u, λ) = u^T Σ u - λ(u^T u - 1).',
                '4. Take derivative: ∂L/∂u = 2 Σ u - 2 λ u = 0 ⟹ Σ u = λ u.',
                '5. The direction of maximum variance is the eigenvector u1 corresponding to the largest eigenvalue λ1.'
              ],
              mathematicalDerivation: 'Σ u = λ u  ⟹  Var(Xu) = u^T Σ u = λ',
              examMarksTip: 'State zero-mean assumption and covariance formulation (2m), write Lagrangian objective (3m), derive eigenvalue equation (3m), explain variance interpretation (2m).'
            }
          }
        ]
      }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // BRANCH 4: INFORMATION SCIENCE & ENGINEERING (ISE)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'vtu-21is71-jul2023',
    subjectName: 'Artificial Intelligence & Machine Learning (ISE)',
    subjectCode: '21IS71',
    scheme: '2021 Scheme',
    semester: '7th Sem',
    branch: 'Information Science (ISE)',
    examSession: 'July/August 2023',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'Candidate Elimination, Neural networks, Bayesian learning, K-Means clustering, and Genetic algorithms.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Concept Learning & Candidate Elimination',
        syllabusTopics: ['Hypothesis Space', 'Find-S Algorithm', 'Candidate Elimination', 'Version Space', 'Inductive Bias'],
        questions: [
          {
            id: 'is-q1a',
            questionNumber: 'Q1.a',
            text: 'Explain the Candidate Elimination Algorithm. Trace the specific boundary S and general boundary G for a training dataset with 4 training examples.',
            marks: 10,
            bloomsLevel: 'L3: Apply',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Initialization: S0 = {most specific}, G0 = {most general}.',
                '2. Positive Sample: Generalize S to include positive example; remove inconsistent hypotheses from G.',
                '3. Negative Sample: Specialize G to exclude negative example; remove inconsistent hypotheses from S.',
                '4. Final Version Space: Represents all consistent hypotheses.'
              ],
              examMarksTip: 'Define S0 and G0 boundaries (2m), trace step-by-step positive/negative updates (5m), draw version space lattice (3m).'
            }
          }
        ]
      }
    ]
  },

  // ═════════════════════════════════════════════════════════════════════════════
  // BRANCH 5: ELECTRONICS & COMMUNICATION ENGINEERING (ECE)
  // ═════════════════════════════════════════════════════════════════════════════
  {
    id: 'vtu-21ec71-jul2024',
    subjectName: 'Neural Networks & Deep Learning (ECE)',
    subjectCode: '21EC71',
    scheme: '2021 Scheme',
    semester: '7th Sem',
    branch: 'Electronics & Communication (ECE)',
    examSession: 'July/August 2024',
    maxMarks: 100,
    duration: '3 Hours',
    syllabusOverview: 'Radial Basis Function (RBF) networks, CNNs for signal/audio processing, 1D CNNs for ECG, Edge TinyML, and Quantization.',
    modules: [
      {
        moduleNumber: 1,
        moduleTitle: 'Module 1: Radial Basis Function (RBF) Networks & Signal Classification',
        syllabusTopics: ['RBF Architecture', 'Gaussian Kernel', 'K-Means for RBF Centers', 'Pseudoinverse Matrix', 'ECG Signal Classification'],
        questions: [
          {
            id: 'ec-q1a',
            questionNumber: 'Q1.a',
            text: 'Explain the architecture and training methodology of Radial Basis Function (RBF) Networks. How are hidden layer centers and output weights determined analytically?',
            marks: 10,
            bloomsLevel: 'L4: Analyze',
            courseOutcome: 'CO1',
            detailedSolution: {
              steps: [
                '1. Architecture: Input layer, Hidden layer (Gaussian kernel activations ϕj(x) = exp(-||x - cj||^2 / 2σj^2)), Output layer (linear combiner y = ∑ wj ϕj(x)).',
                '2. Two-Stage Training: Stage 1 (Unsupervised): Determine centers cj via k-Means; Stage 2 (Supervised): Compute output weights W = (Φ^T Φ)^-1 Φ^T Y via Pseudoinverse.'
              ],
              mathematicalDerivation: 'W = (Φ^T Φ)^-1 Φ^T Y,   ϕj(x) = exp( - ||x - cj||^2 / 2σj^2 )',
              examMarksTip: 'Draw RBF 3-layer architecture (3m), Gaussian kernel formula (3m), Moore-Penrose Pseudoinverse closed-form derivation (4m).'
            }
          }
        ]
      }
    ]
  }
];

export async function getVTUQuestionPapers(filters?: {
  branch?: string;
  subjectCode?: string;
  scheme?: string;
  semester?: string;
  search?: string;
}): Promise<VTUQuestionPaper[]> {
  let list = [...VTU_QUESTION_PAPERS_DB];

  if (filters?.branch && filters.branch !== 'All') {
    list = list.filter((p) => p.branch.toLowerCase().includes(filters.branch!.toLowerCase()) || filters.branch === 'All');
  }

  if (filters?.subjectCode && filters.subjectCode !== 'All') {
    list = list.filter((p) => p.subjectCode.toLowerCase() === filters.subjectCode!.toLowerCase());
  }

  if (filters?.scheme && filters.scheme !== 'All') {
    list = list.filter((p) => p.scheme === filters.scheme);
  }

  if (filters?.semester && filters.semester !== 'All') {
    list = list.filter((p) => p.semester === filters.semester);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.subjectName.toLowerCase().includes(q) ||
        p.subjectCode.toLowerCase().includes(q) ||
        p.branch.toLowerCase().includes(q) ||
        p.examSession.toLowerCase().includes(q) ||
        p.modules.some((m) =>
          m.moduleTitle.toLowerCase().includes(q) ||
          m.questions.some((ques) => ques.text.toLowerCase().includes(q))
        )
    );
  }

  return list;
}

export async function getVTUPaperById(id: string): Promise<VTUQuestionPaper | null> {
  return VTU_QUESTION_PAPERS_DB.find((p) => p.id === id) || null;
}
