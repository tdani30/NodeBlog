
import express from 'express';
import bodyParser, { json } from 'body-parser';
import mongoose from 'mongoose';
import http from 'http';
import path from 'path';

const app =express();
app.use(express.static(path.join(__dirname,'/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var dbURL='mongodb+srv://talha:talha@cluster0.rsf0t.azure.mongodb.net/blogdb?retryWrites=true&w=majority';
var HttpClient=http.Server(app);


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });



app.use(express.json());




var PostData=mongoose.model('BlogApplication',
{
    name:String,
    title:String,
    upvotes:Number,
    content:[]
});


mongoose.connect(dbURL,{useNewUrlParser: true},(error)=>
{
    console.log("Mongo db connection",error);
});


app.get('/GetData',(req,res)=>
{
    PostData.find({},(err,data)=>
    {
        res.send(data);
    });
});

app.get('/GetDataByName/:name',(req,res)=>
{
    PostData.findOne({name:req.params.name},(err,data)=>
    {
        res.send(data);
    });
});

app.post('/UpdateVoteDataByName/:name',async (req,res)=>
{
    //const { upvotes } = req.body;
    var updateObject=await PostData.findOne({name:req.params.name});
    await PostData.updateOne({name:req.params.name},
        {
            '$set':{
                upvotes:updateObject.upvotes + 1
            }
        });

    PostData.findOne({name:req.params.name},(err,data)=>
    {
        res.status(200).json(data);
    });
});

app.post('/UpdateContentDataByName/:name',async (req,res)=>
{
    const { username, text } = req.body;
    var updateObject=await PostData.findOne({name:req.params.name});
   // var data = JSON.parse(updateObject.content);
   // var addData =data.push({name:req.params.name});
    //console.log( data);
    await PostData.updateOne({name:req.params.name},
        {
            '$set':{
                content:updateObject.content.concat({username, text}),
            }
        });

    PostData.findOne({name:req.params.name},(err,data)=>
    {
        res.status(200).json(data);
    });
});

app.post('/PostInformation',(req,res)=>
{
    var response=new PostData(req.body);
    response.save((err)=>
    {
        if(err)
        {
            sendStatus(500);
        }
        res.sendStatus(200);        
    });
});

app.get('*',(req,res)=>
{
   res.sendFile(ptah.join(__dirname + '/build/index.html'));
});

app.listen(8000,()=>
{
    console.log('Listen port on 8000',);
});

//

