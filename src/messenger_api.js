const btconfig = require('../bottender.config');
const config = require('./config');
const request = require('request');
const emoji = require('./emoji');

var getStartedOptions = {
  method: 'POST',
   url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: btconfig.messenger.accessToken },
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
  qs: { access_token: btconfig.messenger.accessToken },
  headers: { 'content-type': 'application/json' },
  body: 
   { whitelisted_domains: 
      [ 'https://cryolitez.github.io/',
      'https://github.com/',
        'https://raw.githubusercontent.com/',
      'https://i.imgur.com/',
    'https://nol.ntu.edu.tw'] },
  json: true 
};

var greetingOption = {
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/thread_settings',
  qs: { access_token: btconfig.messenger.accessToken },
  headers: { 'content-type': 'application/json' },
  body: { 
      "setting_type":"greeting",
      "greeting":{
      "text":`{{user_full_name}}，早安 ${emoji.rabbit}`
       }
    },
  json: true 
   
};

var persistentMenuOptions = {
  method: 'POST',
  url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
  qs: { access_token: btconfig.messenger.accessToken },
  headers: { 'content-type': 'application/json' },
  body:
  {    
    "persistent_menu":[
      {
        "locale":"default",
        "composer_input_disabled":false,
        "call_to_actions":[
          {
            "title":"課程查詢",
            "type":"postback",
            "payload": config.payload.QUERY_COURSE
          },
          {
            "title":"系所查詢",
            "type":"postback",
            "payload": config.payload.QUERY_DEPT
          },
          {
            "title":"教師查詢",
            "type":"postback",
            "payload": config.payload.QUERY_TCHR
          },
          
          
        ]
      },
      {
        "locale":"zh_CN",
        "composer_input_disabled":false
      }
    ]
    
  },  
  json: true,
}



function init(){
    sendRequest(getStartedOptions);
    sendRequest(whiteListOptions);
    sendRequest(greetingOption);
    sendRequest(persistentMenuOptions);


}


function sendRequest(options){
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(options.url,body);
    });
}
exports.init = init