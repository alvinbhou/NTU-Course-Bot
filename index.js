const express = require('express');
const bodyParser = require('body-parser');
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

server.listen(port, () => {
  console.log(`server is listening on ${port} port...`);
  /* init messenger api settings */
  messgapi.init();
});