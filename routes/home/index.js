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

/* GET about page. */
router.get("/aboutus", function (req, res, next) {
  res.render("about/index", {
    title: "VUIDOKAN",
    company: "Công ty TNHH Phát triển Thể thao Vuidokan",
    page: "about",
  });
});

module.exports = router;
