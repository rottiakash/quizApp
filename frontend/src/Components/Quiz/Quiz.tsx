import React, { FC, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData } from "reactfire";
import styles from "./Quiz.module.css";
export interface Room {
  questions: Array<string>;
  player1: string;
  player1_url: string;
  player1_name: string;
  player2_url: string;
  player2_name: string;
  player2_score: string;
  player1_score: string;
  topic: string;
  player2: string;
}
const Quiz: FC = () => {
  const [clock, setClock] = useState<string>("--");
  const history = useHistory();
  const { id, qno } = useParams();
  const firestore = useFirestore();
  const roomRef = firestore.collection("rooms").doc(id);
  const room: Room = useFirestoreDocData(roomRef);
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
      <Question topic={room.topic} question={room.questions[qno - 1]} />
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
}
interface Question {
  correct: string;
  options: Array<string>;
  question: string;
}
const Question: FC<QuestionProps> = ({ topic, question }) => {
  const firestore = useFirestore();
  const topicRef = firestore
    .collection("topics")
    .doc(topic)
    .collection("questions")
    .doc(question);
  const data: Question = useFirestoreDocData(topicRef);
  console.log(data);
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
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            borderRadius: "16px",
            justifyContent: "center",
          }}
        >
          {data.options[0]}
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
          }}
        >
          {data.options[1]}
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
          }}
        >
          {data.options[2]}
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "teal",
            padding: "20px",
            justifyContent: "center",
            borderRadius: "16px",
          }}
        >
          {data.options[3]}
        </div>
      </section>
    </div>
  );
};

export default Quiz;
