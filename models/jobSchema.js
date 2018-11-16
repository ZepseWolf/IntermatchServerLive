const mongoose = require('mongoose') ;
const {ObjectID}  = require('mongodb');


var JobSchema = mongoose.model('JobSchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required:true
    },
    
    title: String,
    description: String,
    start_date: String,
    end_date: String,
    company_id: String,// not needed
    specialization: String,
    created_date:{
        type: String,
        default:Date.now()
    },
    deadline: String,
    require_skills: String,
    require_trait_needs:Array,
    require_trait_personality:Array, 
    require_trait_values:Array 
});

module.exports = {JobSchema};