var express = require("express");
var router = express.Router();

/* GET services page. */
router.get("/", function (req, res, next) {
  res.render("service/index", {
    title: "VUIDOKAN",
    company: "Công ty TNHH Phát triển Thể thao Vuidokan",
    page: "services",
  });
});

module.exports = router;