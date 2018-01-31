let mongoose = require(`mongoose`);
let validator = require(`validator`);

let User = mongoose.model('User',{
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
    tokens:{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true

        }
    }
});

module.exports = {User};