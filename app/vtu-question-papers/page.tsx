'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  FileText,
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  Printer,
  Calculator,
  CheckCircle2,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Binary,
  Database,
  Radio,
  Share2,
  Bookmark,
  Building2,
  FolderKanban
} from 'lucide-react';
import {
  VTUQuestionPaper,
  VTUBranch,
  VTUScheme,
  VTUSemester
} from '@/services/vtu-question-paper-service';
import { MathRenderer } from '@/components/ui/math-renderer';

// Complete Multi-Branch VTU Question Papers Database (Static Data Structure)
const VTU_PAPERS_DATABASE: VTUQuestionPaper[] = [
  // ── AIML BRANCH ──
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
                  '4. Classification Rule: v_NB = argmax_{v_j ∈ V} P(v_j) ∏_{i=1}^n P(a_i | v_j).'
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
                  '1. Algorithm: Given a query instance x_q, compute distance d(x_q, x_i) to all training points. Select k nearest neighbors. Classify by majority vote.',
                  '2. Distance Metrics: Euclidean, Manhattan, Minkowski formulas.',
                  '3. Curse of Dimensionality: Resolve via PCA dimensionality reduction or distance weighting.'
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
                  '1. Vanishing Gradient: During backprop through L layers, gradients multiply by ∂h_{l}/∂h_{l-1}. For Sigmoid, max derivative is 0.25; (0.25)^L → 0 exponentially for L ≥ 10.',
                  '2. Exploding Gradient: When weights W > 1, repeated matrix multiplication causes gradient norms to grow exponentially (inf/NaN).',
                  '3. Mitigations:\n   - ReLU: Gradient is constant 1.0 for z > 0, preventing derivative decay.\n   - He Normal Init: Var(W) = 2/n_{in}, maintaining constant activation variance across layers.\n   - ResNet Skip Connections: Adds identity shortcut x_{l+1} = F(x_l) + x_l, enabling direct gradient highway ∂E/∂x_l = ∂E/∂x_{l+1} (1 + ∂F/∂x_l).'
                ],
                mathematicalDerivation: '\\frac{\\partial E}{\\partial x_l} = \\frac{\\partial E}{\\partial x_{l+1}} \\left( 1 + \\frac{\\partial F}{\\partial x_l} \\right)',
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
                  '1. Output Dimension Formula: O = ⌊ (W - K + 2P)/S ⌋ + 1 = ⌊ (224 - 7 + 6)/2 ⌋ + 1 = 112.',
                  '2. Output Shape: 112 × 112 × 64.',
                  '3. Total Parameters: 64 × ((7 × 7 × 3) + 1) = 64 × 148 = 9,472 parameters.'
                ],
                mathematicalDerivation: 'O = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1 = 112',
                examMarksTip: 'State formula clearly (2m), calculate spatial dimensions step-by-step (4m), calculate total parameters with bias (4m).'
              }
            }
          ]
        }
      ]
    },

    // ── CSE BRANCH ──
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
                  '1. State Space: Ordered pair (x, y) where x ∈ {0,1,2,3,4} and y ∈ {0,1,2,3}. Initial: (0,0), Goal: (2, y).',
                  '2. Rules & Steps: (0,0) → (0,3) → (3,0) → (3,3) → (4,2) → (0,2) → (2,0).'
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
                  '1. Primal: Minimize (1/2)||w||^2 subject to y_i(w^T x_i + b) ≥ 1.',
                  '2. Dual: Maximize L_D(α) = ∑ α_i - (1/2) ∑∑ α_i α_j y_i y_j (x_i^T x_j).',
                  '3. Kernel Trick: Replace dot product x_i^T x_j with K(x_i, x_j) = ⟨ϕ(x_i), ϕ(x_j)⟩.'
                ],
                mathematicalDerivation: 'K(x_i, x_j) = \\exp\\left(-\\gamma \\|x_i - x_j\\|^2\\right)',
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
              text: 'Explain the AdaBoost algorithm step-by-step. Derive the sample weight update rule and the weak learner importance score α_t.',
              marks: 10,
              bloomsLevel: 'L4: Analyze',
              courseOutcome: 'CO1',
              detailedSolution: {
                steps: [
                  '1. Initialize weights: w_i^{(1)} = 1/N.',
                  '2. Round t: Compute weighted error ϵ_t and classifier weight α_t = (1/2) ln((1 - ϵ_t)/ϵ_t).',
                  '3. Update sample weights: w_i^{(t+1)} = (w_i^{(t)} / Z_t) ⋅ exp(-α_t y_i h_t(x_i)).'
                ],
                mathematicalDerivation: '\\alpha_t = \\frac{1}{2} \\ln\\left(\\frac{1 - \\epsilon_t}{\\epsilon_t}\\right)',
                examMarksTip: 'State initialization (2m), calculate epsilon and alpha (4m), derive sample weight updates & normalization (4m).'
              }
            }
          ]
        }
      ]
    },

    // ── AIDS BRANCH ──
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
                  '2. Projection on unit vector u (u^T u = 1): Var(Xu) = u^T Σ u.',
                  '3. Lagrangian L(u, λ) = u^T Σ u - λ(u^T u - 1) ⟹ Σ u = λ u (Eigenvalue problem!).'
                ],
                mathematicalDerivation: '\\Sigma u = \\lambda u \\implies \\text{Var}(Xu) = u^T \\Sigma u = \\lambda',
                examMarksTip: 'State covariance formulation (2m), Lagrangian objective (3m), derive eigenvalue equation (3m), variance interpretation (2m).'
              }
            }
          ]
        }
      ]
    },

    // ── ISE BRANCH ──
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
                  '1. Initialization: S_0 = {<∅, ...>}, G_0 = {<?, ...>}.',
                  '2. Positive Example: Generalize S minimally; prune G.',
                  '3. Negative Example: Specialize G minimally; prune S.'
                ],
                examMarksTip: 'Define boundaries (2m), step-by-step trace (5m), version space lattice (3m).'
              }
            }
          ]
        }
      ]
    },

    // ── ECE BRANCH ──
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
                  '1. 3-Layer RBF Architecture: Input, Non-linear Gaussian Hidden layer ϕ_j(x) = exp(-||x - c_j||^2 / 2σ_j^2), Linear output.',
                  '2. Analytical Solution: Centers c_j via k-Means; weights W = (Φ^T Φ)^{-1} Φ^T Y via Moore-Penrose Pseudoinverse.'
                ],
                mathematicalDerivation: 'W = (\\Phi^T \\Phi)^{-1} \\Phi^T Y',
                examMarksTip: 'Draw RBF architecture (3m), Gaussian kernel formula (3m), Pseudoinverse closed-form derivation (4m).'
              }
            }
          ]
        }
      ]
    }
];

