export type ResearchMaturity = "peer-reviewed" | "preprint" | "standard" | "guidance";

export type ResearchSource = {
  title: string;
  venue: string;
  maturity: ResearchMaturity;
  url: string;
  supports: string;
  limitation: string;
};

export type ResearchInsight = {
  title: string;
  summary: string;
  sourceUrls: string[];
};

export const researchSources: ResearchSource[] = [
  {
    title: "Handbook on Constructing Composite Indicators: Methodology and User Guide",
    venue: "OECD / European Commission JRC 2008",
    maturity: "guidance",
    url: "https://www.oecd.org/en/publications/handbook-on-constructing-composite-indicators-methodology-and-user-guide_9789264043466-en.html",
    supports:
      "Requires a theoretical framework, explicit missing-data treatment, normalization, weighting, aggregation, and uncertainty and sensitivity analysis for composite indicators.",
    limitation:
      "The handbook addresses composite indicators broadly and does not supply harness-specific constructs or valid product ratings.",
  },
  {
    title: "Software Modeling and Measurement: The Goal/Question/Metric Paradigm",
    venue: "University of Maryland Technical Report 1992",
    maturity: "guidance",
    url: "https://drum.lib.umd.edu/items/8119803a-362b-42ec-b6ce-2311713e7236",
    supports:
      "Structures measurement from a concrete goal through decision questions to metrics, preventing collection of signals that do not support a user decision.",
    limitation:
      "GQM structures the measurement program but does not validate a particular rubric, value function, or benchmark.",
  },
  {
    title: "ISO/IEC/IEEE 15939:2017 Systems and Software Engineering - Measurement Process",
    venue: "ISO/IEC/IEEE Standard",
    maturity: "standard",
    url: "https://www.iso.org/standard/71197.html",
    supports:
      "Requires information needs, defined measures, collection and analysis procedures, and evaluation of whether measurement results are valid.",
    limitation:
      "The standard defines a measurement process rather than product-specific scoring rules for AI coding harnesses.",
  },
  {
    title: "Applying Inter-Rater Reliability and Agreement in Collaborative Grounded Theory Studies in Software Engineering",
    venue: "Journal of Systems and Software 2023",
    maturity: "peer-reviewed",
    url: "https://doi.org/10.1016/j.jss.2022.111520",
    supports:
      "Supports dual coding, iterative codebook improvement, and transparent inter-rater reliability reporting for editorial software classifications.",
    limitation:
      "Reliability measures coder consistency; they do not by themselves establish that a construct predicts real harness outcomes.",
  },
  {
    title: "krippendorffsalpha: An R Package for Measuring Agreement Using Krippendorff's Alpha Coefficient",
    venue: "The R Journal 2021",
    maturity: "peer-reviewed",
    url: "https://journal.r-project.org/articles/RJ-2021-046/index.html",
    supports:
      "Supports agreement analysis for ordinal ratings, missing assignments, and more than two coders while emphasizing that interpretation thresholds depend on context.",
    limitation:
      "The coefficient measures reliability rather than validity; HarnessMatch must also report uncertainty, raw disagreement, and the composition of the coded sample.",
  },
  {
    title: "Establishing Best Practices in Building Rigorous Agentic Benchmarks",
    venue: "NeurIPS 2025 Datasets and Benchmarks",
    maturity: "peer-reviewed",
    url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/f316275b44ee2de533102913828a8107-Abstract-Datasets_and_Benchmarks_Track.html",
    supports:
      "Separates task validity from outcome validity and requires frozen environments, verified solvability, robust graders, open harnesses, contamination controls, baselines, and uncertainty.",
    limitation:
      "The checklist evaluates benchmark rigor, not current product mechanisms or suitability for an individual workflow.",
  },
  {
    title: "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena",
    venue: "NeurIPS 2023 Datasets and Benchmarks",
    maturity: "peer-reviewed",
    url: "https://papers.neurips.cc/paper_files/paper/2023/hash/91f18a1287b398d378ef22505bf41832-Abstract-Datasets_and_Benchmarks.html",
    supports:
      "Documents position, verbosity, self-enhancement, and reasoning biases in model-based judging and validates judge agreement against controlled and crowdsourced human preferences.",
    limitation:
      "The study evaluates chat assistants rather than code patches. It supports caution and human calibration for BuffBench-style judges, not a Codebuff capability or quality rating.",
  },
  {
    title: "Holistic Evaluation of Language Models",
    venue: "Transactions on Machine Learning Research 2023",
    maturity: "peer-reviewed",
    url: "https://mlanthology.org/tmlr/2023/liang2023tmlr-holistic/",
    supports:
      "Argues for standardized, multi-scenario, multi-metric evaluation that exposes trade-offs rather than collapsing every outcome into a single score.",
    limitation:
      "HELM evaluates language models; HarnessMatch applies its reporting principles while keeping model and harness capability separate.",
  },
  {
    title: "General Agent Evaluation",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2602.22953",
    supports:
      "Proposes a unified protocol and full-factorial agent, model, and environment evaluation, reinforcing that general-agent claims require cross-domain testing rather than one coding score.",
    limitation:
      "It does not evaluate goose and remains a preprint; HarnessMatch uses it as methodology evidence, not as product evidence or a product rating.",
  },
  {
    title: "WildClawBench: A Benchmark for Real-World, Long-Horizon Agent Evaluation",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.10912",
    supports:
      "Uses native CLI harnesses, reproducible containers, human-authored long-horizon tasks, side-effect auditing, and hybrid grading; it also demonstrates that changing the harness can materially change outcomes for a fixed model.",
    limitation:
      "It is a recent preprint with 60 tasks. HarnessMatch does not import its Hermes Agent or other product results until exact harness revisions, model settings, budgets, attempts, and task-level records satisfy the benchmark admission policy.",
  },
  {
    title: "Agents Don't Just Agree, They Remember: Benchmarking Persistent Sycophancy in Stateful Personal Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2607.10526",
    supports:
      "Shows why persistent memory needs a separate governance layer: incorrect user claims can cross a durable write boundary and later reappear after the original session has been cleared.",
    limitation:
      "The study evaluates a specific persistent-sycophancy protocol on Hermes Agent and OpenClaw across twelve models; it does not establish a general product-quality score or prove that every memory write is unsafe.",
  },
  {
    title: "Sleeper Channels and Provenance Gates: Persistent Prompt Injection in Always-on Autonomous AI Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.13471",
    supports:
      "Models cross-surface delayed execution through memory, skills, schedules, and files, motivating provenance, one-shot authorization, and separation between in-process guardrails and OS-level containment for persistent agents.",
    limitation:
      "The formal argument and companion prototype remain a preprint; the end-to-end attack is demonstrated on OpenClaw, while Hermes Agent is part of the threat model rather than the evaluated implementation target.",
  },
  {
    title: "Yet Even Less Is Even Better For Agentic, Reasoning, and Coding LLMs",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2604.00824",
    supports:
      "Studies training-trajectory selection across mini-SWE-agent, MSWE-agent, and other scaffolds, reinforcing that the agent framework and trajectory construction must be recorded when interpreting coding-model results.",
    limitation:
      "The experiments optimize model training and use specific framework configurations; they do not compare current harness products for end-user suitability, so HarnessMatch imports no mini-SWE-agent product score from the paper.",
  },
  {
    title: "LAGUNA M.1 / XS.2 Technical Report",
    venue: "Poolside technical report 2026",
    maturity: "preprint",
    url: "https://poolside.ai/assets/laguna/laguna-m1-xs2-technical-report.pdf",
    supports:
      "Records the production pool harness, model sampling parameters, per-task sandbox resources, four repeated runs, benchmark patches, and reward-hacking review, illustrating how harness and environment details change the interpretation of agentic model results.",
    limitation:
      "This is a vendor technical report centered on Poolside models. It does not pin the pool client revision or publish complete task-level trajectories for product comparison, and it modifies benchmark images, so HarnessMatch imports no Poolside Agent CLI score from it.",
  },
  {
    title: "Expanding the AI Evaluation Toolbox with Statistical Models",
    venue: "NIST AI 800-3 2026",
    maturity: "standard",
    url: "https://www.nist.gov/publications/expanding-ai-evaluation-toolbox-statistical-models",
    supports:
      "Distinguishes fixed-benchmark accuracy from generalized accuracy and motivates statistical models that decompose task and system variation with valid uncertainty.",
    limitation:
      "HarnessMatch currently lacks raw task-level trials for a generalized linear mixed model and therefore labels its intervals descriptive.",
  },
  {
    title: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
    venue: "ICLR 2024",
    maturity: "peer-reviewed",
    url: "https://proceedings.iclr.cc/paper_files/paper/2024/hash/edac78c3e300629acfe6cbe9ca88fb84-Abstract-Conference.html",
    supports:
      "Establishes repository-level issue resolution with real GitHub issues, complete codebases, executable environments, and fail-to-pass tests as a more realistic unit than isolated code generation.",
    limitation:
      "The original benchmark covers twelve Python repositories and early model systems; later results still require current task curation, exact harness configuration, repeated attempts, and contamination controls.",
  },
  {
    title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
    venue: "NeurIPS 2024",
    maturity: "peer-reviewed",
    url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/5a7c947568c1b1328ccc5230172e1e7c-Abstract-Conference.html",
    supports:
      "Treats the interface around the model as a first-class variable: prompts, commands, control flow, environment, and feedback format.",
    limitation:
      "It studies SWE-agent and benchmark tasks; it is not a current capability audit of commercial products.",
  },
  {
    title: "OpenHands: An Open Platform for AI Software Developers as Generalist Agents",
    venue: "ICLR 2025",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2407.16741",
    supports:
      "Separates the agent loop from the execution runtime and documents sandbox, event stream, tools, and multi-agent coordination.",
    limitation:
      "Its architecture is a strong reference model, not proof that every product implements the same boundaries.",
  },
  {
    title: "Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces",
    venue: "ICLR 2026",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2601.11868",
    supports:
      "Requires realistic tasks, pinned environments, executable tests, repeated attempts, and explicit agent-harness configuration.",
    limitation:
      "A score belongs to a particular model, harness, environment, budget, and run policy; not to the harness in isolation.",
  },
  {
    title: "Harness Engineering for Agentic AI Coding Tools: An Exploratory Study",
    venue: "AIware 2026",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2602.14690",
    supports:
      "Defines eight repository-level mechanisms: context files, settings, skills, subagents, commands, hooks, rules, and MCP.",
    limitation:
      "The product matrix is a February 2026 snapshot of five tools, so current capability labels still need live first-party verification.",
  },
  {
    title: "Harness-Bench: Measuring Harness Effects across Models in Realistic Agent Workflows",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.27922",
    supports:
      "Frames a harness through context, tools, state, constraints, permissions, tracing, and recovery, and compares model-harness pairings.",
    limitation:
      "It is a recent preprint and its aggregate results are not imported as permanent product ratings.",
  },
  {
    title: "Don't Blame the Large Language Model: How Agent Harness Evolution Shapes Coding Agent Quality",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2607.03691",
    supports:
      "Holds the model fixed across 35 Qwen Code releases, showing why the exact harness version must be recorded alongside any result.",
    limitation:
      "It is a recent preprint focused on one harness's release history and 50 SWE-bench Verified tasks, not a universal product ranking.",
  },
  {
    title: "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2604.25850",
    supports:
      "Makes component, experience, and decision observability explicit, pairs every harness edit with a falsifiable prediction, and tests transfer across benchmarks and model families.",
    limitation:
      "It evaluates an automatically evolved research harness and remains a preprint; its gains do not validate current commercial products or justify copying its aggregate scores into HarnessMatch.",
  },
  {
    title: "Rethinking the Evaluation of Harness Evolution for Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2607.12227",
    supports:
      "Requires matched feedback and inference budgets, simple test-time-scaling baselines, and held-out tasks when claiming that harness optimization improves general capability.",
    limitation:
      "It studies automatic harness evolution on Terminal-Bench 2.1 with two model families and is too recent to serve as an accepted universal evaluation standard.",
  },
  {
    title: "What makes a harness a harness: necessary and sufficient conditions for an agent harness",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2606.10106",
    supports:
      "Provides an operational inclusion test and separates an agent harness from an SDK, framework, IDE plugin, orchestrator, and the evaluation harness used to score it.",
    limitation:
      "It is a single-author conceptual-analysis preprint; the proposed boundary is useful for catalog consistency but is not yet a consensus taxonomy or performance model.",
  },
  {
    title: "Failure as a Process: An Anatomy of CLI Coding Agent Trajectories",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2607.09510",
    supports:
      "Analyzes complete Terminal-Bench trajectories and motivates explicit validation, recovery, and intervention mechanisms rather than final-score-only evaluation.",
    limitation:
      "It studies OpenHands, MiniSWE, and Terminus2 trajectories; its findings guide comparison axes but do not verify other products' capabilities.",
  },
  {
    title: "Agent Harness Engineering: A Survey",
    venue: "TMLR submission 2026",
    maturity: "preprint",
    url: "https://openreview.net/pdf?id=eONq7FdiHa",
    supports:
      "Separates execution, tooling, context, lifecycle, observability, verification, and governance as distinct harness layers.",
    limitation:
      "It is under review; HarnessMatch uses the taxonomy as an audit framework rather than treating it as an accepted standard.",
  },
  {
    title: "Large Language Model-Based Agents for Software Engineering: A Survey",
    venue: "arXiv 2024",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2409.02977",
    supports:
      "Separates model reasoning from agent perception, tools, action, memory, planning, and human or multi-agent interaction across 106 studies.",
    limitation:
      "It is a broad survey rather than an operational audit, so its categories guide vocabulary but do not verify current product features.",
  },
  {
    title: "LLM-Based Multi-Agent Systems for Software Engineering: Literature Review, Vision, and the Road Ahead",
    venue: "ACM TOSEM 2025",
    maturity: "peer-reviewed",
    url: "https://doi.org/10.1145/3712003",
    supports:
      "Shows that multi-agent topology, specialization, coordination, and human involvement are workflow choices rather than a universal quality ladder.",
    limitation:
      "The review covers multi-agent research systems; it does not establish that delegated agents improve every coding task or every product.",
  },
  {
    title: "Understanding Software Engineering Agents: A Study of Thought-Action-Result Trajectories",
    venue: "ASE 2025",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2506.18824",
    supports:
      "Motivates trajectory-level observability and distinguishes context gathering, editing, feedback use, and validation patterns hidden by final pass rates.",
    limitation:
      "The study analyzes 120 trajectories from three research agents and should not be generalized into product-level success rates.",
  },
  {
    title: "Agentless: Demystifying LLM-based Software Engineering Agents",
    venue: "PACMSE / FSE 2025",
    maturity: "peer-reviewed",
    url: "https://doi.org/10.1145/3715754",
    supports:
      "Provides a strong counterexample to autonomy-as-quality: a simple localization, repair, and validation pipeline can be competitive and easier to inspect.",
    limitation:
      "Its results are benchmark- and model-specific, and they do not imply that interactive or long-horizon workflows never benefit from richer harnesses.",
  },
  {
    title: "AutoCodeRover: Autonomous Program Improvement",
    venue: "ISSTA 2024",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2404.05427",
    supports:
      "Demonstrates a structured repair loop combining repository search, program analysis, patching, and test feedback rather than undifferentiated autonomy.",
    limitation:
      "It targets issue resolution in a research system; its design supports the verification axis but not current commercial product claims.",
  },
  {
    title: "SWE-rebench: An Automated Pipeline for Task Collection and Decontaminated Evaluation of Software Engineering Agents",
    venue: "ICLR 2026",
    maturity: "peer-reviewed",
    url: "https://arxiv.org/abs/2505.20411",
    supports:
      "Supports continuously refreshed tasks, explicit evaluation windows, and contamination-aware reporting instead of permanent static leaderboard claims.",
    limitation:
      "Fresh tasks reduce contamination risk but do not remove the need to pin model, harness, budget, environment, attempts, and run policy.",
  },
  {
    title: "REAP: Automatic Curation of Coding Agent Benchmarks from Interactive Production Usage",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2604.01527",
    supports:
      "Derives executable tasks from real developer-agent sessions and audits task relevance, test alignment, and multi-run stability, showing how production evaluation can preserve fidelity without relying on one static public benchmark.",
    limitation:
      "REAP studies one production monorepo pipeline and uses automated, partly model-assisted curation; its solve rates cannot be transferred to unrelated repositories or treated as harness-only ratings.",
  },
  {
    title: "Context as a Tool: Context Management for Long-Horizon SWE-Agents",
    venue: "arXiv 2025",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2512.22087",
    supports:
      "Treats context lifecycle as an explicit harness mechanism with stable task state, condensed long-term memory, working memory, and proactive compression.",
    limitation:
      "It evaluates one proposed context-management approach and does not justify assigning high context ratings from context-window size alone.",
  },
  {
    title: "Wink: Recovering from Misbehaviors in Coding Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2602.17037",
    supports:
      "Motivates recovery as a separate dimension by analyzing specification drift, reasoning problems, and tool-call failures in production trajectories.",
    limitation:
      "The reported recovery system is evaluated in one production setting and is not evidence that unrelated harnesses provide comparable intervention mechanisms.",
  },
  {
    title: "AI Harness Engineering: A Runtime Substrate for Foundation-Model Software Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.13357",
    supports:
      "Defines eleven runtime responsibilities and treats an auditable execution episode, rather than a single response, as the evaluation unit.",
    limitation:
      "The proposed H0-H3 ladder is a new conceptual framework validated on a controlled task, not an accepted cross-product scoring standard.",
  },
  {
    title: "Code as Agent Harness",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.18747",
    supports:
      "Organizes harness design into interface, mechanisms, and multi-agent scaling, with verification, shared state, regression control, and human oversight.",
    limitation:
      "It is a broad survey and roadmap, so its mechanisms guide comparison fields but do not supply current product capability labels.",
  },
  {
    title: "VeRO: An Evaluation Harness for Agents to Optimize Agents",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2602.22480",
    supports:
      "Requires versioned agent snapshots, controlled budgets, reference procedures, and structured execution traces for reproducible agent evaluation.",
    limitation:
      "VeRO studies agent optimization tasks and does not make its optimizer results directly comparable to general coding-harness leaderboards.",
  },
  {
    title: "Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation",
    venue: "ICLR 2026",
    maturity: "peer-reviewed",
    url: "https://openreview.net/forum?id=vUaY1t64ZZ",
    supports:
      "Demonstrates standardized, cost-aware evaluation across 21,730 rollouts and uses log inspection to surface behavior hidden by aggregate success rates.",
    limitation:
      "Its cross-domain infrastructure validates evaluation practice, not a permanent ordering of the coding products in HarnessMatch.",
  },
  {
    title: "R2E: Turning any GitHub Repository into a Programming Agent Environment",
    venue: "ICML 2024",
    maturity: "peer-reviewed",
    url: "https://openreview.net/forum?id=kXHgEYFyf3",
    supports:
      "Shows why repository evaluation needs executable environments, realistic project state, program analysis, and feedback rather than static code generation alone.",
    limitation:
      "R2E evaluates constructed repository environments and does not audit the production safety, recovery, or governance of commercial harnesses.",
  },
  {
    title: "Vision2Web: A Hierarchical Benchmark for Visual Website Development with Agent Verification",
    venue: "ICML 2026",
    maturity: "peer-reviewed",
    url: "https://openreview.net/forum?id=lJpXXwhRRF",
    supports:
      "Uses hierarchical tasks, executable test cases, GUI-agent verification, and visual judges to evaluate end-to-end work beyond patch-only benchmarks.",
    limitation:
      "The benchmark is specialized for website development and cannot be generalized into an overall coding-harness performance score.",
  },
  {
    title: "Claw-SWE-Bench: A Benchmark for Evaluating OpenClaw-style Agent Harnesses on Coding Tasks",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2606.12344",
    supports:
      "Quantifies large model and harness effects under controlled comparisons and treats cost as a first-class evaluation outcome.",
    limitation:
      "It is a recent benchmark preprint; its measured pairings are not converted into harness-only ratings or extrapolated to unrelated workflows.",
  },
  {
    title: "Copilot Evaluation Harness: Building User Trust in LLMs and LM Agents for IDE Environments",
    venue: "ICLR BuildingTrust Workshop 2025",
    maturity: "preprint",
    url: "https://openreview.net/forum?id=XMXWk83dah",
    supports:
      "Combines static and execution-based metrics across documentation, testing, and bug-fixing tasks, and examines prompt sensitivity and agent behavior.",
    limitation:
      "The workshop submission evaluates selected models and tasks inside one harness; it is methodological evidence, not a current product ranking.",
  },
  {
    title: "AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents",
    venue: "NeurIPS 2024 Datasets and Benchmarks",
    maturity: "peer-reviewed",
    url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html",
    supports:
      "Separates task utility from adversarial security for tool-using agents and evaluates prompt injection through untrusted tool output with realistic tasks, explicit security cases, and adaptive attacks.",
    limitation:
      "AgentDojo focuses on web and productivity tools rather than repository coding, so it informs HarnessMatch's security model without proving any coding harness is secure or insecure.",
  },
  {
    title: "Do Coding Agents Understand Least-Privilege Authorization?",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.14859",
    supports:
      "AuthBench uses 120 realistic terminal tasks with human-reviewed file permissions and executable utility and attack validators, showing why least privilege needs harness-level policy rather than model intuition alone.",
    limitation:
      "It is a recent preprint about model-generated file policies, not an audit of Crush permissions or evidence that any approval prompt or hook is an effective security boundary.",
  },
  {
    title: "Overeager Coding Agents: Measuring Out-of-Scope Actions on Benign Tasks",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.18583",
    supports:
      "Defines out-of-scope action as an authorization failure distinct from prompt injection and sandbox escape, and uses paired consent conditions, audited tool calls, repeated runs, and multiple model-harness combinations.",
    limitation:
      "The benchmark evaluates selected May 2026 configurations and remains a preprint; HarnessMatch does not convert its product rates into permanent security scores without complete versioned run records.",
  },
  {
    title: "How Coding Agents Fail Their Users: A Large-Scale Analysis of Developer-Agent Misalignment in 20,574 Real-World Sessions",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2605.29442",
    supports:
      "Analyzes 20,574 sessions from 1,639 repositories across CLI and IDE workflows and motivates visible constraints, correction paths, and interface-specific evaluation of agent behavior.",
    limitation:
      "It is an observational preprint based on developer pushback as visible evidence of misalignment; it does not estimate hidden failures or provide comparative harness success rates.",
  },
  {
    title: "SWE-chat: Coding Agent Interactions From Real Users in the Wild",
    venue: "arXiv 2026",
    maturity: "preprint",
    url: "https://arxiv.org/abs/2604.20779",
    supports:
      "Studies 6,000 public coding-agent sessions and distinguishes agent-dominant vibe coding from human-authored workflows, supporting workflow-specific comparison and evaluation with real interaction traces.",
    limitation:
      "It is a living observational dataset and recent preprint; public-session selection, attribution, and survival into commits do not establish causal product quality or safety rankings.",
  },
  {
    title: "Harness engineering: leveraging Codex in an agent-first world",
    venue: "OpenAI Engineering 2026",
    maturity: "guidance",
    url: "https://openai.com/index/harness-engineering/",
    supports:
      "Describes repository knowledge as a versioned system of record, short navigation-first AGENTS.md guidance, worktree-local application observability, mechanically enforced architecture, executable plans, and recurring maintenance as parts of an agent-legible engineering environment.",
    limitation:
      "This is a self-reported five-month internal Codex case study without a matched control or independent replication. Its throughput and time estimates cannot be generalized into product capability or comparative performance claims.",
  },
  {
    title: "Effective harnesses for long-running agents",
    venue: "Anthropic Engineering 2025",
    maturity: "guidance",
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
    supports:
      "Motivates explicit initialization, feature decomposition, progress artifacts, Git history, end-to-end testing, and clean handoffs so fresh sessions can continue work across context windows instead of relying on compaction alone.",
    limitation:
      "This is an Anthropic internal engineering experiment around the Claude Agent SDK, not a controlled cross-product benchmark. It publishes design observations rather than a replicated success-rate estimate.",
  },
  {
    title: "Harness design for long-running application development",
    venue: "Anthropic Engineering 2026",
    maturity: "guidance",
    url: "https://www.anthropic.com/engineering/harness-design-long-running-apps",
    supports:
      "Explores planner, generator, and evaluator separation; negotiated completion contracts; browser-based verification; structured handoffs; context resets versus compaction; and removing harness components as model capability changes.",
    limitation:
      "The reported solo and full-harness comparison used one prompt with radically different duration and cost, plus qualitative manual assessment. It does not isolate causality, supply a product benchmark, or justify a universal multi-agent advantage.",
  },
];

