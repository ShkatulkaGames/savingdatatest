const express = require("express");
const app = express();
require('dotenv').config()

// MongoDB Configurations 
const mongoose = require('mongoose')
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;

require('../models/player')
const playerModel = mongoose.model('Player')

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection To MongoDB Atlas Successful!");
});

app.get("/", (request, response) => {
  response.send("Hi, This Is A Tutorial Api . . .");
});


app.get("/player-data/:id", async (request, response) => {
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({ userID: `${request.params.id}` })
    
    if (playerData) {
      return playerData
    } else {
      const newPlayerDataInstance = new playerModel({
        userID: `${request.params.id}`,
        coins: 0,
        clanTag: '',
        welcomeMes: '',
        clanOwner:"0",
      })
      
      const newPlayerData = await newPlayerDataInstance.save()
      
      return newPlayerData
    }
  }

  response.json(await playerDataCheck());
});

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// We create a POST route
app.post("/player-data/update-coins/:id", async (request, response) => {
  // We use a mongoose method to find A record and update!
  await playerModel.findOneAndUpdate(
    { userID: `${request.params.id}` },
    { $inc: { coins: request.body.coins } }
    // We set the coins to the coins we received in the body of the request
  );
  response.send("Updated Clan Coins.");
  // Just a response.
});
app.post("/player-data/create-clan/:id", async (request, response) => {
  await playerModel.findOneAndUpdate(
    { userID: `${request.params.id}` },
    { $set: { clanOwner: request.body.id },
     $set: { welcomeMes: request.body.welcomeMes } ,
     $set: { clanTag: request.body.clanTag } ,
     $set: { coins: 0 } }
  );
  response.send("Created New Clan.");
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



// And Finally you make the app listen to a port.
