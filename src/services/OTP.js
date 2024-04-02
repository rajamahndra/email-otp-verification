const otpGenerator = require('otp-generator')
const TOTP = require('totp.js')
const { OTP_LENGTH, OTP_CONFIG } = require('../constants/constants')

// OTP WITH ALPHABETS
module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG)
  return OTP
}

// OTP WITH NUMBERS
module.exports.generateOTP2 = () => {
  const key = TOTP.randomKey()
  const totp = new TOTP(key)
  const code = totp.genOTP()

  return code
}
