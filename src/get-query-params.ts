import queryString from 'query-string'
import { Entry } from './main'

export type QueryParams = {
  entries: Entry[]
}
export const getQueryParams = (search: string): QueryParams => {
  const params = queryString.parse(search)
  return {
    entries: parseEntries(Array.isArray(params.labels) ? params.labels : []),
  }
}
const parseEntries = (labels: (string | null)[]) =>
  labels.map((label) => ({ label: label || '' }))

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('parseEntries', () => {
    expect(parseEntries(['1', '2', '3'])).toStrictEqual([
      { label: '1' },
      { label: '2' },
      { label: '3' },
    ])
  })
}
