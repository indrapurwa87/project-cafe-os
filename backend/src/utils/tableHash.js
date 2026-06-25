/**
 * Short hash encoder/decoder for table IDs.
 * Must stay in sync with frontend/src/shared/utils/tableHash.js
 */

const SALT = 48879 // 0xBEEF
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
