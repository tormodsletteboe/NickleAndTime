const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./engine');
const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const avoidPlaceRouter = require('./routes/user_avoidplace.router');
const messagesRouter = require('./routes/messages.router');
const triggerSMSRouter = require('./routes/trigger_sms.router');
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
app.use('/api/user/user_avoidplace',avoidPlaceRouter);
app.use('/messages',messagesRouter);
app.use('/triggersms',triggerSMSRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});





