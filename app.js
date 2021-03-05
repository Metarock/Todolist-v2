//jshint esversion:6
//Starting file, adding mongoose

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//const date = require(__dirname + "/date.js");

const app = express();

  let userList = "";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const password = "johnisaiah2000";

//connect to mongoose locally only
mongoose.connect("mongodb+srv://admin-john:"+ password +"@cluster0.lj0fi.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please input a list name"]
  }
});

//create mongoose model
const Item = mongoose.model("Item", itemSchema);

//create new documents using mongoose
const item1 = new Item({
  name: "Study and practice coding",
});

const item2 = new Item({
  name: "Check the market daily"
});

const item3 = new Item({
  name: "Always take a break"
});

//default array items into the mongoose
const defaultItems = [item1, item2, item3];

//new Schema for users adding list
//for every new list that we create the list is going to have a name
// and it's going to have an array of item documents associated with it as well.
const listSchema = {
  name: {
    type: String,
    required: [true, "Input a list name"],
  },
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {


 //read data from mongoose
 Item.find({},(err, items) => {

   if(err){
     console.log(err);
   }else if(items.length === 0){ //validate if there currently no items in the database, add the default list items
     //inserting documents into mongoose
     Item.insertMany(defaultItems, (err) => {
       if(err){
         console.log(err);
       }else{
         console.log("Success saved to DB")
       }
     });
     res.redirect("/");
   }
   else{
     console.log("Default items already added.")
     console.log(items);
     res.render("list", {listTitle: "Today", newListItems: items});
     console.log("Done reading documents and inserted to javascript object");
   }
 });
});


//post to home page
app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list;


  const add = new Item({
    name: item,
  });

  //this statement basically checks what page is the user currently on
  if (listName === "Today"){
    add.save();
    res.redirect("/");
  }
  else{ //if user is not at the main page, add theitems into the list
    List.findOne({name: listName}, (err, foundList) => {
      //add the list into the array
      foundList.items.push(add);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
});

//Delete
app.post("/delete", (req,res) => {
  const checkItemID = req.body.checkBox;
  const listName = req.body.listName;

  if(listName === "Today"){
    //remove by idea
    Item.findByIdAndRemove(checkItemID, (err) => {
      if(!err){
        console.log("Successfully");
         res.redirect("/");
      }
    });
  }
  else{//if not in the 'Today' page then it is on this page 
  //The condition is the list title, then second parameter pull removes from an existing array all instances of a value/s 
  //that matches the condition and that is the ID. 
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemID}}}, (err, list) => {
      if(!err){
        console.log("Has been deleted");
        res.redirect("/"+listName);
      }
    });
  }
});

//Express routing parameter
app.get("/:userList", (req,res) => {
    //the capitalize function capitalizes the first letter
    userList = _.capitalize(req.params.userList);

    List.findOne({name: userList}, (err, foundList) => {

      if(err){
        console.log(err)
      }
      else if(!foundList){
        //if not found, add the list to the collection

        const list = new List({
          name: userList,
          items: defaultItems
        });

        list.save(() => res.redirect('/' + userList));
        // setTimeout(() => { res.redirect("/" + userList);}, 2000);
        console.log("Successfully added " + userList);
      }
      else{
        //if found, render
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    });

    //save it into the list collection
    // list.save();
})

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;

//let port equal the port that Heroku has set up
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started!!");
});
