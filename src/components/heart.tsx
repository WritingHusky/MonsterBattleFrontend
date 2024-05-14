import axios from "axios";
import { useState } from "react";

/*
This is the component that will handle the heart beat between the user and the server
The 
*/
const heart = () => {
  const [heartbeatConnectId, setHeartbeatConnectId] = useState<number>();
  var userId: any;
  const [heartbeatBatttleId, setHeartbeatBatttleId] = useState<number>();
  var battleId: any;
  const running = false;

  const connectTime = 20;
  const battleTime = 5;

  const startConnectBeating = (new_userId: any) => {
    if (!running) {
      // console.log("Heart beat stopped");
      return;
    }
    userId = new_userId;
    setHeartbeatConnectId(setInterval(sendPingToConnect, 1000 * connectTime)); // Figure out timeout
  };

  const checkConnectHeartBeating = () => {
    if (!running) {
      // console.log("Heart beat stopped");
      return;
    }
    return heartbeatConnectId ? true : false;
  };

  const stopConnectBeating = () => {
    if (!running) {
      // console.log("Heart beat stopped");
      return;
    }
    if (!heartbeatConnectId) {
      return;
    }
    // console.log("cleraed Interval");
    clearInterval(heartbeatConnectId);
    setHeartbeatConnectId(Number.NaN);
  };

  // Send A ping to the battle controller every one second
  const startBattleBeating = (new_battleId: any) => {
    if (!running) {
      // console.log("Heart beat stopped");
      return;
    }
    battleId = new_battleId;
    setHeartbeatBatttleId(setInterval(sendPingToBattle, 1000 * battleTime));
  };

  const stopBattleBeating = () => {
    if (!running) {
      // console.log("Heart beat stopped");
      return;
    }
    if (!heartbeatBatttleId) {
      return;
    }
    clearInterval(heartbeatBatttleId);
    setHeartbeatBatttleId(Number.NaN);
  };

  const halt = () => {
    // console.log("Halting");
    stopBattleBeating();
    stopConnectBeating();
  };

  const sendPingToConnect = async () => {
    await axios
      .post(
        "http://localhost:8080/api/connect/ping",
        JSON.stringify({ userId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log("Connect Ping: ", res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
          // halt(); // Should continue to try to connect to the api continually
          //If there is an error (status code > 2xx)
          if (error.response.status == 401) {
            //Handle the 401 (Unauthorized)
          } else if (
            error.response.status == 500 ||
            error.response.status == 422
          ) {
            //Handle the 500 & 422 Error (Something else went wrong)
            console.error(error.response.data);
          }
        }
      });
  };

  const sendPingToBattle = async () => {
    await axios
      .post(
        "http://localhost:8080/api/battle/ping",
        JSON.stringify({ battleId }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log("Battle Ping: ", res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
          // halt(); // Should continue to try to connect to the api continually
          //If there is an error (status code > 2xx)
          if (error.response.status == 401) {
            //Handle the 401 (Unauthorized)
          } else if (
            error.response.status == 500 ||
            error.response.status == 422
          ) {
            //Handle the 500 & 422 Error (Something else went wrong)
            console.error(error.response.data);
          }
        }
      });
  };

  return {
    startConnectBeating,
    checkConnectHeartBeating,
    stopConnectBeating,
    halt,
    startBattleBeating,
    stopBattleBeating,
  };
};

export default heart;
