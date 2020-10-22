const mysql = require('mysql');

const connection = mysql.createConnection({
	host : 'localhost',
  user : 'root',
  password: '@Takumi0730',
	database: 'todolist'
});

// 接続
connection.connect();

// userdataの取得
connection.query('SELECT * from todoitems;', function (err, rows, fields) {
	if (err) { console.log('err: ' + err); } 

	console.log('name: ' + rows[0].item);
	console.log('id: ' + rows[0].id);

});

// 接続終了
connection.end();