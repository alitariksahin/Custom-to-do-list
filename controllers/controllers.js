const mongoose = require("mongoose");
const date = require("../Date.js");
const _ = require("lodash");
require("dotenv").config();

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

const getData = async function(req, res) {
  let day = date.getDate();
  try {
    const result = await Item.find({});
    if (result.length === 0) {
      await Item.insertMany(items);
      console.log("items are inserted succesfully.");
      res.redirect("/");
    }
    else {
      res.render("list", {list: day, newItems: result});
    }
  }catch(err) {
    console.log(err);
  }
}

const postData = async function(req, res) {
  let itemName = req.body.input;
  let titleName = req.body.submit;

  const newItem = new Item({
    name: itemName
  });
  try {
    if (titleName === date.getDate()) {
      await newItem.save();
      res.redirect("/");
    }
    else {
      const result = await List.findOne({name: titleName});
      result.items.push(newItem);
      await result.save();
      res.redirect("/" + titleName);

    }
  }catch(err) {
    console.log(err);
  }


}

const deleteData = async function(req, res) {
  const itemID = req.body.checkbox;
  const listName = req.body.listName;
  try {
    if (listName === date.getDate()) {
      await Item.findOneAndDelete({_id : itemID});
      res.redirect("/");
    }
    else {
      const result = await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}});
      res.redirect("/" + listName);

    }
  }catch(err) {
    console.log(err);
  }

}

const listData = async function(req, res) {
  const listName = _.capitalize(req.params.listName);
  try {
    const result = await List.findOne({name: listName});
      if (result === null) {
        const customList = new List({
          name: listName,
          items: items
        });
        await customList.save();
        res.redirect("/" + listName);
      }
      else {
        res.render("list", {list: listName, newItems: result.items})
      }

  }catch(err) {
    console.log(err);
  }

}

module.exports = {
  getData,
  postData,
  deleteData,
  listData
}
