var connection = require('./mysql');
var express = require("express");
var app = express();
app.set("view engine", "ejs")

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

// read page
app.get('/', function (req, res) {
  res.render('./index.ejs');
})

// read todoItems
app.get('/api/v1/todoItems', (req, res) => {
  connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
    if (err) { console.log('err: ' + err); } 
    res.send(JSON.stringify(rows));
  })
});

app.post('/', function (req, res) {
  return;
})

// create todoItem
app.post('/api/v1/todoItem', (req, res) => {
  let data = '';
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {
    //データを挿入
    connection.query('insert into todoitems(item, isdone, creation, deadline) values (\' ' + data + '\', 0, now(), now());', function (err, rows) {
      if (err) { console.log('err: ' + err); } 
    }); 

    res.end();
  }) 
});

// delete todoItem
app.delete('/api/v1/todoItems/:id', (req, res) => {
  
  connection.query('DELETE FROM todoitems WHERE id='+req.params.id+';', function (err, rows, fields) {
    if (err) { console.log('err: ' + err); } 
  });

  connection.query('SET @i := 0;', function (err, rows, fields) {
    if (err) { console.log('err: ' + err); } 
  });

  connection.query('UPDATE `todoitems` SET id = (@i := @i +1) ;', function (err, rows, fields) {
    if (err) { console.log('err: ' + err); } 
  });

  res.end();

});

// update todoItem
app.put('/api/v1/todoItems/:id', (req, res) => {
  let data = '';
  req.on('data', function(chunk) {data += chunk})
  .on('end', function() {
    
    connection.query('UPDATE todoitems SET item=\"'+data+'\" WHERE id='+req.params.id+';', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); } 
    });

    res.end();
  }) 

});

app.listen(3000);