var http = require('http');

http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world! 14/06/2018');
    
}).listen(process.env.PORT || 8080);
