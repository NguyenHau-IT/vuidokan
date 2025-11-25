var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home/index", {
    title: "VUIDOKAN",
    company: "Công ty TNHH Phát triển Thể thao Vuidokan",
    page: "home",
  });
});


module.exports = router;
