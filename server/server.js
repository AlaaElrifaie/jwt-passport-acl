import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config/config';
import auth from './config/authenticate';
import signin from './routes/signin.route';
import signup from './routes/signup.route';

// use express
const app = express();

// HTTP request logger
app.use(morgan('dev'));

// Mongodb connection
mongoose.connect(config.db, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(`[MongoDB] Failed to connect. ${err}`);
    }
});

// HTTP request body paser
// if extended is false, you can not post "nested object"
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup passport authentification
app.use(auth.initialize());
auth.setJwtStrategy();

// start Routes
app.get('/', (req, res) => {
    res.send('Hello express server');
});

// signin route
app.use('/users', signin);
// singup route
app.use('/users', signup);


// passport authentification route
app.get('/protected', auth.authenticate(), (req, res) => res.status(200).send('access to protected Route'));


app.listen(config.apiPort, () => {
    console.log(`[Server] listening on port ${config.apiPort}`);
});
