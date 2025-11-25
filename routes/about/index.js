var express = require("express");
var router = express.Router();

/* GET about page. */
router.get("/", function (req, res, next) {
  res.render("about/index", {
    title: "VUIDOKAN",
    company: "Công ty TNHH Phát triển Thể thao Vuidokan",
    page: "about",
  });
});

module.exports = router;
