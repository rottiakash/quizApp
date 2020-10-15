import React, { FC, Suspense } from "react";
import { useHistory } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import Loader from "../../Modules/Loader/Loader";
import UserProfile from "../../Modules/UserProfile/UserProfile";
import styles from "./home.module.css";
export interface HomeProps {}

const HomePage: FC<HomeProps> = () => {
  const auth = useAuth();
  return (
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
          style={{ display: "flex", padding: "20px", flexDirection: "column" }}
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
          <Topics />
        </div>
      </section>
    </div>
  );
};
interface Data {
  id: string;
  name: string;
}
const Topics: FC = () => {
  const history = useHistory();
  const topicRef = useFirestore().collection("topics").limit(10);
  const topics: Array<Data> = useFirestoreCollectionData(topicRef);
  return (
    <Suspense fallback={<Loader />}>
      {topics.map((data) => (
        <article className={styles.article} key={data.id}>
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
