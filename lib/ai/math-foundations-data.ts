export type MathCategory = 'linear-algebra' | 'calculus' | 'probability' | 'optimization';

export interface MathFormulaItem {
  id: string;
  title: string;
  category: MathCategory;
  level: 'Foundation (11-12th)' | 'Undergraduate' | 'Advanced / Research';
  latexFormula: string;
  plainDescription: string;
  intuition: string;
  whereUsedInAI: string;
  codeSnippet: string;
  keyVariables: { symbol: string; meaning: string }[];
}

export const MATH_CATEGORIES: { id: MathCategory; label: string; icon: string; count: number; description: string }[] = [
  {
    id: 'linear-algebra',
    label: 'Linear Algebra & Tensors',
    icon: 'Grid3X3',
    count: 6,
    description: 'Vectors, matrix multiplications, dot products, eigenvalues, and SVD powering neural transformations and embeddings.',
  },
  {
    id: 'calculus',
    label: 'Multivariable Calculus & Backprop',
    icon: 'Activity',
    count: 6,
    description: 'Partial derivatives, gradients, Jacobian & Hessian matrices, and the chain rule driving reverse-mode autodiff.',
  },
  {
    id: 'probability',
    label: 'Probability & Information Theory',
    icon: 'PieChart',
    count: 6,
    description: 'Bayesian inference, Gaussian distributions, maximum likelihood estimation, KL divergence, and cross-entropy loss.',
  },
  {
    id: 'optimization',
    label: 'Optimization Theory & Schedulers',
    icon: 'TrendingDown',
    count: 6,
    description: 'Convex landscapes, stochastic gradient descent, momentum, RMSprop, AdamW, and learning rate warmups.',
  },
];

