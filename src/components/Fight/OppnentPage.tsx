import Opponents from "./opponents";

interface opponentProps {
  setWindow: React.Dispatch<React.SetStateAction<string>>;
  setOpponent: React.Dispatch<React.SetStateAction<string>>;
}
const OppnentPage = ({ setWindow, setOpponent }: opponentProps) => {
  const { opponents } = Opponents();

  return (
    <div className="d-flex flex-column" style={{ marginTop: "50px" }}>
      {opponents.map((opponent, index) => (
        <div
          className="w-100 h-100 d-flex flex-column align-items-center"
          style={{ margin: "10px" }}
          key={index}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setWindow("Rules");
              setOpponent(opponent.name);
            }}
            className="rounded"
            style={{ width: "75%", height: "10rem" }}
          >
            <div>Name: {opponent.name}</div>
            <div>Description: {opponent.description}</div>
            <div>Powerlevel: {opponent.powerlevel}</div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default OppnentPage;
