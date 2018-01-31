let mongoose = require(`mongoose`);

let Todo = mongoose.model('Todo',{
    firstName:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        unique:true
    }
});
module.exports = {Todo};