const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken')
const auth = require('./lib/auth');

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

app.post('/login', function(req, res){
    console.log(req.body); //???
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;

    var sql = "SELECT * FROM solbank.user WHERE solbank_useremail = ?;";
    connection.query(sql, [userEmail], function(error, result){
        if (error) throw error;
        console.log("사용자 accessToken : ",result[0].solbank_accesstoken);
        var dbpassword = result[0].solbank_userpassword;
        console.log('database password : ',dbpassword);
        if(dbpassword == userPassword){
            console.log('로그인 성공');
            //인증 부분
            //jwt.sign()
            jwt.sign(
                {
                    userId : result[0].idsolbank,
                    userName : result[0].solbank_username
                },  //paylaod
                glasses.ourtokenKey,
                glasses.authinfo,
                function(err, token) {
                    console.log('우리가 발급한 토큰 : ',token);
                    res.json(token);
                }
            );
        }
        else if (result.length == 0 || dbpassword != userPassword){
            res.json("등록되지 않은 아이디 혹은 패스워드 오류 입니다.")
        }
    })

})

app.listen(3000);