const RuleSet = () => {
  const ruleSets: Rules[] = [];
  ruleSets[0] = {
    name: "Basic Random",
    teamCount: 2,
    activeMon: 2,
    totalMonCount: 12,
    version: 1,
  };
  return { ruleSet: ruleSets };
};

export default RuleSet;
