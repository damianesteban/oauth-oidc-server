import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`OAuth 2.0 Server is running on port ${PORT}`);
});