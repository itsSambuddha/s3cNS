// lib/whatsapp.ts
export function waTo(phone: string, message?: string): void {
  if (typeof window === 'undefined') {
    return
  }
  const cleanedPhone = phone.replace(/[^+\d]/g, '')
  let url = `https://wa.me/${cleanedPhone}`
  if (message) {
    const encodedMessage = encodeURIComponent(message)
    url += `?text=${encodedMessage}`
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
