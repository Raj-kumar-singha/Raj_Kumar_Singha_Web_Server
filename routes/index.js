const express = require('express'),
    router = express.Router(),
    { downloadResume, getAllUsers } = require('../controllers/todoControllers');

router.post('/download-resume', downloadResume);
router.get('/all-users', getAllUsers);


module.exports = router;