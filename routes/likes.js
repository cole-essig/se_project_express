const router = require('express').Router();
const { addLike, deleteLike } = require('../controllers/likes');

router.put('/:itemId/likes', addLike);
router.delete('/:itemId/likes', deleteLike);

module.exports = router;