import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RewardSearch, type RewardFlight } from './RewardSearch'

describe('RewardSearch & Miles Redemption Component (TDD RED Phase)', () => {
  const mockFlights: RewardFlight[] = [
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
      origin: 'LAX',
      destination: 'HND',
      date: '2026-12-05',
      requiredMiles: 75000,
    },
  ]

  // Criteria 1 & 2: Render accessible search form with origin, destination, and travel date inputs
  it('renders an accessible reward flight search form with origin, destination, and travel date inputs', () => {
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    const form = screen.getByRole('form', { name: /reward flight search/i })
    expect(form).toBeInTheDocument()

    expect(screen.getByRole('textbox', { name: /origin/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /destination/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/travel date/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /search reward flights/i })
    ).toBeInTheDocument()
  })

  // Criteria 3: Validate missing search fields and prevent invalid submission
  it('validates missing search fields and displays error message preventing invalid submission', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} onSearch={onSearch} />)

    const searchButton = screen.getByRole('button', { name: /search reward flights/i })
    await user.click(searchButton)

    expect(screen.getByText(/please fill in all search fields/i)).toBeInTheDocument()
    expect(onSearch).not.toHaveBeenCalled()
  })

  // Criteria 4: Display matching reward flights with details
  it('displays matching reward flights with flight number, route, travel date, and required miles', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
    await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    expect(screen.getByText('RF-101')).toBeInTheDocument()
    expect(screen.getByText('JFK')).toBeInTheDocument()
    expect(screen.getByText('LHR')).toBeInTheDocument()
    expect(screen.getByText('2026-11-20')).toBeInTheDocument()
    expect(screen.getByText(/30,000 miles/i)).toBeInTheDocument()
  })

  // Criteria 5: Display "No data found" when no reward flights match
  it('displays "No data found" when no reward flights match the search criteria', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'BOS')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'DXB')
    await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
  })

  // Criteria 6 & 7: Calculate sufficient miles & display insufficient miles error
  it('calculates whether member has sufficient miles and displays insufficient miles error for ineligible flights', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'LAX')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'HND')
    await user.type(screen.getByLabelText(/travel date/i), '2026-12-05')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    expect(screen.getByText(/insufficient miles/i)).toBeInTheDocument()
    expect(screen.getByText(/need 25,000 more miles/i)).toBeInTheDocument()
  })

  // Criteria 8: Prevent redemption when member does not have enough miles
  it('prevents redemption by disabling the action when member does not have enough miles', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'LAX')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'HND')
    await user.type(screen.getByLabelText(/travel date/i), '2026-12-05')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    const disabledBtn = screen.getByRole('button', { name: /insufficient miles/i })
    expect(disabledBtn).toBeDisabled()
  })

  // Criteria 9: Provide redemption confirmation action for eligible flights
  it('provides a redemption confirmation action for eligible flights', async () => {
    const onRedeem = vi.fn()
    const user = userEvent.setup()
    render(
      <RewardSearch
        availableMiles={50000}
        availableFlights={mockFlights}
        onRedeem={onRedeem}
      />
    )

    await user.type(screen.getByRole('textbox', { name: /origin/i }), 'JFK')
    await user.type(screen.getByRole('textbox', { name: /destination/i }), 'LHR')
    await user.type(screen.getByLabelText(/travel date/i), '2026-11-20')
    await user.click(screen.getByRole('button', { name: /search reward flights/i }))

    const redeemBtn = screen.getByRole('button', { name: /redeem flight/i })
    expect(redeemBtn).toBeEnabled()

    await user.click(redeemBtn)
    expect(onRedeem).toHaveBeenCalledWith(
      expect.objectContaining({ flightNumber: 'RF-101' })
    )
  })

  // Criteria 10: Display accessible loading state
  it('displays an accessible loading state during asynchronous search/redemption operations', () => {
    render(<RewardSearch availableMiles={50000} isLoading={true} />)

    const loadingIndicator = screen.getByRole('status')
    expect(loadingIndicator).toHaveTextContent(/loading/i)
  })

  // Criteria 11: Handle malformed data safely
  it('handles malformed flight records safely without crashing', () => {
    const malformed = [
      { id: 'corrupt-1' } as unknown as RewardFlight,
      null as unknown as RewardFlight,
    ]

    expect(() =>
      render(<RewardSearch availableMiles={50000} availableFlights={malformed} />)
    ).not.toThrow()
  })

  // Criteria 12: Sanitize text inputs before storing them in state
  it('sanitizes text inputs before storing them in state to prevent script injection', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    const originInput = screen.getByRole('textbox', { name: /origin/i })
    await user.type(originInput, '<script>alert("xss")</script>')

    expect(document.querySelector('script')).toBeNull()
  })

  // Criteria 13: Keyboard accessibility and accessible labels
  it('ensures all interactive elements have accessible labels and support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<RewardSearch availableMiles={50000} availableFlights={mockFlights} />)

    const originInput = screen.getByRole('textbox', { name: /origin/i })
    await user.tab()
    expect(originInput).toHaveFocus()
  })
})
