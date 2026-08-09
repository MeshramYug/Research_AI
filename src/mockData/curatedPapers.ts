import { Paper } from '../types/research';

export const CURATED_PAPERS: Paper[] = [
  {
    id: 'paper-attention-2017',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    publishedDate: '2017-06-12',
    journalOrConference: 'NeurIPS 2017',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    url: 'https://arxiv.org/abs/1706.03762',
    pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
    citationsCount: 128450,
    categories: ['cs.CL', 'cs.LG', 'Artificial Intelligence', 'Transformers'],
    source: 'curated',
    recommendationScore: 99,
    recommendationReason: 'Foundational baseline paper for all modern Large Language Models and Vision Transformers.',
    isBookmarked: true,
    analysis: {
      executiveSummary: 'This landmark paper replaces recurrent neural networks (RNNs/LSTMs) with a pure self-attention mechanism, establishing the Transformer architecture which serves as the backbone of modern LLMs (GPT, Llama, Gemini, DeepSeek).',
      noveltyAndContributions: [
        'Introduced Scaled Dot-Product Attention & Multi-Head Self-Attention.',
        'Eliminated sequential recurrence, allowing massively parallelized training on GPUs.',
        'Proposed Sinusoidal Positional Encodings to preserve token sequence order without recurrence.',
        'Achieved state-of-the-art BLEU score on WMT 2014 English-to-German (28.4 BLEU) with 10x faster training.'
      ],
      methodologyBreakdown: 'The model employs an Encoder-Decoder structure. Each layer consists of a Multi-Head Attention sub-layer followed by a position-wise Feed-Forward Network (FFN), with residual connections and Layer Normalization around each.',
      keyMetricsAndResults: [
        { metricName: 'BLEU Score (EN-DE)', value: '28.4 BLEU', benchmark: 'State-of-the-Art (2017)' },
        { metricName: 'BLEU Score (EN-FR)', value: '41.8 BLEU', benchmark: 'State-of-the-Art (2017)' },
        { metricName: 'Training FLOPs', value: '3.3 × 10^18', benchmark: '10x less than ByteNet / ConvS2S' }
      ],
      equationsOrFormulas: [
        {
          name: 'Scaled Dot-Product Attention',
          latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
          description: 'Calculates affinity between Query (Q) and Key (K) vectors scaled by key dimension sqrt(d_k), then multiplies by Values (V).'
        },
        {
          name: 'Multi-Head Attention',
          latex: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h)W^O',
          description: 'Allows the model to jointly attend to information from different representation subspaces at different positions.'
        }
      ],
      limitations: [
        'Quadratic compute and memory complexity O(N^2) with respect to input sequence length N.',
        'Lacks inductive bias for spatial/temporal locality compared to CNNs/RNNs, requiring huge training datasets.'
      ],
      futureResearchDirections: [
        'Efficient Linear/Sparse Attention (FlashAttention, Reformer, Linformer).',
        'State Space Models (Mamba, RWKV) to reduce O(N^2) memory footprint.',
        'Long-context window expansion (Rope, YaRN, Sliding Window Attention).'
      ],
      codeUrl: 'https://github.com/tensorflow/tensor2tensor',
      datasetUrl: 'https://www.statmt.org/wmt14/translation-task.html'
    }
  },
  {
    id: 'paper-deepseek-r1-2025',
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: ['DeepSeek-AI Team', 'Daya Guo', 'Dejian Yang', 'Haowei Zhang', 'Junxiao Song', 'Ruoyu Zhang'],
    publishedDate: '2025-01-22',
    journalOrConference: 'arXiv Preprint 2025',
    abstract: 'We introduce DeepSeek-R1-Zero and DeepSeek-R1. DeepSeek-R1-Zero is trained via pure Reinforcement Learning (RL) without supervised fine-tuning (SFT) as a baseline, demonstrating reasoning abilities like chain-of-thought and self-correction naturally emerging.',
    url: 'https://arxiv.org/abs/2501.12948',
    pdfUrl: 'https://arxiv.org/pdf/2501.12948.pdf',
    citationsCount: 1420,
    categories: ['cs.CL', 'cs.AI', 'Reasoning', 'Reinforcement Learning'],
    source: 'curated',
    recommendationScore: 98,
    recommendationReason: 'State-of-the-art open reasoning model demonstrating emergent self-reflection via pure RL.',
    isBookmarked: true,
    analysis: {
      executiveSummary: 'DeepSeek-R1 presents a breakthrough in LLM reasoning capability by showing that complex multi-step reasoning, verification, and self-correction can emerge purely through Group Relative Policy Optimization (GRPO) reinforcement learning.',
      noveltyAndContributions: [
        'Pioneered DeepSeek-R1-Zero: Pure RL training without prior human SFT data.',
        'Developed Group Relative Policy Optimization (GRPO) eliminating the need for a separate critic model.',
        'Introduced cold-start data generation pipeline to fix readability issues in pure RL reasoning traces.',
        'Distilled reasoning capabilities into smaller models (1.5B to 70B parameters) outperforming GPT-4o-mini.'
      ],
      methodologyBreakdown: 'Uses Mixture-of-Experts (MoE) architecture with GRPO training where rewards are computed strictly from rule-based accuracy (correct answer verification) and format compliance.',
      keyMetricsAndResults: [
        { metricName: 'AIME 2024 (Math)', value: '79.8% Pass@1', benchmark: 'Matches OpenAI o1-mini' },
        { metricName: 'MATH-500', value: '97.3%', benchmark: 'Outperforms GPT-4o' },
        { metricName: 'Codeforces Percentile', value: '96.3th percentile', benchmark: 'Competitive with expert human coders' }
      ],
      equationsOrFormulas: [
        {
          name: 'GRPO Objective Function',
          latex: 'J_{GRPO}(\\theta) = \\mathbb{E}\\left[ \\sum_{i=1}^G \\min\\left( \\frac{\\pi_\\theta(o_i|q)}{\\pi_{\\theta_{old}}(o_i|q)} A_i, \\text{clip}(\\dots) A_i \\right) \\right]',
          description: 'Calculates relative advantage A_i by normalizing rewards across a group of G sampled outputs for prompt q.'
        }
      ],
      limitations: [
        'Higher latency during inference due to expanded Chain-of-Thought reasoning tokens.',
        'Language mixing (switching between Chinese and English) occasionally observed in pure RL zero model.'
      ],
      futureResearchDirections: [
        'Applying GRPO to multimodal spatial and physical reasoning tasks.',
        'Real-time tree search integration with inference token budget scaling.'
      ],
      codeUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
      datasetUrl: 'https://huggingface.co/datasets/deepseek-ai/R1-Distill'
    }
  },
  {
    id: 'paper-flashattention2-2023',
    title: 'FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning',
    authors: ['Tri Dao'],
    publishedDate: '2023-07-17',
    journalOrConference: 'Tri Dao Lab / Stanford AI',
    abstract: 'Attention mechanisms in Transformers are memory-bound. FlashAttention reorders attention algorithms using tiling to reduce memory reads/writes. FlashAttention-2 yields a 2x speedup over FlashAttention by improving parallelism across sequence length and thread block work partitioning.',
    url: 'https://arxiv.org/abs/2307.08691',
    pdfUrl: 'https://arxiv.org/pdf/2307.08691.pdf',
    citationsCount: 2450,
    categories: ['cs.LG', 'cs.DC', 'System Architecture', 'CUDA Optimization'],
    source: 'curated',
    recommendationScore: 94,
    recommendationReason: 'Essential engineering foundation for scaling Transformer context windows to 128k+ tokens efficiently.',
    isBookmarked: false,
    analysis: {
      executiveSummary: 'FlashAttention-2 optimizes GPU SRAM/HBM memory access patterns for Transformer attention computation, achieving up to 225 TFLOPS/GPU (73% of theoretical peak A100 performance).',
      noveltyAndContributions: [
        'Tiling-based exact attention without computing intermediate N x N attention matrix in HBM.',
        'Parallelization across sequence length dimension in addition to batch size and number of heads.',
        'Reduced non-matmul FLOPs by optimizing online Softmax scaling factor calculation.',
        'Support for causal masking, multi-query attention (MQA), and grouped-query attention (GQA).'
      ],
      methodologyBreakdown: 'Decomposes Q, K, V matrices into smaller blocks that fit in GPU Shared Memory (SRAM), computing partial softmax and updating the output iteratively.',
      keyMetricsAndResults: [
        { metricName: 'Training Speedup', value: '2.0x vs FlashAttention-1', benchmark: 'A100 SXM4 80GB GPU' },
        { metricName: 'TFLOPS Utilization', value: '225 TFLOPS (73% Peak)', benchmark: 'Standard Flash Attention ~35%' },
        { metricName: 'Sequence Scaling', value: '128k context', benchmark: 'Zero OOM errors' }
      ],
      equationsOrFormulas: [
        {
          name: 'Online Softmax Rescaling',
          latex: 'm^{(new)} = \\max(m^{(old)}, m^{(block)}), \\quad S^{(new)} = S^{(old)} e^{m^{(old)} - m^{(new)}} + S^{(block)} e^{m^{(block)} - m^{(new)}}',
          description: 'Numerically stable online accumulation of max values and exponential sums across tile iterations.'
        }
      ],
      limitations: [
        'Requires custom CUDA kernel compilation optimized for specific GPU architectures (Ampere, Hopper).',
        'Numerical precision small variances when running in FP16/BF16 vs FP32.'
      ],
      futureResearchDirections: [
        'FlashAttention-3 for NVIDIA Hopper H100 Tensor Memory Accelerator (TMA) & FP8 precision.',
        'Integration with Linear State Space Models (Mamba).'
      ],
      codeUrl: 'https://github.com/Dao-AILab/flash-attention',
      datasetUrl: 'https://github.com/Dao-AILab/flash-attention/tree/main/benchmarks'
    }
  },
  {
    id: 'paper-alphafold3-2024',
    title: 'Accurate Structure Prediction of Biomolecular Interactions with AlphaFold 3',
    authors: ['Josh Abramson', 'Jonas Adler', 'Jack Dunger', 'Richard Evans', 'Tim Green', 'Alexander Pritzel', 'John Jumper', 'Demis Hassabis'],
    publishedDate: '2024-05-08',
    journalOrConference: 'Nature 2024',
    abstract: 'AlphaFold 3 expands protein structure prediction to joint predictions of complex biomolecular systems including proteins, nucleic acids (DNA/RNA), small molecule ligands, ions, and chemical modifications in a unified deep learning model.',
    url: 'https://www.nature.com/articles/s41586-024-07487-w',
    pdfUrl: 'https://www.nature.com/articles/s41586-024-07487-w.pdf',
    citationsCount: 1890,
    categories: ['q-bio.BM', 'cs.LG', 'Biotechnology', 'Computational Biology'],
    source: 'curated',
    recommendationScore: 96,
    recommendationReason: 'Pioneering breakthrough in structural biology enabling drug discovery and molecular design.',
    isBookmarked: true,
    analysis: {
      executiveSummary: 'AlphaFold 3 replaces the specialized structural module of AlphaFold 2 with a Diffusion-based generative architecture (Pairformer + 3D Diffusion Module), enabling unified molecular docking and multi-chain interaction prediction.',
      noveltyAndContributions: [
        'Unified architecture for Proteins, DNA, RNA, Glycans, and Small-Molecule Ligands.',
        'Replaced IPA (Invariant Point Attention) with 3D Atom Diffusion Module.',
        'Improved binding affinity prediction for drug candidate screening by 50%+ over classical physics tools.',
        'Eliminated reliance on rigid covalent template geometry assumptions.'
      ],
      methodologyBreakdown: 'Processes raw sequence and chemical graph input through MSA (Multiple Sequence Alignment) and Pairformer representations, feeding pair features directly into a 3D Denoising Diffusion network to generate final atomic coordinates.',
      keyMetricsAndResults: [
        { metricName: 'Interface LDDT-PLI (Protein-Ligand)', value: '76.4%', benchmark: 'Prev. SOTA 48.1% (AutoDock Vina)' },
        { metricName: 'Protein-RNA Complex RMSD', value: '2.15 Å', benchmark: 'PDB benchmark test set' },
        { metricName: 'Success Rate (cRMSD < 2Å)', value: '62.1%', benchmark: 'Across 10,000 PDB structures' }
      ],
      equationsOrFormulas: [
        {
          name: '3D Coordinate Denoising Score Match',
          latex: '\\mathcal{L}_{diff} = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| s_\\theta(x_t, t, z) - \\nabla_{x_t} \\log p_t(x_t | x_0) \\|^2 \\right]',
          description: 'Denoising objective training the network to predict noise added to 3D atomic spatial coordinates.'
        }
      ],
      limitations: [
        'Generative diffusion can produce non-physical steric clashes in rare unconstrained regions.',
        'Requires MSA generation which can be computationally intensive for novel synthetic sequences.'
      ],
      futureResearchDirections: [
        'Dynamic protein conformational state sampling.',
        'De novo therapeutic antibody and peptide mini-protein design.'
      ],
      codeUrl: 'https://github.com/google-deepmind/alphafold3_pytorch',
      datasetUrl: 'https://www.wwpdb.org'
    }
  },
  {
    id: 'paper-mamba-2023',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: ['Albert Gu', 'Tri Dao'],
    publishedDate: '2023-12-01',
    journalOrConference: 'arXiv 2023 / Carnegie Mellon University',
    abstract: 'Transformers suffer from O(N^2) complexity with sequence length. We introduce Selective State Space Models (SSMs) that make SSM parameters functions of the input, addressing the weakness of prior SSMs to perform content-based reasoning while retaining linear O(N) time and constant O(1) memory during inference.',
    url: 'https://arxiv.org/abs/2312.00752',
    pdfUrl: 'https://arxiv.org/pdf/2312.00752.pdf',
    citationsCount: 3100,
    categories: ['cs.LG', 'cs.CL', 'State Space Models', 'Architecture Design'],
    source: 'curated',
    recommendationScore: 92,
    recommendationReason: 'Leading non-Transformer architecture offering linear scaling and 5x faster inference generation throughput.',
    isBookmarked: false,
    analysis: {
      executiveSummary: 'Mamba presents a major alternative to Transformers by introducing input-dependent selective state matrices, enabling sub-quadratic training time and memory-efficient infinite context streaming.',
      noveltyAndContributions: [
        'Selective SSM mechanism allowing model to filter out irrelevant context dynamically.',
        'Hardware-aware parallel scan algorithm implementation on GPU SRAM.',
        'Eliminates KV-cache storage footprint during autoregressive generation.',
        'Matches Transformer quality on language, DNA sequencing, and audio synthesis tasks.'
      ],
      methodologyBreakdown: 'Replaces attention matrices with continuous differential state equations discretized via Zero-Order Hold (ZOH), making state transition matrices B, C, Delta dynamic functions of the current input token.',
      keyMetricsAndResults: [
        { metricName: 'Inference Throughput', value: '5x higher tokens/sec', benchmark: 'vs LLaMA-7B at 8k context' },
        { metricName: 'Context Memory Footprint', value: 'Constant O(1)', benchmark: 'Transformers scale linearly O(N)' },
        { metricName: 'Zero-shot Perplexity', value: '8.6 perplexity', benchmark: 'Matches Transformer-7B' }
      ],
      equationsOrFormulas: [
        {
          name: 'Discretized Selective State Space Transition',
          latex: 'h_t = \\bar{A} h_{t-1} + \\bar{B} x_t, \\quad y_t = C h_t',
          description: 'State matrix update where A-bar and B-bar are discretized using input-dependent step size Delta(x).'
        }
      ],
      limitations: [
        'Harder to fine-tune on standard Transformer hardware infrastructure tools.',
        'Recall performance on pure copy-paste tasks slightly lower than full self-attention at small scale.'
      ],
      futureResearchDirections: [
        'Hybrid Mamba-Transformer architectures (e.g. Jamba).',
        'Multimodal Vision-Mamba models for high-resolution 4K video processing.'
      ],
      codeUrl: 'https://github.com/state-spaces/mamba',
      datasetUrl: 'https://huggingface.co/state-spaces/mamba-2.8b'
    }
  }
];
