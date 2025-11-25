var express = require('express');
var router = express.Router();

/* GET news page. */
router.get('/', function(req, res, next) {
  res.render('news/index', { 
    title: 'VUIDOKAN',
    page: 'news'
  });
});

/* GET specific news article */
router.get('/article/:id', function(req, res, next) {
  const articleId = req.params.id;
  
  // In a real application, you would fetch article data from database
  // For now, we'll render a placeholder
  res.render('news/article', { 
    title: 'VUIDOKAN',
    page: 'news',
    articleId: articleId
  });
});

/* GET news by category */
router.get('/category/:category', function(req, res, next) {
  const category = req.params.category;
  
  // In a real application, you would filter news by category from database
  res.render('news/index', { 
    title: 'VUIDOKAN',
    page: 'news',
    category: category
  });
});

module.exports = router;