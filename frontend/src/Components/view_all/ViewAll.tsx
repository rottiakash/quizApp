import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import TopicList from "../../Modules/TopicList/TopicList";
import UserProfile from "../../Modules/UserProfile/UserProfile";
import styles from "./ViewAll.module.css";
const ViewAll: FC = () => {
  const history = useHistory();
  return (
    <div
      style={{
        backgroundColor: "#100e17",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "#100e17",
          flexDirection: "column",
        }}
      >
        <section style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <img
                src="https://cdn2.iconfinder.com/data/icons/gradient-purple-navigation-and-transactional-for-w/40/back-purp-512.png"
                alt="back"
                onClick={() => history.goBack()}
                style={{
                  width: "50px",
                  height: "50px",
                  marginLeft: "10px",
                  marginTop: "5px",
                  cursor: "pointer",
                }}
              />
              <span className={styles.subHeading}>All Topics</span>
            </div>
            <div style={{ marginTop: "5px" }}>
              <UserProfile />
            </div>
          </div>
        </section>
        <hr
          style={{
            width: "100vw",
          }}
        />
        <section>
          <TopicList />
        </section>
      </div>
    </div>
  );
};

export default ViewAll;
