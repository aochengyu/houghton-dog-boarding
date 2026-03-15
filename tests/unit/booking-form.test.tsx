import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingRequestForm } from '@/app/account/(protected)/bookings/BookingRequestForm'

// Mock the server action
vi.mock('@/app/actions/bookings', () => ({
  requestBooking: vi.fn().mockResolvedValue({ error: undefined }),
}))

// Mock react-dom hooks used by the form component
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useFormState: (action: unknown, init: unknown) => [init, action],
    useFormStatus: () => ({ pending: false }),
  }
})

const mockPets = [
  { id: 'pet-1', name: 'Buddy', species: 'dog', rabies_exp: '2026-01-01', bordetella_exp: '2026-01-01' },
  { id: 'pet-2', name: 'Whiskers', species: 'cat', rabies_exp: '2026-01-01', bordetella_exp: null },
]

describe('BookingRequestForm', () => {
  it('renders a checkbox for each pet', () => {
    render(<BookingRequestForm pets={mockPets} />)
    const checkboxes = document.querySelectorAll('input[name="pet_id"]')
    expect(checkboxes).toHaveLength(2)
    expect(screen.getByText('Buddy')).toBeInTheDocument()
    expect(screen.getByText('Whiskers')).toBeInTheDocument()
  })

  it('pre-checks the correct pet when defaultPetId matches', () => {
    render(<BookingRequestForm pets={mockPets} defaultPetId="pet-2" />)
    const checkboxes = document.querySelectorAll('input[name="pet_id"]') as NodeListOf<HTMLInputElement>
    const whiskers = Array.from(checkboxes).find((cb) => cb.value === 'pet-2')
    expect(whiskers?.checked).toBe(true)
  })

  it('leaves all unchecked when defaultPetId does not match any pet', () => {
    render(<BookingRequestForm pets={mockPets} defaultPetId="non-existent-id" />)
    const checkboxes = document.querySelectorAll('input[name="pet_id"]') as NodeListOf<HTMLInputElement>
    expect(Array.from(checkboxes).every((cb) => !cb.checked)).toBe(true)
  })

  it('shows all service options', () => {
    render(<BookingRequestForm pets={mockPets} />)
    expect(screen.getByRole('option', { name: /Dog Boarding/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Day Care/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Dog Walking/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Drop-In Visit/i })).toBeInTheDocument()
  })

  it('renders start date input', () => {
    render(<BookingRequestForm pets={mockPets} />)
    const startDate = document.querySelector('input[name="start_date"]')
    expect(startDate).toBeInTheDocument()
    expect((startDate as HTMLInputElement).type).toBe('date')
  })

  it('renders end date input', () => {
    render(<BookingRequestForm pets={mockPets} />)
    const endDate = document.querySelector('input[name="end_date"]')
    expect(endDate).toBeInTheDocument()
    expect((endDate as HTMLInputElement).type).toBe('date')
  })

  it('renders notes textarea', () => {
    render(<BookingRequestForm pets={mockPets} />)
    const notes = document.querySelector('textarea[name="notes"]')
    expect(notes).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<BookingRequestForm pets={mockPets} />)
    // With multiple pets and none pre-selected the button label shows generic text
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('single-pet form renders a hidden input not a checkbox', () => {
    const singlePet = [{ id: 'pet-1', name: 'Buddy', species: 'dog', rabies_exp: '2026-01-01', bordetella_exp: '2026-01-01' }]
    render(<BookingRequestForm pets={singlePet} />)
    const hidden = document.querySelector('input[type="hidden"][name="pet_id"]') as HTMLInputElement
    expect(hidden).toBeInTheDocument()
    expect(hidden.value).toBe('pet-1')
  })
})
