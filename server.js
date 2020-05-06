const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/prod.env' });

connectDB();

const app = express();

// cors fix
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(express.json());

// API routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const profile = require('./routes/profile');
const projects = require('./routes/projects')

// API endpoints

app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/profile', profile)
app.use('/api/projects', projects);
// load client

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('/public/'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/public/index.html'))
  );
}

const PORT = process.env.PORT || 8888;

app.listen(
  PORT,
  console.log(
    `Server is up and running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .rainbow.bold
  )
);
