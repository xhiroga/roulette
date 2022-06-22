import queryString from 'query-string'
import { Entry } from '.'

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
