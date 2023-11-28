const express = require('express');
let books = require("./booksdb.json");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const fs = require("fs").promises;
let bookKeys = Object.keys(books);

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const fPath = "./router/booksdb.json";
    const fContent = await fs.readFile(fPath, "utf8");
    const jsonBooks = JSON.parse(fContent);
    res.json(jsonBooks);
  }
  catch (error){
    console.error(err);
    res.status(500).send("Internal server error");
  }});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  authorKey = bookKeys.filter((keys) => books[keys].author === req.params.author);
  res.send(books[authorKey]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  titleKey = bookKeys.filter((keys) => books[keys].title === req.params.title);
  res.send(books[titleKey]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
