var http = require('http');
var html = require('fs').readFileSync('index.html');

http.createServer(function(req, res) {
  if(req.method === 'GET') {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(html);
  } else if(req.method === 'POST') {
    var data = '';
    
   //POSTデータを受けとる
   req.on('data', function(chunk) {data += chunk})
      .on('end', function() {
 
        console.log(data);
        res.end(html);
 
      })
 
   }
}).listen(3000);