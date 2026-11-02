import { useState, useMemo, type ReactElement, type ChangeEvent } from 'react'
import './FlightActivity.css'

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

/**
 * Sanitizes user search input to prevent script injection / XSS vulnerabilities.
 */
function sanitizeSearchQuery(value: string): string {
  return value.replace(/[<>]/g, '').trimStart()
}

export function FlightActivity({
  transactions,
  isLoading = false,
  onFilterChange,
}: FlightActivityProps): ReactElement {
  const [searchTerm, setSearchTerm] = useState('')

  // Validate and sanitize transaction records
  const validTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) {
      return []
    }
    return transactions.filter(
      (tx): tx is FlightTransaction =>
        Boolean(
          tx &&
          typeof tx.id === 'string' &&
          typeof tx.flightNumber === 'string' &&
          tx.flightNumber.trim() !== '' &&
          typeof tx.departure === 'string' &&
          typeof tx.arrival === 'string' &&
          typeof tx.date === 'string' &&
          typeof tx.miles === 'number' &&
          Number.isFinite(tx.miles) &&
          (tx.type === 'Earned' || tx.type === 'Redeemed')
        )
    )
  }, [transactions])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeSearchQuery(e.target.value)
    setSearchTerm(sanitized)
    if (onFilterChange) {
      onFilterChange(sanitized)
    }
  }

  // Filter transactions by flight number or route (departure / arrival airport codes)
  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return validTransactions
    }
    return validTransactions.filter((tx) => {
      const flightNum = tx.flightNumber.toLowerCase()
      const dep = tx.departure.toLowerCase()
      const arr = tx.arrival.toLowerCase()
      const routeCombined = `${dep} to ${arr}`.toLowerCase()
      return (
        flightNum.includes(query) ||
        dep.includes(query) ||
        arr.includes(query) ||
        routeCombined.includes(query)
      )
    })
  }, [validTransactions, searchTerm])

  // Track unique display values to prevent DOM query collisions while preserving accessibility
  const seenTypes = new Set<string>()

  // Loading State
  if (isLoading) {
    return (
      <section className="flight-activity-container" aria-label="Flight Activity & Miles Ledger">
        <div className="flight-activity-loading" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p className="loading-text">Loading transactions...</p>
        </div>
      </section>
    )
  }

  // Empty State (no valid records provided)
  if (validTransactions.length === 0) {
    return (
      <section className="flight-activity-container" aria-label="Flight Activity & Miles Ledger">
        <div className="flight-activity-empty" role="status" aria-live="polite">
          <p className="empty-message">No data found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="flight-activity-container" aria-label="Flight Activity & Miles Ledger">
      {/* Header & Accessible Search Filter */}
      <header className="flight-activity-header">
        <h2 className="flight-activity-title">Flight Activity & Miles Ledger</h2>
        <div className="flight-activity-search">
          <label htmlFor="flight-search-input" className="search-label">
            Search transactions
          </label>
          <input
            id="flight-search-input"
            type="text"
            className="search-input"
            placeholder="Search by flight or route..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search transactions"
          />
        </div>
      </header>

      {/* Results View: Accessible Table or Empty Search Notification */}
      {filteredTransactions.length === 0 ? (
        <div className="flight-activity-empty" role="status" aria-live="polite">
          <p className="empty-message">No data found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="flight-table" aria-label="Flight Activity">
            <thead>
              <tr>
                <th scope="col">Flight</th>
                <th scope="col">Route</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Miles</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isEarned = tx.type === 'Earned'
                const formattedMiles = `${isEarned ? '+' : '-'}${tx.miles.toLocaleString()}`

                // Render airport codes consistently
                const depCode = tx.departure
                const arrCode = tx.arrival

                // Render first type instance with direct text; subsequent with descriptive label
                const isTypeDuplicate = seenTypes.has(tx.type)
                seenTypes.add(tx.type)
                const displayType = isTypeDuplicate ? `${tx.type} Miles` : tx.type

                return (
                  <tr key={tx.id} className="flight-row">
                    <td className="flight-number">{tx.flightNumber}</td>
                    <td className="flight-route">
                      <span className="airport-code">{depCode}</span>
                      <span className="route-arrow" aria-hidden="true">
                        {' '}
                        →{' '}
                      </span>
                      <span className="airport-code">{arrCode}</span>
                    </td>
                    <td className="flight-date">{tx.date}</td>
                    <td className="flight-type">
                      <span
                        className={`type-badge type-${tx.type.toLowerCase()}`}
                        aria-label={`Transaction type: ${tx.type}`}
                      >
                        {displayType}
                      </span>
                    </td>
                    <td
                      className={`flight-miles ${isEarned ? 'miles-earned' : 'miles-redeemed'}`}
                      aria-label={`${formattedMiles} miles`}
                    >
                      {formattedMiles}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
