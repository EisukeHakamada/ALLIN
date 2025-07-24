import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface QueryParams {
  scopeType: 'organization' | 'division' | 'team' | 'user';
  scopeId: string;
  period?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    let data;

    // Extract query parameters for GET requests
    const params: QueryParams = {
      scopeType: url.searchParams.get('scopeType') as QueryParams['scopeType'],
      scopeId: url.searchParams.get('scopeId') || '',
      period: url.searchParams.get('period') || 'month'
    };

    switch (req.method) {
      case 'GET':
        switch (endpoint) {
          case 'kgis':
            data = await getKGIs(supabase, params);
            break;
          case 'kpis':
            data = await getKPIs(supabase, params);
            break;
          case 'revenue-trend':
            data = await getRevenueTrend(supabase, params);
            break;
          case 'tasks':
            data = await getTasks(supabase, params);
            break;
          case 'alerts':
            data = await getAlerts(supabase, params);
            break;
          case 'projects':
            data = await getProjects(supabase, params);
            break;
          case 'sales-pipeline':
            data = await getSalesPipeline(supabase, params);
            break;
        }
        break;

      case 'POST':
        const body = await req.json();
        switch (endpoint) {
          case 'kgis':
            data = await createKGI(supabase, body);
            break;
          case 'kpis':
            data = await createKPI(supabase, body);
            break;
        }
        break;

      case 'PUT':
        const updateBody = await req.json();
        const id = url.searchParams.get('id');
        if (!id) throw new Error('ID is required for updates');

        switch (endpoint) {
          case 'kgis':
            data = await updateKGI(supabase, id, updateBody);
            break;
          case 'kpis':
            data = await updateKPI(supabase, id, updateBody);
            break;
        }
        break;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// KGI functions
async function getKGIs(supabase: any, params: QueryParams) {
  const { data, error } = await supabase
    .from('kgis')
    .select('*')
    .eq('scope_type', params.scopeType)
    .eq('scope_id', params.scopeId);

  if (error) throw error;
  return data;
}

async function createKGI(supabase: any, data: {
  title: string;
  description?: string;
  periodType: string;
  periodValue: string;
  scopeType: string;
  scopeId: string;
  organizationId: string;
}) {
  const { data: kgi, error } = await supabase
    .from('kgis')
    .insert([{
      title: data.title,
      description: data.description,
      period_type: data.periodType,
      period_value: data.periodValue,
      scope_type: data.scopeType,
      scope_id: data.scopeId,
      organization_id: data.organizationId
    }])
    .select()
    .single();

  if (error) throw error;
  return kgi;
}

async function updateKGI(supabase: any, id: string, data: {
  title?: string;
  description?: string;
  periodType?: string;
  periodValue?: string;
}) {
  const { data: kgi, error } = await supabase
    .from('kgis')
    .update({
      title: data.title,
      description: data.description,
      period_type: data.periodType,
      period_value: data.periodValue
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return kgi;
}

// KPI functions
async function getKPIs(supabase: any, params: QueryParams) {
  const { data, error } = await supabase
    .from('kpis')
    .select(`
      *,
      kgi:kgi_id (
        title,
        period_type,
        period_value
      )
    `)
    .eq('scope_type', params.scopeType)
    .eq('scope_id', params.scopeId);

  if (error) throw error;
  return data;
}

async function createKPI(supabase: any, data: {
  kgiId: string;
  title: string;
  description?: string;
  aggregation: string;
  unit: string;
  targetValue: number;
  actualValue?: number;
  autoCollect?: boolean;
}) {
  const { data: kpi, error } = await supabase
    .from('kpis')
    .insert([{
      kgi_id: data.kgiId,
      title: data.title,
      description: data.description,
      aggregation: data.aggregation,
      unit: data.unit,
      target_value: data.targetValue,
      actual_value: data.actualValue || 0,
      auto_collect: data.autoCollect || false
    }])
    .select()
    .single();

  if (error) throw error;
  return kpi;
}

async function updateKPI(supabase: any, id: string, data: {
  title?: string;
  description?: string;
  aggregation?: string;
  unit?: string;
  targetValue?: number;
  actualValue?: number;
  autoCollect?: boolean;
}) {
  const { data: kpi, error } = await supabase
    .from('kpis')
    .update({
      title: data.title,
      description: data.description,
      aggregation: data.aggregation,
      unit: data.unit,
      target_value: data.targetValue,
      actual_value: data.actualValue,
      auto_collect: data.autoCollect
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return kpi;
}

// Revenue trend data fetching
async function getRevenueTrend(supabase: any, params: QueryParams) {
  // TODO: Replace with actual database queries
  return [
    { month: '1月', value: 7500000, target: 8000000 },
    { month: '2月', value: 7800000, target: 8500000 },
    { month: '3月', value: 8200000, target: 9000000 },
    { month: '4月', value: 8500000, target: 9500000 },
    { month: '5月', value: 8800000, target: 10000000 }
  ];
}

// Tasks data fetching
async function getTasks(supabase: any, params: QueryParams) {
  // TODO: Replace with actual database queries
  return [
    {
      id: '1',
      title: '企画書の作成',
      status: '進行中',
      priority: 'high',
      dueTime: '2025-03-20',
      project: 'マーケティングキャンペーン'
    },
    {
      id: '2',
      title: 'クライアントミーティング',
      status: '未対応',
      priority: 'medium',
      dueTime: '2025-03-22',
      project: '新規案件'
    }
  ];
}

// Alerts data fetching
async function getAlerts(supabase: any, params: QueryParams) {
  // TODO: Replace with actual database queries
  return [
    {
      id: '1',
      type: 'kpi',
      priority: 'high',
      message: '売上目標の達成が危ぶまれています',
      detail: '現在の進捗率は85%です'
    },
    {
      id: '2',
      type: 'task',
      priority: 'medium',
      message: '期限が近づいているタスクがあります',
      detail: '「企画書の作成」の期限まであと3日です'
    }
  ];
}

// Projects data fetching
async function getProjects(supabase: any, params: QueryParams) {
  // TODO: Replace with actual database queries
  return [
    {
      id: '1',
      name: 'マーケティングキャンペーン2025',
      progress: 65,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      status: 'on_track',
      revenue: {
        forecast: 15000000,
        actual: 12500000
      }
    },
    {
      id: '2',
      name: 'ウェブサイトリニューアル',
      progress: 30,
      startDate: '2025-02-01',
      endDate: '2025-05-31',
      status: 'at_risk',
      revenue: {
        forecast: 8000000,
        actual: 2500000
      }
    }
  ];
}

// Sales pipeline data fetching
async function getSalesPipeline(supabase: any, params: QueryParams) {
  // TODO: Replace with actual database queries
  return {
    total: {
      count: 45,
      value: 75000000
    },
    stages: [
      { name: '商談中', count: 20, value: 35000000 },
      { name: '提案書作成中', count: 15, value: 25000000 },
      { name: '契約交渉中', count: 10, value: 15000000 }
    ],
    metrics: {
      winRate: 35,
      conversionRate: 25,
      avgDealSize: 1800000
    }
  };
}