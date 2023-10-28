var express = require('express');
var app = express();
var port = 1853;
app.set("view engine","ejs");
app.set("view engine","pug");
const jquery = require('jquery');
app.use(express.static(__dirname + '/public'))



app.get("/",function(req,res){
    res.render('test.ejs')
})

app.listen(port);