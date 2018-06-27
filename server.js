'use strict';

// Load array of notes
//const data = require('./db/notes');

//console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const morgan = require('morgan');

const notesRouter = require('./notes/notesRouter');
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

const app = express();
const { PORT } = require('./config');
const {requestLogger} = require('./logger');

app.use(requestLogger);



app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.json());



app.use('/api', notesRouter);




app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});