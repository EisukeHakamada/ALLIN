import { z } from 'zod';

// Common types
export const ScopeSchema = z.object({
  type: z.enum(['organization', 'division', 'team', 'user']),
  id: z.string()
});

export type Scope = z.infer<typeof ScopeSchema>;

// KPI types
export const KPISchema = z.object({
  id: z.string(),
  scope_type: z.enum(['organization', 'division', 'team', 'user']),
  scope_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  target_value: z.number(),
  actual_value: z.number(),
  unit: z.string(),
  auto_collect: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().nullable()
});

export type KPI = z.infer<typeof KPISchema>;