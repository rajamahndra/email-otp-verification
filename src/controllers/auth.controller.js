const { encrypt, compare } = require('../services/crypto')
const { generateOTP, generateOTP2 } = require('../services/OTP')
const { sendMail } = require('../services/MAIL')
const bind = require('pg-bind')
const { query, queryAll } = require('../config/db.config')
const { responseService } = require('../utils/response')

module.exports.signUpUser = async (req, res) => {
  const { nama, email, password, no_hp } = req.body

  let responseBody = responseService.error(
    'Something Went Wrong',
    'Invalid Parameter'
  )

  const isExisting = await findUserByEmail(email)
  if (isExisting) {
    responseBody = responseService.customOK(
      true,
      'User With This Email Already existing'
    )
    return res.status(responseBody.status).send(responseBody)
  }
  // create new user
  const newUser = await createUser(nik, nama, email, password, no_hp, 1)
  if (!newUser[0]) {
    responseBody = responseService.serviceUnavailableError(
      newUser[1] || 'Unable to create new user'
    )
    return res.status(responseBody.status).send(responseBody)
  }
  responseBody = responseService.success('User Created', newUser[1])
  return res.status(responseBody.status).send(responseBody)
}

module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body
  const user = await validateUserSignUp(email, otp)

  responseBody = responseService.success('User Verified', user)
  return res.status(responseBody.status).send(responseBody)
}

const findUserByEmail = async (email) => {
  const user = await query(
    bind(
      `SELECT id, nama, email, no_hp
	     FROM users
       WHERE email = :email`,
      {
        email
      }
    )
  )
  if (!user) {
    return false
  }
  return user
}

const createUser = async (nama, email, password, no_hp, just_signedin) => {
  const hashedPassword = await encrypt(password)
  // const otpGenerated = generateOTP()
  const otpGenerated = generateOTP2()
  const newUser = await query(
    bind(
      `INSERT INTO public.users(
       nama, email, password, no_hp, just_signedin, otp)
       VALUES (:nama, :email, :password, :no_hp, :just_signedin, :otp)
       RETURNING id, nama, email;`,
      {
        nama,
        email,
        password: hashedPassword,
        otp: otpGenerated,
        no_hp,
        just_signedin
      }
    )
  )
  if (!newUser) {
    return [false, 'Unable to sign you up']
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated
    })
    return [true, newUser]
  } catch (error) {
    console.log(error)
    return [false, 'Unable to sign up, Please try again later']
  }
}
