const chai = require('chai');
const chaiHttp = require('chai-http');
let server = require("../index");
chai.should();
chai.use(chaiHttp);

let token;
const userLogin ={
    "email": "testuser@gmail.com",
    "password": "password"
}

const issueData = {
    "student": "63ce7c24331778ff79e1ee60",
    "book": "63cfa578349f21256fa6f4c0"
}
let issue_id;
describe('Issue apis', () => {
    before(done => {
        chai
          .request(server)
          .post("/api/login")
          .send(userLogin)
          .end((err, res) => {
            token = res.body.user.token;
            res.should.have.status(constant.HTTP_200_CODE);
            done();
          });
      });
    describe('/POST Issue', () => {
        it('it should post a issue ',(done)=>{
            chai.request(server)
            .post('/api/issue')
            .set('authorization', token)
            .send(issueData)
            .end((err,res)=>{
                // console.log(res);
                issue_id=res.body._id;
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
        });
    });
    describe('/GET Issues', () => {
        it('it should get all issues', (done) =>{
            chai.request(server)
            .get('/api/issue')
            .set('authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.above(0);
                done();
            });
        });
    });
    describe('/GET/:id Issue', () => {
        it('It should get a Issue by the given id', (done) => {
            chai.request(server)
                .get('/api/issue/'+issue_id)
                .set('authorization', token)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('returned');
                    res.body.should.have.property('_id').eql(issue_id);
                    done();
                });
        });
    });
    describe('/PUT/:id Issue', () => {
        it('It should Update status of a Issue by the given id', (done) => {
            chai.request(server)
                .put('/api/issue/'+issue_id)
                .set('authorization', token)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('returned');
                    res.body.should.have.property('_id').eql(issue_id);
                    done();
                });
        });
    });
    describe('/DELETE All Issue, which returned', () => {
        it('It should delete all Issues which returned', (done) => {
            chai.request(server)
                .delete('/api/issue')
                .set('authorization', token)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    done();
                });
        });
    });

})