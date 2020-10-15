import React, { FC } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import styles from "./TopicList.module.css";

interface Data {
  id: string;
  name: string;
}

const TopicList: FC = () => {
  const topicRef = useFirestore().collection("topics");
  const topics: Array<Data> = useFirestoreCollectionData(topicRef);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {topics.map((data) => (
        <div className={styles.card} key={data.id}>
          {data.name}
        </div>
      ))}
    </div>
  );
};

export default TopicList;
