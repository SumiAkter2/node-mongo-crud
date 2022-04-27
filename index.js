const { MongoClient, ServerApiVersion } = require('mongodb');

const ObjectId=require('mongodb').ObjectId;
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

// user:dbuser2
// password:p3dQZkdnwrXy3PTp


const uri = "mongodb+srv://dbuser2:p3dQZkdnwrXy3PTp@cluster0.hacav.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('db connected');
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("users");

app.get('/user',async(req,  res)=>{

    const query={};
    const cursor=userCollection.find(query);
    const users=await cursor.toArray();
    res.send(users)
})
app.get('/user/:id', async(req,res)=>{
    const id=req.params.id;
    const query = {_id:ObjectId(id)}
    const result= await userCollection.findOne(query);
    res.send(result);
})
  // update user
  app.put('/user/:id', async(req, res) =>{
    const id = req.params.id;
    const updatedUser = req.body;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email
        }
    };
    const result = await userCollection.updateOne(filter, updatedDoc, options);
    res.send(result);

})
//delete
app.delete('/user/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
   const result=await userCollection.deleteOne(query);
   res.send(result);
})

//post 
        app.post('/user', async(req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result=await userCollection.insertOne(newUser)
            res.send( result)

        })

        const user = { name: 'mahiya jahi', email: 'mahi@gmail.com' };
        const result = await userCollection.insertOne(user);
        console.log(`User inserted with id:${result.insertedId}`);




    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hello my world')
})

app.listen(port, () => {
    console.log('crud server', port);
})