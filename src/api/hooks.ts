import { useQuery } from '@tanstack/react-query';
import { api } from './client';
import type { Scope } from './types';

export function useKGIs(scope?: Scope) {
  return useQuery({
    queryKey: ['kgis', scope],
    queryFn: () => api.getKGIs(scope)
  });
}

export function useKPIs(kgiId?: string) {
  return useQuery({
    queryKey: ['kpis', kgiId],
    queryFn: () => api.getKPIs(kgiId)
  });
}

export function useRevenueTrend(scope: Scope, period: string) {
  return useQuery({
    queryKey: ['revenue-trend', scope, period],
    queryFn: () => api.getRevenueTrend(scope, period)
  });
}

export function useTasks(scope: Scope) {
  return useQuery({
    queryKey: ['tasks', scope],
    queryFn: () => api.getTasks(scope)
  });
}

export function useAlerts(scope: Scope) {
  return useQuery({
    queryKey: ['alerts', scope],
    queryFn: () => api.getAlerts(scope)
  });
}

export function useProjects(scope: Scope) {
  return useQuery({
    queryKey: ['projects', scope],
    queryFn: () => api.getProjects(scope)
  });
}

export function useSalesPipeline(scope: Scope) {
  return useQuery({
    queryKey: ['sales-pipeline', scope],
    queryFn: () => api.getSalesPipeline(scope)
  });
}