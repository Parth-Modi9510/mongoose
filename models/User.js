let mongoose = require(`mongoose`);
let validator = require(`validator`);
let jwt = require(`jsonwebtoken`);
let _ = require('lodash');

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

let User = mongoose.model('User',UserSchema);

module.exports = {User};