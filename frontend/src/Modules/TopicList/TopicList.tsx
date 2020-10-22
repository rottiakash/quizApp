import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import styles from "./TopicList.module.css";
const axios = require("axios").default;
var qs = require("qs");
interface Data {
  id: string;
  name: string;
}

interface TopicListProps {
  setIsActive: any;
}

const TopicList: FC<TopicListProps> = ({ setIsActive }) => {
  const auth = useAuth();
  const history = useHistory();
  var token: string;
  const topicRef = useFirestore().collection("topics");
  const topics: Array<Data> = useFirestoreCollectionData(topicRef);
  auth.currentUser?.getIdToken().then((idToken) => (token = idToken));

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {topics.map((data) => (
        <div
          style={{ cursor: "pointer" }}
          className={styles.card}
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
          {data.name}
        </div>
      ))}
    </div>
  );
};

export default TopicList;
