// Rule-based Recovery Score calculation for Zyra
export interface RecoveryComponents {
  hrv?: number; hrvBaseline?: number;
  sleepH?: number; sleepBaselineH?: number;
  rhr?: number; rhrBaseline?: number;
  subjectiveMean?: number; // 1..7 (7 best)
  tss3?: number; tss28Avg?: number;
}

export function computeRecovery(components: RecoveryComponents) {
  // Weights: hrv:0.35, sleep:0.25, rhr:0.15, subj:0.15, load:0.1
  const weights: Record<string, number> = {
    hrv: 0.35, sleep: 0.25, rhr: 0.15, subj: 0.15, load: 0.1
  };
  let usedWeights = { ...weights };
  let score = 0;
  let confidence = 1;
  let totalWeight = 0;

  // HRV
  let hrvScore = undefined;
  if (components.hrv !== undefined && components.hrvBaseline !== undefined) {
    hrvScore = Math.max(0, Math.min(1, (components.hrv - 0.7 * components.hrvBaseline) / (0.3 * components.hrvBaseline)));
    score += hrvScore * weights.hrv;
    totalWeight += weights.hrv;
  } else {
    usedWeights.hrv = 0;
  }
  // Sleep
  let sleepScore = undefined;
  if (components.sleepH !== undefined && components.sleepBaselineH !== undefined) {
    sleepScore = Math.max(0, Math.min(1, components.sleepH / components.sleepBaselineH));
    score += sleepScore * weights.sleep;
    totalWeight += weights.sleep;
  } else {
    usedWeights.sleep = 0;
  }
  // RHR
  let rhrScore = undefined;
  if (components.rhr !== undefined && components.rhrBaseline !== undefined) {
    rhrScore = Math.max(0, Math.min(1, (1.2 * components.rhrBaseline - components.rhr) / (0.2 * components.rhrBaseline)));
    score += rhrScore * weights.rhr;
    totalWeight += weights.rhr;
  } else {
    usedWeights.rhr = 0;
  }
  // Subjective
  let subjScore = undefined;
  if (components.subjectiveMean !== undefined) {
    subjScore = (components.subjectiveMean - 1) / 6;
    score += subjScore * weights.subj;
    totalWeight += weights.subj;
  } else {
    usedWeights.subj = 0;
  }
  // Load
  let loadScore = undefined;
  if (components.tss3 !== undefined && components.tss28Avg !== undefined) {
    loadScore = Math.max(0, Math.min(1, 1 - (components.tss3 / (components.tss28Avg + 1e-6))));
    score += loadScore * weights.load;
    totalWeight += weights.load;
  } else {
    usedWeights.load = 0;
  }

  // Re-normalize weights if missing data
  if (totalWeight < 1e-6) {
    confidence = 0;
    return { score: 0, usedWeights, confidence };
  }
  score = score / totalWeight;

  // Low confidence if baseline < 7 days (handled outside)
  if (confidence > 0.5 && (components.hrvBaseline === undefined || components.sleepBaselineH === undefined || components.rhrBaseline === undefined)) {
    confidence = 0.5;
  }

  return { score: Math.round(score * 100), usedWeights, confidence };
}
