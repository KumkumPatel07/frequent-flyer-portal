import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemberProfile, type MemberData } from './MemberProfile'

describe('MemberProfile & Tier Status Component (TDD RED Phase)', () => {
  const mockSilverMember: MemberData = {
    id: 'FF-892147',
    name: 'Sarah Connor',
    tier: 'Silver',
    activeMiles: 18450,
  }

  const mockGoldMember: MemberData = {
    id: 'FF-340192',
    name: 'Miles Morales',
    tier: 'Gold',
    activeMiles: 38200,
  }

  const mockPlatinumMember: MemberData = {
    id: 'FF-559124',
    name: 'Elena Rostova',
    tier: 'Platinum',
    activeMiles: 78500,
  }

  const mockDiamondMember: MemberData = {
    id: 'FF-990001',
    name: 'James Bond',
    tier: 'Diamond',
    activeMiles: 154200,
  }

  // Requirement 1: Display member profile with member name, member ID, current tier, and active miles.
  it('renders member profile with member name, ID, current tier, and active miles', () => {
    render(<MemberProfile member={mockSilverMember} />)

    expect(screen.getByRole('heading', { level: 2, name: /Sarah Connor/i })).toBeInTheDocument()
    expect(screen.getByText(/FF-892147/i)).toBeInTheDocument()
    expect(screen.getByText(/Silver/i)).toBeInTheDocument()
    expect(screen.getByText(/18,450/i)).toBeInTheDocument()
  })

  // Requirement 2: Support four tiers: Silver, Gold, Platinum, and Diamond.
  it.each([
    ['Silver', mockSilverMember],
    ['Gold', mockGoldMember],
    ['Platinum', mockPlatinumMember],
    ['Diamond', mockDiamondMember],
  ])('supports displaying the correct tier badge for %s', (tierName, memberData) => {
    render(<MemberProfile member={memberData} />)

    const tierBadge = screen.getByLabelText(new RegExp(`current tier: ${tierName}`, 'i'))
    expect(tierBadge).toBeInTheDocument()
    expect(tierBadge).toHaveTextContent(new RegExp(tierName, 'i'))
  })

  // Requirement 3: Display progress toward the next tier.
  it('displays an accessible progress bar toward the next tier', () => {
    render(<MemberProfile member={mockSilverMember} />)

    const progressBar = screen.getByRole('progressbar', { name: /tier progress/i })
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  // Requirement 4: Show the next tier name and miles required to reach it.
  it('shows the next tier name and remaining miles required to reach it', () => {
    render(<MemberProfile member={mockSilverMember} />)

    expect(screen.getByText(/next tier/i)).toBeInTheDocument()
    expect(screen.getByText(/Gold/i)).toBeInTheDocument()
    expect(screen.getByText(/miles to/i)).toBeInTheDocument()
  })

  // Requirement 5: Handle the highest tier (Diamond) without showing an invalid next-tier target.
  it('handles the highest tier (Diamond) gracefully without an invalid next-tier target', () => {
    render(<MemberProfile member={mockDiamondMember} />)

    expect(screen.getByText(/highest tier achieved/i)).toBeInTheDocument()
    expect(screen.queryByText(/miles to next tier/i)).not.toBeInTheDocument()

    const progressBar = screen.getByRole('progressbar', { name: /tier progress/i })
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  // Requirement 6: Handle missing or empty member data with a clear "No data found" message.
  it('handles missing or null member data with a clear "No data found" message', () => {
    render(<MemberProfile member={null} />)

    expect(screen.getByText(/no data found/i)).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  // Requirement 7: Ensure all interactive elements have accessible labels and can be accessed using the keyboard.
  it('ensures interactive elements have accessible labels and are keyboard navigable', async () => {
    const handleViewBenefits = vi.fn()
    const user = userEvent.setup()

    render(<MemberProfile member={mockSilverMember} onViewBenefits={handleViewBenefits} />)

    const benefitsButton = screen.getByRole('button', { name: /view tier benefits/i })
    expect(benefitsButton).toBeInTheDocument()

    // Test keyboard focus and trigger
    await user.tab()
    expect(benefitsButton).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(handleViewBenefits).toHaveBeenCalledTimes(1)
  })
})
