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

const PasswordUtils = { hashPassword, verifyPassword }

export default PasswordUtils
