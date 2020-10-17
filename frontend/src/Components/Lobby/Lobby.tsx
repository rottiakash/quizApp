import React, { FC } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData } from "reactfire";
import styles from "./Lobby.module.css";
export interface Room {
  questions: Array<string>;
  player1: string;
  player1_url: string;
  player1_name: string;
  player2_url: string;
  player2_name: string;
  topic: string;
  player2: string;
}
const Lobby: FC = () => {
  let { id } = useParams();
  const history = useHistory();
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
          onClick={() => history.goBack()}
          style={{
            width: "50px",
            height: "50px",
            marginLeft: "10px",
            marginTop: "10px",
            paddingTop: "5px",
            cursor: "pointer",
          }}
        />
        <span className={styles.name}>Room {id}</span>
      </div>
      {!room.player2 && (
        <span className={styles.subtext}>Waiting for Player</span>
      )}
      {room.player2 && (
        <button
          className={styles.btngrad}
          onClick={() => history.push(`/quiz/${id}/1`)}
        >
          Ready!
        </button>
      )}
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
              style={{
                fontSize: "1rem",
                marginLeft: "5px",
                paddingTop: "15px",
              }}
            >
              {room.player1_name}
            </span>
          </div>
        </div>
        <div style={{ color: "white", padding: "20px" }}>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontSize: "1rem",
                marginRight: "5px",
                paddingTop: "15px",
              }}
            >
              {room.player2 ? room.player2_name : "Waiting...."}
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

export default Lobby;
