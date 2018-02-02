let _ = require(`lodash`);
let express = require(`express`);
let bodyParser = require(`body-parser`);
let bcrypt = require(`bcryptjs`);

let {mongoose} = require(`./db/mongoose`);
let {Todo} = require(`./../models/Todo`);
let {User} = require(`./../models/User`);
let {authenticate} = require(`./middleware/middleUser`);

let app = express();
const port = process.env.PORT || 2525;


app.use(bodyParser.json());

app.use((req,res,next) =>{

    res.header('Access-Control-Allow-Origin',' http://localhost:3001');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});


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
    //console.log(`user was called`);
    let body = _.pick(req.body,['username','password']);
    let newUser = new User(body);
    console.log(body);
    newUser.save().then(()=>{
        console.log(`1`);
        return newUser.generateAuthToken();

    }).then((token)=>{
        console.log(`2`);
        res.header('x-auth',token).send(newUser);
    }).catch((e)=>{
        console.log(`3`);
        res.status().send(false);
    });
});

app.get(`/users/me`,authenticate,(req,res)=>{

    res.send(req.user);
});

app.post(`/users/login`,(req,res)=>{

    console.log('was called');
    User.findOne({username:req.body.username}).then((doc)=>{
        if(!doc){

            return res.send();
        }
        console.log('todos are : ',doc);
        bcrypt.compare(req.body.password,doc.password,(err,result)=>{
            if(err){
                return res.send();
            }
            res.send(result);
        }).catch((e)=>{
            res.send();
        });


        /*bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                console.log(hash);
            });
            let hashed = `$2a$10$WFwH0xFz6.ZTIRYJNbWhAeRkkmu8GKHmbb68dErVKH3IfwXtQZOBS`;
            bcrypt.compare(password,hashed,(err,res)=>{
                console.log(res)*/

    },(e)=>{
        res.status(401).send(e);
    })

});

app.listen(port,()=>{
    console.log(`Started on Port ${port}`);
});