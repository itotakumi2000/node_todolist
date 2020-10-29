var http = require('http');
var html = require('fs').readFileSync('index.html');
var connection = require('./mysql');

let todoList = [];

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

http.createServer(function(req, res) {
  if(req.method === 'GET') {

    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(html);

  } else if(req.method === 'POST') {

    var data = '';

    req.on('data', function(chunk) {data += chunk})
    .on('end', function() {
      let todoItem = data.substr(5)
      //POSTの内容をデコード、日本語と空白に対応
      todoItem=decodeURIComponent(todoItem.replace(/\+/g, "%20"));

      //DELETEメソッドの処理
      if(todoItem.slice(0,9) === "od=DELETE"){
        let id=todoItem.slice(13)
        connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
          if (err) { console.log('err: ' + err); } 
          let del;

          //HTMLを削除
          if(rows[id]||rows[id-1]){
            del = '<div class="todoItem">'+rows[id-1].item+'</div><form method="POST" action="main.js"><input type="submit" value="削除" /><input type="hidden" name="_method" value="DELETE" /><input type="hidden" name="id" value="'+id+'" /></form>'
            html = html.toString().replace(del,"");
          }
        });


        connection.query('UPDATE todoitems SET isdone=isdone+1 WHERE id='+id+';', function (err, rows, fields) {
          if (err) { console.log('err: ' + err); } 
        });

        connection.query('DELETE FROM todoitems WHERE isdone=2;', function (err, rows, fields) {
          if (err) { console.log('err: ' + err); } 
        });

        res.end(html);
        return;
      }

      //POSTメソッドの処理
      connection.query('insert into todoitems(item, isdone, creation, deadline) values (\' ' + todoItem + '\', 0, now(), now());', function (err, rows, fields) {
        if (err) { console.log('err: ' + err); } 
      });
      
      connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
        if (err) { console.log('err: ' + err); } 
        for(let i=0; i<rows.length; i++){
          todoList[i]="<div class=\"todoItem\">"+rows[i].item+"</div><form method=\"POST\" action=\"main.js\"><input type=\"submit\" value=\"削除\" /><input type=\"hidden\" name=\"_method\" value=\"DELETE\" /><input type=\"hidden\" name=\"id\" value=\""+rows[i].id+"\" /></form>"
        }
        html = html.toString().replace(/<div class="todoitem"><\/div>/g,todoList[todoList.length-1]+'<div class="todoitem"></div>')
        res.writeHead(303, { 'Location': '/' });
        res.end(html);
      });
    }) 
    
  }
}).listen(3000);
