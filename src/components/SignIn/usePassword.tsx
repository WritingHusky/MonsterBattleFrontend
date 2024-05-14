import { useState } from "react";

const password = () => {
  const getPassword = () => {
    const Password = sessionStorage.getItem("password");
    if (!Password) {
      return;
    }
    return JSON.parse(Password);
  };

  const [password, setPassword] = useState(getPassword());

  const savePassword = (password: string) => {
    sessionStorage.setItem("password", JSON.stringify(password));
    setPassword(password);
  };

  const removePassword = () => {
    sessionStorage.removeItem("password");
  };

  return {
    password,
    setPassword: savePassword,
    removePassword,
    getPassword,
  };
};

export default password;
