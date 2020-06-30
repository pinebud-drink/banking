
const express = require('express');
const app = express();
const path = require('path');

// db_connect
var mysql      = require('mysql');
var glasses  = require('./glasses.json');
var connection = mysql.createConnection({
  host     : glasses.host,
  user     : glasses.user,
  password : glasses.password,
  database : glasses.database
});

connection.connect();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));//to use static asset

//tab

app.get('/design', function(req, res){
    res.render('wallet');
});

app.get('/signup', function(req, res){
    res.render('signup')
});

app.get('/login',function(req,res){
    res.render('login')
});

//post
app.post('/signup', function(req, res){
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    var userAccessToken = req.body.userAccessToken;
    var userRefreshToken = req.body.userRefreshToken;
    var userSeqNo = req.body.userSeqNo;
    console.log(userAccessToken, userRefreshToken, userSeqNo)
    var sql = "INSERT INTO solbank.user"+
    glasses.insert_db+ " VALUES (?, ?, ?, ?, ?, ?)"
    connection.query(sql,[userName, userEmail, userPassword,
        userAccessToken, userRefreshToken, userSeqNo], function (error, results, fields) {
        if (error) throw error;
        res.json('가입완료');
    });
});

app.listen(3000);

