import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp();

import * as express from "express";

const cors = require('cors');

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors({ origin: true }));

app.post("/validate", async (req, res) => {
  const topic = req.body.topic;
  const question = req.body.question;
  const ans = req.body.answer;
  const correctRef = await admin.firestore().collection('topics').doc(topic).collection('questions').doc(question).get();
  if (!correctRef.exists) {
    res.status(404);
    res.send('No such document!');
  } else {
    const correct = correctRef.data()!.correct;
    if (correct == ans)
      res.send(true);
    else
      res.send(false);
  }
});


exports.logic = functions.https.onRequest(app);