import type { ReactElement } from 'react'

export interface RewardFlight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  date: string
  requiredMiles: number
}

export interface RewardSearchParams {
  origin: string
  destination: string
  date: string
}

export interface RewardSearchProps {
  availableMiles: number
  availableFlights?: RewardFlight[]
  isLoading?: boolean
  onRedeem?: (flight: RewardFlight) => void
  onSearch?: (criteria: RewardSearchParams) => void
}

export function RewardSearch(props: RewardSearchProps): ReactElement | null {
  void props
  // Stub: Unimplemented for TDD RED phase
  return null
}
