import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { useMoralis, MoralisProvider } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

const Root = () => {
  const history = useHistory();
  const { authenticate, isAuthenticated } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/dashboard");

      window.location.reload();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return null;

  return (
    <>
      <div className="flex w-screen h-screen items-center justify-center">
        <button
          onClick={authenticate}
          className="bg-yellow-300 px-8 py-5 rounded-xl text-lg animate-pulse"
        >
          Login using MetaMask
        </button>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MoralisProvider
      appId="Hhs8wYUasGdYMXyF1UQi8GgjKYMSOeflsQ0rFlKi"
      serverUrl="https://jt6yv7snxr06.usemoralis.com:2053/server"
    >
      <Router>
        <Switch>
          <Route path="/dashboard">
            <App />
          </Route>
          <Route path="/">
            <Root />
          </Route>
        </Switch>
      </Router>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
