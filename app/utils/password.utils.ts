import bcrypt from 'bcrypt'

async function hashPassword(password: string) {
  const saltRounds = 10
  const hashed = await bcrypt.hash(password, saltRounds)
  return hashed
}

async function verifyPassword({ password, hashedPassword }: { password: string; hashedPassword: string }) {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

function generatePassword(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'
  const digitChar = digits[Math.floor(Math.random() * digits.length)]
  const digitPos = Math.floor(Math.random() * 8)

  return Array.from({ length: 8 }, (_, i) =>
    i === digitPos ? digitChar : letters[Math.floor(Math.random() * letters.length)],
  ).join('')
}

const PasswordUtils = { hashPassword, verifyPassword, generatePassword }

export default PasswordUtils
