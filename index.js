const http = require('http');
const app = require('./app');
const port = process.env.PORT || 5020;
const server = http.createServer(app);
server.listen(`${port}`);
