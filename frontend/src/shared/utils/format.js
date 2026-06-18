// Format number to IDR currency string
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format phone number for display
export function formatPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
}

// Format date to Indonesian locale
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

// Format time elapsed
export function formatElapsed(createdAt) {
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000)
  if (diff < 60) return `${diff} dtk`
  return `${Math.floor(diff / 60)} mnt`
}

// Debounce helper
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
