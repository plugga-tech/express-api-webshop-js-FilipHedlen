const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

/* GET users listing. */
// SKAPA ORDER FÖR EN SPECIFIK USER // PRODUCTS ÄR EN ARRAY MOTSVARANDE INNEHÅLLET I KUNDVAGN
router.post('/add', async (req, res) => {
  const { userId, products } = req.body;

  try {
    const user = await req.app.locals.db.collection('users').findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'Användare kan inte hittas!' });
    }

    for (const product of products) {
      const { id: productId, quantity } = product;
      const foundProduct = await req.app.locals.db.collection('products').findOne({ id: productId });
      if (!foundProduct) {
        return res.status(404).json({ message: 'Produkt kan inte hittas!' });
      }
      if (foundProduct.lager < quantity) {
        return res.status(400).json({
          message: `Otillräckligt lagersaldo för: ${foundProduct.name}`,
        });
      }
      foundProduct.lager -= quantity;
      await req.app.locals.db.collection('products').updateOne({ id: productId }, { $set: { lager: foundProduct.lager } });
    }

    const order = {
      userId: user.id, 
      products,
    };
    await req.app.locals.db.collection('orders').insertOne(order);

    return res.json({ message: 'Din order har lagts till!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Felmeddelande!' });
  }
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