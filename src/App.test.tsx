import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Application Baseline Smoke Test', () => {
  it('renders the initial heading and starter elements without crashing', () => {
    render(<App />)

    const heading = screen.getByRole('heading', { level: 1, name: /get started/i })
    expect(heading).toBeInTheDocument()

    const counterButton = screen.getByRole('button', { name: /count is 0/i })
    expect(counterButton).toBeInTheDocument()
  })

  it('increments the counter when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const counterButton = screen.getByRole('button', { name: /count is 0/i })
    await user.click(counterButton)

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })
})
