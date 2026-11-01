import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { FlightActivity, type FlightTransaction } from './FlightActivity'

describe('FlightActivity & Miles Ledger Component (TDD RED Phase)', () => {
  const mockTransactions: FlightTransaction[] = [
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
    {
      id: 'tx-3',
      flightNumber: 'QF-11',
      departure: 'SYD',
      arrival: 'LAX',
      date: '2026-08-15',
      miles: 7500,
      type: 'Earned',
    },
  ]

  // Requirement 1 & 3: Display a flight activity ledger with flight number, route, date, type, and miles in an accessible table.
  it('renders a structured, accessible table containing flight number, route, date, type, and miles', () => {
    render(<FlightActivity transactions={mockTransactions} />)

    const table = screen.getByRole('table', { name: /flight activity/i })
    expect(table).toBeInTheDocument()

    expect(screen.getByRole('columnheader', { name: /flight/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /route/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /type/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /miles/i })).toBeInTheDocument()

    expect(screen.getByText('AA-104')).toBeInTheDocument()
    expect(screen.getByText(/JFK/i)).toBeInTheDocument()
    expect(screen.getByText(/LHR/i)).toBeInTheDocument()
    expect(screen.getByText('2026-10-12')).toBeInTheDocument()
    expect(screen.getByText('Earned')).toBeInTheDocument()
  })

  // Requirement 2: Correctly distinguish earned miles from redeemed miles.
  it('correctly distinguishes earned miles from redeemed miles with positive and negative indicators', () => {
    render(<FlightActivity transactions={mockTransactions} />)

    expect(screen.getByText(/\+3,450/)).toBeInTheDocument()
    expect(screen.getByText(/-25,000/)).toBeInTheDocument()
  })

  // Requirement 3: Display multiple flight transactions in structured table rows.
  it('displays multiple flight transactions as separate accessible table rows', () => {
    render(<FlightActivity transactions={mockTransactions} />)

    const rows = screen.getAllByRole('row')
    // 1 header row + 3 transaction rows = 4 rows
    expect(rows).toHaveLength(4)

    expect(screen.getByText('BA-2490')).toBeInTheDocument()
    expect(screen.getByText('QF-11')).toBeInTheDocument()
  })

  // Requirement 4: Provide an accessible search/filter control to filter transactions by flight number or route.
  it('provides an accessible search input that filters transactions by flight number or route', async () => {
    const user = userEvent.setup()
    render(<FlightActivity transactions={mockTransactions} />)

    const searchInput = screen.getByRole('textbox', { name: /search transactions/i })
    expect(searchInput).toBeInTheDocument()

    // Filter by flight number
    await user.type(searchInput, 'BA-2490')
    expect(screen.getByText('BA-2490')).toBeInTheDocument()
    expect(screen.queryByText('AA-104')).not.toBeInTheDocument()
    expect(screen.queryByText('QF-11')).not.toBeInTheDocument()

    // Clear and filter by route airport code
    await user.clear(searchInput)
    await user.type(searchInput, 'SYD')
    expect(screen.getByText('QF-11')).toBeInTheDocument()
    expect(screen.queryByText('AA-104')).not.toBeInTheDocument()
    expect(screen.queryByText('BA-2490')).not.toBeInTheDocument()
  })

  // Requirement 5: Display "No data found" when the list is empty or search yields no matches.
  it('displays "No data found" when the transaction list is empty', () => {
    render(<FlightActivity transactions={[]} />)

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('displays "No data found" when search filter yields no matching results', async () => {
    const user = userEvent.setup()
    render(<FlightActivity transactions={mockTransactions} />)

    const searchInput = screen.getByRole('textbox', { name: /search transactions/i })
    await user.type(searchInput, 'NONEXISTENT-FLIGHT')

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
  })

  // Requirement 6: Display a visible loading indicator when the component is in a loading state.
  it('displays a visible loading indicator when isLoading is true', () => {
    render(<FlightActivity transactions={mockTransactions} isLoading={true} />)

    const loadingIndicator = screen.getByRole('status')
    expect(loadingIndicator).toHaveTextContent(/loading/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  // Requirement 7: Handle missing or malformed transaction data safely without crashing.
  it('handles missing or malformed transaction records safely without crashing', () => {
    const malformed = [
      { id: 'corrupt-1' } as unknown as FlightTransaction,
      null as unknown as FlightTransaction,
    ]

    expect(() => render(<FlightActivity transactions={malformed} />)).not.toThrow()
    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
  })

  // Requirement 8: Ensure interactive elements have accessible labels and support keyboard navigation.
  it('ensures interactive filter elements have accessible labels and support keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<FlightActivity transactions={mockTransactions} />)

    const searchInput = screen.getByRole('textbox', { name: /search transactions/i })
    await user.tab()
    expect(searchInput).toHaveFocus()
  })

  // Requirement 9: Sanitize text values before storing them in state.
  it('sanitizes search input safely and prevents script injection', async () => {
    const user = userEvent.setup()
    render(<FlightActivity transactions={mockTransactions} />)

    const searchInput = screen.getByRole('textbox', { name: /search transactions/i })
    await user.type(searchInput, '<script>alert("xss")</script>')

    expect(document.querySelector('script')).toBeNull()
  })
})
