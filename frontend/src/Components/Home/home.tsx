import React, { FC, Suspense, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import Loader from "../../Modules/Loader/Loader";
import LoadingOverlay from "react-loading-overlay";
import UserProfile from "../../Modules/UserProfile/UserProfile";
import styles from "./home.module.css";
const axios = require("axios").default;
var qs = require("qs");
export interface HomeProps {}

const HomePage: FC<HomeProps> = () => {
  const [isActive, setIsActive] = useState(false);
  const auth = useAuth();
  var token: string;
  const history = useHistory();
  auth.currentUser?.getIdToken().then((idToken) => (token = idToken));
  const [code, setCode] = useState<string>("");
  return (
    <LoadingOverlay active={isActive} spinner text="Loading your content...">
      <div className={styles.homecontainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100vw",
          }}
        >
          <span className={styles.name}>
            Welcome, {auth.currentUser?.displayName}
          </span>
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
            }}
          >
            <UserProfile />
          </div>
        </div>
        <hr
          style={{
            width: "100vw",
          }}
        />
        <section>
          <span className={styles.subHeading}>Topics</span>
          <div
            className={styles.cardList}
            style={{
              display: "flex",
              width: "100vw",
              overflowX: "scroll",
            }}
          >
            <Topics setIsActive={setIsActive} />
          </div>
        </section>
        <hr
          style={{
            width: "100vw",
          }}
        />
        <section>
          <span className={styles.subHeading}>Join Room</span>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <input
              type="text"
              value={code}
              placeholder="Enter Room Code"
              style={{
                border: "1px solid teal",
              }}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              style={{ marginLeft: "20px" }}
              className={styles.btngrad}
              onClick={() => {
                (async () => {
                  setIsActive(true);
                  var payload = qs.stringify({
                    room: code,
                    url: auth.currentUser?.photoURL,
                    name: auth.currentUser?.displayName,
                  });
                  var config = {
                    method: "post",
                    url:
                      "https://us-central1-quizapp-fdb5a.cloudfunctions.net/logic/joinroom",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: payload,
                  };
                  var response = await axios(config);
                  history.push(`/lobby/${response.data.roomid}`);
                })();
              }}
            >
              Join
            </button>
          </div>
        </section>
      </div>
    </LoadingOverlay>
  );
};
interface Data {
  id: string;
  name: string;
}

interface TopicsProps {
  setIsActive: any;
}

const Topics: FC<TopicsProps> = ({ setIsActive }) => {
  const history = useHistory();
  const auth = useAuth();
  const topicRef = useFirestore().collection("topics").limit(10);
  const topics: Array<Data> = useFirestoreCollectionData(topicRef);
  var token: string;
  useAuth()
    .currentUser?.getIdToken()
    .then((idToken) => (token = idToken));
  return (
    <Suspense fallback={<Loader />}>
      {topics.map((data) => (
        <article
          className={styles.article}
          key={data.id}
          onClick={() => {
            (async () => {
              setIsActive(true);
              var payload = qs.stringify({
                topic: data.id,
                url: auth.currentUser?.photoURL,
                name: auth.currentUser?.displayName,
              });
              var config = {
                method: "post",
                url:
                  "https://us-central1-quizapp-fdb5a.cloudfunctions.net/logic/createroom",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                data: payload,
              };
              var response = await axios(config);
              history.push(`/lobby/${response.data.roomid}`);
            })();
          }}
        >
          <span className={styles.cardHeader}>{data.name}</span>
        </article>
      ))}
      <article
        className={styles.article}
        onClick={() => history.push("/view_all")}
      >
        <span className={styles.cardHeader}>View All</span>
      </article>
    </Suspense>
  );
};

export default HomePage;
