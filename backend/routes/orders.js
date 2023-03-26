const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

/* GET users listing. */
// SKAPA ORDER FÖR EN SPECIFIK USER // PRODUCTS ÄR EN ARRAY MOTSVARANDE INNEHÅLLET I KUNDVAGN
router.post("/add", function(req, res) {
  const { _id, products } = req.body;
  const newOrder = { userId: new ObjectId(_id), products: products };
  const db = req.app.locals.db;

  db.collection("orders").insertOne(newOrder)
    .then(result => {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        db.collection("products").updateOne(
          { _id: new ObjectId(product._id) },
          { $inc: { lager: -product.quantity } }
        );
      }
      res.send(`Din order har lagts till!`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Felmeddelande!");
    });
});


// HÄMTA ALLA ORDERS
router.get("/all", function(req, res) {
  req.app.locals.db.collection("orders").find().toArray()
  .then(orders => {
    res.send(orders);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
 });
 });


module.exports = router;