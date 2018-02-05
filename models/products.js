let mongoose = require('mongoose');
let _ = require('lodash');

let PersonalInfoSchema = new mongoose.Schema({
    First_Name:{
        type:String,
        required:true,
        trim:true
    },
    Last_Name:{
        type:String,
        required:true,
        trim:true
    },
    Address:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    pincode:{
        type:String,
        required:true,
        trim:true
    },
    gender:{
        type:String,
        required:true,
        trim:true
    }
});

let PersonalInfo = mongoose.model('PersonalInfo',PersonalInfoSchema);

module.exports = {PersonalInfo};

