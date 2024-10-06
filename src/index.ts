import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passportStrategy from './passport';
import oauth2orize from 'oauth2orize';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { clientDatabase } from './models/clients';

dotenv.config();

/**
 * OAuth 2.0 Server
 **/
const oauth2Server = oauth2orize.createServer();

// Grant authorization code
oauth2Server.grant(oauth2orize.grant.code((client: any, redirectUri: string, user: any, ares: any, done: (err: any, code?: string) => void) => {
    const code = uuidv4(); // Random auth code
    done(null, code); // TODO: Save code to database
}));

// Exchange authorization code for access token
oauth2Server.exchange(oauth2orize.exchange.code((client: any, code: string, redirectUri: string, done: (err: any, accessToken?: string, refreshToken?: string) => void) => {
    const accessToken = jwt.sign({ user_id: client.id }, process.env.JWT_SECRET as string);
    done(null, accessToken);
}));


/**
 * Express Server
 */
const app = express();

// Express Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Express Middleware - Passport
app.use(passportStrategy.initialize());
app.use(passportStrategy.session());

/**
 * Routes
 */


// Authorize
app.get('/authorize', (req: any, res: any, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const client = clientDatabase.findById(req.query.client_id as string);
    if (!client) {
        return res.status(400).send('Invalid client');
    }
    res.redirect(`/authorize/decision?client_id=${req.query.client_id}&redirect_uri=${req.query.redirect_uri}`);
});

// Decision - called after the user consents
app.get('/authorize/decision', (req: any, res: any, next) => {
    const client = clientDatabase.findById(req.query.client_id as string);
    if (!client) {
        return res.status(400).send('Invalid client');
    }

    oauth2Server.decision(req, res)
});

// Token Exchange - exchange authorization code for access token
app.post('/token', (req: any, res: any, next) => {
    const client = clientDatabase.findByClientId(req.body.client_id, req.body.client_secret);
    if (!client) {
        return res.status(400).send('Invalid client');
    }

    oauth2Server.token()(req, res, next);
});

// Login
app.post('/login', passportStrategy.authenticate('local', {
    successRedirect: '/authorize',
    failureRedirect: '/login'
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`OAuth 2.0 Server is running on port ${PORT}`);
});