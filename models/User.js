let mongoose = require(`mongoose`);

let User = mongoose.model('User',{
    username:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
});

module.exports = {User};