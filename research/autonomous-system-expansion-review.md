# Prepare an evidence-grounded technical review for expanding a small free-tier Gi

**Question:** Prepare an evidence-grounded technical review for expanding a small free-tier GitHub Actions + Cloudflare Workers AI multi-provider router into a more capable autonomous software operations system. Priorities: (1) robust diagnosis and safe repair of CI failures, (2) multi-agent planning/review/execution and disagreement resolution, (3) autonomous research and tool access, (4) persistent task queue/state across runs, (5) free-tier / iPhone-first operation, (6) least privilege, prompt-injection defense, secret handling, retry/cost controls, human approval boundaries. Recommend a phased architecture and concrete open-source components/patterns that work with GitHub Actions, Cloudflare Workers, and a static frontend; distinguish practical evidence from speculation; identify common failure modes and measurable acceptance tests. Include sources/citations and prioritize no-cost or free-tier solutions. Do not assume any tool or account is connected.

# Phased Architecture for an **Autonomous CI Operations System** on Free-Tier GitHub Actions + Cloudflare Workers

The literature supports a staged build: CI failure triage is the best-evidenced capability, multi-agent coordination and persistent memory have moderate support, and free-tier/iPhone-first operation is largely an engineering extrapolation rather than a tested claim. Evidence is uneven—several key sources are single-case industrial reports or conceptual frameworks—so recommendations below separate demonstrated results from design proposals.

## Diagnosing and Safely Repairing CI Failures

