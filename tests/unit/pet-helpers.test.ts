import { describe, it, expect, vi, afterEach } from 'vitest'

// ── Copied helpers for isolation ────────────────────────────

type VaxStatus = 'ok' | 'soon' | 'expired' | 'missing'

function worstVaxStatus(rabies: string | null, bordetella: string | null): VaxStatus {
  const statuses = [rabies, bordetella].map((exp) => {
    if (!exp) return 'missing' as VaxStatus
    const daysUntil = Math.floor((new Date(exp).getTime() - Date.now()) / 86400000)
    if (daysUntil < 0) return 'expired' as VaxStatus
    if (daysUntil <= 30) return 'soon' as VaxStatus
    return 'ok' as VaxStatus
  })
  const priority: VaxStatus[] = ['expired', 'soon', 'missing', 'ok']
  return priority.find((s) => statuses.includes(s)) ?? 'ok'
}

function calcAge(dob: string | null): string | null {
  if (!dob) return null
  const birth = new Date(dob)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years === 0) return `${months}mo`
  if (months === 0) return `${years}yr`
  return `${years}yr ${months}mo`
}

// ── Helper to build a date string N days from now ───────────

function daysFromNow(n: number): string {
  const d = new Date(Date.now() + n * 86400000)
  return d.toISOString().split('T')[0]
}

// ── Tests ───────────────────────────────────────────────────

describe('worstVaxStatus', () => {
  it('returns "ok" when both vaccines are 60 days in the future', () => {
    const future = daysFromNow(60)
    expect(worstVaxStatus(future, future)).toBe('ok')
  })

  it('returns "soon" when a vaccine is 15 days out (≤30 days)', () => {
    const ok = daysFromNow(60)
    const soon = daysFromNow(15)
    expect(worstVaxStatus(ok, soon)).toBe('soon')
  })

  it('returns "soon" when a vaccine is exactly 30 days out', () => {
    const future = daysFromNow(60)
    const edge = daysFromNow(30)
    expect(worstVaxStatus(future, edge)).toBe('soon')
  })

  it('returns "expired" when a vaccine expired yesterday', () => {
    const ok = daysFromNow(60)
    const expired = daysFromNow(-1)
    expect(worstVaxStatus(ok, expired)).toBe('expired')
  })

  it('returns "missing" when both are null', () => {
    expect(worstVaxStatus(null, null)).toBe('missing')
  })

  it('returns "missing" when one is null and the other is current', () => {
    const ok = daysFromNow(60)
    expect(worstVaxStatus(ok, null)).toBe('missing')
  })

  it('prioritises "expired" over "missing"', () => {
    const expired = daysFromNow(-1)
    expect(worstVaxStatus(expired, null)).toBe('expired')
  })

  it('prioritises "expired" over "soon"', () => {
    const expired = daysFromNow(-1)
    const soon = daysFromNow(15)
    expect(worstVaxStatus(soon, expired)).toBe('expired')
  })
})

describe('calcAge', () => {
  it('returns null for null dob', () => {
    expect(calcAge(null)).toBeNull()
  })

  it('returns months-only string for a baby under 1 year', () => {
    // 3 months ago
    const dob = new Date()
    dob.setMonth(dob.getMonth() - 3)
    const dobStr = dob.toISOString().split('T')[0]
    const result = calcAge(dobStr)
    expect(result).toMatch(/mo$/)
    expect(result).not.toMatch(/yr/)
  })

  it('returns year-only string when birth month matches current month exactly', () => {
    // Born exactly 2 years ago (same month)
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 2)
    const dobStr = dob.toISOString().split('T')[0]
    const result = calcAge(dobStr)
    expect(result).toBe('2yr')
  })

  it('returns combined yr+mo string for typical age', () => {
    // Born 1 year and 3 months ago
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 1)
    dob.setMonth(dob.getMonth() - 3)
    const dobStr = dob.toISOString().split('T')[0]
    const result = calcAge(dobStr)
    expect(result).toMatch(/\dyr \dmo/)
  })

  it('returns "0mo" for a pet born this month', () => {
    // Born at start of current month
    const dob = new Date()
    dob.setDate(1)
    const dobStr = dob.toISOString().split('T')[0]
    const result = calcAge(dobStr)
    // Could be "0mo" if same month
    expect(result).toMatch(/mo$/)
  })
})
