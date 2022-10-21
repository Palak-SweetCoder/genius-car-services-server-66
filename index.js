const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json())

//Mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyvcmep.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('geniusCar').collection('service');

        //get data from the server and make url to fetch on client side
        //get all data from server by query and cursor
        //find()
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        //Read data from the server and make url to fetch on client side
        //get single data from server by id and query
        //findOne()
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //Create data or post data from client side to server side
        //use post method
        //insertOne()
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        //Delete data from client side and server side
        //use delete method
        //deleteOne()
        app.delete('/service/:id', async (req, res) => {
            const id =req.params.id;
            const query ={_id: ObjectId(id)};
            const result =await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Genius Car Server Running...')
})

app.listen(port, () => {
    console.log('Genius Car Server Running...', port)
})