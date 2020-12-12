var connection = require('./mysql');
var express = require("express");
var app = express();
app.set("view engine", "ejs")

//テーブルの初期化
connection.query('truncate table todoitems;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); } 
});

// GETリクエスト
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

//deleteメソッド
// app.delete('/api/v1/todoItems/:id', (req, res) => {

//   connection.query('DELETE FROM todoitems WHERE id='+req.params.id+';', function (err, rows, fields) {
//     if (err) { console.log('err: ' + err); } 
//   });

//   res.end();

// });


// app.post('/:id', function (req, res){
//   let data = '';
  
//   req.on('data', function(chunk) {data += chunk})
//   .on('end', function() {

//     //デコード、日本語と空白に対応
//     data=decodeURIComponent(data.replace(/\+/g, "%20"));
    
//     if(data === "_method=delete"){
      
//       //deleteメソッド
//       connection.query('DELETE FROM todoitems WHERE id='+req.params.id+';', function (err, rows, fields) {
//         if (err) { console.log('err: ' + err); } 
//       });
      
//       connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
//         if (err) { console.log('err: ' + err); } 
//         give_data = {
//           method: "delete",
//           rows: rows
//         };
//         res.render('./index.ejs', give_data);
//       });
      
//     } else {
      
//       //putメソッド
//       data = data.replace( /name=/g , "" ).replace( /&_method=put/g , "" ) ;

//       //データを更新
//       connection.query('UPDATE todoitems SET item=\"'+data+'\" WHERE id='+req.params.id+';', function (err, rows, fields) {
//         if (err) { console.log('err: ' + err); } 
//       });
      
//       connection.query('SELECT * FROM todoitems;', function (err, rows, fields) {
//         if (err) { console.log('err: ' + err); } 
    
//         give_data = {
//           method: "put",
//           rows: rows
//         };
        
//         res.render('./index.ejs', give_data);
//       });
      
//     }
//   });
  
// });

app.listen(3000);