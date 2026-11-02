import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { FrequentFlyerPortal } from './components/FrequentFlyerPortal'
import { RewardSearch, type RewardFlight } from './components/RewardSearch'
import { FlightActivity, type FlightTransaction } from './components/FlightActivity'
import type { MemberData } from './components/MemberProfile'

describe('Phase 6: Final Polish & Accessibility (TDD RED Phase)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  const mockMember: MemberData = {
    id: 'FF-892147',
    name: 'Sarah Connor',
    tier: 'Silver',
    activeMiles: 50000,
  }

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
      requiredMiles: 20000,
    },
  ]

  // Requirement 1: Redemption Persistence Across Browser Refresh
  describe('Redemption Persistence Across Browser Refresh', () => {
    it('persists redeemed flight IDs in localStorage and keeps flights disabled upon reload', async () => {
      const user = userEvent.setup()
      const { unmount } = render(
        <FrequentFlyerPortal
          initialMember={mockMember}
          availableRewardFlights={mockAvailableFlights}
        />
      )

      // Search flights
      await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
      await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
      await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
      await user.click(screen.getByRole('button', { name: /search reward flights/i }))

      // Redeem flight RF-101
      const redeemBtn = screen.getByRole('button', { name: /redeem flight rf-101/i })
      await user.click(redeemBtn)

      // Verify localStorage was updated with redeemed flight ID
      const storedRedeemed = window.localStorage.getItem('ffp_redeemed_flights')
      expect(storedRedeemed).not.toBeNull()
      expect(storedRedeemed).toContain('rf-101')

      // Simulate browser refresh by unmounting and remounting without initial props
      unmount()

      render(<FrequentFlyerPortal availableRewardFlights={mockAvailableFlights} />)

      // Search flights again after reload
      await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
      await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
      await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
      await user.click(screen.getByRole('button', { name: /search reward flights/i }))

      // RF-101 must remain disabled in redeemed state after reload
      const reloadedBtn = screen.getByRole('button', {
        name: /flight rf-101 already redeemed/i,
      })
      expect(reloadedBtn).toBeDisabled()
      expect(reloadedBtn).toHaveTextContent(/redeemed/i)
    })

    it('handles missing or malformed redeemed-flight storage safely without crashing', () => {
      window.localStorage.setItem('ffp_redeemed_flights', 'MALFORMED_JSON{{{')
      expect(() => render(<FrequentFlyerPortal />)).not.toThrow()

      window.localStorage.setItem(
        'ffp_redeemed_flights',
        JSON.stringify({ notAnArray: true })
      )
      expect(() => render(<FrequentFlyerPortal />)).not.toThrow()
    })
  })

  // Requirement 2: Heading Accessibility & Hierarchy
  describe('Heading Accessibility & Single Primary Heading', () => {
    it('maintains a single primary h1 page heading and semantic heading structure', () => {
      render(<App />)

      // Exactly one primary h1 on the entire page
      const h1Headings = screen.getAllByRole('heading', { level: 1 })
      expect(h1Headings).toHaveLength(1)
      expect(h1Headings[0]).toHaveTextContent(/Frequent Flyer Portal/i)

      // Starter verification heading in footer is an h2
      const starterHeading = screen.getByRole('heading', {
        level: 2,
        name: /get started/i,
      })
      expect(starterHeading).toBeInTheDocument()
    })
  })

  // Requirement 3: Tier Benefits Interaction
  describe('Tier Benefits Dialog & Interaction', () => {
    it('opens an accessible dialog with tier benefits on click and supports dismissal', async () => {
      const user = userEvent.setup()
      render(<FrequentFlyerPortal initialMember={mockMember} />)

      const benefitsBtn = screen.getByRole('button', { name: /view tier benefits/i })
      await user.click(benefitsBtn)

      // Accessible modal dialog should open
      const dialog = screen.getByRole('dialog', { name: /tier benefits/i })
      expect(dialog).toBeInTheDocument()

      // Dialog content should reflect member's tier (Silver)
      expect(within(dialog).getByText(/silver/i)).toBeInTheDocument()

      // Should provide an accessible close action
      const closeBtn = within(dialog).getByRole('button', { name: /close/i })
      await user.click(closeBtn)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  // Requirement 4: Form Error Association
  describe('Form Error Association via aria-describedby', () => {
    it('associates invalid form inputs with error message using aria-describedby', async () => {
      const user = userEvent.setup()
      render(<RewardSearch availableMiles={50000} />)

      const searchBtn = screen.getByRole('button', { name: /search reward flights/i })
      await user.click(searchBtn)

      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeInTheDocument()
      expect(errorAlert).toHaveAttribute('id')
      const errorId = errorAlert.getAttribute('id')
      expect(errorId).toBeTruthy()

      const originInput = screen.getByRole('textbox', { name: /origin/i })
      const destInput = screen.getByRole('textbox', { name: /destination/i })
      const dateInput = screen.getByLabelText(/travel date/i)

      expect(originInput).toHaveAttribute('aria-invalid', 'true')
      expect(originInput).toHaveAttribute('aria-describedby', errorId)
      expect(destInput).toHaveAttribute('aria-invalid', 'true')
      expect(destInput).toHaveAttribute('aria-describedby', errorId)
      expect(dateInput).toHaveAttribute('aria-invalid', 'true')
      expect(dateInput).toHaveAttribute('aria-describedby', errorId)
    })
  })

  // Requirement 5: Airport Formatting
  describe('Airport Formatting Consistency', () => {
    it('renders all airport codes consistently without converting duplicate LHR values to city names', () => {
      const transactionsWithDuplicates: FlightTransaction[] = [
        {
          id: 'tx-1',
          flightNumber: 'AA-104',
          departure: 'JFK',
          arrival: 'LHR',
          date: '2026-10-12',
          miles: 3450,
          type: 'Earned',
        },
        {
          id: 'tx-2',
          flightNumber: 'BA-2490',
          departure: 'LHR',
          arrival: 'DXB',
          date: '2026-09-28',
          miles: 25000,
          type: 'Redeemed',
        },
      ]

      render(<FlightActivity transactions={transactionsWithDuplicates} />)

      // Both LHR occurrences should be rendered consistently as 'LHR'
      const lhrElements = screen.getAllByText('LHR')
      expect(lhrElements).toHaveLength(2)

      // The special-case "London Heathrow" string must not appear
      expect(screen.queryByText(/London Heathrow/i)).not.toBeInTheDocument()
    })
  })

  // Requirement 6: Document Metadata & SEO
  describe('Document Metadata & SEO Readiness', () => {
    it('defines a descriptive title, meta description, and theme-color in index.html', async () => {
      // @ts-expect-error Node fs module available at test runtime
      const fs = await import('node:fs')
      // @ts-expect-error Node path module available at test runtime
      const path = await import('node:path')

      const proc = (globalThis as unknown as { process?: { cwd: () => string } }).process
      const cwd = proc ? proc.cwd() : '.'
      const htmlPath = path.resolve(cwd, 'index.html')
      const html = fs.readFileSync(htmlPath, 'utf-8')

      // Should have a descriptive title rather than package slug
      expect(html).toMatch(/<title>Frequent Flyer Portal.*<\/title>/i)

      // Should have meta description
      expect(html).toMatch(/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i)

      // Should have theme-color
      expect(html).toMatch(/<meta\s+name=["']theme-color["']\s+content=["'][^"']+["']/i)
    })
  })
})
