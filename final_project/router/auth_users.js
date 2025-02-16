const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.json");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 3600 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const username = req.body.username;
  const ISBN = req.params.isbn;
  let reviewList = books[ISBN].reviews;
  let pushIt = {"username": username, "review": review};
  let retrievedUsers = reviewList.map(retrieveduser => retrieveduser.username);
    if (retrievedUsers.includes(username)){
        teststring = "true on first if";
        reviewList = reviewList.map(retrieveduser => {
        if (retrieveduser.username === username){
          teststring = teststring + "and second if";
          retrieveduser.review = review}})  
    }  
      else {
        reviewList.push(pushIt)
      };
  res.status(300).json(books[ISBN])
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.body.username;
  let reviewList = books[ISBN].reviews;
  let retrievedUsers = reviewList.map(retrieveduser => retrieveduser.username);
  if (retrievedUsers.includes(username)){
    reviewList = reviewList.filter((user) => user.username != username)
    // res.send(`Reviews of user ${username} deleted`);
    res.send(books[ISBN]);
  }
  else{
    res.send("user not found");
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
