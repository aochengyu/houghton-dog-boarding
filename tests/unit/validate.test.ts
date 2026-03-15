import { describe, it, expect } from 'vitest'
import {
  sanitize,
  isValidUUID,
  isValidDate,
  isValidReferralCode,
  isValidEmail,
  isValidService,
  isValidStatus,
} from '@/lib/validate'

describe('sanitize', () => {
  it('truncates to maxLen', () => {
    expect(sanitize('hello world', 5)).toBe('hello')
  })

  it('trims leading and trailing whitespace', () => {
    expect(sanitize('  hello  ', 100)).toBe('hello')
  })

  it('strips HTML tags (XSS)', () => {
    expect(sanitize('<script>alert("xss")</script>', 100)).toBe('alert("xss")')
  })

  it('strips HTML anchor tags', () => {
    expect(sanitize('<a href="x">click</a>', 100)).toBe('click')
  })

  it('strips control characters', () => {
    // \x00 (null byte) is a control char
    expect(sanitize('hello\x00world', 100)).toBe('helloworld')
  })

  it('handles empty string', () => {
    expect(sanitize('', 10)).toBe('')
  })

  it('truncation happens after trimming and stripping', () => {
    // The tag is stripped first, then what remains is trimmed and truncated
    expect(sanitize('<b>hello</b> world', 5)).toBe('hello')
  })
})

describe('isValidUUID', () => {
  it('returns true for a valid UUID v4', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('returns true for uppercase UUID', () => {
    expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true)
  })

  it('returns false for too-short string', () => {
    expect(isValidUUID('550e8400-e29b-41d4')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidUUID('')).toBe(false)
  })

  it('returns false for random non-UUID string', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false)
  })

  it('returns false for UUID with wrong segment lengths', () => {
    expect(isValidUUID('550e840-e29b-41d4-a716-446655440000')).toBe(false)
  })
})

describe('isValidDate', () => {
  it('returns true for a valid YYYY-MM-DD date', () => {
    expect(isValidDate('2024-06-15')).toBe(true)
  })

  it('returns false for wrong format (MM/DD/YYYY)', () => {
    expect(isValidDate('06/15/2024')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidDate('')).toBe(false)
  })

  it('returns false for partial date', () => {
    expect(isValidDate('2024-06')).toBe(false)
  })

  it('returns false for an invalid calendar date', () => {
    expect(isValidDate('2024-13-01')).toBe(false)
  })

  it('returns true for leap year date', () => {
    expect(isValidDate('2024-02-29')).toBe(true)
  })
})

describe('isValidReferralCode', () => {
  it('returns true for exactly 6 uppercase alphanumeric chars', () => {
    expect(isValidReferralCode('ABC123')).toBe(true)
  })

  it('returns true for all uppercase letters', () => {
    expect(isValidReferralCode('ABCDEF')).toBe(true)
  })

  it('returns true for all digits', () => {
    expect(isValidReferralCode('123456')).toBe(true)
  })

  it('returns false for lowercase letters', () => {
    expect(isValidReferralCode('abc123')).toBe(false)
  })

  it('returns false for fewer than 6 chars', () => {
    expect(isValidReferralCode('ABC12')).toBe(false)
  })

  it('returns false for more than 6 chars', () => {
    expect(isValidReferralCode('ABC1234')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidReferralCode('')).toBe(false)
  })

  it('returns false for special characters', () => {
    expect(isValidReferralCode('ABC-12')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('returns true for email with subdomain', () => {
    expect(isValidEmail('user@mail.example.co.uk')).toBe(true)
  })

  it('returns false for missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('returns false for missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('returns false for email over 254 chars', () => {
    const longLocal = 'a'.repeat(245)
    expect(isValidEmail(`${longLocal}@example.com`)).toBe(false)
  })

  it('returns false for spaces in email', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
  })
})

describe('isValidService', () => {
  it('returns true for "boarding"', () => {
    expect(isValidService('boarding')).toBe(true)
  })

  it('returns true for "day-care"', () => {
    expect(isValidService('day-care')).toBe(true)
  })

  it('returns true for "walking"', () => {
    expect(isValidService('walking')).toBe(true)
  })

  it('returns true for "drop-in"', () => {
    expect(isValidService('drop-in')).toBe(true)
  })

  it('returns false for unknown service', () => {
    expect(isValidService('grooming')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidService('')).toBe(false)
  })

  it('returns false for uppercase variant', () => {
    expect(isValidService('Boarding')).toBe(false)
  })
})

describe('isValidStatus', () => {
  it('returns true for "inquiry"', () => {
    expect(isValidStatus('inquiry')).toBe(true)
  })

  it('returns true for "confirmed"', () => {
    expect(isValidStatus('confirmed')).toBe(true)
  })

  it('returns true for "active"', () => {
    expect(isValidStatus('active')).toBe(true)
  })

  it('returns true for "completed"', () => {
    expect(isValidStatus('completed')).toBe(true)
  })

  it('returns true for "cancelled"', () => {
    expect(isValidStatus('cancelled')).toBe(true)
  })

  it('returns false for unknown status', () => {
    expect(isValidStatus('pending')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidStatus('')).toBe(false)
  })
})
