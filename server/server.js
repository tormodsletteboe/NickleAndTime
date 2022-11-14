const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
var cron = require('node-cron');
let i=0;
cron.schedule('*/10 * * * * *', () => {
    console.log(new Date().toLocaleString());
    console.log('Hi I am Tom with the Ramirez cohort',i++);
    console.log('-------------');
});
cron.schedule('*/12 * * * * *', () => {
  console.log(new Date().toLocaleString());
  console.log('To the 🚌 👆');
  console.log('-------------');
});

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
