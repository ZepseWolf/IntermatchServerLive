const mongoose = require('mongoose') ;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var schema = new Schema({// the text here are use to target specific collection /*RULE MSUT END WITH S ,ALL SMALL CAP
    _id: { 
        type: String,
        required : true
    },
    email : { 
        type: String,
        required : true
    },
    username : { 
        type: String,
        required : true
    },
    password : { 
        type: String,
        required : true
    },
    user_type: {
        type: String,
        required : true
    },
    creation_dt: {
        type: String,
        default: Date.now()
    },
    num_of_login: {
        type: Number,
        default: 0
    }
    
    // to add  information of the user 
});
schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}
//check password when user logged in
schema.methods.isValid = function (hashedPassword){
    return bcrypt.compareSync(hashedPassword, this.password);
}

module.exports = mongoose.model('userSchema', schema);