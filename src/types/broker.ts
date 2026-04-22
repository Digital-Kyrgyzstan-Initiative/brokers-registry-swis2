export interface Broker {
  id: number
  inn: string
  certificateExpiryDate: string
  legalEntityName: string
  legalAddress: string
  phone: string
  email: string
  status: string
}

export interface BrokerMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number | [number, number]
}

export interface BrokerListResponse {
  data: Broker[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: BrokerMeta
}

export type SortByField = 'createdAt' | 'inn'
export type SortOrderField = 'asc' | 'desc'
