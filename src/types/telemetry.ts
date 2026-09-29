import { z } from 'zod';

export const MetricSeveritySchema = z.enum(['normal', 'warning', 'critical', 'optimal']);

export const KpiPulseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  value: z.number(),
  formattedValue: z.string().min(1),
  unit: z.string().min(1),
  changePercentage24h: z.number(),
  targetBenchmark: z.number(),
  severity: MetricSeveritySchema,
  trend: z.enum(['up', 'down', 'stable']),
});

export const EfficiencyGainSchema = z.object({
  category: z.string().min(1),
  headlineMetric: z.string().min(1),
  savingsRatio: z.string().min(1),
  hoursAutomatedPerWeek: z.number().positive(),
  costReductionPercentage: z.number().positive(),
  humanInterventionDrop: z.number().positive(),
  description: z.string().min(1),
});

export const EventCategorySchema = z.enum([
  'agent_dispatch',
  'pipeline_sync',
  'anomaly_detected',
  'state_transition',
  'failover_recovery',
]);

export const EventStreamEntrySchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  sourceHub: z.string().min(1),
  eventCategory: EventCategorySchema,
  message: z.string().min(1),
  status: z.enum(['success', 'pending', 'alert', 'info']),
  latencyMs: z.number().nonnegative(),
});

export const TelemetryConfigSchema = z.object({
  refreshIntervalMs: z.number().positive(),
  kpiPulses: z.array(KpiPulseSchema).min(1),
  efficiencyGains: z.array(EfficiencyGainSchema).min(1),
  initialEvents: z.array(EventStreamEntrySchema).min(1),
});

export type MetricSeverity = z.infer<typeof MetricSeveritySchema>;
export type KpiPulse = z.infer<typeof KpiPulseSchema>;
export type EfficiencyGain = z.infer<typeof EfficiencyGainSchema>;
export type EventCategory = z.infer<typeof EventCategorySchema>;
export type EventStreamEntry = z.infer<typeof EventStreamEntrySchema>;
export type TelemetryConfig = z.infer<typeof TelemetryConfigSchema>;
