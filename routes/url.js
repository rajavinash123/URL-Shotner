const express = require("express");
const { handlerGenerateNewShortURL } = require('../controllers/url');

const router = express.Router();

router.post("/", handlerGenerateNewShortURL);

module.exports = router;