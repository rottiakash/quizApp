import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { FirebaseAppProvider } from "reactfire";
const firebaseConfig = {
  apiKey: "AIzaSyA0SfRaGwvI_iPMD5TQjdv0b34O9_fJWAk",
  authDomain: "quizapp-fdb5a.firebaseapp.com",
  databaseURL: "https://quizapp-fdb5a.firebaseio.com",
  projectId: "quizapp-fdb5a",
  storageBucket: "quizapp-fdb5a.appspot.com",
  messagingSenderId: "659495845309",
  appId: "1:659495845309:web:34ffdb332dfc5a2b8166d4",
  measurementId: "G-HLTR2TDWD6",
};
ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <App />
      </Suspense>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
