let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minLength: 3
    },
    token:{
        type: String
    },
});

userSchema.pre('save', function(next){
    const user = this;
    if(user.isModified('password') || user.isNew){
        bcrypt.hash(user.password, 8).then(hash =>{
            user.password = hash;
            next();
        }).catch(err =>{
            next(err);
        })
    }else{
        return next();
    }
});

userSchema.methods.comparePassword = function (password, cb){
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err){
            return cb(err);
        }
        cb(null, isMatch);
    })
}

userSchema.methods.generateAuthToken = function() {
    return new Promise((sucess, reject) => {
        const user = this;
        const token = jwt.sign(
            {_id: user._id},
            'key',
            {expiresIn: '7d'}
        )
        user.token = token;
        user.save().then(user => {
            sucess({
                sucess: true,
                token: token
            });
        }).catch(err =>{
            reject({
                sucess: false,
                token: null,
                err: err.errmsg
            });
        })
    });
}

module.exports = mongoose.model('User', userSchema);
