var config = require('../bottender.config');
var request = require('request');


var getStartedOptions = {
  method: 'POST',
   url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: config.messenger.accessToken },
  headers: { 'content-type': 'application/json' },
  body: {
    "get_started":{
      "payload":"GET_STARTED_PAYLOAD"
    }
  },
  json: true
}


/* set up whitelist domains */
var whiteListOptions = { 
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: config.messenger.accessToken },
  headers: { 'content-type': 'application/json' },
  body: 
   { whitelisted_domains: 
      [ 
        'https://raw.githubusercontent.com/',
      'https://i.imgur.com/',
    'https://nol.ntu.edu.tw'] },
  json: true 
};

function init(){
    sendRequest(getStartedOptions);
    sendRequest(whiteListOptions);


}


function sendRequest(options){
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(options.url,body);
    });
}
exports.init = init