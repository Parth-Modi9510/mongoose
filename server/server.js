let express = require(`express`);
let bodyParser = require(`body-parser`);

let {mongoose} = require(`./db/mongoose`);
let {Todo} = require(`./../models/Todo`);
let {User} = require(`./../models/User`);

let app = express();
const port = process.env.PORT || 2525;


app.use(bodyParser.json());

app.post('/todos',(req,res)=>{

    let newTodo = new Todo({
        firstName:req.body.firstName,
        lastName:req.body.lastName
    });

    newTodo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{

        res.status(401).send(e);
    });
});

app.get(`/todos`,(req,res)=>{
    Todo.find().then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    })
});

app.get('/todosID/:id',(req,res)=>{

    Todo.findOne({_id:req.params.id}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    })
});

app.get('/todosFN/:firstname',(req,res)=>{

    Todo.findOne({firstName:req.params.firstname}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    })
});

app.get('/todosLN/:lastname',(req,res)=>{

    Todo.findOne({lastName:req.params.lastname}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    })
});

app.listen(port,()=>{
    console.log(`Started on Port ${port}`);
});