export const MATH_FORMULAS: MathFormulaItem[] = [
  // ── 1. LINEAR ALGEBRA ──
  {
    id: 'la-1',
    title: 'Vector Dot Product & Cosine Similarity',
    category: 'linear-algebra',
    level: 'Foundation (11-12th)',
    latexFormula: 'u \\cdot v = \\sum_{i=1}^n u_i v_i = \\|u\\| \\|v\\| \\cos(\\theta) \\implies \\text{CosineSim}(u, v) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}',
    plainDescription: 'Measures the directional alignment and geometric projection between two multidimensional feature vectors.',
    intuition: 'If two embedding vectors point in the exact same direction, cosine similarity is 1.0 (100% semantic match); if orthogonal, it is 0.0.',
    whereUsedInAI: 'Vector Database semantic retrieval (RAG), LLM text embeddings similarity search, and Transformer Attention Score matrices.',
    codeSnippet: `import numpy as np

def cosine_similarity(u: np.ndarray, v: np.ndarray) -> float:
    dot_product = np.dot(u, v)
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)
    return dot_product / (norm_u * norm_v + 1e-9)

# Example: Embeddings for "King" and "Queen"
vec_king = np.array([0.82, 0.15, 0.94])
vec_queen = np.array([0.79, 0.18, 0.91])
print(f"Similarity: {cosine_similarity(vec_king, vec_queen):.4f}")`,
    keyVariables: [
      { symbol: 'u, v', meaning: 'High-dimensional feature vectors (e.g. 1536-dim OpenAI or 768-dim BERT embeddings)' },
      { symbol: '||u||', meaning: 'Euclidean L2 norm (magnitude length of vector u)' },
      { symbol: 'θ', meaning: 'Angle between the two vectors in vector space' },
    ],
  },
  {
    id: 'la-2',
    title: 'Matrix-Vector Affine Layer Transformation',
    category: 'linear-algebra',
    level: 'Undergraduate',
    latexFormula: 'Z = W X + b \\quad \\text{where } W \\in \\mathbb{R}^{d_{out} \\times d_{in}}, X \\in \\mathbb{R}^{d_{in} \\times B}, b \\in \\mathbb{R}^{d_{out} \\times 1}',
    plainDescription: 'The fundamental building block of every Artificial Neural Network (Dense / Linear layer).',
    intuition: 'Matrix W rotates, shears, and stretches the input coordinate space X, while bias vector b shifts the origin.',
    whereUsedInAI: 'Multi-Layer Perceptrons (MLPs), Feed-Forward Networks (FFN) inside Transformers, and Convolutional Linear projections.',
    codeSnippet: `import torch
import torch.nn as nn

# Linear Layer with weight matrix W (4x3) and bias b (4x1)
linear_layer = nn.Linear(in_features=3, out_features=4, bias=True)
input_tensor = torch.tensor([[1.0, 2.0, 3.0]]) # Batch size 1, 3 features
output = linear_layer(input_tensor) # Z = WX + b
print("Output Tensor:", output)`,
    keyVariables: [
      { symbol: 'W', meaning: 'Weight matrix learned during gradient descent optimization' },
      { symbol: 'X', meaning: 'Input feature matrix or batch activations' },
      { symbol: 'b', meaning: 'Learnable bias vector' },
      { symbol: 'Z', meaning: 'Pre-activation linear logits' },
    ],
  },
  {
    id: 'la-3',
    title: 'Singular Value Decomposition (SVD)',
    category: 'linear-algebra',
    level: 'Advanced / Research',
    latexFormula: 'A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i u_i v_i^T',
    plainDescription: 'Factorizes any real matrix into left-singular vectors U, singular values Σ, and right-singular vectors V^T.',
    intuition: 'Identifies the most dominant directional axes of variation in high-dimensional data, allowing massive rank reduction with minimal data loss.',
    whereUsedInAI: 'Principal Component Analysis (PCA), Low-Rank Adaptation (LoRA fine-tuning for LLMs), and Latent Semantic Analysis (LSA).',
    codeSnippet: `import numpy as np

# Rank-3 Matrix factorized via SVD
A = np.random.randn(5, 4)
U, S, Vt = np.linalg.svd(A, full_matrices=False)

# Low-Rank Approximation (rank-2)
A_rank2 = np.dot(U[:, :2] * S[:2], Vt[:2, :])
print("Original Shape:", A.shape, "Approximation Rank:", np.linalg.matrix_rank(A_rank2))`,
    keyVariables: [
      { symbol: 'U', meaning: 'Orthogonal matrix of left singular vectors' },
      { symbol: 'Σ', meaning: 'Diagonal matrix containing singular values sorted in descending order' },
      { symbol: 'V^T', meaning: 'Orthogonal matrix of right singular vectors transpose' },
    ],
  },
  {
    id: 'la-4',
    title: 'Transformer Scaled Dot-Product Attention',
    category: 'linear-algebra',
    level: 'Advanced / Research',
    latexFormula: '\\text{Attention}(Q, K, V) = \\text{Softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
    plainDescription: 'Computes contextual dynamic attention weights across token sequences via query-key dot products.',
    intuition: 'Every token queries all other tokens (Q · K^T); dividing by √d_k prevents softmax gradients from vanishing into flat saturation regions.',
    whereUsedInAI: 'Core mechanism of GPT-4, Llama 3, Claude 3.5, Mistral, BERT, and Vision Transformers (ViT).',
    codeSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, V), attention_weights`,
    keyVariables: [
      { symbol: 'Q, K, V', meaning: 'Query, Key, and Value projected embedding matrices' },
      { symbol: 'd_k', meaning: 'Dimension of the key vectors (e.g. 64 or 128 per attention head)' },
      { symbol: 'Softmax', meaning: 'Normalizes attention scores into probabilities summing to 1.0' },
    ],
  },

  // ── 2. MULTIVARIABLE CALCULUS & BACKPROPAGATION ──
  {
    id: 'calc-1',
    title: 'Gradient Vector & Directional Derivative',
    category: 'calculus',
    level: 'Foundation (11-12th)',
    latexFormula: '\\nabla f(x) = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T',
    plainDescription: 'The vector of all first-order partial derivatives representing the direction of steepest ascent of a scalar function.',
    intuition: 'If you stand on a hilly loss landscape in the dark, the negative gradient -∇f(x) points directly down into the steepest descent valley.',
    whereUsedInAI: 'Core of all neural network training loops, calculating parameter update steps during optimization.',
    codeSnippet: `import torch

# Define scalar function f(x, y) = x^2 + 3*y^2 - 4*x
x = torch.tensor(3.0, requires_grad=True)
y = torch.tensor(2.0, requires_grad=True)

f = x**2 + 3*(y**2) - 4*x
f.backward()

print(f"Gradient df/dx (Expected 2*3 - 4 = 2): {x.grad.item()}")
print(f"Gradient df/dy (Expected 6*2 = 12): {y.grad.item()}")`,
    keyVariables: [
      { symbol: '∇f', meaning: 'Nabla / Del gradient operator' },
      { symbol: '∂f/∂x_i', meaning: 'Rate of change of output f with respect to parameter x_i holding others constant' },
    ],
  },
  {
    id: 'calc-2',
    title: 'Vectorized Chain Rule for Backpropagation',
    category: 'calculus',
    level: 'Undergraduate',
    latexFormula: '\\frac{\\partial L}{\\partial W^{[l]}} = \\frac{1}{m} \\left( \\frac{\\partial L}{\\partial Z^{[l]}} \\right) \\left( A^{[l-1]} \\right)^T',
    plainDescription: 'Calculates the exact gradient of the loss function with respect to layer weights in reverse topological order.',
    intuition: 'Backpropagates the error backwards layer-by-layer by repeatedly multiplying local partial derivatives.',
    whereUsedInAI: 'PyTorch Autograd engine, TensorFlow computational graphs, and reverse-mode automatic differentiation.',
    codeSnippet: `import numpy as np

# Forward pass activations
A_prev = np.array([[0.5, 0.8], [0.2, 0.9]]) # (2, 2)
dZ = np.array([[0.01, -0.04], [0.03, -0.02]]) # (2, 2)

# Vectorized backprop weight gradient
dW = np.dot(dZ, A_prev.T) / A_prev.shape[1]
print("Weight Gradient Matrix dW:\\n", dW)`,
    keyVariables: [
      { symbol: 'L', meaning: 'Scalar loss value (e.g. Cross-Entropy or MSE)' },
      { symbol: 'Z^[l]', meaning: 'Pre-activation linear combination at layer l' },
      { symbol: 'A^[l-1]', meaning: 'Post-activation outputs from the previous layer' },
    ],
  },
  {
    id: 'calc-3',
    title: 'Jacobian & Hessian Curvature Matrices',
    category: 'calculus',
    level: 'Advanced / Research',
    latexFormula: 'J = \\begin{bmatrix} \\frac{\\partial f_i}{\\partial x_j} \\end{bmatrix}, \\quad H = \\begin{bmatrix} \\frac{\\partial^2 f}{\\partial x_i \\partial x_j} \\end{bmatrix}',
    plainDescription: 'Jacobian holds first derivatives of vector-valued functions; Hessian holds second-order partial derivatives measuring surface curvature.',
    intuition: 'The Hessian tells you whether a critical point is a local minimum, maximum, or saddle point, and detects loss landscape valleys.',
    whereUsedInAI: 'Second-order optimization (L-BFGS, Newton-Raphson), Sharpness-Aware Minimization (SAM), and GAN stability analysis.',
    codeSnippet: `import torch
from torch.autograd.functional import hessian

def loss_fn(w):
    return w[0]**4 + 2*(w[1]**2) - w[0]*w[1]

w = torch.tensor([1.0, 2.0])
H = hessian(loss_fn, w)
print("Hessian 2nd Order Curvature Matrix:\\n", H)`,
    keyVariables: [
      { symbol: 'J', meaning: 'Jacobian matrix of first-order partials (m x n)' },
      { symbol: 'H', meaning: 'Hessian square matrix of second-order partials (n x n)' },
    ],
  },

  // ── 3. PROBABILITY & INFORMATION THEORY ──
  {
    id: 'prob-1',
    title: "Bayes' Theorem & Posterior Estimation",
    category: 'probability',
    level: 'Foundation (11-12th)',
    latexFormula: 'P(\\theta | X) = \\frac{P(X | \\theta) P(\\theta)}{P(X)} = \\frac{P(X | \\theta) P(\\theta)}{\\int P(X | \\theta\') P(\\theta\') d\\theta\'}',
    plainDescription: 'Updates our degree of belief in hypothesis θ after observing empirical evidence X.',
    intuition: 'Posterior = (Likelihood × Prior) / Marginal Evidence. Essential for decision making under uncertainty.',
    whereUsedInAI: 'Bayesian Neural Networks, Naive Bayes Classifiers, Bayesian Hyperparameter Optimization (Optuna), and Kalman Filters.',
    codeSnippet: `def bayes_theorem(prior_spam: float, p_word_given_spam: float, p_word_given_ham: float) -> float:
    p_ham = 1.0 - prior_spam
    p_word = (p_word_given_spam * prior_spam) + (p_word_given_ham * p_ham)
    posterior_spam = (p_word_given_spam * prior_spam) / p_word
    return posterior_spam

prob = bayes_theorem(prior_spam=0.1, p_word_given_spam=0.85, p_word_given_ham=0.05)
print(f"Probability email is spam given keyword: {prob*100:.2f}%")`,
    keyVariables: [
      { symbol: 'P(θ | X)', meaning: 'Posterior probability of model parameters given observed dataset' },
      { symbol: 'P(X | θ)', meaning: 'Likelihood of data given parameters' },
      { symbol: 'P(θ)', meaning: 'Prior probability belief before seeing data' },
    ],
  },
  {
    id: 'prob-2',
    title: 'Categorical Cross-Entropy Loss',
    category: 'probability',
    level: 'Undergraduate',
    latexFormula: 'L_{\\text{CE}} = -\\sum_{c=1}^C y_c \\log(\\hat{y}_c) = -\\log(\\hat{y}_{\\text{true}})',
    plainDescription: 'Measures the dissimilarity between true one-hot probability distribution y and predicted model softmax distribution y_hat.',
    intuition: 'Penalizes confident incorrect predictions exponentially. If target is class 1 and model predicts 0.01, loss is -ln(0.01) = 4.60.',
    whereUsedInAI: 'Default loss function for LLM Next-Token Prediction, Image Classification (ImageNet), and Multi-Class Object Detection.',
    codeSnippet: `import numpy as np

def cross_entropy_loss(y_true_one_hot, y_pred_probs):
    eps = 1e-15 # Avoid log(0)
    y_pred_probs = np.clip(y_pred_probs, eps, 1 - eps)
    return -np.sum(y_true_one_hot * np.log(y_pred_probs))

true_label = np.array([0, 1, 0]) # Class 2
pred_probs = np.array([0.05, 0.90, 0.05])
print(f"Cross-Entropy Loss: {cross_entropy_loss(true_label, pred_probs):.4f}")`,
    keyVariables: [
      { symbol: 'y_c', meaning: 'Ground-truth binary indicator (1 if class c is correct, 0 otherwise)' },
      { symbol: 'y_hat_c', meaning: 'Softmax probability score assigned by the model to class c' },
      { symbol: 'C', meaning: 'Total number of vocabulary tokens or target classes' },
    ],
  },
  {
    id: 'prob-3',
    title: 'Kullback-Leibler (KL) Divergence',
    category: 'probability',
    level: 'Advanced / Research',
    latexFormula: 'D_{\\text{KL}}(P \\parallel Q) = \\sum_{x \\in \\mathcal{X}} P(x) \\log\\left( \\frac{P(x)}{Q(x)} \\right) = \\mathbb{E}_{x \\sim P} \\left[ \\log P(x) - \\log Q(x) \\right]',
    plainDescription: 'Asymmetric measure of the information lost when approximating probability distribution P with distribution Q.',
    intuition: 'D_KL is always >= 0 (Gibbs inequality) and equals 0 if and only if P and Q are identical.',
    whereUsedInAI: 'Variational Autoencoders (VAE latent loss), Reinforcement Learning from Human Feedback (RLHF / PPO reference model penalty), and Knowledge Distillation.',
    codeSnippet: `import torch
import torch.nn.functional as F

# Two probability distributions
P = torch.tensor([0.4, 0.35, 0.25])
Q = torch.tensor([0.33, 0.33, 0.34])

kl_div = F.kl_div(Q.log(), P, reduction='batchmean')
print(f"KL Divergence D_KL(P || Q): {kl_div.item():.5f}")`,
    keyVariables: [
      { symbol: 'P(x)', meaning: 'True target reference distribution' },
      { symbol: 'Q(x)', meaning: 'Model predicted or approximate distribution' },
      { symbol: 'D_KL', meaning: 'Relative entropy measured in nats or bits' },
    ],
  },

  // ── 4. OPTIMIZATION THEORY & SCHEDULERS ──
  {
    id: 'opt-1',
    title: 'Stochastic Gradient Descent (SGD) with Momentum',
    category: 'optimization',
    level: 'Foundation (11-12th)',
    latexFormula: 'v_t = \\beta v_{t-1} + \\eta \\nabla L(\\theta_t), \\quad \\theta_{t+1} = \\theta_t - v_t',
    plainDescription: 'Accelerates gradient descent in the relevant direction while dampening oscillations along ravines.',
    intuition: 'Imagine a heavy rolling bowling ball rolling down a valley: accumulated velocity pushes it through small local bumps and saddle points.',
    whereUsedInAI: 'Standard baseline optimizer for Computer Vision (ResNets, YOLOv11) and foundational neural networks.',
    codeSnippet: `import torch.optim as optim
import torch.nn as nn

model = nn.Linear(10, 2)
# SGD with momentum coefficient 0.9 and weight decay
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4)`,
    keyVariables: [
      { symbol: 'v_t', meaning: 'Accumulated velocity vector at timestep t' },
      { symbol: 'β', meaning: 'Momentum decay constant (typically 0.9 or 0.99)' },
      { symbol: 'η', meaning: 'Learning rate step size' },
      { symbol: 'θ', meaning: 'Model parameter weights' },
    ],
  },
  {
    id: 'opt-2',
    title: 'AdamW (Adaptive Moment Estimation with Decoupled Weight Decay)',
    category: 'optimization',
    level: 'Undergraduate',
    latexFormula: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\; v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2, \\; \\theta_{t+1} = \\theta_t - \\eta \\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda \\theta_t \\right)',
    plainDescription: 'Combines first moment (mean gradient) and second moment (uncentered variance) with decoupled L2 weight decay regularization.',
    intuition: 'Adapts the learning rate individually for every single parameter: frequent features get smaller updates, rare features get larger updates.',
    whereUsedInAI: 'De-facto industry standard optimizer for training all modern Large Language Models (LLMs) including LLaMA, GPT, Mistral, and Claude.',
    codeSnippet: `import torch.optim as optim

