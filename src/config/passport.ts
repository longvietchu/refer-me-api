import dotenv from 'dotenv';
import { PassportStatic } from 'passport';
import {
    ExtractJwt,
    Strategy as JwtStrategy,
    VerifiedCallback
} from 'passport-jwt';
import { User } from '../models/User';
// const User = mongoose.model('users');

dotenv.config();
let opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

export default (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload: any, done: VerifiedCallback) => {
            User.findOne({ email: jwt_payload.email })
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch((err) => console.log(err));
        })
    );
};
