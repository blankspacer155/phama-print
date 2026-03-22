export function format(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export function formatDateTime(date: Date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0') // Ensure minutes are padded

  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

export function toThaiTimezoneISOString(date: Date): string {
  const offset = 7 * 60 * 60 * 1000 // UTC+7 in milliseconds
  const thaiDate = new Date(date.getTime() + offset)
  return thaiDate.toISOString().replace('Z', '+07:00')
}
