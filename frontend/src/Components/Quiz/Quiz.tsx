import React, { FC, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDocData } from "reactfire";
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
  const [clock, setClock] = useState<number>(21);
  const [startTimer, set] = useState<boolean>(false);
  const history = useHistory();
  const { id, qno } = useParams();
  const auth = useAuth();
  const firestore = useFirestore();
  const roomRef = firestore.collection("rooms").doc(id);
  const room: Room = useFirestoreDocData(roomRef);
  useInterval(() => {
    if (startTimer) if (clock === 0) return;
    setClock(clock - 1);
  }, 1000);
  var token: string;
  auth.currentUser?.getIdToken().then((idToken) => (token = idToken));
  const validate = async (answer: string) => {
    var payload = qs.stringify({
      room: id,
      question: room.questions[qno - 1],
      answer,
      timer: clock,
    });
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
    setClock(21);
    set(false);
    if (parseInt(qno) < 7) history.push(`/quiz/${id}/${parseInt(qno) + 1}`);
    else window.alert("Quiz Done.....Next route to be implemented");
  };
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
        set={set}
        startTimer={startTimer}
        validate={validate}
        setClock={setClock}
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
  set: any;
  startTimer: boolean;
  setClock: any;
  validate: any;
}
interface Question {
  correct: string;
  options: Array<string>;
  question: string;
}
const Question: FC<QuestionProps> = ({
  topic,
  question,
  set,
  startTimer,
  setClock,
  validate,
}) => {
  const firestore = useFirestore();
  useEffect(() => {
    set(true);
  }, [set, startTimer]);
  const topicRef = firestore
    .collection("topics")
    .doc(topic)
    .collection("questions")
    .doc(question);
  const data: Question = useFirestoreDocData(topicRef);

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
        <div
          onClick={() => validate(data.options[0])}
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            borderRadius: "16px",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {data.options[0]}
        </div>
        <div
          onClick={() => validate(data.options[1])}
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
            cursor: "pointer",
          }}
        >
          {data.options[1]}
        </div>
        <div
          onClick={() => validate(data.options[2])}
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
            cursor: "pointer",
          }}
        >
          {data.options[2]}
        </div>
        <div
          onClick={() => validate(data.options[3])}
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
            cursor: "pointer",
          }}
        >
          {data.options[3]}
        </div>
      </section>
    </div>
  );
};

export default Quiz;
