let express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  routes = require('./server-assets/routes/index'),
  handlers = require('./utils/handlers'),
  server = express(),
  port = process.env.PORT || 1582,
  http = require('http').Server(server),
  io = require('socket.io')(http), 
  Planet = require('./server-assets/models/planet-model'),
  constants = require('./utils/constants');

//Registers Middleware for server
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use('/', express.static(`${__dirname}/public/planets/`));
server.use('/api', cors(handlers.corsOptions), routes.router)
server.use('/', handlers.defaultErrorHandler)

server.get('/whatport', function (req, res) {
  res.send({ port: port })
})

server.get('/', function (req, res) {
  res.sendfile('index.html')
});

io.on('connection', function (socket) {
    socket.emit(constants.COWABUNGA, {turtles: ['Mikey', 'Leo', 'Donnie', 'Raph']})

    socket.on(constants.GIVEMEPLANETS, function(){
      Planet.getAll({}, function(planets){
        socket.emit(constants.PLANETSRECIEVED, planets)
      })
    })
    
});



http.listen(port, function () {
  console.log(`Creating worlds on port: ${port}`);
})