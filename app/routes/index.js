import express from 'express';
import authMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get('/', authMiddleware.guest, (req, res) => {
    res.render('index', {title: 'Home'});
});

module.exports = router;
