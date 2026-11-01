import {
  useState,
  useMemo,
  type ReactElement,
  type FormEvent,
  type ChangeEvent,
} from 'react'
import './RewardSearch.css'

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

/**
 * Sanitizes text input values to guard against cross-site scripting (XSS).
 */
function sanitizeInput(value: string): string {
  return value.replace(/[<>]/g, '').trimStart()
}

export function RewardSearch({
  availableMiles,
  availableFlights,
  isLoading = false,
  onRedeem,
  onSearch,
}: RewardSearchProps): ReactElement {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Validate incoming flights defensively against malformed data
  const validFlights = useMemo(() => {
    if (!Array.isArray(availableFlights)) {
      return []
    }
    return availableFlights.filter(
      (flight): flight is RewardFlight =>
        Boolean(
          flight &&
          typeof flight.id === 'string' &&
          typeof flight.flightNumber === 'string' &&
          typeof flight.origin === 'string' &&
          typeof flight.destination === 'string' &&
          typeof flight.date === 'string' &&
          typeof flight.requiredMiles === 'number' &&
          Number.isFinite(flight.requiredMiles)
        )
    )
  }, [availableFlights])

  const handleOriginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrigin(sanitizeInput(e.target.value))
    if (errorMessage) setErrorMessage(null)
  }

  const handleDestinationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestination(sanitizeInput(e.target.value))
    if (errorMessage) setErrorMessage(null)
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
    if (errorMessage) setErrorMessage(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleanOrigin = origin.trim()
    const cleanDestination = destination.trim()
    const cleanDate = date.trim()

    if (!cleanOrigin || !cleanDestination || !cleanDate) {
      setErrorMessage('Please fill in all search fields')
      return
    }

    setErrorMessage(null)
    setHasSearched(true)

    if (onSearch) {
      onSearch({
        origin: cleanOrigin,
        destination: cleanDestination,
        date: cleanDate,
      })
    }
  }

  // Filter matching flights based on search parameters
  const searchResults = useMemo(() => {
    if (!hasSearched) {
      return []
    }
    const orig = origin.trim().toUpperCase()
    const dest = destination.trim().toUpperCase()
    const travelDate = date.trim()

    return validFlights.filter((flight) => {
      const matchOrigin = flight.origin.toUpperCase() === orig
      const matchDest = flight.destination.toUpperCase() === dest
      const matchDate = flight.date === travelDate
      return matchOrigin && matchDest && matchDate
    })
  }, [hasSearched, origin, destination, date, validFlights])

  // Loading View
  if (isLoading) {
    return (
      <section
        className="reward-search-container"
        aria-label="Reward Flight Search & Redemption"
      >
        <div className="reward-search-loading" role="status" aria-live="polite">
          <span className="loading-spinner" aria-hidden="true" />
          <p className="loading-text">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="reward-search-container"
      aria-label="Reward Flight Search & Redemption"
    >
      <header className="reward-search-header">
        <h2 className="reward-search-title">Reward Flight Search</h2>
        <div className="reward-balance-chip" aria-label="Available miles balance">
          <span>Available:</span>
          <strong>{availableMiles.toLocaleString()} miles</strong>
        </div>
      </header>

      {/* Accessible Search Form */}
      <form
        className="reward-search-form"
        onSubmit={handleSubmit}
        aria-label="Reward flight search"
        noValidate
      >
        {errorMessage && (
          <div className="form-error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="reward-origin" className="form-label">
              Origin
            </label>
            <input
              id="reward-origin"
              type="text"
              className={`form-input ${errorMessage && !origin.trim() ? 'input-invalid' : ''}`}
              placeholder="e.g. JFK"
              value={origin}
              onChange={handleOriginChange}
              aria-label="Origin"
              aria-required="true"
              aria-invalid={Boolean(errorMessage && !origin.trim())}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reward-destination" className="form-label">
              Destination
            </label>
            <input
              id="reward-destination"
              type="text"
              className={`form-input ${errorMessage && !destination.trim() ? 'input-invalid' : ''}`}
              placeholder="e.g. LHR"
              value={destination}
              onChange={handleDestinationChange}
              aria-label="Destination"
              aria-required="true"
              aria-invalid={Boolean(errorMessage && !destination.trim())}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reward-date" className="form-label">
              Travel date
            </label>
            <input
              id="reward-date"
              type="date"
              className={`form-input ${errorMessage && !date.trim() ? 'input-invalid' : ''}`}
              value={date}
              onChange={handleDateChange}
              aria-label="Travel date"
              aria-required="true"
              aria-invalid={Boolean(errorMessage && !date.trim())}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="reward-btn"
            aria-label="Search reward flights"
          >
            Search Reward Flights
          </button>
        </div>
      </form>

      {/* Results View */}
      {hasSearched && (
        <section
          className="reward-results-section"
          aria-label="Reward Flights Results"
        >
          {searchResults.length === 0 ? (
            <div
              className="reward-search-empty"
              role="status"
              aria-live="polite"
            >
              <p className="empty-message">No data found</p>
            </div>
          ) : (
            <div className="reward-cards-list">
              {searchResults.map((flight) => {
                const isEligible = availableMiles >= flight.requiredMiles
                const shortfall = Math.max(
                  0,
                  flight.requiredMiles - availableMiles
                )

                return (
                  <article
                    key={flight.id}
                    className="reward-flight-card"
                    aria-label={`Flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination}`}
                  >
                    <div className="flight-info-group">
                      <span className="flight-number-badge">
                        {flight.flightNumber}
                      </span>
                      <div className="flight-route-display">
                        <span>{flight.origin}</span>
                        <span aria-hidden="true" className="route-arrow">
                          {' '}
                          →{' '}
                        </span>
                        <span>{flight.destination}</span>
                      </div>
                      <span className="flight-date-text">{flight.date}</span>
                    </div>

                    <div className="redemption-action-group">
                      <span
                        className="required-miles-display"
                        aria-label={`Required: ${flight.requiredMiles.toLocaleString()} miles`}
                      >
                        {flight.requiredMiles.toLocaleString()} miles
                      </span>

                      {!isEligible ? (
                        <div
                          className="insufficient-miles-alert"
                          role="alert"
                        >
                          <span className="insufficient-badge">
                            Insufficient Miles
                          </span>
                          <p className="shortfall-text">
                            Need {shortfall.toLocaleString()} more miles
                          </p>
                          <button
                            type="button"
                            className="reward-btn"
                            disabled
                            aria-label={`Insufficient miles to redeem ${flight.flightNumber}`}
                          >
                            Redemption Unavailable
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="reward-btn"
                          onClick={() => onRedeem && onRedeem(flight)}
                          aria-label={`Redeem flight ${flight.flightNumber}`}
                        >
                          Redeem Flight
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}
    </section>
  )
}
