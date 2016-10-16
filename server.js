'use strict';

const Hapi = require('hapi');
const rq = require('request-promise')

const server = new Hapi.Server();
server.connection({ port: 3000, routes: { cors: true } });

const db = {
  myUsernameHere:{ //replace with redis
    password:'somepassword',
    apikey:'apikey'
  },
  matt:{ //replace with redis
    password:'somepassword',
    apikey:'apikey'
  }
} 

server.route({
  method: 'POST',
  path: '/',
  handler: function (request, reply) {
    var options = {
      method: 'POST',
      uri: 'https://daymos.cloudant.com/_session',
      resolveWithFullResponse: true,  
      body: {
        name: request.payload.name,
        password: request.payload.password,
      },
      json: true // Automatically stringifies the body to JSON 
    };
    rq(options) //make request to db
      .then((res)=>{
        console.log(res.headers['set-cookie'])
        reply(res.headers['set-cookie'] )
          .header('Access-Control-Allow-Origin','*')
          .header('set-cookie', res.headers['set-cookie'])
      })
      .catch((err)=>{
        console.log(err) 
      })
  }
});

server.route({
  method: 'POST',
  path: '/login',
  handler: function (request, reply) {
    console.log(request.payload.username)
    console.log(db[request.payload.username]!== undefined) 
    reply(request.payload);
  }
});


server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
