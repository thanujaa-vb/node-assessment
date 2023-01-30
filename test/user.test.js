const chai = require('chai');
const chaiHttp = require('chai-http');
let server = require("../index");
const User = require('../model/user');
chai.should();
chai.use(chaiHttp);


const userData = {
    "firstName": "test user",
    "lastName": "test name",
    "email": "testuser@gmail.com",
    "password": "password",
    "role": "user",

}
const userLogin ={
    "email": "testuser@gmail.com",
    "password": "password"
}
let token;
describe('User APIs', () =>{
    // after(done => {
    //     // After each test we truncate the database
    //     User.deleteOne({"email": "testuser@gmail.com"}, err => {
    //       done();
    //     });
    //   });
    // describe('REGISTER/ user', ()=>{
    //     it('it should register a user ',(done)=>{
    //         chai.request(server)
    //         .post('/api/register')
    //         .send(userData)
    //         .end((err,res)=>{
    //             res.should.have.status(201);
    //             res.body.should.be.a('object');
    //             done();
    //         });
    //     })
    // })
    describe('LOGIN/ user', () =>{
        it('It should login user', (done) =>{
            chai.request(server)
            .post('/api/login')
            .send(userLogin)
            .end((err,res) =>{
                token=res.body.user.token;
                res.body.user.should.have.property('role');
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
        })
    })
    describe('Protected Route/ user', () =>{
        it('It should allows user role', (done) =>{
            chai.request(server)
            .post('/api/welcome')
            .set('access-token', token)
            .end((err,res) =>{
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.should.be.a('object');
                done();
            })
        })
    })
    describe('LOGOUT/ user', () =>{
        it('It should logout user', (done) =>{
        chai.request(server)
            .post('/api/logout')
            .set('authorization', token)
            .end((err,res) =>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            })
        })
    })
})