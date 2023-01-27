require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const Books = require("../model/books");
const constant = require("../config");

const addBooks = async (req, res) => {
    const {
        name,
        author,
        description,
        cat,
        copies
    }  = req.body;
    try{
        const oldBook = await Books.findOne({ name });
    
        if (oldBook) {
          return res.status(constant.HTTP_409_CODE).send("Book Already created. Please create another...");
        }
        let books = new Books({
            name,
            author,
            description,
            cat,
            copies
        })
        await books.save();
        return res.status(constant.HTTP_201_CODE).json(books);
    }
    catch(err){
        console.error(err.message);
        return res.status(constant.HTTP_500_CODE).send('Server Error..')
    }
}

const getBooks = async(req,res) =>{
    let query = [
        {
          $match: {
            name:{ $regex: "" },
          },
        },
      ];
      if (req.query.cat) {
        query.push({
          $match: {
            cat: req.query.cat,
          },
        });
      }
      if (req.query.author) {
        query.push({
          $match: {
            author: req.query.author,
          },
        });
      }
    try {
    const books = await Books.aggregate(query);
     return res.status(constant.HTTP_200_CODE).send(books);
    } catch (error) {
     return res.status(constant.HTTP_500_CODE).send(error);
    }
}

const getBookById = async(req, res) =>{
    const _id=req.params.bookId;
    try{
        code=200;
          const books = await Books.findById({_id});
          if(!books){
              return res.status(constant.HTTP_400_CODE).send("Bad request");
          }
        return res.status(constant.HTTP_200_CODE).send(books);
      } catch (error){
          res.status(constant.HTTP_500_CODE).send("Internal Server Error");
        }
}
const updateBookById = async(req, res) =>{
    let _id=req.params.bookId
  try{
      const books = await Books.findOneAndUpdate
      (
        {_id},
        {...req.body},
        {new:true}
      );
      if(!books){
        return res.status(constant.HTTP_400_CODE).send("Bad Request")
      };
      books.save()
      res.status(constant.HTTP_200_CODE).send("Updated Successfully");
  }catch (error){
    return res.status(constant.HTTP_500_CODE).send("Internal server error");
  }
}

const deleteBookById = async(req, res) =>{
    const _id=req.params.bookId
  try{
      const books = await Books.findByIdAndDelete({_id});
      if(!books){
        return res.status(constant.HTTP_400_CODE).send("Bad Request")
      };
      res.status(constant.HTTP_200_CODE).send("Deleted Successfully..");
      } catch(error){
        return res.status(constant.HTTP_500_CODE).send("Internal server error");
      }
}
module.exports = {
    addBooks,
    getBooks,
    getBookById,
    updateBookById,
    deleteBookById
};