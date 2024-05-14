import RuleSet from "./RuleSets";

interface opponentProps {
  setWindow: React.Dispatch<React.SetStateAction<string>>;
  setRules: React.Dispatch<React.SetStateAction<Rules | undefined>>;
}
const RulesPage = ({ setWindow, setRules }: opponentProps) => {
  const { ruleSet } = RuleSet();

  return (
    <div className="d-flex flex-column" style={{ marginTop: "50px" }}>
      {ruleSet.map((rules, index) => (
        <div
          className="w-100 h-100 d-flex flex-column align-items-center"
          style={{ margin: "10px" }}
          key={index}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setWindow("SetUp");
              setRules(rules);
            }}
            className="rounded"
            style={{ width: "75%", height: "10rem" }}
          >
            <div>Name: {rules.name}</div>
            <div>TeamCount: {rules.teamCount}</div>
            <div>ActiveMon: {rules.activeMon}</div>
            <div>TotalMonCount: {rules.totalMonCount}</div>
            <div>Version: {rules.version}</div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default RulesPage;
