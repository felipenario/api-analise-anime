let connection = require('../config/database')();
let User = require('../models/user');

module.exports = {
    signup: (req, res, next) =>{
        const {username, password} = req.body;

        const user = new User({username, password});

        user.save().then(user =>{
            res.status(201).json(user)
        })
        .catch(error =>{
            res.status(500).json(error)
        })
    },
    login: (req, res, next) =>{
        const {username, password} = req.body
        User.findOne({'username': username}).then(user => {
            if(!user){
                res.status(401).json({
                    sucess: false,
                    token: null,
                    msg: "Usuário não encontrado"
                })
            }else{
                user.comparePassword(password, (err, isMatch) =>{
                    if(isMatch && !err){
                        user.generateAuthToken().then(sucess =>{
                            res.status(200).json(sucess)
                        }).catch(error => {
                            res.status(401).json(error)
                        })
                    }else{
                        res.status(401).json({
                            sucess: false,
                            token: null,
                            msg: "Senha incorreta!"
                        })
                    }
                })
            }
        })
    },
    logout: (req, res, next) => {
        const userID = req.user._id;
        User.update({
            _id: userID
        }, {
            $set: {
                token: null
            }
        }).then(user =>{
            res.status(200).send({sucess: true, token: null, msg: 'Logout realizada com sucesso!'});
        }).catch(error =>{
            res.status(500).send({sucess: false, msg: 'Logout não realizado!'});
        })
    }
}
