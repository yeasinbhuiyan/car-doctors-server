const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()


const port = process.env.PORT || 5000




// middlewear 

app.use(cors())
app.use(express.json())







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9xgdj4e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("carDoctors");

    const carsCollection = database.collection("services");
    const bookingCollection = database.collection("bookings")




    app.get('/services', async (req, res) => {
      const cursor = carsCollection.find()

      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const quary = { _id: new ObjectId(id) }
      const options = {
        projection: { title: 1, price: 1, service_id: 1 ,img :1 },
      };
      const result = await carsCollection.findOne(quary, options)
      res.send(result)
    })



    // find some data 
    // http://localhost:5000/bookings?email=yeasinaa@gmail.com&sort=1

    app.get('/bookings', async (req, res) => {
      // console.log(req.query.email)
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = bookingCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })






    // bookings 
    app.post('/bookings', async (req, res) => {
      const bookings = req.body
      console.log(bookings)
      const result = await bookingCollection.insertOne(bookings)
      res.send(result)
    })

    app.patch('/bookings/:id',async(req,res) =>{
      const id = req.params.id 
      const filter = {_id : new ObjectId(id)}

      const updatedBooking = req.body


      const updated ={
        $set:{
          status : updatedBooking.status
        }
      }
      // console.log(updatedBooking)


      const result = await bookingCollection.updateOne(filter,updated)
      res.send(result)
    })

    app.delete('/bookings/:id',async(req,res)=>{
      const id = req.params.id 
      const quary = {_id : new ObjectId(id)}
      const result = await bookingCollection.deleteOne(quary)
      res.send(result)

    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Cars doctor server is running')

})

app.listen(port, () => {
  console.log(`Cars doctor server is running on ${port}`)

})