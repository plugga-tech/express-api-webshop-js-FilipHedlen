const express = require('express');
const router = express.Router();


/* GET users listing. */
// HÄMTA ALLA USERS // SKICKA INTE MED LÖSENORD // BARA ID, NAMN + EMAIL PÅ ALLA USERS
router.get("/", function(req, res) {
  const getUsers = req.app.locals.db.collection("users").find().toArray()
  .then(users => {
    for (let i = 0; i < users.length; i++) {
      delete users[i].password;
    }
    res.send(users);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
  });
});


// HÄMTA SPECIFIK USER // SKICKA HELA OBJEKTET
router.get("/:id", function(req, res) {
  const userId  = req.body.id;
  req.app.locals.db.collection("users").findOne({id: userId})
  .then(user => {
    if (!user) {
      return res.status(404).send("Kan inte hitta användare!");
    }
    res.send(user);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
  });
 });


// SKAPA USER
router.post("/add", function(req, res) {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  req.app.locals.db.collection("users").insertOne(newUser)
  .then(result => {
    console.log(result);
    res.send(`Ny användare ${newUser.name} tillagd!`);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send("Felmeddelande!");
  });
});

// LOGGA IN USER
router.post("/login", function(req, res) {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  req.app.locals.db.collection("users").findOne({email: userEmail})
    .then(user => {
      if (!user) {
        return res.status(401).send("Inkorrekt email");
      } else if (user.password !== userPassword) {
        return res.status(401).send("Inkorrekt lösenord");
      } else {
        res.send(`${user.name}, du är inloggad!`);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error!");
    });
});

module.exports = router;
