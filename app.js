//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/loanDB", {useNewUrlParser: true});

const loanSchema = new mongoose.Schema({
  email: String,
  password: String
});


loanSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});


const Loan = mongoose.model("loan", loanSchema);

app.get("/", function(req, res){
res.render("home");
 });

 app.get("/loan", function(req, res){
 res.render("loan");
  });

  app.get("/lend", function(req, res){
  res.render("lend");
   });

   app.get("/about", function(req, res){
   res.render("about");
    });

    app.get("/eligible", function(req, res){
    res.render("eligible");
     });

     app.get("/register", function(req, res){
     res.render("register");
      });

      app.post("/register", function(req,res){
        const newLoan = new Loan({
          email: req.body.username,
          password: req.body.password
        });
        newLoan.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.render("eligible");
          }
        });
      });

      app.get("/login", function(req, res){
      res.render("login");
       });

      app.post("/login", function(req,res){
        const username = req.body.username;
        const password = req.body.password;

        Loan.findOne({email:username}, function(err, foundUser){
          if (err){
            console.log(err);
          }else {
            if (foundUser){
              if (foundUser.password=== password){
                res.render("about")
              }
            }
          }
        });
      });

      app.get("/contact", function(req, res){
      res.render("contact");
       });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
