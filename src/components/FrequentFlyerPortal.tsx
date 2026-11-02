import { useState, type ReactElement } from 'react'
import { MemberProfile, type MemberData } from './MemberProfile'
import { FlightActivity, type FlightTransaction } from './FlightActivity'
import { RewardSearch, type RewardFlight } from './RewardSearch'
import './FrequentFlyerPortal.css'

export interface FrequentFlyerPortalProps {
  initialMember?: MemberData | null
  initialTransactions?: FlightTransaction[] | null
  availableRewardFlights?: RewardFlight[]
  isLoading?: boolean
}

const STORAGE_KEYS = {
  MEMBER: 'ffp_member_data',
  TRANSACTIONS: 'ffp_transactions_data',
}

// Initial fictional demo member data
const DEFAULT_MEMBER: MemberData = {
  id: 'FF-892147',
  name: 'Sarah Connor',
  tier: 'Silver',
  activeMiles: 50000,
}

// Initial fictional demo flight transactions
const DEFAULT_TRANSACTIONS: FlightTransaction[] = [
  {
    id: 'tx-101',
    flightNumber: 'AA-104',
    departure: 'JFK',
    arrival: 'LHR',
    date: '2026-10-12',
    miles: 3450,
    type: 'Earned',
  },
  {
    id: 'tx-102',
    flightNumber: 'BA-2490',
    departure: 'LHR',
    arrival: 'DXB',
    date: '2026-09-28',
    miles: 25000,
    type: 'Redeemed',
  },
]

// Default available reward flights catalogue
const DEFAULT_REWARD_FLIGHTS: RewardFlight[] = [
  {
    id: 'rf-101',
    flightNumber: 'RF-101',
    origin: 'JFK',
    destination: 'LHR',
    date: '2026-11-20',
    requiredMiles: 30000,
  },
  {
    id: 'rf-202',
    flightNumber: 'RF-202',
    origin: 'JFK',
    destination: 'LHR',
    date: '2026-11-20',
    requiredMiles: 30000,
  },
  {
    id: 'rf-303',
    flightNumber: 'RF-303',
    origin: 'LAX',
    destination: 'HND',
    date: '2026-12-05',
    requiredMiles: 75000,
  },
]

/**
 * Validates member data record defensively.
 */
function isValidMember(data: unknown): data is MemberData {
  if (!data || typeof data !== 'object') return false
  const m = data as Partial<MemberData>
  return (
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.tier === 'string' &&
    typeof m.activeMiles === 'number' &&
    Number.isFinite(m.activeMiles)
  )
}

/**
 * Validates transaction record defensively.
 */
function isValidTransaction(tx: unknown): tx is FlightTransaction {
  if (!tx || typeof tx !== 'object') return false
  const t = tx as Partial<FlightTransaction>
  return (
    typeof t.id === 'string' &&
    typeof t.flightNumber === 'string' &&
    typeof t.departure === 'string' &&
    typeof t.arrival === 'string' &&
    typeof t.date === 'string' &&
    typeof t.miles === 'number' &&
    Number.isFinite(t.miles) &&
    (t.type === 'Earned' || t.type === 'Redeemed')
  )
}

/**
 * Safely reads JSON data from localStorage with graceful fallback.
 */
function loadPersistedData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Safely writes JSON data to localStorage.
 */
function persistData<T>(key: string, data: T): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Gracefully handle storage quota or privacy restrictions
  }
}

export function FrequentFlyerPortal({
  initialMember,
  initialTransactions,
  availableRewardFlights = DEFAULT_REWARD_FLIGHTS,
  isLoading = false,
}: FrequentFlyerPortalProps): ReactElement {
  // Initialize state with props or fallback to safe persisted/default data
  const [member, setMember] = useState<MemberData | null>(() => {
    if (initialMember !== undefined) {
      return initialMember
    }
    const loaded = loadPersistedData<unknown>(STORAGE_KEYS.MEMBER, null)
    return isValidMember(loaded) ? loaded : DEFAULT_MEMBER
  })

  const [transactions, setTransactions] = useState<FlightTransaction[]>(() => {
    if (initialTransactions !== undefined) {
      return Array.isArray(initialTransactions) ? initialTransactions : []
    }
    const loaded = loadPersistedData<unknown>(
      STORAGE_KEYS.TRANSACTIONS,
      null
    )
    if (Array.isArray(loaded)) {
      const valid = loaded.filter(isValidTransaction)
      if (valid.length > 0) return valid
    }
    return DEFAULT_TRANSACTIONS
  })

  const [redeemedFlightIds, setRedeemedFlightIds] = useState<string[]>([])
  const [isRedeeming, setIsRedeeming] = useState(false)

  // Handles reward flight redemption with cross-component consistency
  const handleRedeemFlight = (flight: RewardFlight) => {
    if (
      isRedeeming ||
      isLoading ||
      !flight ||
      !member ||
      typeof flight.requiredMiles !== 'number' ||
      !Number.isFinite(flight.requiredMiles) ||
      flight.requiredMiles <= 0 ||
      member.activeMiles < flight.requiredMiles ||
      redeemedFlightIds.includes(flight.id)
    ) {
      return
    }

    setIsRedeeming(true)

    try {
      const updatedMiles = member.activeMiles - flight.requiredMiles
      const updatedMember: MemberData = {
        ...member,
        activeMiles: updatedMiles,
      }

      const newTransaction: FlightTransaction = {
        id: `tx-redemption-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        flightNumber: flight.flightNumber,
        departure: flight.origin,
        arrival: flight.destination,
        date: flight.date,
        miles: flight.requiredMiles,
        type: 'Redeemed',
      }

      const updatedTransactions = [newTransaction, ...transactions]

      // Update state synchronously
      setMember(updatedMember)
      setTransactions(updatedTransactions)
      setRedeemedFlightIds((prev) => [...prev, flight.id])

      // Persist updated state safely
      persistData(STORAGE_KEYS.MEMBER, updatedMember)
      persistData(STORAGE_KEYS.TRANSACTIONS, updatedTransactions)

      // Primary action telemetry logging
      console.log(
        '[Analytics] User interacted with End-to-End Frequent Flyer Portal'
      )
    } finally {
      setIsRedeeming(false)
    }
  }

  // Loading View
  if (isLoading) {
    return (
      <main className="portal-container" aria-label="Frequent Flyer Portal">
        <div className="portal-loading" role="status" aria-live="polite">
          <span className="portal-loading-spinner" aria-hidden="true" />
          <p className="portal-loading-text">
            Loading Frequent Flyer Portal...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="portal-container" aria-label="Frequent Flyer Portal">
      <header className="portal-header">
        <h1 className="portal-title">Frequent Flyer Portal</h1>
        <p className="portal-subtitle">
          Manage member tier status, flight ledger, and miles redemption.
        </p>
      </header>

      <div className="portal-grid">
        {/* Section 1: Member Profile */}
        <section className="portal-section" aria-label="Member Status Overview">
          <MemberProfile member={member} />
        </section>

        {/* Section 2: Reward Flight Search & Redemption Calculator */}
        <section
          className="portal-section"
          aria-label="Reward Search and Redemption"
        >
          <RewardSearch
            availableMiles={member?.activeMiles ?? 0}
            availableFlights={availableRewardFlights}
            redeemedFlightIds={redeemedFlightIds}
            onRedeem={handleRedeemFlight}
          />
        </section>

        {/* Section 3: Flight Activity Ledger */}
        <section
          className="portal-section"
          aria-label="Flight History and Activity"
        >
          <FlightActivity transactions={transactions} />
        </section>
      </div>
    </main>
  )
}
