import React, { FC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreDocData } from "reactfire";
import styles from "./Winner.module.css";
export interface Room {
  questions: Array<string>;
  player1: string;
  player1_url: string;
  player1_name: string;
  player2_url: string;
  player2_name: string;
  player2_score: string;
  player1_score: string;
  p1_q1: boolean;
  p1_q2: boolean;
  p1_q3: boolean;
  p1_q4: boolean;
  p1_q5: boolean;
  p1_q6: boolean;
  p1_q7: boolean;
  p2_q1: boolean;
  p2_q2: boolean;
  p2_q3: boolean;
  p2_q4: boolean;
  p2_q5: boolean;
  p2_q6: boolean;
  p2_q7: boolean;
  p1_w: boolean;
  p2_w: boolean;
  topic: string;
  player2: string;
}

const Winner: FC = () => {
  var player;
  const firestore = useFirestore();
  const { id } = useParams();
  const roomRef = firestore.collection("rooms").doc(id);
  const room: Room = useFirestoreDocData(roomRef);
  const history = useHistory();
  if (!room.topic) {
    window.alert("This room has been deleted");
    history.push("/");
  }
  const auth = useAuth();
  if (auth.currentUser?.uid === room.player1) {
    player = 1;
  } else player = 2;
  if (player)
    firestore
      .collection("rooms")
      .doc(id)
      .update({ [`p${player}_w`]: true });
  const getWinner = () => {
    var winner;
    if (
      room.p1_q1 === true &&
      room.p2_q1 &&
      room.p1_q2 === true &&
      room.p2_q2 &&
      room.p1_q3 === true &&
      room.p2_q3 &&
      room.p1_q4 === true &&
      room.p2_q4 &&
      room.p1_q5 === true &&
      room.p2_q5 &&
      room.p1_q6 === true &&
      room.p2_q6 &&
      room.p1_q7 === true &&
      room.p2_q7 &&
      room.p1_w &&
      room.p2_w
    ) {
      if (room.player1_score > room.player2_score)
        winner = { name: room.player1_name, image: room.player1_url };
      else if (room.player2_score > room.player1_score)
        winner = { name: room.player2_name, image: room.player2_url };
      else winner = { name: "Tie!!" };
    } else winner = { name: "Results not Declared" };
    return winner;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#100e17",
        flexDirection: "column",
      }}
    >
      <span className={styles.text} style={{ padding: "10px" }}>
        Winner:
      </span>
      <span className={styles.text} style={{ padding: "10px" }}>
        {getWinner().name}
      </span>
      {getWinner().image && (
        <img
          src={getWinner().image}
          alt="Profile"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            padding: "10px",
            display: "block",
          }}
        />
      )}
      {getWinner().name !== "Tie!!" &&
        getWinner().name !== "Results not Declared" && (
          <span className={styles.text} style={{ padding: "10px" }}>
            {room.player1_score} - {room.player2_score}
          </span>
        )}
      <button
        className={styles.btngrad}
        onClick={() => {
          history.push("/");
        }}
      >
        Close Room
      </button>
    </div>
  );
};

export default Winner;
