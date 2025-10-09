import * as dateFns from 'date-fns'
import { Akun } from '@prisma/client'
import constants from '~/constants'

const normalUsernameLength = 8

function generateUsername(value: Partial<Akun>): string {
  try {
    let result = value.firstName?.substring(0, 1) ?? ''
    result += value.lastName?.substring(0, 3)
    if (value.tanggalLahir) {
      result += dateFns.format(value.tanggalLahir, constants.dateFormats.akunUsername)
    }
    return result.toLowerCase()
  } catch (error) {
    console.log(error)
    return 'ERROR!'
  }
}

function getDisplayName(value: Partial<Akun>): string {
  let result = value.firstName ?? ''
  if (value.lastName) result += ` ${value.lastName}`
  return result
}

function uniqifyExistingUsername(latestUsername: string): string {
  const currCount =
    latestUsername.length > normalUsernameLength
      ? // * Have existed more than 2
        Number(latestUsername.substring(normalUsernameLength)) + 1
      : // * Have existed more than 1
        1
  return `${latestUsername.substring(0, normalUsernameLength)}${currCount}`.toLowerCase()
}

const akun = {
  normalUsernameLength,
  generateUsername,
  getDisplayName,
  uniqifyExistingUsername,
}

export default akun
