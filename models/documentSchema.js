const mongoose = require('mongoose') ;


var DocumentSchema = mongoose.model('DocumentSchema',{// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required:true
    },
    fileName: String,
    text: String,
    category:String,
    date_created: {
        type: Number,
        default:Date.now()
    }
});

module.exports = {DocumentSchema};