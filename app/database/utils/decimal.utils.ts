import { Decimal } from '@prisma/client/runtime/library'

function decimalToNumber(value: Decimal | null): number | null {
  if (value === null) return null
  return value.toNumber()
}

const decimal = {
  decimalToNumber,
}

export default decimal
