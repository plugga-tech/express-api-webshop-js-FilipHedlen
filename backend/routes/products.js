const express = require('express');
const router = express.Router();

/* GET users listing. */
// HÄMTA ALLA PRODUKTER
router.get("/", function(req, res) {
  const getProducts = req.app.locals.db.collection("products").find().toArray()
  .then(products => {
    res.send(products);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Error!");
 });
});

// HÄMTA SPECIFIK PRODUKT
router.get("/:id", function(req, res) {
  const productId  = req.params.id;
  req.app.locals.db.collection("products").findOne({id: productId})
  .then(product => {
    if (!product) {
      return res.status(404).send("Kan inte hitta produkt!");
    }
    res.send(product);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
  });
});

// SKAPA PRODUKT
router.post("/add", function(req, res) {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    lager: req.body.lager
  };

  req.app.locals.db.collection("products").insertOne(newProduct)
  .then(result => {
    console.log(result);
    res.send(`Ny produkt - ${newProduct.name} tillagd!`);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
  });
});

module.exports = router;