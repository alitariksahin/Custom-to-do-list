const mongoose = require("mongoose");
const date = require("../Date.js");
const _ = require("lodash");
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("item", itemSchema);

const item1 = new Item({
  name: "Welcome to your to-do-list"
});
const item2 = new Item({
  name: "Add new items by clicking on '+'"
});
const item3 = new Item({
  name: "Remove items by checking out the checkbox"
});

const items = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = new mongoose.model("list", listSchema);

const getData = function(req, res) {
  let day = date.getDate();

  Item.find({}, function(err, result) {
    if (result.length === 0) {
      Item.insertMany(items, function(err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("items are inserted succesfully.")
        }
      });
      res.redirect("/");
    }
    res.render("list", {list: day, newItems: result});
  });
}

const postData = function(req, res) {
  let itemName = req.body.input;
  let titleName = req.body.submit;

  const newItem = new Item({
    name: itemName
  });

  if (titleName === date.getDate()) {
    newItem.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: titleName}, function(err, result) {
      if (!err) {
        result.items.push(newItem);
        result.save();
        res.redirect("/" + titleName);
      }
    });
  }

}

const deleteData = function(req, res) {
  const itemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findOneAndDelete({_id : itemID}, function(err) {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
    });
  }
  else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, function(err, result) {
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }
}

const listData = function(req, res) {
  const listName = _.capitalize(req.params.listName);
  List.findOne({name: listName}, function(err, result) {
    if (!err) {
      if (result === null) {

        const customList = new List({
          name: listName,
          items: items
        });
        customList.save();
        res.redirect("/" + listName);
      }
      else {
        res.render("list", {list: listName, newItems: result.items})
      }
    }
  })
}

module.exports = {
  getData,
  postData,
  deleteData,
  listData
}
