const User = require("../models/user");
const jwt = require('jsonwebtoken');

module.exports = {
    jwtVerify: (req, res, next) =>{
        let token = req.headers['authorization'].replace('Bearer ', '');
        if(token){
            jwt.verify(token, 'key', function(err, decoded){
                if(err){
                    return res.status(401).json({
                        sucess: false,
                        msg: 'Falha ao verificar token de acesso. Tente Novamente!'
                    });
                }else{
                    const userID = decoded._id;
                   User.findOne({

                       _id: userID,
                       token: token,

                    }, {username: 1, _id: 1}).lean().then((user) =>{
                        if(!user){
                            return res.status(401).json({
                                sucess: false,
                                msg: 'Token não encontrado. Faça Login!'
                            });
                        }else{
                            req.user = user;
                            next();
                        }
                    }).catch((err) =>{
                        return res.status(401).json({
                            sucess: false,
                            msg: 'Token Inválido!',
                            err: err.errmsg
                        });
                    });
                }
            });
        }else{
            return res.status(401).json({
                sucess: false,
                message: 'O envio do token é obrigatório!'
            });
        }
    },
}
