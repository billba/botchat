import React, { useCallback, useEffect, useState } from "react";
import ReactWebChat, {
  createDirectLine,
  createStore
} from "botframework-webchat";

import "./App.css";
import Timer from "./Timer";

const TIME_INTERVAL = 10000;

function App() {
  const [directLine, setDirectLine] = useState(createDirectLine({}));
  const [store, setStore] = useState();
  const [timeRemaining, setTimeRemaining] = useState();

  const initConversation = useCallback(() => {
    setStore(
      createStore({}, ({ dispatch }) => next => action => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: { language: window.navigator.language }
            }
          });
        }
        if (action.type === "WEB_CHAT/SUBMIT_SEND_BOX") {
          setTimeRemaining(TIME_INTERVAL);
        }
        return next(action);
      })
    );

    (async function() {
      // In this demo, we are using Direct Line token from MockBot.
      // Your client code must provide either a secret or a token to talk to your bot.
      // Tokens are more secure. To learn about the differences between secrets and tokens
      // and to understand the risks associated with using secrets, visit https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication?view=azure-bot-service-4.0
      const res = await fetch(
        "https://webchat-mockbot.azurewebsites.net/directline/token",
        { method: "POST" }
      );
      const { token } = await res.json();

      setDirectLine(createDirectLine({ token }));
    })().catch(error => console.log(error));
  }, [setStore, setDirectLine, setTimeRemaining]);

  const restartConversation = useCallback(() => {
    alert("Restarting Conversation");
    initConversation();
  }, [initConversation]);

  useEffect(() => {
    initConversation();
  }, []);

  return (
    <div className="App">
      <Timer
        ms={timeRemaining}
        onComplete={restartConversation}
        setTimeRemaining={setTimeRemaining}
      />
      <ReactWebChat className="chat" directLine={directLine} store={store} />
    </div>
  );
}

export default App;