# AdamW with standard decoupled weight decay
optimizer = optim.AdamW(
    model.parameters(),
    lr=3e-4,
    betas=(0.9, 0.999),
    eps=1e-8,
    weight_decay=0.01
)`,
    keyVariables: [
      { symbol: 'm_t', meaning: 'First moment estimate (exponentially decaying average of past gradients)' },
      { symbol: 'v_t', meaning: 'Second moment estimate (exponentially decaying average of squared gradients)' },
      { symbol: 'λ', meaning: 'Decoupled weight decay coefficient preventing parameter blowup' },
      { symbol: 'ε', meaning: 'Small constant (1e-8) preventing division by zero' },
    ],
  },
  {
    id: 'opt-3',
    title: 'Cosine Annealing Learning Rate with Warmup',
    category: 'optimization',
    level: 'Advanced / Research',
    latexFormula: '\\eta_t = \\eta_{\\min} + \\frac{1}{2} (\\eta_{\\max} - \\eta_{\\min}) \\left( 1 + \\cos\\left( \\frac{t - T_{\\text{warm}}}{T_{\\max} - T_{\\text{warm}}} \\pi \\right) \\right)',
    plainDescription: 'Linearly warms up learning rate from 0 to η_max, then smoothly decays following a half-cosine curve down to η_min.',
    intuition: 'Warmup stabilizes early noisy gradient estimates; cosine annealing allows fine exploration of flat, generalizing minima at the end of training.',
    whereUsedInAI: 'Pre-training schedules for Chinchilla, Llama-3, DeepSeek-V3, and Gemma architectures.',
    codeSnippet: `from torch.optim.lr_scheduler import CosineAnnealingLR

# Decays learning rate smoothly to 1e-6 over 100,000 steps
scheduler = CosineAnnealingLR(optimizer, T_max=100000, eta_min=1e-6)`,
    keyVariables: [
      { symbol: 'η_t', meaning: 'Current learning rate at training step t' },
      { symbol: 'T_warm', meaning: 'Number of warmup steps (typically 1-5% of total training steps)' },
      { symbol: 'T_max', meaning: 'Total planned training steps / budget' },
    ],
  },
];
