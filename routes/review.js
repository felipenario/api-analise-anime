let express = require('express');
let router = express.Router();
let controller = require('../controllers/review');
const auth = require('../lib/auth');


router.get('/review/anime', auth.jwtVerify, controller.getAnimesByExistingReviews);
router.get('/review/all', auth.jwtVerify, controller.getAllReviews);
router.get('/review/:id', auth.jwtVerify, controller.getReviewById);
router.get('/review/anime/:anime',auth.jwtVerify, controller.getReviewsByAnime);
router.get('/my-reviews/', auth.jwtVerify, controller.getReviewByUser);
router.post('/review/', auth.jwtVerify, controller.addReview);
router.put('/review/:id', auth.jwtVerify, controller.editReview);
router.delete('/review/:id', auth.jwtVerify, controller.deleteReview);




module.exports = router;
