const express=require('express');
const app=express();
const dfff=require('dialogflow-fulfillment');
const MongoClient=require('mongodb').MongoClient;
const { toArray } = require('actions-on-google/dist/common');
const { DateTime } = require('actions-on-google');
const url='mongodb://localhost:27017/';
const dbname='customersdetails';
let db;
MongoClient.connect(url,(err,client)=>{
    db=client.db(dbname);
    console.log(`connected to database: ${url}`);
    console.log(`Database : ${dbname}`);
});
app.get('/',(req,res)=>{
    res.send('we are live')
});
app.post('/',express.json(),(req,res)=>{
    const agent=new dfff.WebhookClient({
        request:req,
        response:res
    });
    var intentMap=new Map();
    intentMap.set('identifyUser',identifyUser);
    var phoneno=agent.context.get("awaiting_phoneno").parameters.phoneno;
    //var name1=agent.context.get("awaiting_name").parameters.name;
    var data=db.collection('customer').find().toArray(function(err,result){
        if(err) throw err;
        for(var i=0;i<result.length;i++){
            if(result[i].phoneno==phoneno){
                var name2=result[i].name;
                db.collection('customerissues').find().toArray(function(err,result1){
                    if(err) throw err;
                    for(var j=0;j<result1.length;j++){
                        if(result1[j].phoneno==phoneno){
                            var d=new Date();
                    agent.add(`Hello ${name2} your details are----- phoneno:${phoneno} ,your issue details are ---problem:${result1[j].problem},at:${d},status:${result1[j].status},ticketno:
                    ${result1[j].ticketno}`);
                    console.log(result1[j]);
                    agent.handleRequest(intentMap);
                        }
                    }
                })
            }
        }
    })
    
});
function identifyUser(agent){
    //var name1=agent.context.get("awaiting_name").parameters.name;
    var phoneno=agent.context.get("awaiting_phoneno").parameters.phoneno;
    //console.log(name1);
    console.log(phoneno);
   // agent.add(`hello ${name1}`);
    
} 
app.listen(5010,(req,res)=>{
    console.log("server is listening");
});