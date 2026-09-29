import { z } from 'zod';

export const NodeStatusSchema = z.enum(['operational', 'degraded', 'syncing', 'maintenance']);

export const GeoCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  city: z.string().min(1),
  country: z.string().min(1),
  region: z.string().min(1),
});

export const OperationalHubSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: z.enum(['primary', 'edge', 'gateway']),
  status: NodeStatusSchema,
  coordinates: GeoCoordinatesSchema,
  latencyMs: z.number().nonnegative(),
  throughputGbps: z.number().positive(),
  activeAgents: z.number().int().nonnegative(),
  uptimePercentage: z.number().min(0).max(100),
  meshConnections: z.array(z.string()).min(1),
});

export const MessengerSectionSchema = z.object({
  badge: z.string().min(1),
  title: z.string().min(1),
  titleHighlight: z.string().min(1),
  subtitle: z.string().min(1),
  activeCoresLabel: z.string().min(1),
  throughputLabel: z.string().min(1),
  agentsLabel: z.string().min(1),
  syncClockLabel: z.string().min(1),
  hubsUnit: z.string().min(1),
  awaitingSignal: z.string().min(1),
});

export const HubsNetworkSchema = z.object({
  networkName: z.string().min(1),
  topology: z.enum(['full-mesh', 'ring', 'star', 'hybrid']),
  syncFrequencyHz: z.number().positive(),
  hubs: z.array(OperationalHubSchema).length(5),
  section: MessengerSectionSchema,
});

export type NodeStatus = z.infer<typeof NodeStatusSchema>;
export type GeoCoordinates = z.infer<typeof GeoCoordinatesSchema>;
export type OperationalHub = z.infer<typeof OperationalHubSchema>;
export type MessengerSectionConfig = z.infer<typeof MessengerSectionSchema>;
export type HubsNetwork = z.infer<typeof HubsNetworkSchema>;
