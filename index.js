const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000;

//middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.exrbbd1.mongodb.net/?retryWrites=true&w=majority`;

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
        //await client.connect();

        // database collection
        const database = client.db("Taskmanagement");
        const usercollection = database.collection("users");
        const taskcollection = database.collection("tasks");
        const ongingcollection = database.collection("onging");
        const completecollection = database.collection("complete");

        //user realted 

        app.get('/users', async (req, res) => {
            const result = await usercollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log("user", user)
            const query = { email: user.email }
            const existuser = await usercollection.findOne(query)
            if (existuser) {
                return res.send({ message: 'user exist', insertedId: null })
            }
            const result = await usercollection.insertOne(user)
            res.send(result)
        })

        //task realted 

        app.get('/tasks', async (req, res) => {
            const result = await taskcollection.find().toArray()
            res.send(result)
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskcollection.findOne(query)
            res.send(result)
        })

        app.get('/tasks/user/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email };
            const result = await taskcollection.findOne(query)
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const user = req.body
            const result = await taskcollection.insertOne(user)
            res.send(result)
        })
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskcollection.deleteOne(query)
            res.send(result)
        })

        app.get('/Ongoing', async (req, res) => {
            const result = await ongingcollection.find().toArray()
            res.send(result)
        })
        app.post('/Ongoing', async (req, res) => {
            const user = req.body
            const result = await ongingcollection.insertOne(user)
            res.send(result)
        })
        app.delete('/Ongoing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ongingcollection.deleteOne(query)
            res.send(result)
        })


        app.get('/Complete', async (req, res) => {
            const result = await completecollection.find().toArray()
            res.send(result)
        })
        app.post('/Complete', async (req, res) => {
            const user = req.body
            const result = await completecollection.insertOne(user)
            res.send(result)
        })
        app.delete('/Complete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await completecollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('task management running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})