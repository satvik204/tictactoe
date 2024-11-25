
import express from 'express';
import cors from 'cors';
import {StreamChat} from 'stream-chat';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();



const app = express();


app.use(cors());
app.use(express.json());

const api_Key = process.env.API_KEY;
const api_Secret = process.env.API_SECRET;

const serverClient = StreamChat.getInstance(api_Key,api_Secret)


app.post("/signup", async(req,res)=> {
    try{

        console.log(req.body);
        
 const {firstname,lastname,username,password} = req.body;
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password,10);
  const token = serverClient.createToken(userId);
  res.json({token,userId,firstname,lastname,username,hashedPassword})
  console.log(token,userId,firstname,lastname,username,hashedPassword);
  
}catch(error){
 res.json(error);
}})
app.post("/login",async(req,res) => {
    try{
const {userName,passWord} = req.body;
const {users} = await serverClient.queryUsers({name: userName});
if (users.length === 0) return res.json({message: "user not found"});
const token = serverClient.createToken(users[0].id);
const passwordMatch = await bcrypt.compare(passWord,users[0].hashedPassword);
if (passwordMatch) {
    res.json({token, firstname: users[0].firstname,lastname: users[0].lastname,userId: users[0].id,userName})
}

    }catch(error){
         res.json(error);
    }
})

app.get('/testend', (req, res) => {
    res.send('Backend is working!');
  });


const port = process.env.PORT || 3000;


app.listen(port,() => {
    console.log(`Server running on port ${port}`);
    
})