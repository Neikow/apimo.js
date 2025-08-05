export const Converters = {
  toDate: (v: string) => new Date(v),
  toUrl: (path: string, baseUrl: string) => (v: string) => new URL(
    `${path}${v}`,
    baseUrl,
  ).href,
}
