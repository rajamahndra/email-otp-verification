const router = require('express').Router()
router.use('/auth', require('./auth.routes'))
router.get('/helow', (req, res) => {
  return res.send({ message: 'HELOWWW WORRLDD' })
})
module.exports = router
