import { render, screen } from '@testing-library/react'
import App from './App'

describe('Application Smoke Test', () => {
  it('renders the Frequent Flyer Portal heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /frequent flyer portal/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the main portal landmark', () => {
    render(<App />)

    expect(
      screen.getByRole('main', {
        name: /frequent flyer portal/i,
      }),
    ).toBeInTheDocument()
  })
})