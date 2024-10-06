import passport from 'passport';
import { Strategy } from 'passport-local';
import { userDatabase } from './models/users';

const passportStrategy = passport.use(new Strategy(
    (username, password, done) => {
        const user = userDatabase.findByUsername(username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username'});
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password'});
        }
        return done(null, user);
    }
));

passportStrategy.serializeUser((user, done) => {
    done(null, user.id);
});

passportStrategy.deserializeUser((id, done) => {
    const user = userDatabase.findById(id);
    done(null, user);
});

export default passportStrategy;