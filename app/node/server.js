const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const redis = require('redis');

server.listen(8890);

io.on('connection', function (socket) {

    console.log("client connected");

    const redisClient = redis.createClient(
        {
            host: 'redis-app',
            port: 6379,
            no_ready_check: true,
            auth_pass: 'Redis2020!',
        }
    );

    redisClient.on("connect", function () {
        console.log("You are now connected");
    });

    redisClient.on("error", function (error) {
        console.error(error);
    });

    redisClient.subscribe('message');

    redisClient.on("message", function (channel, data) {
        console.log("mew message add in queue " + data['message'] + " channel");
        socket.emit(channel, data);
    });

    socket.on('disconnect', function () {
        redisClient.quit();
    });

});