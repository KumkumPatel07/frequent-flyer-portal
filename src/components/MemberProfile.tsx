import type { ReactElement } from 'react'

export type TierLevel = 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

export interface MemberData {
  id: string
  name: string
  tier: TierLevel
  activeMiles: number
}

export interface MemberProfileProps {
  member?: MemberData | null
  onViewBenefits?: () => void
}

export function MemberProfile(props: MemberProfileProps): ReactElement | null {
  void props
  // Stub: Unimplemented for TDD RED phase
  return null
}
