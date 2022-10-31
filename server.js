const express = require('express');
const PORT = process.env.PORT || 3000;
const server = express();

const router = require('./routes');

server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(express.static('public'));
server.use("/api", router);


server.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/index.html'));
})

server.listen(PORT, ()=>{console.log(`Listening on port PORT {PORT}`)});