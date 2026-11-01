import type { ReactElement } from 'react'
import './MemberProfile.css'

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

interface TierRule {
  target: number
  nextTier: TierLevel | null
}

const TIER_RULES: Record<TierLevel, TierRule> = {
  Silver: {
    target: 25000,
    nextTier: 'Gold',
  },
  Gold: {
    target: 50000,
    nextTier: 'Platinum',
  },
  Platinum: {
    target: 100000,
    nextTier: 'Diamond',
  },
  Diamond: {
    target: 100000,
    nextTier: null,
  },
}

/**
 * Sanitizes input string to prevent script injection / XSS risks.
 */
function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }
  return value.replace(/[<>]/g, '').trim()
}

/**
 * Validates and sanitizes numeric miles to non-negative finite integer.
 */
function sanitizeMiles(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.floor(value))
}

export function MemberProfile({ member, onViewBenefits }: MemberProfileProps): ReactElement {
  if (!member || !member.name || !member.id) {
    return (
      <div className="member-profile-container">
        <div className="member-profile-empty" role="status" aria-live="polite">
          <p className="empty-message">No data found</p>
        </div>
      </div>
    )
  }

  const sanitizedName = sanitizeText(member.name)
  const sanitizedId = sanitizeText(member.id)
  const activeMiles = sanitizeMiles(member.activeMiles)

  const currentTier: TierLevel = TIER_RULES[member.tier] ? member.tier : 'Silver'
  const tierRule = TIER_RULES[currentTier]
  const isDiamond = currentTier === 'Diamond'
  const nextTier = tierRule.nextTier

  const remainingMiles = nextTier ? Math.max(0, tierRule.target - activeMiles) : 0
  const progressPercent = isDiamond
    ? 100
    : Math.min(100, Math.max(0, Math.round((activeMiles / tierRule.target) * 100)))

  return (
    <article className="member-profile-container" aria-label="Member Profile">
      <div className="member-profile-card">
        {/* Header: Member Identity & Current Tier */}
        <header className="member-profile-header">
          <div className="member-profile-identity">
            <h2 className="member-name">{sanitizedName}</h2>
            <span className="member-id">Member ID: {sanitizedId}</span>
          </div>
          <span
            className="tier-badge"
            aria-label={`Current tier: ${currentTier}`}
            data-tier={currentTier}
          >
            {currentTier}
          </span>
        </header>

        {/* Stats Row */}
        <section className="member-profile-stats" aria-label="Mileage Summary">
          <div className="stat-item">
            <span className="stat-label">Active Miles</span>
            <span className="stat-value">{activeMiles.toLocaleString()}</span>
          </div>
        </section>

        {/* Tier Progress Section */}
        <section className="member-profile-tier-progress" aria-label="Tier Status Progress">
          {nextTier ? (
            <div className="tier-progress-meta">
              <div className="next-tier-info">
                <span>Next Tier:</span>
                <span className="next-tier-highlight">{nextTier}</span>
              </div>
              <div className="remaining-miles">
                <span>
                  {remainingMiles.toLocaleString()} miles to reach
                </span>
              </div>
            </div>
          ) : (
            <div className="tier-progress-meta">
              <span className="highest-tier-status">Highest Tier Achieved</span>
            </div>
          )}

          <div
            role="progressbar"
            aria-label="Tier progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="progress-track"
          >
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        {/* Interactive Actions */}
        <footer className="member-profile-actions">
          <button
            type="button"
            className="member-profile-btn"
            onClick={onViewBenefits}
            aria-label="View tier benefits"
          >
            View Tier Benefits
          </button>
        </footer>
      </div>
    </article>
  )
}
