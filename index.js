const express = require('express');
const bodyParser = require('body-parser');
const {
  MessengerBot,
  LineBot,
  TelegramBot,
} = require('bottender');
const { registerRoutes } = require('bottender/express');

const handler = require('./handler');
const config = require('./bottender.config');
const server = express();


server.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

const bots = {
  line: new LineBot(config.line).onEvent(handler),
  telegram: new TelegramBot(config.telegram).onEvent(handler),
};

registerRoutes(server, bots.line, { path: '/line' });
registerRoutes(server, bots.telegram, { path: '/telegram' });

server.listen(3000, () => {
  console.log('server is listening on 3000 port...');
});