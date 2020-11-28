var connection = require('./mysql');
var express = require("express");
var app = express();
app.set("view engine", "ejs")

let give_data;

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

// //GETリクエスト
app.get('/', function (req, res) {
  give_data = {
    method: "get"
  };
  res.render('./index.ejs', give_data);
})

//POSTリクエスト
app.post('/', function (req, res) {
  var data = '';
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {
    let Item_position = 5
    let todoItem = data.substr(Item_position)
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

app.post('/:id', function (req, res){
  let data = '';
  
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {

    //デコード、日本語と空白に対応
    data=decodeURIComponent(data.replace(/\+/g, "%20"));
    
    if(data === "_method=delete"){
      
      //deleteメソッド
      connection.query('DELETE FROM todoitems WHERE id='+req.params.id+';', function (err, rows, fields) {
        if (err) { console.log('err: ' + err); } 
      });
      
      connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
        if (err) { console.log('err: ' + err); } 
        give_data = {
          method: "delete",
          rows: rows
        };
        res.render('./index.ejs', give_data);
      });
      
    } else {
      
      //putメソッド
      data = data.replace( /name=/g , "" ).replace( /&_method=put/g , "" ) ;

      //データを更新
      connection.query('UPDATE todoitems SET item=\"'+data+'\" WHERE id='+req.params.id+';', function (err, rows, fields) {
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
      
    }
  });
  
});

app.listen(3000);