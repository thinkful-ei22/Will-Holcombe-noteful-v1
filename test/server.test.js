'use strict';

const chai = require('chai');

const { app, runServer, closeServer } = require('../server');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
describe('notes', function() {

  before(function() {
    return runServer();
  });

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });

  // `chai.request.get` is an asynchronous operation. When
  // using Mocha with async operations, we need to either
  // return an ES6 promise or else pass a `done` callback to the
  // test that we call at the end. We prefer the first approach, so
  // we just return the chained `chai.request.get` object.
  /*
  it('should return index page on GET', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.equal(./index.html);
        
        });
      });
 
*/
  describe('404 handler', function() {

    it('should return a 404 status code for bad path', function() {
      return chai.request(app)
        .get('/api/1005')


        .then(function(res) {
          expect(res).to.have.status(404);
          // expect(res).message.to.deep.equal(`Missing 'title' in request body`);

          expect(res).to.be.json;
          expect(res.body).to.be.a('object');

        });

    });
  });

  describe('GET /api/notes endpoint', function() {

    it('should list notes on GET', function() {
      return chai.request(app)
        .get('/api/notes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.be.above(0);
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.have.all.keys(
              'content', 'id', 'title');
          });
        });
    });


    it('should return 404 for an invalid id', function() {
   
      return chai.request(app)
        .get('/api')
         
     
        .then(function(res) {
          expect(res).to.have.status(404);
          // expect(res).message.to.deep.equal(`Missing 'title' in request body`);
        
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
        
        });
    });

  });

  describe('GET /api/notes/:id', function(){
    it('should return correct note object with id, title, content for given id', function() {
    //const newItem = { title: 'coffee', content: 'water seanutbutter' };
      let testObject;
 
    
      return chai.request(app)
      // first have to get so we have an idea of object to update
        .get('/api/notes')
        .then(function(res){ 
          testObject = res.body[0];
       
          
          return chai.request(app)
            .get(`/api/notes/${testObject.id}`); //api/notes/:id
        })
        .then(function(res) {
          expect(res.body.id).to.deep.equal(testObject.id);
          expect(res.body.title).to.deep.equal(testObject.title);
          expect(res.body.content).to.deep.equal(testObject.content);
        });

    });
  });
  /*
    it('should t')

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
*/
  /*
  it('should raise error if missing title', function() {
    const badInputs = 
      {content: 'water'};
      //[content: "sand"]
  
    return chai
      .request(app)
      .post('/api/notes')
      .send(badInputs)
      .then(function(res) {
        expect(res).to.have.status(400);
   
      });

  });

*/




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

  /*   Is this extraneous??
  it('should raise error if missing title', function() {
    const badInputs = 
      {content: 'water'};
      //[content: "sand"]
  
    return chai
      .request(app)
      .post('/api/notes')
      .send(badInputs)
      .then(function(res) {
        expect(res).to.have.status(400);
   
      });

  });
*/

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
});

