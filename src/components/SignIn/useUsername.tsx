import { useState } from "react";

const usename = () => {
  const getUsername = () => {
    const Username = sessionStorage.getItem("username");
    if (!Username) {
      return;
    }
    return JSON.parse(Username);
  };

  const [username, setUsername] = useState(getUsername());

  const saveUsername = (username: string) => {
    sessionStorage.setItem("username", JSON.stringify(username));
    setUsername(username);
  };

  const removeUsername = () => {
    sessionStorage.removeItem("username");
  };

  return {
    username,
    setUsername: saveUsername,
    removeUsername: removeUsername,
    getUsername: getUsername,
  };
};

export default usename;
