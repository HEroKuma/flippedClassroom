var path = require("path");
var express = require("express");
var http = require("http");
var app = express();

// 設定 view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

// 設定 server
var server = app.listen(process.env.PORT || 3006, function(){
    var host = server.address().address;
    var port = server.address().port;
});

// 設定 socket.io
io = require("socket.io")(server);

//sql connect
var mysql = require('mysql');
var db_option = mysql.createConnection({
    host: '123.207.232.68',
    user: 'webprogramming',
    password: 'team4',
    database: 'webProgramming',
    port: 3306
});

var sql = 'SELECT * FROM question_table;';

db_option.connect()

function querytest(callback){
    db_option.query(sql, function(err, row, fields){
        callback(null,row);
    });
}


function openChannel(io, channel){
    if (io.nsps["/" + channel]){
        return;
    }

    // 建立一個quiz channel
    var quizChannel = io.of("/" + channel);

    //
    quizChannel.on("connection", function(socket){
        socket.on("quizPublished", function(quiz){
            quizChannel.emit("quizPublished", quiz);
        });

        socket.on("answerSubmitted", function(answer){
            quizChannel.emit("answerSubmitted", answer);
        });

        socket.on("correctAnswerGiven", function(answer){
            quizChannel.emit("correctAnswerGiven", answer);
        });
    });
}

// 老師出題頁面
app.get("/", function(req, res, next){
    if (req.query.channel){
        openChannel(io, req.query.channel);
        res.render("host", {channel: req.query.channel});
        return;
    }
    db_option.query(sql, function(err, rows){
        var data = rows;
        res.render('host', {channel: null, title: 'query_info', data:data});
    });
    //res.render("host", {channel: null});
    return;
});

app.get("/index", function(req, res, next){
    res.render('index');
    return;
});

// 學生頁面
app.get("/:channel", function(req, res, next){
    res.render("guest", {channel: req.params.channel});
    return;
});



module.exports = app;
