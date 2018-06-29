'use strict';

const chai = require('chai');

const { app, runServer, closeServer } = require('../server');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Noteful App', function() {


  let server;
  before(function() {
    return runServer();
  });

  
  after(function() {
    return closeServer();
  });

  
  describe('404 handler', function() {

    it('should return a 404 status code for bad path', function() {
      return chai.request(app)
        .get('/bad/path')
        .catch(err => err.response)

        .then(function(res) {
          expect(res).to.have.status(404);
          
        });

    });
  });

  describe('Static Server', function() {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });

  

    it('should return a 404 status code for bad path', function() {
      return chai.request(app)
        .get('/')


        .then(function(res) {
          console.log(res.body);

          expect(res).to.be.html;
          expect(res.body).to.be.a('object');

        });

    });
  });

  describe('GET /api/notes endpoint', function() {

    it('should list 10 notes on GET on default and'
    + ' return list with correct fields', function() {
      return chai.request(app)
        .get('/api/notes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(10);
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.have.all.keys(
              'content', 'id', 'title');
          });
        });
    });

    /*
    it('should return correct search results for a valid query', function(){
        
      let searchTermTest;
      return chai.request(app)
        .get('/api/notes')
        .then(function(res) {

          let targetTitle = res.body[0].title;
          for (let i=0; i<targetTitle.length; i++)
          {
          //let  = targetTitle[i];
           
            let firstWord = targetTitle.substr(0, targetTitle.indexOf(' '));
           
            searchTermTest = firstWord;
            console.log(searchTermTest);
          }
          console.log(searchTermTest);


        //updateData.id = res.body[0].title;
        return chai.request(app)
            .get(`/api/notes?searchTerm=${searchTermTest}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.title).to.include(searchTermTest);
        });
    });

*/

    it('should return correct search results for a valid query', function () {
      return chai.request(app)
        .get('/api/notes?searchTerm=about%20cats')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.an('object');
        });
    });

    it('should return an empty array for an incorrect query', function() {
   
      return chai.request(app)
        .get('/api/notes?searchTerm=sldorf%20dorf')
         
     
        .then(function(res) {
          
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(0);
          
        
          expect(res).to.be.json;
          
        
        });
    });

  });

  describe('GET /api/notes/:id', function(){
    it('should return correct note object with id, title, content for given id', function() {
    
      let testObject;

      return chai.request(app)
      
        .get('/api/notes')
        .then(function(res){ 
          testObject = res.body[0];
      
          return chai.request(app)
            .get(`/api/notes/${testObject.id}`); 
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.deep.equal(testObject.id);
          expect(res.body.title).to.deep.equal(testObject.title);
          expect(res.body.content).to.deep.equal(testObject.content);
        });

    });
/*
    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .get('/api/notes/dorf')
        //.catch(err => err.response)
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });
    */
  });
 


  describe('POST /api/notes endpoint', function(){

    it('should add an item on POST', function() {
      const newItem = { title: 'coffee', content: 'water seanutbutter' };
      return chai
        .request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.id).to.not.equal(null);
          // response should be deep equal to `newItem` from above if we assign
          // `id` to it from `res.body.id`
          expect(res.body).to.deep.equal(
            Object.assign(newItem, { id: res.body.id })
          );
        });
    });

    it('should return 404 for an invalid id', function() {
    
    
      return chai.request(app)
        .put('/api/notes/99')
      
     
        .then(function(res) {
          expect(res).to.have.status(400);
          // expect(res).message.to.deep.equal(`Missing 'title' in request body`);
        
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        
        });
    });
  });

  

  describe('PUT /api/notes/:id endpoint', function(){
    it('should update items on PUT', function() {
      const updateData = {
        title: 'foo',
        content: 'true'
      };
      return chai.request(app)
      // first have to get so we have an idea of object to update
        .get('/api/notes')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai.request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.deep.equal(updateData);
        });
    });


    it('should raise error if missing title', function() {
      const updateData = {
        content: 'foo',
     
      };
      return chai.request(app)
      // first have to get so we have an idea of object to update
        .get('/api/notes')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai.request(app)
            .put(`/api/notes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(400);
          // expect(res).message.to.deep.equal(`Missing 'title' in request body`);
        
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        
        });
    });

    it('should return 404 for an invalid id', function() {
      const updateData = {
        title: 'whoa',
        content: 'foo',
     
      };
    
      return chai.request(app)
        .put('/api/notes/99')
        .send(updateData)
     
        .then(function(res) {
          expect(res).to.have.status(404);
          // expect(res).message.to.deep.equal(`Missing 'title' in request body`);
        
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        
        });
    });

  });



  describe('DELETE /api/notes/:id endpoint', function(){

    let testObjects;

    it('should delete an item by id', function(){
      return chai.request(app)
      // first have to get so we have an idea of object to update
        .get('/api/notes')
        .then(function(res){ 
          testObjects = res.body;
       
          
          return chai.request(app)
            .delete(`/api/notes/${testObjects[0].id}`); //api/notes/:id
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });

    });
  });

});

