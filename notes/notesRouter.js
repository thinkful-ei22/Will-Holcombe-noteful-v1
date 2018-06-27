'use strict';

// Load array of notes
//const data = require('./db/notes');

//console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


/*

  router.put('/notes/:id', (req, res, next) => {
    const id = req.params.id;
  
    /***** Never trust users - validate input *****/
    /*
    const updateObj = {};
    const updateFields = ['title', 'content'];
  
    updateFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
  
    notes.update(id, updateObj, (err, item) => {
      if (err) {
        return next(err);
      }
      if (item) {
        res.json(item);
      } else {
        next();
      }
    });
  });
  */
  
  /*app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
  */

  
  router.get('/notes', (req, res, next) => {
    const { searchTerm } = req.query;
  
    notes.filter(searchTerm, (err, list) => {
      if (err) {
        return next(err); // goes to error handler
      }
      res.json(list); // responds with filtered array
    });
  });
    
  
  router.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  notes.find(id, (err, item) =>{
    if(err) {
      console.error(err);
    }
    if(item) {
      res.json(item);
    }
    else{
      console.log('not found');
    }
  });
  
  });
  
module.exports = router;
 /*
 
  router.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ message: 'Not Found' });
  });
  
  router.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
  
  */