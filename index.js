var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");

var app=express();
app.use(bodyParser());

var option = {stats: true};
compiler.init(option);
app.get("/",function(req,res){
    res.sendfile(__dirname+'/index.html');
})

app.post("/compilecode",function(req,res){
    var code=req.body.code;
    var input = req.body.input;
    var lang = req.body.lang;
    if(lang==="cpp"){
        if(input.trim() !=""){
            var envData = {OS: "windows", cmd: "g++", options: {timeout: 10000}};
            compiler.compileCPPWithInput(envData,code,input,function(data){
                if(data.error){
                    res.send(data.error)
                }else{
                    res.send(data.output);
                }
            });
        }else{
            var envData = {OS: "windows", cmd: "g++", options: {timeout: 10000}};
            compiler.compileCPP(envData,code,function(data){
                if(data.error){
                    res.send(data.error)
                }else{
                    res.send(data.output);
                }
            })
        }
    }
    if(lang==="python"){
        if(input.trim() !=""){
            var envData = {OS: "windows"};
            compiler.compilePythonWithInput(envData,code,input,function(data){
                if(data.error){
                    res.send(data.error)
                }else{
                    res.send(data.output);
                }
            });
        }else{
            var envData = {OS: "windows"};
            compiler.compilePython(envData,code,function(data){
                if(data.error){
                    res.send(data.error)
                }else{
                    res.send(data.output);
                }
            });
        }
    }
});

app.get("/fullstat",function(req,res){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

app.listen(8080);

compiler.flush(function(){
    console.log("All files flushed");
})