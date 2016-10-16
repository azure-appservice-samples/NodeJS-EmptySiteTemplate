var http = require('http');

http.createServer(function (req, res) {
            app.get('/webhook', function(req, res) {
          if (req.query['hub.mode'] === 'subscribe' &&
              req.query['hub.verify_token'] === 'carinaserver_token') {
            console.log("Validating webhook");
            res.status(200).send(req.query['hub.challenge']);
          } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);          
          }  
        });
    //res.writeHead(200, { 'Content-Type': 'text/html' });
    //res.end('Hello, world!');
    
}).listen(process.env.PORT || 8080);
