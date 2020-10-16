var http = require('http');
var html = require('fs').readFileSync('index.html');

let todoList = [];

http.createServer(function(req, res) {
  if(req.method === 'GET') {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(html);
  } else if(req.method === 'POST') {
    var data = '';
    
    req.on('data', function(chunk) {data += chunk})
    .on('end', function() {
      let todoItem = data.substr(5)
      todoList.push(todoItem)
      for(let i=0; i<todoList.length; i++){
        todoList[i]="<div class=\"todoItem\">"+todoList[i]+"</div>"
      }
      html = html.toString().replace(/<div class="todoitem"><\/div>/g,todoList[todoList.length-1]+'<div class="todoitem"></div>')
      res.end(html);
      
    })
    
  }
}).listen(3000);