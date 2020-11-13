var http = require('http');
var connection = require('./mysql');
var express = require("express");
var app = express();
var fs = require('fs');
var ejs = require('ejs');

app.set("view engine", "ejs")

let give_data;

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

//GETリクエスト
app.get('/', function (req, res) {

  var data = {
    method: "get"
  };
  res.render('./index.ejs', data);
})

//POSTリクエスト
app.post('/post', function (req, res) {
  var data = '';
  
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {
    let todoItem = data.substr(5)
    //POSTの内容をデコード、日本語と空白に対応
    todoItem=decodeURIComponent(todoItem.replace(/\+/g, "%20"));
    
    //データを挿入
    connection.query('insert into todoitems(item, isdone, creation, deadline) values (\' ' + todoItem + '\', 0, now(), now());', function (err, rows) {
      if (err) { console.log('err: ' + err); } 
    });
    
    connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 
      
      give_data = {
        method: "post",
        rows: rows
      };
      
      res.render('./index.ejs', give_data);
    })
  }) 
});



// //DELETEリクエスト
app.post('/delete', function (req, res){
  var data_delete = '';

  req.on('data', function(chunk) {data_delete += chunk})
  .on('end', function() {
    let delete_id = data_delete.substr(3)
    //POSTの内容をデコード、日本語と空白に対応
    delete_id=decodeURIComponent(delete_id.replace(/\+/g, "%20"));

    connection.query('DELETE FROM todoitems WHERE id='+delete_id+';', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 
    });
    
    connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 

      console.log(rows)
      
      give_data = {
        method: "delete",
        rows: rows
      };
      
      res.render('./index.ejs', give_data);
    })
  });
});
  
  
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
