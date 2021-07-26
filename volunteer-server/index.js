const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9fdd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const  volunteerCollection = client.db("volunteers").collection("volunteerData");
  // perform actions on the collection object
  
  app.post('/addRegister',(req, res) => {
    const Register = req.body;
    volunteerCollection.insertOne(Register)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/volunteerData', (req,res) => {
    volunteerCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.delete('/delete/:id',(req, res) => {
   volunteerCollection.deleteOne({_id: ObjectId( req.params.id)})
   .then( result => {
     console.log(result)
     res.send(result.deletedCount > 0)
   })
  })

  
});


app.listen(port) 