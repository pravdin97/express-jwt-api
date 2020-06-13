require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const models = require('../models');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, async (payload, next) => {
  console.log('payload received', payload);
  let user = await models.users.findOne({ 
    where: { id: payload.id }
  });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);

async function generateToken(user) {
  const payload = { id: user.id, name: user.name };
  const token = jwt.sign(payload, jwtOptions.secretOrKey);
  return token;
}

const verifyToken = passport.authenticate('jwt', { session: false });

module.exports = {
  passport,
  generateToken,
  verifyToken,
};