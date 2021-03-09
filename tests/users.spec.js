const app = require('../bin/www');

let chai = require("chai");
let chaiHttp = require('chai-http');
let expect = chai.expect;
const base_url = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Teste de Usuários na API REST', ()=>{
    let qtdUsuarios = 0;
    let userTest = {
        username: 'usuarioTestezada',
        password: "123456"
    }

    let _idUsuario;

    let token = '';

    before(done =>{
        let Usuario = require('../models/user')
        Usuario.count()
        .then(qtd=>{
            qtdUsuarios = qtd
            done();
        })
        .catch(error=>{
            console.log('Error: ', error)
        })
    })

    it('Criar um novo usuário na API', (done)=>{
        chai.request(base_url)
        .post('/signup')
        .send(userTest)
        .end((err, res) =>{
            expect(res).to.have.status(201)
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('username')
            expect(res.body.username).to.equal(userTest.username);
            _idUsuario = res.body._id
            done();
        })
    });

    it('Logar com o usuário recém criado', (done)=>{
        chai.request(base_url)
        .post('/login')
        .send(userTest)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.sucess).to.equal(true)
            token = res.body.token;
            done();
        })
    });

    it('Deslogar com o usuário recém criado', (done)=>{
        chai.request(base_url)
        .post('/logout')
        .set('authorization', 'Bearer '+ token)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.sucess).to.equal(true)
            token = res.body.token;
            done();
        })
    });

    after(done =>{
        let Usuario = require('../models/user')
        Usuario.remove({"_id": _idUsuario})
        .then(ok =>{
            console.log("Apagou Usuário!")
            done();
        })
        .catch(error =>{
            console.log('Error: ', error)
            done(error)
        })
    })

});
