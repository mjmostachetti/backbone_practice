var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var counter1 = 0;
var counter2 = 0;
var nextId = 2;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get('/counter/:val', function (req, res) {
    var num = req.params.val
    console.log("This is the params passed in :" + num)
    console.log("counter has been requested");
    res.send(JSON.stringify({value : counter1}));
});


app.put('/counter/:val', function (req, res) {
    console.log(req.body);
    var json = JSON.stringify({})
    res.end(json);
});

app.post('/counter',function (req,res){
    console.log('server side post')
    var json = JSON.stringify({id:nextId})
    res.end(json);
    nextId++;
});

app.get('/counter', function (req,res){

})

//app.get('/text')

app.listen(3000, function () {
    console.log("server started");
});