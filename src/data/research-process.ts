export const researchProcessDisclosure = {
  label: "AI-assisted, source-governed research",
  short:
    "Language models help discover and structure evidence, but they are never treated as sources and cannot establish product capabilities independently.",
  introduction:
    "HarnessMatch uses language models to help discover, extract, structure, and cross-check information from first-party documentation, official repositories, release notes, and benchmark records admitted by the benchmark policy.",
  governance:
    "Model output is a research aid, not evidence. Every published product claim must remain traceable to an admitted underlying source and a verification date; that source record, not the model response, is authoritative.",
  crossCheck:
    "Different models may be used independently to surface conflicting interpretations and reduce single-model blind spots. Not every claim is processed by every model, and model agreement does not establish accuracy, product capability, or scientific validity. Conflicts and unsupported claims are held for editorial review.",
  stages: [
    {
      label: "Discover",
      description: "Find candidate products, documentation, repositories, releases, and benchmark records.",
    },
    {
      label: "Extract",
      description: "Turn source material into structured candidate claims, dates, versions, and limitations.",
    },
    {
      label: "Cross-check",
      description: "Use independent passes to flag disagreements, missing context, and claims needing closer inspection.",
    },
    {
      label: "Publish",
      description: "Admit only claims with an allowed source, direct traceability, editorial classification, and a verification date.",
    },
  ],
} as const;
