const express = require('express');
const bodyParser = require('body-parser');
require('./db/mongoose')
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./route/user');
const taskRouter = require('./route/task');
const app = express();
const cors = require('cors');
const port = process.env.PORT ;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(userRouter);
app.use(taskRouter);
app.use('/', (req, res) => {
    res.send("Hello")
})


app.listen(port, ()=>{
   console.log('Server is listening at '+port);
});