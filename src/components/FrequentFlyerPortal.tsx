import type { ReactElement } from 'react'
import type { MemberData } from './MemberProfile'
import type { FlightTransaction } from './FlightActivity'
import type { RewardFlight } from './RewardSearch'

export interface FrequentFlyerPortalProps {
  initialMember?: MemberData | null
  initialTransactions?: FlightTransaction[] | null
  availableRewardFlights?: RewardFlight[]
  isLoading?: boolean
}

export function FrequentFlyerPortal(
  props: FrequentFlyerPortalProps
): ReactElement | null {
  void props
  // Stub: Unimplemented for TDD RED phase
  return null
}
