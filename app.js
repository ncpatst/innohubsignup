var express = require('express');
var app = express();
// var port = 1857;
app.set("view engine","ejs");
app.set("view engine","pug");
const jquery = require('jquery');
app.use(express.static(__dirname + '/public'))

var path = require('path') 
var bodyParser = require('body-parser')
var assert = require('assert')
var fs = require("fs");
const { time, error } = require('console');

var CronJob = require('cron').CronJob;

var nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const $ = jquery

// const mysql = require("mysql");
// const connection= mysql.createConnection({
// 	host:'127.0.0.1',
// 	user:'student',
// 	password:'fin5)SDK',
// 	database:'students'
// });




app.get('/', function(req, res) {
    res.render("index.ejs");
})
app.get('/signup', function(req, res) {
    res.render("recreatesignup.ejs" ,{message:""});
})

app.get('/submit', function(req, res){
    var Name = req.query.name;
    var email = req.query.email;
    var time = req.query.Block;
    var classname = req.query.class;
    var purpose = req.query.Purpose;
    var addinfo = req.query.additioninformation;
    var date = req.query.getdate;
    var fin = date.split("/")
    date = fin[2]+"-"+fin[0]+"-"+fin[1];
    // console.log(date);
    if(date == "" || date=="undefined" || date=="undefined--undefined"){
        // console.log("error")
       res.render("recreatesignup.ejs",{message:"date error"})
    }
    else{
    var findrepeat = 'select count(1) from records where name = ? and email = ? and time = ? and date = ?';
        connection.query(findrepeat,[Name,email,time,date],(err,result)=>{
            if(err){
                console.log(err.message);
            }
            var testn = (JSON.parse(JSON.stringify(result)))
            var whetherrepeat =  testn[0]['count(1)'];
            if(whetherrepeat > 0){
                res.render("submit.ejs",{teachername:Name,classs:classname,date:date,timePeriod:time});
            }
            else{
                const insert = "insert into records(name,email,time,classname,purpose,addinfo,date) VALUES(?,?,?,?,?,?,?)"
                connection.query(insert,[Name,email,time,classname,purpose,addinfo,date],(err,result)=>{
                    if(err){
                        console.log(err.message);
                    }
                    else{
                        res.render("submit.ejs",{teachername:Name,classs:classname,date:date,timePeriod:time})
                    }
                }) 
            }
        })
    }
});

// create table records(name VARCHAR(32),email VARCHAR(32),time VARCHAR(24), classname VARCHAR(24), purpose VARCHAR(24), addinfo Text,date VARCHAR(24));


app.get("/mysql",function(req,res){
    var datadate = 'select * from records where date >= ? order by date desc;';
    var n=new Date();
    var date = n.getFullYear()+"-"+(n.getMonth()+1<10?"0"+n.getMonth()+1:n.getMonth()+1)+"-"+(n.getDate()>19?"0"+n.getDate:n.getDate());
    // console.log(date);
    connection.query(datadate,date,(err,result)=>{
        if(err){
            console.log(err.message);
        }
        var gettot = (JSON.parse(JSON.stringify(result)))
        for(let i = 0;i<gettot.length;i++){
            if(gettot[i].time == 'block1'){
                gettot[i].time = "Block A/E 8:40 - 10:00A.M.";
            }
            else if(gettot[i].time == 'block2'){
                gettot[i].time = "Block B/F 10:10 - 11:30A.M.";
            }
            else if(gettot[i].time == 'block3'){
                gettot[i].time = "Block C/G 12:15 - 13:35P.M.";
            }
            else if(gettot[i].time == 'block4'){
                gettot[i].time = "Block D/H 13:45 - 15:05P.M.";
            }
            delete gettot[i].purpose;
            delete gettot[i].email;
            delete gettot[i].addinfo;
        }
        
        res.render("table.ejs",{jsondata:JSON.stringify(gettot)})
    });
})

app.get("/total",function(req,res){
    var datadate = 'select * from records where date >= ? order by date desc;';
    var n=new Date();
    var date = n.getFullYear()+"-"+(n.getMonth()+1<10?"0"+n.getMonth()+1:n.getMonth()+1)+"-"+(n.getDate()>19?"0"+n.getDate:n.getDate());
    // console.log(date);
    connection.query(datadate,date,(err,result)=>{
        if(err){
            console.log(err.message);
        }
        var gettot = (JSON.parse(JSON.stringify(result)))
        res.render("totalpanel.ejs",{jsondata:JSON.stringify(gettot)})
    });
})

app.get('/cancel', function(req, res) {
    res.render("cancel.ejs",{message:""});
})

app.get('/cancelsuccess', function(req, res) {
    var date = req.query.date;
    var fin = date.split("/")
    date = fin[2]+"-"+fin[0]+"-"+fin[1];
    var timeperiod = req.query.timeperiod;
    var teachername = req.query.teachername.trim();
    var classname=req.query.classname.trim();
    var select = 'SELECT count(1) FROM records where date = ? and time = ? and name = ? and classname = ?';
    connection.query(select,[date,timeperiod,teachername.toLowerCase(),classname.toLowerCase()],(err,result)=>{
        if(err) {
            res.render("error.ejs",{message:"Please check the date and the name"})
        }
        else {
            var testn = (JSON.parse(JSON.stringify(result)))
		    var whethersignup =  testn[0]['count(1)'];
            if(whethersignup == 0){
                res.render("error.ejs",{message:"you have not sign up the page"})
            }
            else{
                const d = 'delete from records where date = ? and time = ? and name = ? and classname = ?';
                connection.query(d,[date,timeperiod,teachername.toLowerCase(),classname.toLowerCase()],(err,result)=>{
                    if(err) {console.log(err.message)}
                    else {
                        // console.log('数据删除成功');
                        res.render("cancelsuccess.ejs", {teachername:teachername,classs:classname,date:date,timePeriod:timeperiod});
                    }
            });
        }
        }
        return;
    });
    return;
});

app.get('/test',function(req,res){
    res.render('test.ejs')
})

var server = app.listen(8081, function () {//应用启动端口为8081

    var host = "localhost";
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});
//TST create by Millie Pu


// student@192.168.123.27

// fin5)SDK


