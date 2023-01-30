const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const booksController = require('../controller/booksController');
const issueController = require('../controller/issuesController');
const isAuth = require('../middleware/auth');
const isAdmin = require('../roles/isAdmin');
const isUser = require('../roles/isUser');

router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.post('/logout',isAuth.verifyToken, userController.userLogout);


router.post('/welcome', [isAuth.verifyToken, isUser], (req, res) => {
   return res.status(constant.HTTP_200_CODE).send({message: "Hello User"});
  });
router.post('/home',  [isAuth.verifyToken, isAdmin], (req, res) => {
   return res.status(constant.HTTP_200_CODE).send({message: "Hello Admin"});
  });
router.post('/issue',isAuth.verifyToken,issueController.addIssue );
router.get('/issue',isAuth.verifyToken,issueController.getIssues);
router.get('/issue/:issueId',isAuth.verifyToken,issueController.getIssueById);
router.put('/issue/:issueId',isAuth.verifyToken,issueController.updateIssueById);
router.delete('/issue',isAuth.verifyToken,issueController.deleteAllIsuues);

router.post('/books',isAuth.verifyToken,booksController.addBooks);
router.get('/books', isAuth.verifyToken,booksController.getBooks);
router.get('/books/:bookId', isAuth.verifyToken,booksController.getBookById);
router.put('/books/:bookId', isAuth.verifyToken,booksController.updateBookById);
router.delete('/books/:bookId', isAuth.verifyToken,booksController.deleteBookById);

module.exports = router; 