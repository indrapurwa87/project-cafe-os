/**
 * Short hash encoder/decoder for table IDs.
 * Encodes numeric table IDs to short alphanumeric strings (e.g. 3 → "o9z")
 * so that raw IDs are not exposed in customer-facing URLs.
 *
 * Uses XOR + bit-permutation + base36 encoding for short, non-sequential output.
 */

const SALT = 48879 // 0xBEEF — XOR mask

// 16-bit permutation table for bit-shuffling
const PERM = [10, 3, 14, 1, 8, 5, 12, 0, 15, 7, 2, 11, 6, 13, 4, 9]

function shuffleBits(n) {
  let out = 0
  for (let i = 0; i < 16; i++) {
    if (n & (1 << i)) out |= (1 << PERM[i])
  }
  return out
}

function unshuffleBits(n) {
  let out = 0
  for (let i = 0; i < 16; i++) {
    if (n & (1 << PERM[i])) out |= (1 << i)
  }
  return out
}

export function encodeTableId(id) {
  return shuffleBits(id ^ SALT).toString(36)
}

export function decodeTableId(hash) {
  return unshuffleBits(parseInt(hash, 36)) ^ SALT
}
