import axios from "axios";
interface logOutProps {
  username: string;
  password: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const handleLogOut = ({ username, password, setPage }: logOutProps) => {
  // console.log("logging Out");
  axios
    .post(
      "http://localhost:8080/api/connect/logOut",
      JSON.stringify({ username, password }),
      { headers: { "Content-Type": "application/json" } }
    )
    .then(() => {
      // console.log(res);
      setPage("Login");
    }) //If every thing is good
    // Looking to recieve a JSON object of the format: { "userID": "..."}
    .catch((error) => {
      if (error.response) {
        //If there is an error (status code > 2xx)
        if (error.response.status == 401) {
          //Handle the 401 (Unauthorized)
        } else if (
          error.response.status == 500 ||
          error.response.status == 422
        ) {
          //Handle the 500 & 422 Error (Something else went wrong)
          console.log(error.response.data);
        }
      }
    });
};

export default handleLogOut;
