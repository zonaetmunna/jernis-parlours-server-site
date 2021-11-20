const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
     res.send('hi');
})

// database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugo5b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
     try {
          await client.connect();
          const database = client.db('jerinParlors');
          const parlerService = database.collection('service');
          const bookingData = database.collection('booking');

          // services
          // get api for services
          app.get('/services', async (req, res) => {
               const service = parlerService.find({});
               const result = await service.toArray();
               res.json(result);
          })
          // get api for singleService
          app.get('/services/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await parlerService.findOne(query);
               res.json(result);
          })

          // booking
          // post booking
          app.post('/booking', async (req, res) => {
               const booking = req.body;
               const result = await bookingData.insertOne(booking);
               res.json(result);
          })
          // get booking for specific email
          app.get('/booking', async (req, res) => {
               const email = req.query.email;
               const query = { email: email };
               const cursor = bookingData.find(query);
               const result = await cursor.toArray();
               res.json(result);
          })

     }
     finally {
          // 
     }

}
run().catch(console.dir);



app.listen(port, () => {
     console.log('listing the port ', port);
})