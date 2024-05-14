const Opponents = () => {
  const opponents: Opponent[] = [];
  opponents[0] = {
    name: "Random",
    description: "Choses a random move each time",
    powerlevel: "Easy",
  };
  return { opponents };
};

export default Opponents;
