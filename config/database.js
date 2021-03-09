let mongoose = require('mongoose');

module.exports = ()=>{
    let url = 'mongodb://localhost:27017/atividadeEAD'
    let options = {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        poolSize: 10
    }
    mongoose.connect(url, options);
    mongoose.connection.once('open', ()=>{
        console.log('Mongoose Conectado!')
    })
    mongoose.connection.on('error', (error)=>{
        console.log('Erro ao conectar o mongoose: ', error)
    })
}