const router = require('express').Router();

router.get('/', () => {
  console.log("GET items");
});
router.post('/', () => {
  console.log("POST new item");
});
router.delete('/items/:itemId', () => {
  console.log("Delete by item id");
});

module.exports = router;