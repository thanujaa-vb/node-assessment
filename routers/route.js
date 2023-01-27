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
// router.post('/token', userController.GetAccessToken);
router.post('/logout', userController.userLogout);


router.post('/welcome', [isAuth.verifyRefreshToken, isUser], (req, res) => {
    res.status(constant.HTTP_200_CODE).send("Welcome User.....");
  });
router.post('/home',  [isAuth.verifyRefreshToken, isAdmin], (req, res) => {
    res.status(constant.HTTP_200_CODE).send("Hello Admin.....");
  });
router.post('/issue',issueController.addIssue );
router.get('/issue',issueController.getIssues);
router.get('/issue/:issueId',issueController.getIssueById);
router.put('/issue/:issueId',issueController.updateIssueById);
router.delete('/issue',issueController.deleteAllIsuues);

router.post('/books',booksController.addBooks);
router.get('/books',booksController.getBooks);
router.get('/books/:bookId',booksController.getBookById);
router.put('/books/:bookId',booksController.updateBookById);
router.delete('/books/:bookId',booksController.deleteBookById);

module.exports = router; 