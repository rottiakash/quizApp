import React, { FC } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { useAuth } from "reactfire";

import styles from "./Login.module.css";
import GoogleButton from "react-google-button";
export interface LoginProps {}

const LoginPage: FC<LoginProps> = () => {
  const auth = useAuth();
  return (
    <div className={styles.logincontainer}>
      <span className={styles.text}>QuizApp</span>

      <GoogleButton
        style={{ width: "fit", padding: "2px" }}
        className={styles.button}
        onClick={() =>
          auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
        }
      />
    </div>
  );
};

export default LoginPage;
