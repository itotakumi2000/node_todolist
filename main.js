var http = require('http');
var connection = require('./mysql');
var express = require("express");
var app = express();
var fs = require('fs');
var ejs = require('ejs');

app.set("view engine", "ejs")

var read_indexfile = fs.readFileSync('./index.ejs', 'utf8');

let todoList = [];

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

//GETリクエスト
app.get('/', function (req, res) {
  var get_indexfile = ejs.render(read_indexfile, {});

  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.write(get_indexfile);
  res.end();
});

//POSTリクエスト
app.post('/', function (req, res) {
  var data = '';
  
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {
    let todoItem = data.substr(5)
    //POSTの内容をデコード、日本語と空白に対応
    todoItem=decodeURIComponent(todoItem.replace(/\+/g, "%20"));
    
    //POSTメソッドの処理
    connection.query('insert into todoitems(item, isdone, creation, deadline) values (\' ' + todoItem + '\', 0, now(), now());', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 

      var post_indexfile = ejs.render(read_indexfile, {
        method:"post",
        rows:rows,
      });
      
      res.writeHead(303, { 'Location': '/' });
      res.write(post_indexfile);
      res.end();
    });
    
  }) 
});



// //DELETEリクエスト
// app.post('/delete', function (req, res){
  //   var data_delete = '';
  
  //   req.on('data', function(chunk) {data_delete += chunk})
  //   .on('end', function() {
    //     let todoItem_delete = data_delete.substr(5)
    //     //POSTの内容をデコード、日本語と空白に対応
    //     todoItem_delete=decodeURIComponent(todoItem_delete.replace(/\+/g, "%20"));
    
    //     let id=todoItem_delete.slice(13)
    //     // connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
      //     //   if (err) { console.log('err: ' + err); } 
      //     //   let del;
      
      //     //   //HTMLを削除
      //     //   if(rows[id]||rows[id-1]){
        //     //     del = '<div class="todoItem">'+rows[id-1].item+'</div><form method="POST" action="delete"><input type="submit" value="削除" /><input type="hidden" name="_method" value="DELETE" /><input type="hidden" name="id" value="'+id+'" /></form><form method="POST" action="put"><input type="text" name="name" /><input type="submit" value="更新" /><input type="hidden" name="_method" value="PUT" /><input type="hidden" name="id" value="'+id+'" /></form>'
        //     //     html = html.toString().replace(del,"");
        //     //   }
        //     // })
        //     connection.query('UPDATE todoitems SET isdone=isdone+1 WHERE id='+id+';', function (err, rows, fields) {
//       if (err) { console.log('err: ' + err); } 
//     });
    
//     connection.query('DELETE FROM todoitems WHERE isdone=2;', function (err, rows, fields) {
//       if (err) { console.log('err: ' + err); } 
//     });
    
//     res.end();
//   });
// });
  
  
// //PUTリクエスト
// app.post('/put', function (req, res){
//   var data_put = '';

//   req.on('data', function(chunk) {data_put += chunk})
//   .on('end', function() {
//     let todoItem_put = data_put.substr(5)
//     //POSTの内容をデコード、日本語と空白に対応
//     todoItem_put=decodeURIComponent(todoItem_put.replace(/\+/g, "%20"));

//     if(todoItem_put.match(/_method=PUT/)){
//       let content_num = todoItem_put.indexOf("&")
//       let content=todoItem_put.substr(0,content_num);
//       let id_num = todoItem_put.substr(content_num + 16);
      
//       // connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
//       //   if (err) { console.log('err: ' + err); } 
//       //   if(rows[id_num]||rows[id_num-1]){
//       //     html = html.toString().replace(rows[id_num-1].item,content)
//       //   }
//       //   res.end();
//       // });
    
//     connection.query('UPDATE todoitems SET item=\"'+content+'\" WHERE id='+id_num+';', function (err, rows, fields) {
//       if (err) { console.log('err: ' + err); } 
//     });
//     }
//   })
// });

app.listen(3000);
