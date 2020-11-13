var http = require('http');
var connection = require('./mysql');
var express = require("express");
var app = express();

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
      
      give_data = {
        method: "delete",
        rows: rows
      };
      
      res.render('./index.ejs', give_data);
    })
  });
});
  
  
// //PUTリクエスト
app.post('/put', function (req, res){
  var data_put = '';

  req.on('data', function(chunk) {data_put += chunk})
  .on('end', function() {
    //POSTの内容をデコード、日本語と空白に対応
    data_put=decodeURIComponent(data_put.replace(/\+/g, "%20"));
    let and_index = data_put.indexOf("&")
    let put_id = data_put.substr(and_index + 4)
    let content = data_put.substr(5, and_index - 5)


    connection.query('UPDATE todoitems SET item=\"'+content+'\" WHERE id='+put_id+';', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 
    });
    
    connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 

      give_data = {
        method: "put",
        rows: rows
      };
      
      res.render('./index.ejs', give_data);
    });
  
  })
});

app.listen(3000);