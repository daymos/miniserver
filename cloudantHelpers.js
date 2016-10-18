exports.initCloudant = (username, callback)=>{

  const cloudantClient = require('cloudant')({account:'daymos', password:'Mattia1988'});

  cloudantClient.db.create(username, function() {
    cloudantClient.generate_api_key(function(err, api) {
      if (err) throw err     
      cloudantClient.db.use(username).set_security({
        nobody:[],
        daymos:['_reader', '_writer', '_admin', '_replicator'],
        [api.key]: ['_reader', '_writer']
      }, (err, result)=>{
        if(err) console.log('error in setting secutiry for db')
        console.log('set security for: ', username) 
      })

      //here shoud create data structure

      cloudantClient.db.use(JSON.parse(localStorage.getItem('faceit')).username).insert({ crazy: true }, 'rabbit', function(err, body, header) {
        if (err) {
          return console.log('error insertin gmessage', err.message);
        }
        console.log('You have inserted the rabbit.');
      });

      callback(api)
    })
  })
}
