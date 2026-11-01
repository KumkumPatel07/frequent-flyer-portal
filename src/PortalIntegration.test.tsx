import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FrequentFlyerPortal } from './components/FrequentFlyerPortal'
import type { MemberData } from './components/MemberProfile'
import type { FlightTransaction } from './components/FlightActivity'
import type { RewardFlight } from './components/RewardSearch'

describe('End-to-End Frequent Flyer Portal Integration (TDD RED Phase)', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  const mockMember: MemberData = {
    id: 'FF-892147',
    name: 'Sarah Connor',
    tier: 'Silver',
    activeMiles: 50000,
  }

  const mockInitialTransactions: FlightTransaction[] = [
    {
      id: 'tx-101',
      flightNumber: 'AA-104',
      departure: 'JFK',
      arrival: 'LHR',
      date: '2026-10-12',
      miles: 3450,
      type: 'Earned',
    },
  ]

  const mockAvailableFlights: RewardFlight[] = [
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
  ]

  // Requirement 1: Main dashboard renders Member Profile, Flight Activity, and Reward Search sections together
  it('renders Member Profile, Flight Activity, and Reward Search sections together in main dashboard', () => {
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
      />
    )

    // Verify Member Profile section is present
    expect(
      screen.getByRole('heading', { level: 2, name: /Sarah Connor/i })
    ).toBeInTheDocument()

    // Verify Flight Activity section is present
    expect(
      screen.getByRole('heading', { level: 2, name: /Flight Activity & Miles Ledger/i })
    ).toBeInTheDocument()

    // Verify Reward Flight Search section is present
    expect(
      screen.getByRole('heading', { level: 2, name: /Reward Flight Search/i })
    ).toBeInTheDocument()
  })

  // Requirement 2: Member information and available miles are shared consistently across the portal
  it('shares member info and available miles consistently across profile and search sections', () => {
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
      />
    )

    // Profile displays member active miles (50,000)
    expect(screen.getByText('50,000')).toBeInTheDocument()

    // Search balance chip displays consistent available miles
    const balanceChip = screen.getByLabelText(/available miles balance/i)
    expect(within(balanceChip).getByText(/50,000 miles/i)).toBeInTheDocument()
  })

  // Requirement 3: Reward flight search works inside the integrated dashboard
  it('allows searching reward flights inside the integrated dashboard', async () => {
    const user = userEvent.setup()
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
      />
    )

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
    await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    expect(screen.getByText('RF-101')).toBeInTheDocument()
    expect(screen.getByText(/30,000 miles/i)).toBeInTheDocument()
  })

  // Requirement 4 & 5: Successful redemption updates balance, ledger, prevents overdrawn redemption, and logs telemetry
  it('completes reward redemption, synchronizes ledger/profile miles, prevents over-redemption, and logs analytics', async () => {
    const user = userEvent.setup()
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
      />
    )

    // 1. Search for reward flights
    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
    await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    // 2. Click redeem on first eligible flight RF-101 (30,000 miles)
    const redeemBtn = screen.getByRole('button', { name: /redeem flight rf-101/i })
    await user.click(redeemBtn)

    // 3. Verify exact analytics telemetry was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] User interacted with End-to-End Frequent Flyer Portal'
    )

    // 4. Verify balance updated across portal (50,000 - 30,000 = 20,000)
    expect(screen.getByText('20,000')).toBeInTheDocument()
    const balanceChip = screen.getByLabelText(/available miles balance/i)
    expect(within(balanceChip).getByText(/20,000 miles/i)).toBeInTheDocument()

    // 5. Verify ledger updated with new redeemed transaction (-30,000)
    expect(screen.getByText(/-30,000/)).toBeInTheDocument()
    expect(screen.getByText('RF-101')).toBeInTheDocument()

    // 6. Verify second flight requiring 30,000 miles is now blocked (only 20,000 available)
    const disabledBtn = screen.getByRole('button', {
      name: /insufficient miles to redeem rf-202/i,
    })
    expect(disabledBtn).toBeDisabled()
  })

  // Requirement 6: Empty data states display "No data found"
  it('displays "No data found" in sections with empty data', () => {
    render(
      <FrequentFlyerPortal
        initialMember={null}
        initialTransactions={[]}
        availableRewardFlights={[]}
      />
    )

    const noDataMessages = screen.getAllByText(/no data found/i)
    expect(noDataMessages.length).toBeGreaterThan(0)
  })

  // Requirement 7: Loading states are accessible and visible during asynchronous operations
  it('displays an accessible loading indicator when isLoading is true', () => {
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
        isLoading={true}
      />
    )

    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toHaveTextContent(/loading/i)
  })

  // Requirement 8 & 10: Invalid data and missing persisted data do not crash portal
  it('initializes safely without crashing when persisted data is missing or malformed', () => {
    const malformedTransactions = [{ id: 'corrupt' } as unknown as FlightTransaction]

    expect(() =>
      render(
        <FrequentFlyerPortal
          initialMember={undefined}
          initialTransactions={malformedTransactions}
          availableRewardFlights={undefined}
        />
      )
    ).not.toThrow()
  })

  // Requirement 9: Interactive elements remain keyboard accessible and properly labelled
  it('ensures interactive elements throughout the portal support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <FrequentFlyerPortal
        initialMember={mockMember}
        initialTransactions={mockInitialTransactions}
        availableRewardFlights={mockAvailableFlights}
      />
    )

    // User can tab into interactive controls
    await user.tab()
    expect(document.activeElement).not.toBeNull()
    expect(document.activeElement).toHaveAttribute('aria-label')
  })
})
