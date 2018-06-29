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




router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  /***** Never trust users - validate input *****/
    
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item => {
      if(item){
        res.json(item);
      }
      else{
        next();
      }
    })
      .catch(err =>{
      next(err)
      
    });
  });




router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id; //same as const {id} = req.params

  notes.delete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

    



router.post('/notes', (req, res, next) => {
    
  const { title, content } = req.body;
  
  const newItem = { title, content };
  //console.log('Hello', newItem);
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

   


  
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
  console.log(searchTerm);
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => {
      next(err);
    });
});




 
    
  
router.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
  

module.exports = router;
 
 
 
  
  