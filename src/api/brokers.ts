import type { Broker, BrokerListResponse, SortByField, SortOrderField } from '../types/broker'



export interface FetchBrokersParams {
  page: number
  pageSize: number
  nameSearch: string
  innSearch: string
  sortBy: SortByField
  sortOrder: SortOrderField
}

function buildUrl(params: FetchBrokersParams): string {
  const sp = new URLSearchParams()
  sp.set('page', String(params.page))
  sp.set('per_page', String(params.pageSize))
  sp.set('sortBy', params.sortBy)
  sp.set('sortOrder', params.sortOrder)

  if (params.nameSearch.trim()) {
    sp.set('filter[legalEntityName][contains-ilike]', params.nameSearch.trim())
  }
  if (params.innSearch.trim()) {
    sp.set('filter[inn][exact]', params.innSearch.trim())
  }

  return `/api/broker/list?${sp.toString()}`
}

function dedup(brokers: Broker[]): Broker[] {
  const seen = new Set<number>()
  return brokers.filter(r => !seen.has(r.id) && seen.add(r.id))
}

function parseTotal(total: number | [number, number]): number {
  return Array.isArray(total) ? total[0] : total
}

export async function fetchBrokers(
  params: FetchBrokersParams
): Promise<{ data: Broker[]; total: number }> {
  const response = await fetch(buildUrl(params))

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const json: BrokerListResponse = await response.json()

  return {
    data: dedup(json.data),
    total: parseTotal(json.meta.total),
  }
}
