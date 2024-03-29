const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SALT_ROUNDS = 12
const APP_SECRET = 'supersecretkey'


const hashPassword = async (password) => {
let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

return hashedPassword
}

const comparePassword = async (storedPassword, password) => {
  let passwordMatch = await bcrypt.compare(password, storedPassword)
  return passwordMatch 
}

const createToken = (payload) => {
  let token = jwt.sign(payload, APP_SECRET)
  return token
}

const verifyToken = (req, res, next) => {
  const { token } = res.locals
  
  let payload = jwt.verify(token, APP_SECRET)

  if(payload){
    res.locals.payload = payload

    return next()
  }
  res.status(401).send({ status: 'Error', msg: 'Unauthorized'})
}

const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]

    if (token) {
      res.locals.token = token
    
      return next()
    }
  } catch (error) {
    res.status(401).send({ status: 'Error1', msg: 'Unauthorized'})
  }
}

const requireAuth = (req, res, next) => {
  const { token } = res.locals
  if (!token) {
    return res.status(401).send({ status: 'Error2', msg: "Unathorized"})
  }

  try {
    const payload = jwt.verify(token, APP_SECRET)
    res.locals.payload = payload
    req.userId = payload.userId
    next()
  }catch (error) {
    res.status(401).send ({ status: 'Error3', msg: 'Unauthorized'})
  }
}


module.exports = { 
  stripToken,
  verifyToken,
  createToken,
  comparePassword,
  hashPassword,
  requireAuth
}