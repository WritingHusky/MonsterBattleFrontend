import axios from "axios";
import { useState } from "react";

interface SignInProps {
  setUserToken: (UserToken: { userId: string }) => void;
  setWindow: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setUserName: (username: string) => void;
  setPassword: (password: string) => void;
}

const SignInWindow = ({
  setUserToken: setUserToken,
  setWindow: setWindow,
  setPage: setPage,
  setUserName: setUserName,
  setPassword: setPassWord,
}: SignInProps) => {
  const [loginUsername, setLoginUserName] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const username = loginUsername;
    await axios
      .post(
        "http://localhost:8080/api/connect/signIn",
        JSON.stringify({ username, password }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        setUserToken(res.data);
        // console.log("setting to main page"); // Debugging
        setUserName(loginUsername);
        setPassWord(password);
        setPage("Main");
      }) //If every thing is good
      // Looking to recieve a JSON object of the format: { "userID": "..."}
      .catch((error) => {
        if (error.response) {
          //If there is an error (status code > 2xx)
          if (error.response.status == 401) {
            //Handle the 401 (Unauthorized)
            setValid("UnAuth");
          } else if (error.response.status == 422) {
            setValid("Empty");
          } else if (error.response.status == 500) {
            //Handle the 500 & 422 Error (Something else went wrong)
            setValid("Internal");
            console.log(error.response.data); // Remove to clear console
          }
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {valid === "UnAuth" && (
            <p style={{ color: "red" }}>*Invalid username / Password</p>
          )}
          {valid === "Internal" && (
            <p style={{ color: "gray" }}>
              *Something has Happend on the server
            </p>
          )}
          {valid === "Empty" && (
            <p style={{ color: "Red" }}>*Please Enter Values</p>
          )}
          <label>
            <p>Username</p>
            <input
              type="text"
              onChange={(e) => setLoginUserName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <p>Password</p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div
          className="d-flex flex-row-reverse justify-content-between"
          style={{ marginTop: "10px" }}
        >
          <button className="btn btn-primary" type="submit" style={{}}>
            SignIn
          </button>
          <button
            className="btn btn-secondary"
            onClick={(event) => {
              event.preventDefault();
              setWindow("SignUp");
            }}
          >
            SignUp
          </button>
        </div>
      </form>
    </>
  );
};

export default SignInWindow;
