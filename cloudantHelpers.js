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

      cloudantClient.db.use(username).insert({ userLevel: 0.0 }, 'userLevel', function(err, body, header) {
        if (err) {
          return console.log('error adding initial level', err.message);
        }
        console.log('You have initialised the level');
      });

      cloudantClient.db.use(username).insert({ historical: [] }, 'historical', function(err, body, header) {
        if (err) {
          return console.log('error adding initial historical', err.message);
        }
        console.log('You have initialised the histroical record');
      });

      cloudantClient.db.use(username).insert({ partials: [{

        type: 'happiness',
        properType: 'Happiness',
        data: [
          {"id": "user", "score": 0},
          {"id": "api", "score": 0}
        ]
      },
      {
        type: 'sadness',
        properType: 'Sadness',
        data: [
          {"id": "user", "score": 0},
          {"id": "api", "score": 0}
        ]
      },
      {
        type: 'surprise',
    properType: 'Surprise',
    data: [
      {"id": "user", "score": 0},
      {"id": "api", "score": 0}
    ]
  },
      {
        type: 'anger',
    properType: 'Anger',
    data: [
      {"id": "user", "score": 0},
      {"id": "api", "score": 0}
    ]
  },
{
        type: 'neutral',
    properType: 'Neutral',
    data: [
      {"id": "user", "score": 0},
      {"id": "api", "score": 0}
    ]
  },
  {
          type: 'fear',
      properType: 'Fear',
      data: [
            {"id": "user", "score": 0},
            {"id": "api", "score": 0}
          ]
    }
      ]}, 'partials', function(err, body, header) {
        if (err) {
          return console.log('error adding initial historical', err.message);
        }
        console.log('You have initialised the histroical record');
      });


      callback(api)
    })
  })
} 
