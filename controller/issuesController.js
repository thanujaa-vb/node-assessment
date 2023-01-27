require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const Books = require("../model/books");
const Issue = require("../model/issues");
const Users = require("../model/user");
const constant = require("../config");

const addIssue = async(req, res) =>{
    Books.findById(req.body.book)
    .then((requiredBook)=>{
        Users.findById(req.body.student)
        .then((requiredUser)=>{
            
            if(!requiredBook){
                return res.status(400).json("Book doesn't exist");
           }
            else if(!requiredUser){
                        return res.status(400).json("Student doesn't exist");
                   }
            else if(requiredBook._id&&requiredUser._id) {
                Issue.find({
                   student: req.body.student 
                })
                .then((issues)=>{
                    notReturned=issues.filter((issue)=>(!issue.returned));
                    if(notReturned&&notReturned.length>=3){
                        return res.status(400).send("The student has already issued 3 books. Please return them first");
                    }
                    else{
                        if(requiredBook.copies>0){
                        Issue.create(req.body, function(err, issue) {
                            if (err) return res.send(err);
                            Issue.findById(issue._id)
                            .populate('student')
                            .populate('book')                        
                            .exec(function(err, issue) {
                              if (err) return res.status(400).send(err);
                              Books.findByIdAndUpdate(req.body.book,{
                                $set: {copies: (requiredBook.copies-1)}
                            },{new: true})
                            .then((book) => {
                            res.statusCode=200;
                            res.setHeader('Content-Type','application/json');
                            res.json(issue);
            
                           },)
                           .catch((err) => res.status(400).send({success: false}));
            
                            })})
                    }
                    else {
                        console.log(requiredBook);
                        return res.status(400).send("The book is not available. You can wait for some days, until the book is returned to library.");
                    }
                    }
                })
                .catch((err)=>res.status(400).send(err)) ;
            }
        },)
        .catch((err)=>res.status(400).send(err)) 
                  
    },)
    .catch((err)=>res.status(400).send(err)) 
}

const getIssues = async(req, res) =>{
                   Issue.find({})
                    .populate('student')
                    .populate('book')
                      .then((issues)=>{
                         return res.status(200).json(issues);
                      },)
                      .catch((err)=>res.status(400).send(err))
}

const deleteAllIsuues = async(req, res) =>{
    Issue.remove({})
    .then((resp) => {
        console.log("Removed All Issue");
        return res.status(200).json(resp);
    },)
    .catch((err) => res.status(400).send(err));
}

const getIssueById = async(req, res) =>{
    Issue.findById(req.params.issueId)
    .populate('student')
    .populate('book')
    .then((issue)=>{
        if(issue)
       { 
       return res.status(200).json(issue);
       }
       else if(!issue){
        return res.status(404).send("Issue not found");
    }
       else{
        return res.status(401).send("Unauthorised");
       }
    },(err)=> res.send(err))
    .catch((err)=>res.status(400).send(err))
}

const updateIssueById = async(req, res) =>{
Issue.findById(req.params.issueId)
    .then((issue)=>{
        if(issue.returned === false){
    Books.findById(issue.book)
    .then((requiredBook)=>{
        Issue.findByIdAndUpdate(req.params.issueId,{
            $set: {returned: true}
        },{new: true})
        .populate('student')
        .populate('book')
        .then((issue) => {
            Books.findByIdAndUpdate(issue.book,{
                $set: {copies: (requiredBook.copies+1)}
            },{new: true})
            .then((book) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(issue);
            },)
            .catch((err) => res.status(400).json({success: false,message: "Book not updated"}));
       },)
       .catch((err) => res.status(400).json({success: false,message: "Issue not Updated"}));
    },)
    .catch((err) => res.status(400).json({success: false,message: "Book not found"}));
}
else{
    return res.status(200).send("Already Returned");
}
   },)
   .catch((err) => res.status(400).json({success: false,message: "Issue not found"}))
}
module.exports = {
    addIssue,
    getIssues,
    deleteAllIsuues,
    getIssueById,
    updateIssueById
}