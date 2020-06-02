var koa = require('koa');
var app = module.exports = new koa();

const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser =  require('koa-bodyparser');

const data = require('./data');

app.use(bodyParser());
app.use(cors());
app.use(middleware);

function middleware(ctx, next) {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log(`${start.toLocaleTimeString()} ${ctx.request.method} ${ctx.request.url} ${ctx.response.status} - ${ms}ms`);
  });
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const adventures = [];

for (let i = 0; i < 50; i++) {
  adventures.push({
    id: i + 1,
    name: data.characterNames[getRandomInt(0, data.characterNames.length)],
    status: data.statuses[getRandomInt(0, data.statuses.length)],
    planetName: data.planetNames[getRandomInt(0, data.planetNames.length)],
    ebatteries: getRandomInt(10, 200),
    batteries: getRandomInt(1, 500)
  });
}

const router = new Router();

router.get('/visited', ctx => {
  ctx.response.body = adventures.filter(adventure => adventure.status === 'visited');
  ;
  ctx.response.status = 200;
});

router.get('/postponed', ctx => {
  ctx.response.body = adventures.filter(adventure => adventure.status === 'postponed');
  ctx.response.status = 200;
});

router.get('/cancelled', ctx => {
  ctx.response.body = adventures.filter(adventure => adventure.status === 'cancelled');
  ctx.response.status = 200;
});

router.get('/deadly', ctx => {
  ctx.response.body = adventures.filter(adventure => adventure.status === 'cancelled');
  ctx.response.status = 200;
});

const planetsWithInfo = [];

data.planetNames.forEach(function (planetName) {
  planetsWithInfo.push({
    planetName: planetName,
    population: getRandomInt(100, 400000),
    pollutionRate: getRandomInt(1, 100)
  })
})

router.get('/planets/:planetName', ctx => {
  const headers = ctx.params;
  const planetName = headers.planetName;
  if (typeof planetName !== 'undefined') {
    ctx.response.body = planetsWithInfo.filter(planet => planet.planetName == planetName);
    ctx.response.status = 200;
  } else {
    console.log("Missing or invalid: clientId!");
    ctx.response.body = { text: 'Missing or invalid: clientId!' };
    ctx.response.status = 404;
  }
});

const charactersWithInfo = [];

data.characterNames.forEach(function(character){
  charactersWithInfo.push({
    characterName: character,
    favoriteDevice: data.gadgets[getRandomInt(0, data.gadgets.length)],
    currentYear: getRandomInt(1960, 2029),
    imageUrl: data.charactersWithPictures.get(character)
  })
});

router.get('/characters', ctx => {
  ctx.response.body = charactersWithInfo;
  ctx.response.status = 200;
});

router.get('/characters/:characterName', ctx => {
  const headers = ctx.params;
  const characterName = headers.characterName;
  if (typeof characterName !== 'undefined') {
    ctx.response.body = charactersWithInfo.filter(character => character.characterName == characterName)[0];  
    ctx.response.status = 200;
  } else {
    console.log("Missing or invalid: characterName!");
    ctx.response.body = { text: 'Missing or invalid: clientId!' };
    ctx.response.status = 404;
  }
});

const simulateAdventure = () => {
  return {
    status: data.adventureStatuses[getRandomInt(0, data.adventureStatuses.length)],
    damage: getRandomInt(0, 100),
    rewards: data.adventureRewards[getRandomInt(0, data.adventureRewards.length)]
  }
}

router.get('/simulateAdventure', ctx => {
  ctx.response.body = simulateAdventure();
  ctx.response.status = 200;  
});

router.post('/change', ctx => {
  const headers = ctx.request.body;
  const id = headers.id;
  const status = headers.status;
  const batteries = headers.batteries;
  if (typeof id !== 'undefined' && typeof status !== 'undefined') {
    const index = adventures.findIndex(request => request.id == id);
    if (index === -1) {
      console.log("Model not available!");
      ctx.response.body = { text: 'Model not available!' };
      ctx.response.status = 404;
    } else {
      let request = adventures[index];
      request.status = status;
      if (status === 'filled') {
        request.batteries = batteries;
      }
      ctx.response.body = request;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid: id!");
    ctx.response.body = { text: 'Missing or invalid: id!' };
    ctx.response.status = 404;
  }
});

const broadcast = (data) =>
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

router.post('/request', ctx => {
  const headers = ctx.request.body;
  const name = headers.name;
  const status = headers.status;
  const character = headers.character;
  const ebatteries = headers.ebatteries;
  const batteries = headers.batteries;
  if (typeof name !== 'undefined' && typeof character !== 'undefined' && typeof status !== 'undefined'
    && typeof ebatteries !== 'undefined' && batteries !== 'undefined') {
    const index = adventures.findIndex(request => request.name == name && request.character == character);
    if (index !== -1) {
      console.log("Request already exists!");
      ctx.response.body = { text: 'Request already exists!' };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, adventures.map(function (request) {
        return request.id;
      })) + 1;
      let obj = {
        id: maxId,
        name,
        status,
        character,
        ebatteries,
        batteries
      };
      adventures.push(obj);
      broadcast(obj);
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid fields!");
    ctx.response.body = { text: 'Missing or invalid fields!' };
    ctx.response.status = 404;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(1958);