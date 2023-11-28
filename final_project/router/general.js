const express = require('express');
let books = require("./booksdb.json");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fs = require("fs").promises;
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
    console.error(error);
    res.status(500).send("Internal server error");
  }});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const ISBN = req.params.isbn;
    const fPath = "./router/booksdb.json";
    const fContent = await fs.readFile(fPath, "utf8");
    const jsonBooks = JSON.parse(fContent);
    res.json(jsonBooks[ISBN]);
  }
  catch (error){
    console.error(error);
    res.status(500).send("Internal server error");
  }});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const fPath = "./router/booksdb.json";
    const fContent = await fs.readFile(fPath, "utf8");
    const author = req.params.author;
    const jsonBooks = JSON.parse(fContent);
    const bookKeys = Object.keys(jsonBooks);
    let BooksToReturn = [];
    let counter = "";
    BooksToReturn = bookKeys.map((keys) => {
      if (jsonBooks[keys].author === req.params.author){
        BooksToReturn.push(jsonBooks[keys])
        counter += "-";
      }
    });
    res.send(counter)}
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
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
