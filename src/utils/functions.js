const moment = require('moment')

const empty = (data) => {
  if (data === null || data === undefined || data === '' || data === ' ') {
    return true
  } else if (Array.isArray(data) && data.length === 0) {
    return true
  } else if (typeof data === 'object' && Object.keys(data).length === 0) {
    return true
  } else {
    return false
  }
}

const getUserID = (jwt) => {
  return jwt.subject
}

const getUserEmail = (jwt) => {
  return jwt.email
}

function convertTimeFormat(data) {
  const formatTimeNow = 'DD-MM-YYYY HH:mm:ss'
  for (let i = 0; i < data.length; i++) {
    data[i].transaction_created_at = moment(
      data[i].transaction_created_at
    ).format(formatTimeNow)
    data[i].transaction_updated_at = moment(
      data[i].transaction_updated_at
    ).format(formatTimeNow)
    data[i].created_at = moment(data[i].created_at).format(formatTimeNow)
    data[i].updated_at = moment(data[i].updated_at).format(formatTimeNow)
  }
}

module.exports = {
  empty,
  getUserID,
  getUserEmail,
  convertTimeFormat
}
