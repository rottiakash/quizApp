import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import * as express from "express";

const cors = require("cors");

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function shuffle(array: Array<string>) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors({ origin: true }));

//Middleware
const fireAuth = async (req: any, res: any, next: any) => {
  let idToken: string = req.headers.authorization;
  idToken = idToken.replace("Bearer ", "").trim();
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401);
    res.send("Unauthorised");
  }
};

app.use(fireAuth);

app.post("/validate", async (req, res) => {
  const topic = req.body.topic;
  const question = req.body.question;
  const ans = req.body.answer;
  const correctRef = await admin
    .firestore()
    .collection("topics")
    .doc(topic)
    .collection("questions")
    .doc(question)
    .get();
  if (!correctRef.exists) {
    res.status(404);
    res.send("No such document!");
  } else {
    const correct = correctRef.data()!.correct;
    if (correct == ans) res.send(true);
    else res.send(false);
  }
});

app.post("/createroom", async (req: any, res) => {
  var questions: Array<string> = [];
  const topicid = req.body.topic;
  const photourl = req.body.url;
  const name = req.body.name;
  const uid = req.uid;
  const roomid = makeid(7);
  const snapshot = await admin
    .firestore()
    .collection("topics")
    .doc(topicid)
    .collection("questions")
    .get();
  snapshot.forEach((doc) => questions.push(doc.id));
  questions = shuffle(questions);
  questions.slice(0, 7);
  try {
    await admin.firestore().collection("rooms").doc(roomid).set({
      topic: topicid,
      player1: uid,
      player1_url: photourl,
      player1_name: name,
      player1_score: 0,
      player2_score: 0,
      questions,
    });
    console.log("Created Room", roomid);
    res.send({ roomid });
  } catch (error) {
    console.log("Error:", error);
  }
});

app.post("/joinroom", async (req: any, res) => {
  const roomid = req.body.room;
  const photourl = req.body.url;
  const name = req.body.name;
  const uid = req.uid;
  try {
    await admin.firestore().collection("rooms").doc(roomid).update({
      player2: uid,
      player2_url: photourl,
      player2_name: name,
    });
    console.log("Joinned Room", roomid);
    res.send({ roomid });
  } catch (error) {
    console.log("Error:", error);
  }
});
exports.logic = functions.https.onRequest(app);
