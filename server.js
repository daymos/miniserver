'use strict';

const Hapi = require('hapi');
const rq = require('request-promise')

const server = new Hapi.Server();
server.connection({ port: 3000 });

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

        rq(options)
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
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
