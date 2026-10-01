/** Days where Jev is part of the control-plane story, not an add-on layer. */
export const JEV_CORE_INTEGRATION_DAYS = new Set([1, 10, 14, 17, 20, 29, 30, 31])

export function isJevCoreIntegration(day: number): boolean {
  return JEV_CORE_INTEGRATION_DAYS.has(day)
}

const JEV_FEATURE_PATTERN =
  /^(Jev |LLM \+ Jev |Agent harness default|Calibrated escalation|Default agent harness)/

export function splitPromptFeatures(features: string[]): { coreFeatures: string[]; jevLayerFeatures: string[] } {
  const coreFeatures: string[] = []
  const jevLayerFeatures: string[] = []

  for (const feature of features) {
    if (JEV_FEATURE_PATTERN.test(feature)) {
      jevLayerFeatures.push(feature)
    } else {
      coreFeatures.push(feature)
    }
  }

  return { coreFeatures, jevLayerFeatures }
}
