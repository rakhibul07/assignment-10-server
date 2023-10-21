 const express = require('express');
 const app =express();
 const cors = require('cors');
 require('dotenv').config()
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const port = process.env.PORT || 5000;
 


 //middleware
 app.use(cors());
 app.use(express.json());

 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slxyews.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const productCollection = client.db("productsDB").collection("products");
    const cartCollection = client.db("cartDB").collection("carts")

    app.post("/products", async(req,res)=>{
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

    app.get("/products", async(req,res)=>{
        const result = await productCollection.find().toArray();
        res.send(result);
    })

    app.get("/products/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.put('/products/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedProduct = req.body;
      const  product= {
          $set: {
            name: updatedProduct.name, 
            image:updatedProduct.image,
            color:updatedProduct.color, 
            brand:updatedProduct.brand,
            type:updatedProduct.type,
             price:updatedProduct.price, 
             rating:updatedProduct.rating,
             description:updatedProduct.description
          }
      }
      const result = await productCollection.updateOne(filter, product,options);
      res.send(result);
  })

    
    app.delete("/products/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })

    //carts api
    app.post("/carts",async(req,res)=>{
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart);
      res.send(result)
    })


    app.get("/carts",async(req,res)=>{
      const result= await cartCollection.find().toArray();
      res.send(result)
    })

    

    app.delete("/carts/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
  })

   
    
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


 app.get("/", (req,res)=>{
    res.send("server is running  ");
 })

 app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);   
 })
