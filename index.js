const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const {
  MessengerBot,
  LineBot,
  TelegramBot,
} = require('bottender');
const { registerRoutes } = require('bottender/express');
const handler = require('./src/handler');
const btconfig = require('./bottender.config');
const messgapi = require('./src/messenger_api');

const server = express();
const port = process.env.PORT || 3000;

server.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

const bots = {
  line: new LineBot(btconfig.line).onEvent(handler),
  telegram: new TelegramBot(btconfig.telegram).onEvent(handler),
  messenger: new MessengerBot(btconfig.messenger).onEvent(handler),
};

registerRoutes(server, bots.line, { path: '/line' });
registerRoutes(server, bots.telegram, { path: '/telegram' });
registerRoutes(server, bots.messenger, { path: '/messenger' });

if(btconfig.credential){
  let options = {
    key: fs.readFileSync(btconfig.credential.key),
    cert: fs.readFileSync(btconfig.credential.cert),
    ca: fs.readFileSync(btconfig.credential.ca),
  }
  https.createServer(options, server).listen(8443, () =>{
    console.log(`server is listening on 8443 port`);
  });
}
else{
  server.listen(port, () => {
    console.log(`server is listening on ${port} port...`);
    /* init messenger api settings */
    // messgapi.init();
  });
}

