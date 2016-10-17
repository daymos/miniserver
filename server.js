'use strict'

const Assert = require('assert'),
  Hapi = require('hapi'),
  Boom = require("boom"),
  MongoClient = require("mongodb").MongoClient,
  { initCloudant } = require('./cloudantHelpers.js')

const server = new Hapi.Server();
server.connection({ port: 3000, routes: { cors: true } });

server.route({
  method:'GET',
  path:'/',
  handler:function(request,reply){
    newApiKey() 
    console.log('request received')
    reply('ciao')
  }
})
server.route({
  method:'POST',
  path:'/login',
  handler:function(request, reply){
    MongoClient.connect('mongodb://matt:Mattia13@ds059306.mlab.com:59306/face-it', function(err, db) {
      Assert.equal(null, err);
      console.log("Connected correctly to server");

      db.collection('users').find({username:request.payload.name}).toArray(function(err, docs) {
        Assert.equal(err, null)
        console.log('docs: ', docs)
        if(docs.length === 0) reply('usernotfound')
        else if(docs[0].password === request.payload.password) reply ({state:'success', data: JSON.stringify(docs[0]})) //sendback api key
        else reply('wrongpassword' )
      });
      db.close();
    });
  }
})
server.route({
  method:'POST',
  path:'/signup',
  handler:function(request, reply){
    MongoClient.connect('mongodb://matt:Mattia13@ds059306.mlab.com:59306/face-it', function(err, db) {
      Assert.equal(null, err);
      db.collection('users').find({username:request.payload.name}).toArray(function(err, docs){
        Assert.equal(null, err) 
        if(docs.length !== 0) reply('nametaken')
        else {
          //create new user on pouch
          console.log('payload.name', request.payload)
          initCloudant(request.payload.name, next)

          function next(api){
            db.collection('users').insertMany(
              [{
                username: String(request.payload.name),
                password: String(request.payload.password),
                api: {
                  key: String(api.key),
                  password: String(api.password)
                }
              }],
              function(err, result){
                if(err) console.log('Error in db.collection - cannot add user to db')
                Assert.equal(err, null)
                console.log('succesfully inserted new user')
                //do something here like send back something to the frontend
                db.close()
                reply(JSON.stringify({name:request.payload.name, api:api})) 
              })
          }
        }
      })
    });
  }
})

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
