const express = require('express');
const dbRouter = require('./data/db-router')

const server = express();

server.use(express.json());
server.use(dbRouter)

server.get('/', (req,res) => {
    res.send(`
    <h1>This is working </h1>
    `)
});

module.exports = server