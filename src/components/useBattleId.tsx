import { useState } from "react";

const BattleId = () => {
  const getBattleId = () => {
    const BattleId = sessionStorage.getItem("battleId");
    if (!BattleId) {
      return;
    }
    return JSON.parse(BattleId);
  };

  const [battleId, setbattleId] = useState(getBattleId());

  const saveBattleId = (battleId: string) => {
    sessionStorage.setItem("battleId", JSON.stringify(battleId));
    setbattleId(battleId);
  };

  const removeBattleId = () => {
    sessionStorage.removeItem("battleId");
    // Might want to add hanlding to tell server to remove battle from list
  };

  return {
    battleId,
    setBattleId: saveBattleId,
    removeBattleId,
    getBattleId,
  };
};

export default BattleId;
