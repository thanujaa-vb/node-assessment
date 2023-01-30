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

const bookData = {
    "name": "book test",
    "author": "author test",
    "description": "description about book tests",
    "cat": "Fiction",
    "copies": 5
}
let book_id;
let dummyBook;

describe('Books apis', () => {
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
    
    describe('/POST Books', () => {
        it('it should post a book ',(done)=>{
            console.log(token);
            chai.request(server)
            .post('/api/books')
            .set('authorization', token)
            .send(bookData)
            .end((err,res)=>{
                // console.log(res);
                book_id=res.body._id;
                dummyBook=res.body;
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
        });
        it('it should throw error if book exist', (done) => {
            chai.request(server)
                .post('/api/books')
                .set('authorization', token)
                .send(bookData)
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });
    });
    describe('/GET Books', () => {
        it('it should get all books', (done) =>{
            chai.request(server)
            .get('/api/books')
            .set('authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.above(0);
                done();
            });
        })
    })
    describe('/GET/:id Books', () => {
        it('It should get a Book by the given id', (done) => {
            chai.request(server)
                .get('/api/books/'+book_id)
                .set('authorization', token)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id').eql(book_id);
                    done();
                });
        });
        it('It should give Bad Request by the wrong given id', (done) => {
            const id_num="61a1d9751075ba088c43f562"
            chai.request(server)
                .get('/api/books/' +id_num)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    const updateBookData = {
        "name": "updated book name"
    }
    describe("/PUT/:id Books",()=>{
        it("It should update/edit a books by the  id",(done)=>{
            chai.request(server)
            .put('/api/books/'+book_id)
            .set('authorization', token)
            .send(updateBookData)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
            });
        });
        it('It should give Bad Request by the wrong given id', (done) => {
            const id_num="61a1d9751075ba088c43f562"
            chai.request(server)
                .put('/api/books/' +id_num)
                .set('authorization', token)
                .send(updateBookData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
    describe('/DELETE/:id books', () => {
        it('It should delete a books by the id ',(done)=>{
            chai.request(server)
            .delete('/api/books/'+book_id)
            .set('authorization', token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a("object");
                done()
            });
        });
        it('It should give Bad Request by the wrong given id', (done) => {
            const id_num="61a1d9751075ba088c43f562"
            chai.request(server)
                .delete('/api/books/' +id_num)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

});