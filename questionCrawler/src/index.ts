import * as a from "axios";
import * as admin from "firebase-admin";
import * as cheerio from "cheerio";
var serviceAccount = require("./quizapp-fdb5a-firebase-adminsdk-2o7dx-b81a80b1cf.json");

let axios = a.default;
const url: string =
  "https://opentdb.com/api.php?amount=50&category=30&difficulty=hard&type=multiple";
const prod = false;
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

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let topicID = "j84sWFIW7vSb2d97wcrJ";

const questionRef = admin
  .firestore()
  .collection("topics")
  .doc(topicID)
  .collection("questions");

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
}

async function fetch() {
  const data = await axios.get(url);
  let questions: Array<Question> = data.data.results;
  let result = questions.map((question: Question) => ({
    question: cheerio.load(question.question)(":root").text(),
    correct: cheerio.load(question.correct_answer)(":root").text(),
    options: shuffle(
      [question.correct_answer, ...question.incorrect_answers].map(
        (content) => {
          const $ = cheerio.load(content);
          return $(":root").text();
        }
      )
    ),
  }));
  console.log(result);
  if (prod) {
    console.log("Uploading to Firestore");
    result.map(async (question) => {
      await questionRef.doc(makeid(20)).set(question);
    });
    console.log("Done");
  }
}

fetch();
