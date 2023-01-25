const express = require("express");
const router = express();
const {
  getData,
  postData,
  deleteData,
  listData
} = require("../controllers/controllers");

router.get("/", getData);
router.post("/", postData);
router.post("/delete", deleteData);
router.get("/:listName", listData);

module.exports = router;
