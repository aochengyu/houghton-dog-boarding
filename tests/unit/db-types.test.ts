import { describe, it, expect } from 'vitest'
import {
  formatCents,
  SERVICE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/db/types'

describe('formatCents', () => {
  it('formats 7000 cents as $70', () => {
    expect(formatCents(7000)).toBe('$70')
  })

  it('formats 0 cents as $0', () => {
    expect(formatCents(0)).toBe('$0')
  })

  it('formats 150 cents as $2 (integer division via toFixed(0))', () => {
    // 150 / 100 = 1.5, toFixed(0) rounds to "2"
    expect(formatCents(150)).toBe('$2')
  })

  it('formats 100 cents as $1', () => {
    expect(formatCents(100)).toBe('$1')
  })

  it('formats 6000 cents as $60', () => {
    expect(formatCents(6000)).toBe('$60')
  })
})

describe('SERVICE_LABELS', () => {
  const validServiceKeys = ['boarding', 'day-care', 'walking', 'drop-in'] as const

  it('has all valid service keys', () => {
    for (const key of validServiceKeys) {
      expect(SERVICE_LABELS).toHaveProperty(key)
    }
  })

  it('boarding label is "Dog Boarding"', () => {
    expect(SERVICE_LABELS.boarding).toBe('Dog Boarding')
  })

  it('day-care label is "Day Care"', () => {
    expect(SERVICE_LABELS['day-care']).toBe('Day Care')
  })

  it('walking label is "Dog Walking"', () => {
    expect(SERVICE_LABELS.walking).toBe('Dog Walking')
  })

  it('drop-in label is "Drop-In Visit"', () => {
    expect(SERVICE_LABELS['drop-in']).toBe('Drop-In Visit')
  })

  it('has exactly 4 service types', () => {
    expect(Object.keys(SERVICE_LABELS)).toHaveLength(4)
  })
})

describe('STATUS_LABELS', () => {
  const validStatusKeys = ['inquiry', 'confirmed', 'active', 'completed', 'cancelled'] as const

  it('has all valid status keys', () => {
    for (const key of validStatusKeys) {
      expect(STATUS_LABELS).toHaveProperty(key)
    }
  })

  it('has exactly 5 status types', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(5)
  })

  it('all labels are non-empty strings', () => {
    for (const label of Object.values(STATUS_LABELS)) {
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    }
  })
})

describe('STATUS_COLORS', () => {
  it('has the same keys as STATUS_LABELS', () => {
    const labelKeys = Object.keys(STATUS_LABELS).sort()
    const colorKeys = Object.keys(STATUS_COLORS).sort()
    expect(colorKeys).toEqual(labelKeys)
  })

  it('all color values are non-empty strings', () => {
    for (const color of Object.values(STATUS_COLORS)) {
      expect(typeof color).toBe('string')
      expect(color.length).toBeGreaterThan(0)
    }
  })
})
