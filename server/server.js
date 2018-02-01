let _ = require(`lodash`);
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

app.delete(`/todos/remove/:id`,(req,res)=>{
    console.log(req.params.id);
    Todo.findOneAndRemove({_id:req.params.id}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        console.log(todos);
        res.status(400).send(e);
    })
});

app.patch('/todos/:id',(req,res)=>{

    let body = _.pick(req.body,['firstName','lastName']);
    console.log(body);
    Todo.findByIdAndUpdate(req.params.id,{$set:body},{new:true}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(400).send(e);
    })
});

app.post('/users',(req,res)=>{
    let body = _.pick(req.body,['username','password']);
    let newUser = new User(body);

    newUser.save().then(()=>{

        return newUser.generateAuthToken();

    }).then((token)=>{

        res.header('x-auth',token).send(newUser);
    }).catch((e)=>{

        res.status(400).send(e);
    });
});


app.listen(port,()=>{
    console.log(`Started on Port ${port}`);
});