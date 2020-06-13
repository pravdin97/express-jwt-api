require('dotenv').config();
const express = require('express');
import cors from 'cors';

const { passport } = require('./src/auth');
const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', require('./src/routes'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('server started at port', PORT);
});