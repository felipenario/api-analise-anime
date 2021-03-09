const app = require('../bin/www');

let chai = require("chai");
let chaiHttp = require('chai-http');
let expect = chai.expect;
const base_url = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Teste de Análises na API REST', ()=>{

    let qtdAnalises = 0;

    let analiseTest = {
        animeAnalisado: "animeTeste",
        descricaoAnalise: "descricaoTeste",
        usuario: "usuarioTeste"
    }

    let userTest = {
        username: 'usuarioTestezada',
        password: "123456"
    }

    let _idAnalise;
    let _idUsuario;
    let token;

    before(done =>{
        let Analise = require('../models/review')
        Analise.count()
        .then(qtd=>{
            qtdAnalises = qtd
            done();
        })
        .catch(error=>{
            console.log('Error: ', error)
        })
    })

    before(done =>{
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
    })

    before(done =>{
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
    })

    it('Criar uma nova análise na API', (done)=>{
        chai.request(base_url)
        .post('/analise')
        .set('authorization', 'Bearer '+ token)
        .send(analiseTest)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.analiseCadastrada.animeAnalisado).to.be.equal(analiseTest.animeAnalisado)
            _idAnalise = res.body.analiseCadastrada._id
            done();
        })
    });

    it('Recuperar todas as análises na API', (done)=>{
        chai.request(base_url)
        .get('/analise')
        .set('authorization', 'Bearer '+ token)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            done();
        })
    });

    it('Recuperar análise por ID na API', (done)=>{
        chai.request(base_url)
        .get('/analise/'+ _idAnalise)
        .set('authorization', 'Bearer '+ token)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('animeAnalisado')
            done();
        })
    });

    it('Recuperar minhas análises na API', (done)=>{
        chai.request(base_url)
        .get('/minhas-analises')
        .set('authorization', 'Bearer '+ token)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            done();
        })
    });

    it('Recuperar análise por anime na API', (done)=>{
        chai.request(base_url)
        .get('/analise/anime/'+ "Bleach")
        .set('authorization', 'Bearer '+ token)
        .send()
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body[0].animeAnalisado).to.be.equal('Bleach')
            done();
        })
    });

    it('Editar análise por ID na API', (done)=>{
        let _analiseTestezada = {
            animeAnalisado: "animeTestezada",
            descricaoAnalise: "descricaoTeste",
            usuario: "usuarioTeste"
        }

        chai.request(base_url)
        .put('/analise/'+ _idAnalise)
        .set('authorization', 'Bearer '+ token)
        .send(_analiseTestezada)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('msg')
            done();
        })
    });

    it('Deletar análise por ID na API', (done)=>{
        chai.request(base_url)
        .delete('/analise/'+ _idAnalise)
        .set('authorization', 'Bearer '+ token)
        .end((err, res) =>{
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('msg')
            done();
        })
    });

    after(done =>{
        let Analise = require('../models/review')
        Analise.remove({"_id": _idAnalise})
        .then(ok =>{
            console.log("Apagou Análise!")
            done();
        })
        .catch(error =>{
            console.log('Error: ', error)
            done(error)
        })
    })

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
