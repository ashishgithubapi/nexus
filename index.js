const http = require('http');
const app = require('./app');
const host = '0.0.0.0';
const port = process.env.PORT || 4060;
const server = http.createServer(app);
server.listen(`${port,host}`);
