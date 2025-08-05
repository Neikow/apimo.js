import { z } from 'zod'

export const TYPE_UNDOCUMENTED = z.unknown().transform((v, { path }) => {
  console.warn(`Unhandled \`${path}\` with value \`${v}\``)
  return v
})

export const TYPE_UNDOCUMENTED_NULLABLE = z.unknown().nullable().transform((v, { path }) => {
  if (v !== null) {
    console.warn(`Unhandled \`${path}\` with value \`${v}\``)
  }
  return v
})
