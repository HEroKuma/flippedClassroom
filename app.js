var path = require("path");
var express = require("express");
var app = express();

// 設定 view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// 設定 server
var server = app.listen(process.env.PORT || 3000, function(){
    var host = server.address().address;
    var port = server.address().port;
});

// 設定 socket.io
io = require("socket.io")(server);

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
    res.render("host", {channel: null});
    return;
});

// 學生頁面
app.get("/:channel", function(req, res, next){
    res.render("guest", {channel: req.params.channel});
    return;
});

module.exports = app;
