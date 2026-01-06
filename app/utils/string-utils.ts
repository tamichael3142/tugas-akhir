function capitalize(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const StringUtils = {
  capitalize,
}

export default StringUtils
