import type { ReactElement } from 'react'

export type TransactionType = 'Earned' | 'Redeemed'

export interface FlightTransaction {
  id: string
  flightNumber: string
  departure: string
  arrival: string
  date: string
  miles: number
  type: TransactionType
}

export interface FlightActivityProps {
  transactions?: FlightTransaction[] | null
  isLoading?: boolean
  onFilterChange?: (query: string) => void
}

export function FlightActivity(props: FlightActivityProps): ReactElement | null {
  void props
  // Stub: Unimplemented for TDD RED phase
  return null
}
