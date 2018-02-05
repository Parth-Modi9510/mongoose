let _ = require(`lodash`);
let express = require(`express`);
let bodyParser = require(`body-parser`);
let bcrypt = require(`bcryptjs`);

let {mongoose} = require(`./db/mongoose`);
let {Todo} = require(`./../models/Todo`);
let {User} = require(`./../models/User`);
let {PersonalInfo} = require('./../models/products')
let {authenticate} = require(`./middleware/middleUser`);


let app = express();
const port = process.env.PORT || 2525;


app.use(bodyParser.json());

app.use((req,res,next) =>{

    res.header('Access-Control-Allow-Origin',' http://localhost:3000');
    //res.header('Access-Control-Allow-Origin',' http://localhost:3001');
    //res.header('Access-Control-Allow-Origin',' http://localhost:3002');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials",true);
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Allow-Methods`, `DELETE`);
    res.header(`Access-Control-Allow-Methods`, `PATCH`);

    res.header(`Access-Control-Expose-Headers`, `x-auth`);

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
    }).catch((e)=>{
        res.send(false);
    })
});

app.get('/todosID/:id',(req,res)=>{

    Todo.findOne({_id:req.params.id}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    }).catch((e)=>{
        res.send(false);
    })
});

app.get('/todosFN/:firstname',(req,res)=>{

    Todo.findOne({firstName:req.params.firstname}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    }).catch((e)=>{
        res.send(false);
    })
});

app.get('/todosLN/:lastname',(req,res)=>{

    Todo.findOne({lastName:req.params.lastname}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(401).send(e);
    }).catch((e)=>{
        res.send(false);
    })
});

app.delete(`/todos/remove/:id`,(req,res)=>{
    console.log(req.params.id);
    Todo.findOneAndRemove({_id:req.params.id}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        console.log(todos);
        res.status(400).send(e);
    }).catch((e)=>{
        res.send(false);
    })
});

app.patch('/todos/:id',(req,res)=>{

    let body = _.pick(req.body,['firstName','lastName']);
    console.log(body);
    Todo.findByIdAndUpdate(req.params.id,{$set:body},{new:true}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(400).send(e);
    }).catch((e)=>{
        res.send(false);
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

    }).catch((err)=>{res.send(false)}).then((token)=>{
        console.log(`2`);
        res.header('x-auth',token).send(newUser);
    }).catch((e)=>{
        console.log(`3`);
        res.status().send(false);
    });
})

app.get(`/users/me`,authenticate,(req,res)=>{

    res.send(req.user);
});

app.post(`/users/login`,(req,res)=>{

    console.log('was called');
    User.findOne({username:req.body.username}).then((doc)=>{
        bcrypt.compare(req.body.password,doc.password).then((result)=>{
            if(result){

                res.header('x-auth',doc.tokens[0].token).send(doc);
            }
            else{
                res.send(false);
            }
        }).catch((e)=>{
            res.send(false);
        })

    }).catch((e)=>{
        res.send(false);
    })
});

// PersonalInfos

app.get(`/users/login/personalInfo`,(req,res)=>{
    PersonalInfo.find({}).then((info)=>{
        if(info){
            res.send(info);
        }
        else{
            res.send(false);
        }
    }).catch((e)=>{
        res.send(false);
    })
});

app.post(`/users/login/personalInfo`,(req,res)=>{
    console.log(req);
    let body = req.body;
    let newPerson = new PersonalInfo(body);
    newPerson.save().then((info)=>{
        res.send(info);
    }).catch((e)=>{
        res.send(false,e);
    })
});

app.delete(`/users/login/personalInfo/:id`,(req,res)=>{
    console.log('id',req.params._id);
    PersonalInfo.findOneAndRemove({_id:req.params.id}).then((doc)=>{
        console.log(_id);

        console.log(doc);
        res.send(doc);
    }).catch((err)=>{
        console.log('error');
        res.send(false);
    })
});

app.post('/users/login/personalInfo/GetUser',(req,res)=>{
    PersonalInfo.findOne({_id:req.body._id}).then((doc)=>{
        res.send(doc);
    }).catch((err)=>{
        res.send(false);
    })
});

app.patch('/users/login/personalInfo/updateUser',(req,res)=>{
    let body = req.body;
    console.log(body);
    PersonalInfo.findByIdAndUpdate(req.body._id,{$set:body},{new:true}).then((doc)=>{
        res.send(doc);
    }).catch((err)=>{
        res.send(false);
    })
});


/*app.patch('/todos/:id',(req,res)=>{

    let body = _.pick(req.body,['firstName','lastName']);
    console.log(body);
    Todo.findByIdAndUpdate(req.params.id,{$set:body},{new:true}).then((todos)=>{
        res.send(todos);
    },(e)=>{
        res.status(400).send(e);
    }).catch((e)=>{
        res.send(false);
    })
});*/

app.listen(port,()=>{
    console.log(`Started on Port ${port}`);
});