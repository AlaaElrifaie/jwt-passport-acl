import passport from 'passport';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import config from './config';

// default export
export default {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: config.jwt.session }),
    returnSignJwtToken,
    setJwtStrategy
};

// destructuring passport-jwt
const {
    Strategy: JwtStrategy,
    ExtractJwt
} = passportJwt;

// destructuring config.jwt.secret
const { secret } = config.jwt;

// sign and return JWT token
function returnSignJwtToken(email) {
    const opts = {};
    // Signing a token with 1 hour of expiration
    opts.expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign({ email }, secret, opts);
    return token;
}

// set the password strategy
function setJwtStrategy() {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
        passReqToCallback: true
    };
    const strategy = new JwtStrategy(opts, (req, jwtPayload, done) => {
        if (jwtPayload.email === 'rh@trueinnovation.de') {
            console.log('found rudi');
            return done(null, true);
        }
        console.log('not found rudi');
        return done(null, false);
    });

    passport.use(strategy);
}