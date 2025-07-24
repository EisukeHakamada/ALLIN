import { z } from 'zod';
import type { Scope, KGI, KPI } from './types';

const API_BASE_URL = '/api/v1';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithError(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    
    throw new APIError(
      errorData?.message || 'An error occurred',
      response.status,
      errorData
    );
  }
  
  return response;
}

async function get<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetchWithError(url.toString());
  const data = await response.json();
  return schema.parse(data);
}

async function post<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  data: unknown
): Promise<T> {
  const response = await fetchWithError(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const responseData = await response.json();
  return schema.parse(responseData);
}

export function createAPIClient() {
  return {
    // KPI endpoints
    async getKPIs(scope?: Scope) {
      const params = scope ? {
        scopeType: scope.type,
        scopeId: scope.id
      } : undefined;
      
      return get('/kpis', z.array(KPISchema), params);
    },

    async createKPI(data: {
      scope_type: string;
      scope_id: string;
      name: string;
      description?: string | null;
      target_value: number;
      actual_value: number;
      unit: string;
      auto_collect?: boolean;
    }) {
      return post('/kpis', KPISchema, data);
    },

    async getRevenueTrend(scope: Scope, period: string) {
      return get('/revenue-trend', z.array(z.object({
        month: z.string(),
        value: z.number(),
        target: z.number()
      })), {
        scopeType: scope.type,
        scopeId: scope.id,
        period
      });
    },

    async getTasks(scope: Scope) {
      return get('/tasks', z.array(z.object({
        id: z.string(),
        title: z.string(),
        status: z.string(),
        priority: z.string(),
        dueTime: z.string(),
        project: z.string()
      })), {
        scopeType: scope.type,
        scopeId: scope.id
      });
    },

    async getAlerts(scope: Scope) {
      return get('/alerts', z.array(z.object({
        id: z.string(),
        type: z.string(),
        priority: z.string(),
        message: z.string(),
        detail: z.string()
      })), {
        scopeType: scope.type,
        scopeId: scope.id
      });
    },

    async getProjects(scope: Scope) {
      return get('/projects', z.array(z.object({
        id: z.string(),
        name: z.string(),
        progress: z.number(),
        startDate: z.string(),
        endDate: z.string(),
        status: z.string(),
        revenue: z.object({
          forecast: z.number(),
          actual: z.number()
        })
      })), {
        scopeType: scope.type,
        scopeId: scope.id
      });
    },

    async getSalesPipeline(scope: Scope) {
      return get('/sales-pipeline', z.object({
        total: z.object({
          count: z.number(),
          value: z.number()
        }),
        stages: z.array(z.object({
          name: z.string(),
          count: z.number(),
          value: z.number()
        })),
        metrics: z.object({
          winRate: z.number(),
          conversionRate: z.number(),
          avgDealSize: z.number()
        })
      }), {
        scopeType: scope.type,
        scopeId: scope.id
      });
    }
  };
}

export type APIClient = ReturnType<typeof createAPIClient>;

export const api = createAPIClient();