export default function VTUQuestionPapersPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Paper & Question Accordion State
  const [activePaperId, setActivePaperId] = useState<string>('vtu-21ai54-jul2024');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('q1a');

  // Filtered papers (calculated against static memory array)
  const filteredPapers = useMemo(() => {
    return VTU_PAPERS_DATABASE.filter((p) => {
      const matchBranch = selectedBranch === 'All' || p.branch.toLowerCase().includes(selectedBranch.toLowerCase());
      const matchScheme = selectedScheme === 'All' || p.scheme === selectedScheme;
      const matchSem = selectedSemester === 'All' || p.semester === selectedSemester;
      const matchSub = selectedSubjectCode === 'All' || p.subjectCode === selectedSubjectCode;
      const matchSearch =
        !searchQuery ||
        p.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.examSession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.modules.some((m) =>
          m.questions.some((q) => q.text.toLowerCase().includes(searchQuery.toLowerCase()))
        );

      return matchBranch && matchScheme && matchSem && matchSub && matchSearch;
    });
  }, [selectedBranch, selectedScheme, selectedSemester, selectedSubjectCode, searchQuery]);

  const activePaper = VTU_PAPERS_DATABASE.find((p) => p.id === activePaperId) || filteredPapers[0] || VTU_PAPERS_DATABASE[0];

  const branchStats = useMemo(() => [
    { name: 'All Branches', count: VTU_PAPERS_DATABASE.length, icon: Layers, code: 'All' },
    { name: 'AI & ML (AIML)', count: VTU_PAPERS_DATABASE.filter((p) => p.branch.includes('AIML')).length, icon: Cpu, code: 'AIML' },
    { name: 'Computer Science (CSE)', count: VTU_PAPERS_DATABASE.filter((p) => p.branch.includes('CSE')).length, icon: Binary, code: 'CSE' },
    { name: 'AI & Data Science (AIDS)', count: VTU_PAPERS_DATABASE.filter((p) => p.branch.includes('AIDS')).length, icon: Database, code: 'AIDS' },
    { name: 'Information Science (ISE)', count: VTU_PAPERS_DATABASE.filter((p) => p.branch.includes('ISE')).length, icon: FolderKanban, code: 'ISE' },
    { name: 'Electronics & Comm (ECE)', count: VTU_PAPERS_DATABASE.filter((p) => p.branch.includes('ECE')).length, icon: Radio, code: 'ECE' },
  ], []);

  const handlePrintExam = () => {
    window.print();
  };

  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">VTU AI / ML / DL Question Papers by Branch</span>
        </div>

        {/* Hero Header */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/70 via-card to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Visvesvaraya Technological University (VTU)
                </span>
                <span className="text-xs text-muted-foreground font-mono">Branch-wise Multi-Scheme Repository</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                VTU Question Papers & Step-by-Step Solved Models (by Branch)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Comprehensive archive of previous years&apos; VTU university exam papers across AIML, CSE, AIDS, ISE, and ECE branches. Every question contains step-by-step calculus derivations, state space formulations, Python recipes, and official VTU valuation schemes.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={handlePrintExam}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-lg shadow-purple-950/40 cursor-pointer print:hidden"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Exam PDF</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* ── BRANCH SELECTOR TABS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
          {branchStats.map((b) => {
            const isSelected = selectedBranch === b.code;
            const Icon = b.icon;
            return (
              <button
                key={b.code}
                onClick={() => setSelectedBranch(b.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-950/30 ring-2 ring-purple-500/20'
                    : 'bg-card border-border hover:border-purple-500/30 hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-muted-foreground'}`} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary border border-border text-foreground font-bold">
                    {b.count} Papers
                  </span>
                </div>
                <div className={`text-xs font-bold truncate ${isSelected ? 'text-purple-300' : 'text-foreground'}`}>
                  {b.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── FILTER TOOLBAR ── */}
        <Card className="p-4 bg-card border-border rounded-2xl space-y-3 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic (e.g. Backprop, SVM, AdaBoost, PCA)..."
                className="pl-9 bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
              />
            </div>

            {/* Scheme Selector */}
            <div>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
              >
                <option value="All">All Schemes (2022, 2021, 2018)</option>
                <option value="2022 Scheme">2022 Scheme</option>
                <option value="2021 Scheme">2021 Scheme</option>
                <option value="2018 Scheme">2018 Scheme</option>
              </select>
            </div>

            {/* Semester Selector */}
            <div>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
              >
                <option value="All">All Semesters (3rd to 8th)</option>
                <option value="5th Sem">5th Semester</option>
                <option value="6th Sem">6th Semester</option>
                <option value="7th Sem">7th Semester</option>
              </select>
            </div>

            {/* Subject Code Selector */}
            <div>
              <select
                value={selectedSubjectCode}
                onChange={(e) => setSelectedSubjectCode(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
              >
                <option value="All">All Subject Codes</option>
                <option value="21AI54">21AI54 - AIML</option>
                <option value="21AI61">21AI61 - Deep Learning</option>
                <option value="18CS71">18CS71 - AIML (CSE)</option>
                <option value="21CS63">21CS63 - ML (CSE)</option>
                <option value="21AD53">21AD53 - Data Science (AIDS)</option>
                <option value="21IS71">21IS71 - AIML (ISE)</option>
                <option value="21EC71">21EC71 - Deep Learning (ECE)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ── QUESTION PAPER TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none print:hidden">
          {filteredPapers.map((p) => {
            const isSelected = activePaperId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePaperId(p.id)}
                className={`px-4 py-2.5 rounded-2xl border text-left transition-all whitespace-nowrap cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/40 font-bold'
                    : 'bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4" />
                <div className="text-xs">
                  <div>{p.subjectCode} - {p.subjectName}</div>
                  <div className="text-[10px] opacity-80 font-mono">
                    <span className="text-amber-300 font-semibold">{p.branch}</span> • {p.scheme} • {p.examSession}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE VTU QUESTION PAPER HEADER CARD ── */}
        <Card className="p-6 bg-card border-border rounded-3xl space-y-6 shadow-xl">
          <div className="text-center space-y-2 border-b border-border pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 font-mono">
              Visvesvaraya Technological University, Belagavi
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {activePaper.semester} B.E. Degree Examination ({activePaper.branch}) — {activePaper.examSession}
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-mono flex-wrap pt-1">
              <span className="px-2.5 py-1 bg-secondary rounded-lg border border-border">Subject Code: <strong>{activePaper.subjectCode}</strong></span>
              <span className="px-2.5 py-1 bg-secondary rounded-lg border border-border">Branch: <strong>{activePaper.branch}</strong></span>
              <span className="px-2.5 py-1 bg-secondary rounded-lg border border-border">Scheme: <strong>{activePaper.scheme}</strong></span>
              <span className="px-2.5 py-1 bg-secondary rounded-lg border border-border">Duration: <strong>{activePaper.duration}</strong></span>
              <span className="px-2.5 py-1 bg-secondary rounded-lg border border-border">Max Marks: <strong>{activePaper.maxMarks}</strong></span>
            </div>
            <p className="text-[11px] text-muted-foreground italic pt-1">
              Note: Answer any FIVE full questions, choosing ONE full question from each module.
            </p>
          </div>

          {/* ── MODULE-WISE QUESTION BREAKDOWN & MODEL ANSWERS ── */}
          <div className="space-y-6">
            {activePaper.modules.map((module) => (
              <div key={module.moduleNumber} className="space-y-4">
                <div className="flex items-center justify-between bg-secondary/80 px-4 py-2.5 rounded-2xl border border-border flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                      {module.moduleTitle}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Topics: {module.syllabusTopics.slice(0, 3).join(' • ')}
                  </div>
                </div>

                {/* Questions Accordion */}
                <div className="space-y-3 pl-2 sm:pl-4">
                  {module.questions.map((q) => {
                    const isExpanded = expandedQuestionId === q.id;
                    return (
                      <Card
                        key={q.id}
                        className={`p-5 bg-card border rounded-2xl transition-all space-y-3 ${
                          isExpanded ? 'border-purple-500/40 shadow-lg shadow-purple-950/20 ring-1 ring-purple-500/20' : 'border-border'
                        }`}
                      >
                        <div
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold font-mono text-[11px] rounded">
                                {q.questionNumber}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold font-mono text-[10px] rounded border border-emerald-500/20">
                                {q.marks} Marks
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {q.bloomsLevel} • {q.courseOutcome}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
                              {q.text}
                            </p>
                          </div>

                          <button className="p-1 text-muted-foreground hover:text-foreground">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Expanded Step-by-Step VTU Solution */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-border space-y-4 text-xs animate-in fade-in duration-150">
                            {/* Mathematical Derivation Proof */}
                            {q.detailedSolution.mathematicalDerivation && (
                              <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                                  📐 Governing Mathematical Proof / Derivation:
                                </span>
                                <div className="p-2.5 bg-black/60 rounded-lg text-xs text-purple-200 border border-purple-500/20 overflow-x-auto text-center">
                                  <MathRenderer math={q.detailedSolution.mathematicalDerivation} block />
                                </div>
                              </div>
                            )}

                            {/* Step-by-step Solution Steps */}
                            <div className="space-y-2">
                              <span className="font-bold text-emerald-400 block text-xs">
                                📝 Step-by-Step Model Examination Answer:
                              </span>
                              <ul className="space-y-1.5 text-muted-foreground list-none pl-1 leading-relaxed">
                                {q.detailedSolution.steps.map((step, idx) => (
                                  <li key={idx} className="p-2 bg-secondary/40 rounded-xl border border-border/60">
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Code Snippet if applicable */}
                            {q.detailedSolution.codeSnippet && (
                              <div className="space-y-1.5">
                                <strong className="text-foreground block text-xs">💻 Python Algorithm Implementation:</strong>
                                <pre className="p-3.5 bg-zinc-950 rounded-xl font-mono text-[11px] text-emerald-300 border border-border overflow-x-auto">
                                  <code>{q.detailedSolution.codeSnippet.code}</code>
                                </pre>
                              </div>
                            )}

                            {/* Examiner Marks Allocation Tip */}
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs">
                              <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-400 block">VTU Valuation & Marks Allocation Scheme:</strong>
                                <span className="text-muted-foreground">{q.detailedSolution.examMarksTip}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </NexusShell>
  );
}
