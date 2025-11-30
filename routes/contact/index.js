var express = require('express');
var router = express.Router();

/* GET contact page */
router.get('/', function(req, res, next) {
  res.render('contact/index', { 
    title: 'VUIDOKAN',
    company: 'Công ty TNHH Phát triển Thể thao Vuidokan',
    page: 'contact'
  });
});

/* POST contact form submission */
router.post('/submit', function(req, res, next) {
  const { name, email, phone, service, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin bắt buộc.'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email không hợp lệ.'
    });
  }

  // Phone validation (Vietnamese phone numbers)
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Số điện thoại không hợp lệ.'
    });
  }

  // Here you would typically save to database or send email
  // For now, just return success response
  console.log('Contact form submission:', {
    name: name,
    email: email,
    phone: phone,
    service: service,
    message: message,
    timestamp: new Date()
  });

  res.json({
    success: true,
    message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
  });
});

module.exports = router;