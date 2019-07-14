//Get the framework for hapi.js
const Hapi = require('hapi');

// Store the hosting server and the port
const host = 'localhost';
const port = 3000;

var gameHit = {
    timestamp: -1,
    hit: -1
};

var queue = [];


// Lets create the server here
const server = Hapi.Server({
    host: host,
    port: port,
    routes: {
        cors: true
    }
});

// Create an init method to start the server.
const init = async () => {

    /*
    try {
        await server.register({
            plugin: require('hapi-cors'),
            options: {
                origins: ['http://localhost:4200']
            }
        });
        await server.start();
        console.log('server started');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

     */

     await server.start();
     console.log("Server up and running at port: " + port);
}

server.route([
    {
        method: 'GET',
        path: '/msgRPS/getGamepadHit',
        handler: function (request, h) {

            console.log("Get request..." + ", que length: " + queue.length);

            var currentHit = queue.shift();
            if( currentHit !== undefined){
                console.log("Not undefined!");
                console.log(currentHit.timestamp + " " + currentHit.hit);
                gameHit = currentHit;
            }

            console.log("Get request..." + gameHit.timestamp);

            return gameHit;
        }
    },
    {
        method: 'POST',
        path: '/msgRPS/setGamepadHit',
        handler: function (request, h) {
            console.log("Request:");
            console.log("Timestamp: " + request.payload.timestamp);
            console.log("Hit: " + request.payload.hit);

            gameHit.timestamp = request.payload.timestamp;
            gameHit.hit = request.payload.hit;

            var gameHitNew = {
                timestamp: gameHit.timestamp,
                hit: gameHit.hit
            };

            queue.push(gameHitNew);

            console.log("POST request. Queue length: " + queue.length);

            return gameHit;
        }
    },
    {
        method: 'GET',
        path: '/msgRPS/clearGamepadHit',
        handler: function (request, h) {
            console.log("Cleared...");

            gameHit.timestamp = -1;
            gameHit.hit = -1;

            queue = [];
            console.log("Queue cleared.");

            return gameHit;
        }
    }
    ]);

// Call the init method.
init();
