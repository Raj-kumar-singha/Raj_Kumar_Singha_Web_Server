const express = require('express'),
    router = express.Router(),
    { downloadResume } = require('../controllers/todoControllers');

router.post('/download-resume', downloadResume);


module.exports = router;