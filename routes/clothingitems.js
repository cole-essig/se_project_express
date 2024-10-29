const router = require('express').Router();
const { getItems, createItem, deleteItem, addLike, deleteLike } = require('../controllers/clothingitems');
const { auth } = require('../middlewares/auth')

router.get('/', getItems);
router.post('/', auth, createItem);
router.delete('/:itemId', auth, deleteItem);
router.put('/:itemId/likes', auth, addLike);
router.delete('/:itemId/likes', auth, deleteLike);

module.exports = router;