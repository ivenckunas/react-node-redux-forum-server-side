const express = require("express");
const router = express.Router();

const { register, login, authSession, getAllTopics, getSingleTopic, postNewDiscussion } = require('../controllers/mainController');
const { validateReg } = require("../middleware/validator");


router.post('/register', validateReg, register)
router.post('/login', login)
router.get('/auth', authSession)
router.get('/all-topics', getAllTopics)
router.post('/new-discussion', postNewDiscussion)
router.get('/topic/:id', getSingleTopic)


module.exports = router;