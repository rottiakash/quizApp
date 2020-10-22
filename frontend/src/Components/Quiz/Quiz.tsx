import React, { FC, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDocData } from "reactfire";
import Waiter from "../../Modules/Waiter/Waiter";
import styles from "./Quiz.module.css";
const axios = require("axios").default;
var qs = require("qs");
export interface Room {
  questions: Array<string>;
  player1: string;
  player1_url: string;
  player1_name: string;
  player2_url: string;
  player2_name: string;
  player2_score: string;
  player1_score: string;
  p1_q1: string;
  p1_q2: string;
  p1_q3: string;
  p1_q4: string;
  p1_q5: string;
  p1_q6: string;
  p1_q7: string;
  p2_q1: string;
  p2_q2: string;
  p2_q3: string;
  p2_q4: string;
  p2_q5: string;
  p2_q6: string;
  p2_q7: string;
  topic: string;
  player2: string;
}
function useInterval(callback: any, delay: any) {
  const savedCallback: React.MutableRefObject<any> = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const Quiz: FC = () => {
  const resetTimer = () => setClock(21);

  const [questionData, setQuestionData] = useState<Question>();
  const regularOption = {
    display: "flex",
    backgroundColor: "teal",
    padding: "20px",
    borderRadius: "16px",
    justifyContent: "center",
    cursor: "pointer",
  };
  const validateOption = {
    display: "flex",
    backgroundColor: "orange",
    padding: "20px",
    borderRadius: "16px",
    justifyContent: "center",
    cursor: "pointer",
  };
  const wrongOption = {
    display: "flex",
    backgroundColor: "tomato",
    padding: "20px",
    borderRadius: "16px",
    justifyContent: "center",
    cursor: "pointer",
  };
  const correctOption = {
    display: "flex",
    backgroundColor: "lime",
    padding: "20px",
    borderRadius: "16px",
    justifyContent: "center",
    cursor: "pointer",
  };
  var player: number;
  const [clock, setClock] = useState<any>(21);
  const [optionStyle, setOptionStyle] = useState({
    option1: regularOption,
    option2: regularOption,
    option3: regularOption,
    option4: regularOption,
  });
  const [disabled, setDisabled] = useState(false);
  const history = useHistory();
  const { id, qno } = useParams();
  const auth = useAuth();
  const firestore = useFirestore();
  const roomRef = firestore.collection("rooms").doc(id);
  const room: Room = useFirestoreDocData(roomRef);
  const colorCorrectOption = () => {
    switch (questionData?.options.indexOf(questionData.correct)) {
      case 0:
        setOptionStyle({ ...optionStyle, option1: correctOption });
        break;
      case 1:
        setOptionStyle({ ...optionStyle, option2: correctOption });
        break;
      case 2:
        setOptionStyle({ ...optionStyle, option3: correctOption });
        break;
      case 3:
        setOptionStyle({ ...optionStyle, option4: correctOption });
        break;
    }
  };
  if (auth.currentUser?.uid === room.player1) {
    player = 1;
  } else player = 2;
  if (player)
    firestore
      .collection("rooms")
      .doc(id)
      .update({ [`p${player}_q${qno}`]: true });
  var other;
  switch (qno) {
    case "1":
      console.log("Here");
      if (player === 1) other = room.p2_q1;
      else other = room.p1_q1;
      break;
    case "2":
      if (player === 1) other = room.p2_q2;
      else other = room.p1_q2;
      break;
    case "3":
      if (player === 1) other = room.p2_q3;
      else other = room.p1_q3;
      break;
    case "4":
      if (player === 1) other = room.p2_q4;
      else other = room.p1_q4;
      break;
    case "5":
      if (player === 1) other = room.p2_q5;
      else other = room.p1_q5;
      break;
    case "6":
      if (player === 1) other = room.p2_q6;
      else other = room.p1_q6;
      break;
    case "7":
      if (player === 1) other = room.p2_q7;
      else other = room.p1_q7;
      break;
    default:
      break;
  }
  console.log(other);
  useInterval(async () => {
    if (clock === 0) {
      setClock("--");
      colorCorrectOption();
      await timeout(3000);
      if (parseInt(qno) < 7) history.push(`/quiz/${id}/${parseInt(qno) + 1}`);
      else history.push(`/winner/${id}`);
      setOptionStyle({
        option1: regularOption,
        option2: regularOption,
        option3: regularOption,
        option4: regularOption,
      });
      setClock(21);
      return;
    }
    if (clock === "--") return;
    setClock(clock - 1);
  }, 1000);
  var token: string;
  auth.currentUser?.getIdToken().then((idToken) => (token = idToken));
  const validate = async (answer: string, button: number) => {
    setDisabled(true);
    if (button === 1)
      setOptionStyle({ ...optionStyle, option1: validateOption });
    else if (button === 2)
      setOptionStyle({ ...optionStyle, option2: validateOption });
    else if (button === 3)
      setOptionStyle({ ...optionStyle, option3: validateOption });
    else if (button === 4)
      setOptionStyle({ ...optionStyle, option4: validateOption });
    var payload = qs.stringify({
      room: id,
      question: room.questions[qno - 1],
      answer,
      timer: clock,
    });
    setClock("--");
    console.log(payload);
    var config = {
      method: "post",
      url:
        "https://us-central1-quizapp-fdb5a.cloudfunctions.net/logic/validate",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: payload,
    };
    var response = await axios(config);
    console.log(response);

    if (response.data === true) {
      if (button === 1)
        setOptionStyle({ ...optionStyle, option1: correctOption });
      else if (button === 2)
        setOptionStyle({ ...optionStyle, option2: correctOption });
      else if (button === 3)
        setOptionStyle({ ...optionStyle, option3: correctOption });
      else if (button === 4)
        setOptionStyle({ ...optionStyle, option4: correctOption });
    } else {
      if (button === 1)
        setOptionStyle({ ...optionStyle, option1: wrongOption });
      else if (button === 2)
        setOptionStyle({ ...optionStyle, option2: wrongOption });
      else if (button === 3)
        setOptionStyle({ ...optionStyle, option3: wrongOption });
      else if (button === 4)
        setOptionStyle({ ...optionStyle, option4: wrongOption });
    }
    await timeout(1000);
    colorCorrectOption();
    await timeout(3000);
    setOptionStyle({
      option1: regularOption,
      option2: regularOption,
      option3: regularOption,
      option4: regularOption,
    });

    if (parseInt(qno) < 7) history.push(`/quiz/${id}/${parseInt(qno) + 1}`);
    else history.push(`/winner/${id}`);
    setDisabled(false);
    setClock(21);
  };
  if (!other) return <Waiter />;
  else
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#100e17",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="https://cdn2.iconfinder.com/data/icons/gradient-purple-navigation-and-transactional-for-w/40/back-purp-512.png"
            alt="back"
            onClick={() => history.push("/")}
            style={{
              width: "50px",
              height: "50px",
              marginLeft: "10px",
              marginTop: "10px",
              paddingTop: "5px",
              cursor: "pointer",
            }}
          />
          <span className={styles.name}>Question {qno}</span>
        </div>

        <Question
          topic={room.topic}
          question={room.questions[qno - 1]}
          validate={validate}
          setClock={setClock}
          optionStyle={optionStyle}
          resetTimer={resetTimer}
          disabled={disabled}
          setQuestionData={setQuestionData}
        />

        <div
          style={{
            display: "flex",
            width: "100vw",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "white", padding: "20px" }}>
            <div style={{ display: "flex" }}>
              <img
                src={room.player1_url}
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
              <span
                className={styles.score}
                style={{
                  marginLeft: "5px",
                  paddingTop: "10px",
                }}
              >
                {room.player1_score}
              </span>
            </div>
          </div>
          <span
            style={{
              marginRight: "5px",
              paddingTop: "10px",
              height: "50px",
              width: "50px",
              padding: "4px",
              border: "5px solid white",

              textAlign: "center",
            }}
            className={styles.clock}
          >
            <span className={styles.score}>{clock}</span>
          </span>
          <div style={{ color: "white", padding: "20px" }}>
            <div style={{ display: "flex" }}>
              <span
                className={styles.score}
                style={{
                  marginRight: "5px",
                  paddingTop: "10px",
                }}
              >
                {room.player2_score}
              </span>
              <img
                src={
                  room.player2
                    ? room.player2_url
                    : "https://media.istockphoto.com/vectors/waiting-icon-vector-sign-and-symbol-isolated-on-white-background-vector-id1029720470?k=6&m=1029720470&s=170667a&w=0&h=Jj71N5y7TwYnqCblQZnKZTCF5zOjknUWEchBRJza_wc="
                }
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
};

interface QuestionProps {
  topic: string;
  question: string;
  resetTimer: any;
  setClock: any;
  validate: any;
  optionStyle: {
    option1: any;
    option2: any;
    option3: any;
    option4: any;
  };
  disabled: boolean;
  setQuestionData: any;
}
interface Question {
  correct: string;
  options: Array<string>;
  question: string;
}
const Question: FC<QuestionProps> = ({
  topic,
  question,
  resetTimer,
  disabled,
  validate,
  optionStyle,
  setQuestionData,
}) => {
  const [first, setFirst] = useState(true);
  const firestore = useFirestore();
  useEffect(() => {
    if (first) {
      resetTimer();
      setFirst(false);
    }
  }, [first, resetTimer]);
  const topicRef = firestore
    .collection("topics")
    .doc(topic)
    .collection("questions")
    .doc(question);
  const data: Question = useFirestoreDocData(topicRef);
  useEffect(() => {
    if (data) setQuestionData(data);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "30px",
          justifyContent: "center",
          borderRadius: "16px",
        }}
      >
        Question:
        <br />
        <br />
        {data.question}
      </div>
      <br />
      <br />
      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}
      >
        <button
          disabled={disabled}
          onClick={() => validate(data.options[0], 1)}
          style={optionStyle.option1}
        >
          {data.options[0]}
        </button>
        <button
          disabled={disabled}
          onClick={() => validate(data.options[1], 2)}
          style={optionStyle.option2}
        >
          {data.options[1]}
        </button>
        <button
          disabled={disabled}
          onClick={() => validate(data.options[2], 3)}
          style={optionStyle.option3}
        >
          {data.options[2]}
        </button>
        <button
          disabled={disabled}
          onClick={() => validate(data.options[3], 4)}
          style={optionStyle.option4}
        >
          {data.options[3]}
        </button>
      </section>
    </div>
  );
};

export default Quiz;
