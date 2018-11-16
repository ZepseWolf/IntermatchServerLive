const mongoose = require('mongoose') ;
const {ObjectID}  = require('mongodb');

var EmployeeSchema = mongoose.model('EmployeeSchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required : true
    },
    user_type: {
        type: String,
        default : "Employee"
    },
    full_name:{
        type: String
    },
    birthdate:{
        type: String
    },
    description:[{
        _id: { 
            type: String,
            required : false
        },id: { 
            type: String,
            default: ObjectID.createPk()
        },
        content: String,
        created : {    
            type: Number,
            default:Date.now()
        }
    }],
    specialization:{
        type: String
    },
    //Embedded sub-document Start
    matched_jobs:[{
        //Once both accept we create this 
        _id: { 
            type: String,
            required : false
        },
        company_id : {
            type: String
        },
        
        matched_date : {    
            type: String,
            default:Date.now()
        },
        job_id: {
            type: String
        },
    }],
    potentional_jobs:Array ,
    education:[{
        _id: { 
            type: String,
            required : false
        },
        instution_name: String,
        start_date: String,
        end_date: String,
        certification: String
    }],
    experiences:[{
        _id: { 
            type: String,
            required : false
        },
        job_position : String,
        company_name : String,
        start_date: String,
        end_date: String,
        description: String
    }],
    trait_needs:Array,
    trait_personality:Array, 
    trait_values:Array,  
    skill:[{
        _id: { 
            type: String,
            required : false
        },
        skill_name : String
    }],
    //Sub doc end
    // to add  information of the user 
});

module.exports = {EmployeeSchema};
