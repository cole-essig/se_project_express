const router = require('express').Router();

router.get('/', () => {
  console.log("GET users");
});
router.get('/:userId', () => {
  console.log("GET user ID");
});
router.post('/', () => {
  console.log("Create new user");
});

module.exports = router;