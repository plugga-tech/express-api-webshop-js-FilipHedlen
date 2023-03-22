const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
    console.log(results);

  })

  res.send('Hej hej users');
});

router.post("/add", function(req, res) {

  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result);
    res.redirect("/show")
  })
})

module.exports = router;
