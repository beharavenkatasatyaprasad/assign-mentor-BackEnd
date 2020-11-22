const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = "mongodb+srv://satyabehara:ftjrbtc9S1@cluster0.u3j3r.mongodb.net/mentorassignment?retryWrites=true&w=majority";
const cors = require('cors');

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.send("Hello From Server");
});

app.get("/student", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
    let db = client.db("mentorassignment");
    let studentList = await db.collection("students").find().toArray();
    client.close();
    res.json(studentList);
    } catch (error) {
      res.json({
          message : "Something Went wrong"
      })  
    }
})

app.post("/student", async function (req,res){
   try {
    let client  = await mongoClient.connect(url);
    let db = client.db("mentorassignment");
   await db.collection("students").insertOne({
    name : req.body.name,
    id : req.body.id,
    contact : req.body.contact,
    batch : req.body.batch,
    mentorAssigned : false,
    mentorName : "Not Assigned"
});
   client.close();
   res.json({
       message : "Student Added Successfully!"
   })
   } catch (error) {
       res.json({
           message : "Something Went Wrong"
       })
   }
})

app.post("/mentor", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db("mentorassignment");
        let inserted = await db.collection("mentors").insertOne({
            name : req.body.name,
            id : req.body.id,
            contact : req.body.contact,
            studentList : []
        });
        console.log(inserted + " Inserted");
        client.close();
        res.json({
            message : "Mentor Added Successfully!"
        })
    } catch (error) {
        res.json({
            message : "Something Went wrong"
        })
    }
})

app.get("/mentor", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
    let db = client.db("mentorassignment");
    let mentorList = await db.collection("mentors").find().toArray();
    client.close();
    res.json(mentorList);
    } catch (error) {
      res.json({
          message : "Something Went wrong"
      })  
    }
})


app.put('/mentor/assignStudent', async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db('mentorassignment');
        await db.collection('mentors').findOneAndUpdate({name : req.body.mentor},{$push: {studentList : req.body.studentName}});
        await db.collection('students').findOneAndUpdate({name : req.body.studentName}, {$set : {mentorAssigned : true}});
        await db.collection('students').findOneAndUpdate({name : req.body.studentName}, {$set : {mentorName : req.body.mentor }});
        client.close();
    } catch (error) {
        console.log(error);
    }
})


app.listen(process.env.PORT || 3000);
