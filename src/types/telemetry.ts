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

export const OperationsDeckSchema = z.object({
  badge: z.string().min(1),
  title: z.string().min(1),
  titleHighlight: z.string().min(1),
  subtitle: z.string().min(1),
  adminButtonText: z.string().min(1),
});

export const AgentFrameworkSchema = z.enum(['langgraph', 'crewai', 'autogen', 'mcp', 'custom']);

export const AgentTraceEventSchema = z.object({
  id: z.string().min(1),
  traceId: z.string().min(1),
  framework: AgentFrameworkSchema,
  agentId: z.string().min(1),
  cloudRegion: z.string().min(1),
  action: z.string().min(1),
  promptTokens: z.number().nonnegative(),
  completionTokens: z.number().nonnegative(),
  estimatedCostUsd: z.number().nonnegative(),
  latencyMs: z.number().nonnegative(),
  confidenceScore: z.number().min(0).max(1), // Drives shader dispersion
  driftVariance: z.number().min(0).max(1),   // Drives shader turbulence
  status: z.enum(['success', 'throttled', 'circuit_broken', 'intercepted']),
  timestamp: z.string().min(1),
});

export const FleetPolicyConstraintsSchema = z.object({
  operatingMode: z.enum(['autonomous', 'human_in_loop', 'strict_circuit_breaker', 'safe_dry_run']),
  maxSpendPerMinuteUsd: z.number().positive(),
  p99LatencyCutoffMs: z.number().positive(),
  confidenceFloor: z.number().min(0).max(1),
  circuitBreakerTripped: z.boolean(),
  updatedAt: z.string().min(1),
});

export const TelemetryConfigSchema = z.object({
  refreshIntervalMs: z.number().positive(),
  kpiPulses: z.array(KpiPulseSchema).min(1),
  efficiencyGains: z.array(EfficiencyGainSchema).min(1),
  initialEvents: z.array(EventStreamEntrySchema).min(1),
  initialAgentTraces: z.array(AgentTraceEventSchema).default([]),
  defaultPolicy: FleetPolicyConstraintsSchema,
  operationsDeck: OperationsDeckSchema,
});

export type MetricSeverity = z.infer<typeof MetricSeveritySchema>;
export type KpiPulse = z.infer<typeof KpiPulseSchema>;
export type EfficiencyGain = z.infer<typeof EfficiencyGainSchema>;
export type EventCategory = z.infer<typeof EventCategorySchema>;
export type EventStreamEntry = z.infer<typeof EventStreamEntrySchema>;
export type AgentFramework = z.infer<typeof AgentFrameworkSchema>;
export type AgentTraceEvent = z.infer<typeof AgentTraceEventSchema>;
export type FleetPolicyConstraints = z.infer<typeof FleetPolicyConstraintsSchema>;
export type OperationsDeckConfig = z.infer<typeof OperationsDeckSchema>;
export type TelemetryConfig = z.infer<typeof TelemetryConfigSchema>;
