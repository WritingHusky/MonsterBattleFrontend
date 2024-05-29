/*
This component will just handle the updates to the battleField
*/

import { useEffect } from "react";

interface BattleFieldProps {
	background: string; // The url of the background image??
	children: React.ReactNode; // This will be the monsters that are fighting
	battleInfo: battlefieldInfo | undefined;
}
/**
 * This component will handle all the background updates and changes to the battlefield
 * @param param0
 * @returns
 */
const BattleField = ({
	background,
	children,
	battleInfo,
}: BattleFieldProps) => {
	//When the battleInfo changes
	useEffect(() => {}, [battleInfo]);

	return <div style={{ backgroundImage: background }}>{children}</div>;
};

export default BattleField;
