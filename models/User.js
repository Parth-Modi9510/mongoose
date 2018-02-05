let mongoose = require(`mongoose`);
let validator = require(`validator`);
let jwt = require(`jsonwebtoken`);
let _ = require('lodash');
let bcrypt = require(`bcryptjs`);


let UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`It is not a valid Email.`
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','username']);
};

UserSchema.methods.generateAuthToken = function () {

    let user = this;
    let access = 'x-auth';

    let token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    user.tokens.push({access,token});

    return user.save().then(()=>{

        return token;
    });
};


UserSchema.statics.findByToken = function (token) {
    let newUser = this;
    let decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    }catch (e){
        return Promise.reject();
    }

    return newUser.findOne({
        _id:decoded._id,
        'tokens.access':`x-auth`,
        'tokens.token':token
    });
};

UserSchema.pre('save',function (next) {
   let user = this;
   if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        })
   }
   else
   {
       next();
   }
});

let User = mongoose.model('User',UserSchema);

module.exports = {User};