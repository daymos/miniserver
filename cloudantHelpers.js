exports.initCloudant = (username, callback)=>{

  const cloudantClient = require('cloudant')({account:'daymos', password:'Mattia1988'});
  console.log('initCloudant was called')

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

      console.log('API key: %s', api.key);
      console.log('Password for this key: %s', api.password);
      console.log('');
      callback(api)
    })
  })
}
