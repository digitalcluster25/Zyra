// Rule-based AI Insights engine for Zyra
export interface Insight {
  id: string;
  userId: string;
  insightText: string;
  insightType: string;
  meta: any;
  severity: 'low' | 'med' | 'high';
  isRead: boolean;
  createdAt: Date;
}

export function detectInsights(data: {
  acwr?: number;
  hrvDropPct?: number;
  subjectiveStressHigh?: boolean;
  hrvTrend?: string;
  tss?: number;
  subjectives?: any;
}): Insight[] {
  const insights: Insight[] = [];
  // Пример правила: ACWR > 1.25 и HRV_drop_pct > 12%
  if (data.acwr && data.acwr > 1.25 && data.hrvDropPct && data.hrvDropPct > 12) {
    insights.push({
      id: '', userId: '',
      insightText: 'Возможное недовосстановление',
      insightType: 'recovery',
      meta: { acwr: data.acwr, hrvDropPct: data.hrvDropPct },
      severity: 'med', isRead: false, createdAt: new Date()
    });
  }
  // Пример: высокий стресс + падение HRV
  if (data.subjectiveStressHigh && data.hrvTrend === 'down') {
    insights.push({
      id: '', userId: '',
      insightText: 'Внешний стресс влияет на восстановление',
      insightType: 'stress',
      meta: { hrvTrend: data.hrvTrend, subjectives: data.subjectives },
      severity: 'med', isRead: false, createdAt: new Date()
    });
  }
  return insights;
}