export const researchInsights: ResearchInsight[] = [
  {
    title: "There is no universal winner.",
    summary:
      "Results change with the model, harness version, environment, budget, and workflow. Choose for the setup you will actually use.",
    sourceUrls: [
      "https://arxiv.org/abs/2601.11868",
      "https://arxiv.org/abs/2607.03691",
    ],
  },
  {
    title: "More autonomy is not automatically better.",
    summary:
      "Focused work can benefit from a smaller, inspectable repair and validation loop instead of the most autonomous system.",
    sourceUrls: [
      "https://doi.org/10.1145/3715754",
      "https://arxiv.org/abs/2404.05427",
    ],
  },
  {
    title: "Context, verification, and recovery are different capabilities.",
    summary:
      "Long tasks need managed context, visible execution, validation, and a way to recover from drift. One feature does not guarantee the others.",
    sourceUrls: [
      "https://arxiv.org/abs/2512.22087",
      "https://arxiv.org/abs/2506.18824",
      "https://arxiv.org/abs/2602.17037",
    ],
  },
  {
    title: "Benchmark scores expire.",
    summary:
      "A result is a snapshot of exact versions and run conditions. Fresh tasks and reproducible configuration matter more than a permanent grade.",
    sourceUrls: [
      "https://arxiv.org/abs/2505.20411",
      "https://arxiv.org/abs/2601.11868",
    ],
  },
  {
    title: "Read the run, not only the score.",
    summary:
      "Trajectories reveal validation, recovery, tool misuse, and intervention patterns that the same final pass rate can hide.",
    sourceUrls: [
      "https://arxiv.org/abs/2605.13357",
      "https://openreview.net/forum?id=vUaY1t64ZZ",
      "https://arxiv.org/abs/2607.09510",
    ],
  },
  {
    title: "Vibe coding still needs visible guardrails.",
    summary:
      "When an agent writes most of the code, simple controls matter more, not less: show what it can access, how to interrupt or correct it, and whether changes can be inspected and recovered.",
    sourceUrls: [
      "https://arxiv.org/abs/2604.20779",
      "https://arxiv.org/abs/2605.29442",
      "https://arxiv.org/abs/2605.14859",
    ],
  },
  {
    title: "A sandbox and aligned scope solve different problems.",
    summary:
      "Isolation limits the damage a tool can cause, while permission policy and visible consent boundaries constrain what the agent should attempt. Prompt injection, excess initiative, and sandbox escape therefore need separate evidence.",
    sourceUrls: [
      "https://proceedings.neurips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html",
      "https://arxiv.org/abs/2605.14859",
      "https://arxiv.org/abs/2605.18583",
    ],
  },
  {
    title: "A better harness must work beyond the tasks that shaped it.",
    summary:
      "Harness changes should predict an outcome before evaluation, use matched budgets and simple search baselines, and then hold up on unseen tasks or another benchmark before supporting a general product claim.",
    sourceUrls: [
      "https://arxiv.org/abs/2604.25850",
      "https://arxiv.org/abs/2607.12227",
    ],
  },
];
