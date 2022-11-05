const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME_}:${process.env.USER_PASSWORD_}@cluster0.i9b8vs8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('emaJohn').collection('products');
        app.get('/products', async(req, res) =>{
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({products, count});
        })
        app.post('/productsByIds', async(req, res) => {
            const ids =  req.body;
            console.log(ids);
            const objectIds = ids.map(id => ObjectId(id));
            const query = {_id:{$in: objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally {

    }
}
run().catch(error => console.log(error));










app.get('/', (req, res) => {
    res.send("ema john simple server is running");
})
app.listen(port, (req, res) => {
    console.log('ema john simple server is running');
})