The strongest evidence sits here. An industrial SAP HANA deployment found that supplying historical failure data let an LLM produce exact remediation in 92.1% of cases, and error location was identified with 97.4% accuracy with domain knowledge versus 84.2% without [[1.1]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/) [[1.2]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/). That study argues root-cause and solution generation can be done in a single LLM call for CI, since splitting them is cost-inefficient and compounds earlier errors [[1.3]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/) [[1.4]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/). A multi-source temporal framework correlating logs, config, and version history identified the ground-truth cause across all six controlled scenarios and cut investigation time from 25.5 to 3.8 minutes [[2.1]](https://consensus.app/papers/multisource-temporal-reasoning-for-automated-root-cause-venkatachalapathy/8ed76d0969885342a75b494734f33215/).

Repair quality is the weak link: on 100 real CI failures, Agentless, SWE-Agent, and AutoCodeRover reached only 28%, 35%, and 13% correct-patch rates [[3.1]](https://consensus.app/papers/cibench-a-framework-for-evaluating-large-language-model-nabil-zhu/5152e616ec845d7ba1c30c232f2e333b/). A human-in-the-loop architecture with tool-scoped, mostly read-only access and a risk-scored autonomy gate reported 87.6% top-1 triage accuracy versus 57.1% for rule-based matching, with a 0.7% false-remediation rate under bounded autonomy [[4.1]](https://consensus.app/papers/agentic-pipeline-operations-llm-agents-for-cicd-failure-jinna-bandari/1910242270ae532da77d78755445c6a8/) [[4.2]](https://consensus.app/papers/agentic-pipeline-operations-llm-agents-for-cicd-failure-jinna-bandari/1910242270ae532da77d78755445c6a8/). The field also lacks shared benchmarks and faces cost, latency, and reliability gaps [[5.1]](https://consensus.app/papers/aidriven-failure-management-in-cicd-pipelines-from-bougad-elkhadir/a48c77f53ddb5737a57abdc257253b4e/).

- **Phase 1:** single-call triage with a historical-failure knowledge base [[1.1]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/).
- **Phase 2:** read-only tool access plus a risk/confidence autonomy gate [[4.3]](https://consensus.app/papers/agentic-pipeline-operations-llm-agents-for-cicd-failure-jinna-bandari/1910242270ae532da77d78755445c6a8/).
- **Phase 3:** patch proposals gated behind human approval, given low repair rates [[3.1]](https://consensus.app/papers/cibench-a-framework-for-evaluating-large-language-model-nabil-zhu/5152e616ec845d7ba1c30c232f2e333b/).

## Multi-Agent Planning, Review, and Disagreement Resolution

Multi-agent systems gain robustness through decentralization and task reassignment on failure [[6.1]](https://consensus.app/papers/multiagent-collaboration-mechanisms-a-survey-of-llms-tran-dao/1b1408203b4a5eedbf4458caa566002e/) [[6.2]](https://consensus.app/papers/multiagent-collaboration-mechanisms-a-survey-of-llms-tran-dao/1b1408203b4a5eedbf4458caa566002e/), and structured debugging pipelines assign specialized agents to reproduction, localization, patch generation, and validation [[7.1]](https://consensus.app/papers/llmbased-multiagent-systems-for-software-engineering-he-treude/797515474cd8578d87cee4eb3231428a/). Debate-based designs—a discriminator agent resolving disagreement, or a meta-policy re-ranking competing patches—are the documented patterns for conflict resolution [[7.2]](https://consensus.app/papers/llmbased-multiagent-systems-for-software-engineering-he-treude/797515474cd8578d87cee4eb3231428a/) [[7.3]](https://consensus.app/papers/llmbased-multiagent-systems-for-software-engineering-he-treude/797515474cd8578d87cee4eb3231428a/). SagaLLM adds transactional safeguards, checkpointing, and independent validation agents to counter unreliable self-validation and context loss [[8.1]](https://consensus.app/papers/sagallm-context-management-validation-and-transaction-chang-geng/fb333f7884265bc493c0f90edc691ba5/) [[8.2]](https://consensus.app/papers/sagallm-context-management-validation-and-transaction-chang-geng/fb333f7884265bc493c0f90edc691ba5/).

Designated leadership and a criticize-reflect loop reduced communication cost and improved team efficiency in embodied-agent experiments [[9.1]](https://consensus.app/papers/embodied-llm-agents-learn-to-cooperate-in-organized-teams-guo-huang/651e45d231fa5daabb5b2a54b07b3672/) [[9.2]](https://consensus.app/papers/embodied-llm-agents-learn-to-cooperate-in-organized-teams-guo-huang/651e45d231fa5daabb5b2a54b07b3672/). Note that LLM agents tend to over-report and comply with any instruction, causing redundancy [[9.3]](https://consensus.app/papers/embodied-llm-agents-learn-to-cooperate-in-organized-teams-guo-huang/651e45d231fa5daabb5b2a54b07b3672/), and multi-agent decision-making introduces coordination and communication concerns absent in single-agent frameworks [[10.1]](https://consensus.app/papers/llmbased-multiagent-decisionmaking-challenges-and-sun-huang/3533124db4035b23a127512be60b5a30/).

**Fig 3.** Illustrative examples of collaboration types, where each agent 𝑎 is equipped with different tools or capabilities through their system prompt 𝑟 . In scenario a), agents cooperate by leveraging their individual specialties (e.g., writing, translation, research) to achieve a shared goal (academic writing). In scenario b), agents compete and debate against each other fo r their own goals. In scenario (c) of coopetition, agents compromise with each other, compete on one aspect while agreeing on another. [[6]](https://consensus.app/papers/multiagent-collaboration-mechanisms-a-survey-of-llms-tran-dao/1b1408203b4a5eedbf4458caa566002e/)

*How to read: Three panels labeled a, b, and c show cooperation, competition, and coopetition. In each, agents with different tool or role prompts connect by arrows; read left to right to see how shared goals versus opposing goals change the interaction pattern.*

## Persistent State, Memory, and Cost Control

Cross-session memory is the enabling substrate for continuity. WebCoach's external memory store raised task success from 47% to 61% on WebVoyager and let smaller models match GPT-4o-backed agents [[11.1]](https://consensus.app/papers/webcoach-selfevolving-web-agents-with-crosssession-liu-geng/15318a645281599b966231bf101a8b45/) [[11.2]](https://consensus.app/papers/webcoach-selfevolving-web-agents-with-crosssession-liu-geng/15318a645281599b966231bf101a8b45/). Critically, *what* is retained matters more than volume: selective memory completed 12/12 trials at 3.9K tokens while full history managed 8/12 at 7.7K [[12.1]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/) [[12.2]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/). Discarding reasoning traces and tool logs across sessions is advised because they are useful within a session but harmful across sessions [[12.3]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/).

The recommended starting pattern is context plus a retrieval store, graduating to tiered memory only when data justifies it [[13.1]](https://consensus.app/papers/memory-for-autonomous-llm-agentsmechanisms-evaluation-du/c39606478b3c5d80b1d7ed3513145b45/) [[13.2]](https://consensus.app/papers/memory-for-autonomous-llm-agentsmechanisms-evaluation-du/c39606478b3c5d80b1d7ed3513145b45/). A zero-token data-refresh contract decoupled generated programs from runtime data, firing on 12/12 trials with no model call [[12.4]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/)—directly relevant to free-tier token budgets. Benchmarks show current frameworks remain inadequate at actively grounding tool parameters from memory [[14.1]](https://consensus.app/papers/mem2actbench-a-benchmark-for-evaluating-longterm-memory-shen-li/d4579a9514225c219326058e6d289a4c/).

## Security, Least Privilege, and Human Approval Boundaries

Prompt injection is the dominant threat: benchmarked attack success reached 84.30% with limited defense effectiveness [[15.1]](https://consensus.app/papers/agent-security-bench-asb-formalizing-and-benchmarking-zhang-huang/855f0332a1cf58df9cca7ce9354d7b88/), and the Toxic Agent Flow exploit let malicious GitHub issues leak private repository data through an MCP integration [[16.1]](https://consensus.app/papers/from-prompt-injections-to-protocol-exploits-threats-in-ferrag-tihanyi/4ab586bc9f9358f99651d024e232fe26/) [[16.2]](https://consensus.app/papers/from-prompt-injections-to-protocol-exploits-threats-in-ferrag-tihanyi/4ab586bc9f9358f99651d024e232fe26/). The convergent defense is deterministic, out-of-band action mediation rather than in-model refusal [[17.1]](https://consensus.app/papers/adaptive-evaluation-of-outofband-defenses-against-prompt-narisetty-kore/7b98505bdc975af984c4977a141aa034/); Progent cut attack success roughly sixfold (25.8% to 4.2%) on AgentDojo [[17.2]](https://consensus.app/papers/adaptive-evaluation-of-outofband-defenses-against-prompt-narisetty-kore/7b98505bdc975af984c4977a141aa034/), though robustness against optimized adaptive attackers remains unproven [[17.3]](https://consensus.app/papers/adaptive-evaluation-of-outofband-defenses-against-prompt-narisetty-kore/7b98505bdc975af984c4977a141aa034/).

DRIFT's secure planner builds a minimal function trajectory with a parameter checklist, and an injection isolator masks conflicting instructions from the memory stream [[18.1]](https://consensus.app/papers/drift-dynamic-rulebased-defense-with-injection-isolation-li-liu/30c0fb0349f05e8593bd4991abfda6e7/) [[18.2]](https://consensus.app/papers/drift-dynamic-rulebased-defense-with-injection-isolation-li-liu/30c0fb0349f05e8593bd4991abfda6e7/). AgentSandbox operationalizes defense-in-depth, least privilege, and complete mediation via ephemeral agents [[19.1]](https://consensus.app/papers/llm-agents-should-employ-security-principles-zhang-su/7e6a9444228450d9b668d1ae2ebcffcd/) [[19.2]](https://consensus.app/papers/llm-agents-should-employ-security-principles-zhang-su/7e6a9444228450d9b668d1ae2ebcffcd/). A real deployment found a sub-agent could impersonate the operator through an input-injection path, fixed by replacing the tool with structured return values [[20.1]](https://consensus.app/papers/springdrift-an-auditable-persistent-runtime-for-llm-brady/cb617673ed755a72867336f9fb529cd3/) [[20.2]](https://consensus.app/papers/springdrift-an-auditable-persistent-runtime-for-llm-brady/cb617673ed755a72867336f9fb529cd3/).

| Priority | Evidence strength | Recommended component/pattern | Acceptance test |
|---|---|---|---|
| CI triage | Strong (industrial + controlled) | Single-call triage + historical-failure store [[1.1]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/) | ≥90% error-location accuracy on replay corpus [[1.2]](https://consensus.app/papers/using-large-language-models-to-support-automation-of-bui-grintz/6b4f2e83f87658e9b7a7261800db3dfa/) |
| Repair | Moderate (low patch rates) | Human-gated patch proposals [[3.1]](https://consensus.app/papers/cibench-a-framework-for-evaluating-large-language-model-nabil-zhu/5152e616ec845d7ba1c30c232f2e333b/) | False-remediation rate <1% [[4.2]](https://consensus.app/papers/agentic-pipeline-operations-llm-agents-for-cicd-failure-jinna-bandari/1910242270ae532da77d78755445c6a8/) |
| Multi-agent | Moderate (proposals + experiments) | Debate/discriminator + validation agent [[7.2]](https://consensus.app/papers/llmbased-multiagent-systems-for-software-engineering-he-treude/797515474cd8578d87cee4eb3231428a/) [[8.2]](https://consensus.app/papers/sagallm-context-management-validation-and-transaction-chang-geng/fb333f7884265bc493c0f90edc691ba5/) | Disagreement resolved without constraint violation [[8.3]](https://consensus.app/papers/sagallm-context-management-validation-and-transaction-chang-geng/fb333f7884265bc493c0f90edc691ba5/) |
| Memory | Moderate | Selective persistent store, discard traces [[12.1]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/) | Task completion with fewer tokens than full history [[12.2]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/) |
| Security | Moderate (static benchmarks) | Out-of-band deterministic mediation [[17.1]](https://consensus.app/papers/adaptive-evaluation-of-outofband-defenses-against-prompt-narisetty-kore/7b98505bdc975af984c4977a141aa034/) | Attack success reduced ≥5× on AgentDojo [[17.2]](https://consensus.app/papers/adaptive-evaluation-of-outofband-defenses-against-prompt-narisetty-kore/7b98505bdc975af984c4977a141aa034/) |

## Common Failure Modes and Caveats

Recurring failure modes include unreliable self-validation and context loss in planning [[8.1]](https://consensus.app/papers/sagallm-context-management-validation-and-transaction-chang-geng/fb333f7884265bc493c0f90edc691ba5/), memory poisoning and plan-of-thought backdoors [[15.2]](https://consensus.app/papers/agent-security-bench-asb-formalizing-and-benchmarking-zhang-huang/855f0332a1cf58df9cca7ce9354d7b88/), and protocol-level exploits across agent boundaries [[16.3]](https://consensus.app/papers/from-prompt-injections-to-protocol-exploits-threats-in-ferrag-tihanyi/4ab586bc9f9358f99651d024e232fe26/). Tool integration remains siloed and labor-intensive, with ad-hoc authentication and weak validation [[16.4]](https://consensus.app/papers/from-prompt-injections-to-protocol-exploits-threats-in-ferrag-tihanyi/4ab586bc9f9358f99651d024e232fe26/) [[16.5]](https://consensus.app/papers/from-prompt-injections-to-protocol-exploits-threats-in-ferrag-tihanyi/4ab586bc9f9358f99651d024e232fe26/). On the free-tier/iPhone-first priority, the supplied papers offer no direct evidence; the closest support is that selective memory and zero-token refresh reduce per-run cost [[12.4]](https://consensus.app/papers/shared-selective-persistent-memory-for-agentic-llm-pedada-dhavala/070be86754455969ada4163e5208b8bd/), and that small models with good memory scaffolding can approach larger-model performance [[11.2]](https://consensus.app/papers/webcoach-selfevolving-web-agents-with-crosssession-liu-geng/15318a645281599b966231bf101a8b45/). Treat the mobile-first and free-tier claims as engineering hypotheses to validate, not established findings.
 
_These search results were found and analyzed using Consensus, an AI-powered search engine for research. Try it at https://consensus.app. © 2026 Consensus NLP, Inc. Personal, non-commercial use only; redistribution requires copyright holders’ consent._
 
## References
 
`1.` Bui D, Grintz S, Berndt A, Bach T. Using Large Language Models to Support Automation of Failure Management in CI/CD Pipelines: A Case Study in SAP HANA. *2026 IEEE International Conference on Software Analysis, Evolution and Reengineering (SANER).* 2026. doi:10.1109/saner67736.2026.00063
 
> [1.1] The results show that data from historical failures contributed the most to the system's accuracy, enabling it to produce exact solutions in 92.1% of cases in our dataset. (Results)
 
> [1.2] The system correctly identified the error location with 97.4 % accuracy when provided with domain knowledge, compared to 84.2 % accuracy without it. (Results)
 
> [1.3] We argue that this is time and cost inefficient because these steps depend on one another and must be performed sequentially. (Discussion)
 
> [1.4] If the LLM produces incorrect insights in an earlier step, subsequent steps will also be affected. (Discussion)
 
`2.` Venkatachalapathy R. Multi-Source Temporal Reasoning for Automated Root Cause Analysis in Continuous Integration and Deployment Systems Using Large Language Models. *2026 6th International Conference on Soft Computing for Security Applications (ICSCSA).* 2026. doi:10.1109/icscsa69367.2026.11708424
 
> [2.1] Results show that the proposed framework identifies the ground-truth root cause across all six controlled representative scenarios and reduces average investigation time from 25.5 min to 3.8 min, an average reduction of approximately 85.0% compared with baseline manual inspection. (Results)
 
`3.` Nabil RL, Zhu H, Rubio-González C. CI-Bench: A Framework for Evaluating Large Language Model Tools on CI Failures. *Proceedings of the 2026 IEEE/ACM 48th International Conference on Software Engineering.* 2026. doi:10.1145/3774748.3787606
 
> [3.1] Our evaluation shows that Agentless, SWE-Agent, and AutoCodeRover achieve success rates of up to 28%, 35%, and 13%, respectively, in generating correct patches. (Results)
 
`4.` Jinna KR, Bandari U. Agentic Pipeline Operations: LLM Agents for CI/CD Failure Triage and Remediation under Human-in-the-Loop Guardrails. *International Journal of Research and Applied Innovations.* 2025. doi:10.15662/ijrai.2025.0803015
 
> [4.1] On a replay corpus of 1,240 labelled failures reconstructed in a sandbox Kubernetes and Tekton environment, the agent reaches 87.6% top-1 triage accuracy against 57.1% for a rule-based matcher. (Results)
 
> [4.2] Median time-to-green falls from 132 minutes under human-only handling to 30 minutes under bounded autonomy, and calibrated gating holds the auto-remediation false-remediation rate at 0.7%. (Results)
 
> [4.3] Actions are mediated by an autonomy gate that combines a per-action risk score with a calibrated confidence estimate to select one of five levels, from human-only operation to bounded auto-remediation of low-risk classes, and every decision is written to an append-only audit trail. (Abstract)
 
`5.` Bougad H, Elkhadir Z, Begdouri MA. AI-Driven Failure Management in CI/CD Pipelines: From Prediction to Remediation. *2026 International Conference on Circuit, Systems and Communication (ICCSC).* 2026. doi:10.1109/iccsc71566.2026.11650055
 
> [5.1] It also highlights several gaps in the research, including the lack of shared benchmarks, cost and latency constraints, and the security and reliability challenges of large language model-based approaches. (Abstract)
 
`6.` Tran K, Dao D, Nguyen M, Pham Q, O'Sullivan B, Nguyen HD. Multi-Agent Collaboration Mechanisms: A Survey of LLMs. *ArXiv.* 2025;abs/2501.06322. doi:10.48550/arxiv.2501.06322
 
> [6.1] - Robustness and Reliability: Decentralization of control leads to continued system operation even with some failed components. (Introduction)
 
> [6.2] In the event of agent failure, the task can be readily reassigned to other agents. (Introduction)
 
`7.` He J, Treude C, Lo D. LLM-Based Multi-Agent Systems for Software Engineering: Literature Review, Vision, and the Road Ahead. *ACM Transactions on Software Engineering and Methodology.* 2024;34:1 - 30. doi:10.1145/3712003
 
> [7.1] Several frameworks, including MASAI [8], MarsCode [86], AutoSD [64], and others [19, 73, 92, 125], follow a structured process consisting of stages like bug reproduction, fault localization, patch generation, and validation. (Body)
 
> [7.2] SWE-Search [7] consists of three agents: the SWE-Agent for adaptive exploration, the Value Agent paired with a Monte Carlo tree search module for iterative feedback and utility estimation, and the Discriminator Agent for collaborative decision-making through debate. (Body)
 
> [7.3] DEI [159] resolves GitHub issues by using a meta-policy to select the best solution, integrating and re-ranking patches generated by different agents for improved issue resolution. (Body)
 
`8.` Chang EY, Geng L. SagaLLM: Context Management, Validation, and Transaction Guarantees for Multi-Agent LLM Planning. *ArXiv.* 2025;abs/2503.11951. doi:10.14778/3750601.3750611
 
> [8.1] This paper introduces SagaLLM, a structured multi-agent architecture designed to address four foundational limitations of current LLM-based planning systems: unreliable self-validation, context loss, lack of transactional safeguards, and insufficient inter-agent coordination. (Abstract)
 
> [8.2] SagaLLM bridges this gap by integrating the Saga transactional pattern with persistent memory, automated compensation, and independent validation agents. (Abstract)
 
> [8.3] Empirical evaluations across planning domains demonstrate that standalone LLMs frequently violate interdependent constraints or fail to recover from disruptions. (Abstract)
 
`9.` Guo X, Huang K, Liu J, et al. Embodied LLM Agents Learn to Cooperate in Organized Teams. *IEEE Transactions on Computational Social Systems.* 2024;13:2514-2530. doi:10.1109/tcss.2025.3637527
 
> [9.1] Through a series of experiments with embodied LLM agents and human–agent collaboration, our results highlight the impact of designated leadership on team efficiency, shedding light on the leadership qualities displayed by LLM agents and their spontaneous cooperative behaviors. (Abstract)
 
> [9.2] and reduce unnecessary communication steps. (Body)
 
> [9.3] However, LLM agents tend to over-report and comply with any instruction, which may result in information redundancy and confusion in multiagent cooperation. (Abstract)
 
`10.` Sun C, Huang S, Pompili D. LLM-Based Multi-Agent Decision-Making: Challenges and Future Directions. *IEEE Robotics and Automation Letters.* 2025;10:5681-5688. doi:10.1109/lra.2025.3562371
 
> [10.1] Although research on LLM-as-an-agent has shown that LLM can be applied to Decision-Making (DM) and achieve decent results, the extension of LLM-based agents to Multi-Agent DM (MADM) is not trivial, as many aspects, such as coordination and communication between agents, are not considered in the DM frameworks of a single agent. (Abstract)
 
`11.` Liu G, Geng S, Li S, et al. WebCoach: Self-Evolving Web Agents with Cross-Session Memory Guidance. *ArXiv.* 2025;abs/2511.12997. doi:10.48550/arxiv.2511.12997
 
> [11.1] With a 38B model, it increases task success rates from 47% to 61% while reducing or maintaining the average number of steps. (Abstract)
 
> [11.2] Notably, smaller base models with WebCoach achieve performance comparable to the same web agent using GPT-4o. (Abstract)
 
`12.` Pedada S, Dhavala A, Patil N. Shared Selective Persistent Memory for Agentic LLM Systems. *ArXiv.* 2026;abs/2607.09493. doi:10.48550/arxiv.2607.09493
 
> [12.1] In a controlled replication on four public datasets, where a formatting specification is established once and then withheld, no memory completes 0/12 trials at 3.8K input tokens, selective memory completes 12/12 at 3.9K, and full conversation history completes 8/12 at 7.7K. (Abstract)
 
> [12.2] What is kept matters more than how much is kept: the winning configuration costs essentially what the failing one does, and twice as much context does not improve on it. (Abstract)
 
> [12.3] These are useful within a session but harmful across sessions. (Introduction)
 
> [12.4] A complementary zero-token data refresh contract decouples generated programs from runtime data, firing on 12/12 trials at a median 0.08s with no model call, while summary-driven data representation costs 97-431x fewer tokens than raw injection. (Abstract)
 
`13.` Du P. Memory for Autonomous LLM Agents:Mechanisms, Evaluation, and Emerging Frontiers. *ArXiv.* 2026;abs/2603.07670. doi:10.48550/arxiv.2603.07670
 
> [13.1] Working memory in the context window; long-term records in an external vector or structured store. (Body)
 
> [13.2] Our recommendation: start with Pattern B, instrument it thoroughly, and graduate to Pattern C only when empirical data shows that learned control meaningfully improves your target workload. (Body)
 
`14.` Shen Y, Li K, Zhou W, Hu S. Mem2ActBench: A Benchmark for Evaluating Long-Term Memory Utilization in Task-Oriented Autonomous Agents. *ArXiv.* 2026;abs/2601.19935. doi:10.48550/arxiv.2601.19935
 
> [14.1] From these memory chains, a reverse-generation method produces 400 tool-use tasks, with human evaluation confirming 91.3\% are strongly memory-dependent. (Abstract)
 
`15.` Zhang H, Huang J, Mei K, et al. Agent Security Bench (ASB): Formalizing and Benchmarking Attacks and Defenses in LLM-based Agents. *ArXiv.* 2024;abs/2410.02644. doi:10.48550/arxiv.2410.02644
 
> [15.1] Our benchmark results reveal critical vulnerabilities in different stages of agent operation, including system prompt, user prompt handling, tool usage, and memory retrieval, with the highest average attack success rate of 84.30\%, but limited effectiveness shown in current defenses, unveiling important works to be done in terms of agent security for the community. (Abstract)
 
> [15.2] Based on ASB, we benchmark 10 prompt injection attacks, a memory poisoning attack, a novel Plan-of-Thought backdoor attack, 4 mixed attacks, and 11 corresponding defenses across 13 LLM backbones. (Abstract)
 
`16.` Ferrag M, Tihanyi N, Hamouda D, Maglaras LA, Debbah M. From Prompt Injections to Protocol Exploits: Threats in LLM-Powered AI Agents Workflows. *ICT Express.* 2025;12:353-383. doi:10.1016/j.icte.2025.12.001
 
> [16.1] - 5) Toxic Agent Flow attack: The Toxic Agent Flow attack is a critical vulnerability in the widely used GitHub MCP server, discovered by Invariant Labs [51], which allows attackers to hijack a user's agent through malicious GitHub issues, leading to the leakage of private repository data. (Body)
 
> [16.2] Once the agent interacts with the malicious issue, it is coerced into pulling private repository data into the context and leaking it in an open pull request, accessible to the attacker or anyone else. (Body)
 
> [16.3] We systematically categorize more than thirty attack techniques spanning input manipulation, model compromise, system and privacy attacks, and protocol-level vulnerabilities. (Abstract)
 
> [16.4] Despite this progress, tool integration remains siloed and labor-intensive. (Introduction)
 
> [16.5] However, the rapid growth of plugins, connectors, and inter-agent protocols has outpaced security practices, leading to brittle integrations that rely on ad-hoc authentication, inconsistent schemas, and weak validation. (Abstract)
 
`17.` Narisetty P, Kore S, Kattamanchi UKR, Kumarapu J. Adaptive Evaluation of Out-of-Band Defenses Against Prompt Injection in LLM Agents. *ArXiv.* 2026;abs/2606.26479. doi:10.48550/arxiv.2606.26479
 
> [17.1] Recent work (2024 to 2026) has converged on a strategy for defending tool-using LLM agents against indirect prompt injection: rather than training the model to refuse malicious instructions, enforce security outside the model with a deterministic policy that mediates the agent's actions. (Abstract)
 
> [17.2] Averaged over three runs, the defense held: Progent cut mean attack success roughly sixfold (25.8% to 4.2%), and a hand-crafted adaptive attack did not raise it (2.6%). (Abstract)
 
> [17.3] For LaunchSafe the working implication is to build defense on deterministic, out-of-band actionmediation as the most promising foundation against an adaptive attacker, while treating the real open problems as cost, deployability, and the harder attacks not yet run , and remembering that its robustness against a serious optimized adaptive attacker is, on the evidence here, still unproven. (Conclusion)
 
`18.` Li H, Liu X, Chiu H, Li D, Zhang N, Xiao C. DRIFT: Dynamic Rule-Based Defense with Injection Isolation for Securing LLM Agents. *ArXiv.* 2025;abs/2506.12104. doi:10.48550/arxiv.2506.12104
 
> [18.1] A Secure Planner first constructs a minimal function trajectory and a JSON-schema-style parameter checklist for each function node based on the user query. (Abstract)
 
> [18.2] Finally, an Injection Isolator detects and masks any instructions that may conflict with the user query from the memory stream to mitigate long-term risks. (Abstract)
 
`19.` Zhang K, Su Z, Chen P, Bertino E, Zhang X, Li N. LLM Agents Should Employ Security Principles. *ArXiv.* 2025;abs/2505.24019. doi:10.48550/arxiv.2505.24019
 
> [19.1] Takeaway: We present AgentSandbox, a conceptual framework that operationalizes this imperative by illustrating how deploying security principles such as defense-in-depth, least privilege, complete mediation, and psychological acceptability help secure agentic AI systems. (Body)
 
> [19.2] To illustrate this approach, we introduce AgentSandbox, a conceptual framework embedding these security principles to provide safeguards throughout an agent's life-cycle. (Abstract)
 
`20.` Brady S. Springdrift: An Auditable Persistent Runtime for LLM Agents with Case-Based Memory, Normative Safety, and Ambient Self-Perception. *ArXiv.* 2026;abs/2604.04660. doi:10.48550/arxiv.2604.04660
 
> [20.1] The request\_human\_input tool, available to sub-agents, was injecting prompts into the cognitive loop's input channel as if they were operator input-meaning a sub-agent could effectively impersonate the operator. (Body)
 
> [20.2] The vulnerability was confirmed, and the tool was replaced with structured return values. (Body)
