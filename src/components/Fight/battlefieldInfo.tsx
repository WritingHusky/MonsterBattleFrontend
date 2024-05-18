interface battlefieldInfo {
	monCountTotal: number;
	teamCount: number;
	monInTeam: number;
	activeMon: number;
	turnCount: number;

	monsters: monsterInfo[];
	monSlots: string[];
	monsterTurnInfoArray: MonsterTurnInfo[];

	turnDisplayList: {
		displayList: TurnDisplayElement[];
	};

	moveOverrides: number[];

	weather: string;
	terrain: string;
	state: string;
}

interface monsterInfo {
	name: string;
	currentHp: number;
	maxHp: number;
	dexID: number;
	monsterCode: string;
	status: string;
	statusTimer: number;
	isDead: boolean;
	team: number;
	position: string;
	stats: number[];
	level: number;
	type: string;
	slot: string;
	moves: MonsterMove[];
	generatedStats: statBlock;
	statusEffectedStats: statBlock;
	beyondEffectedStats: statBlock;
}

interface statBlock {
	hp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	speed: number;
}

interface MonsterMoveEffect {
	trigger: string;
	failedTriggerMSG: string;
	resultCode: string;
	effectValue: string;
	attackType: string;
	moveType: string;
}

interface MonsterMove {
	moveEffects: MonsterMoveEffect[];
	moveName: string;
	priority: number;
	accuracy: number;
	power: number;
	typing: string;
	source: string;
	target: string;
}

interface MonsterTurnInfo {
	preMoveEffects: any[]; // Assuming this could be of various types
	move: MonsterMove;
	endMoveEffects: any[]; // Assuming this could be of various types
}

interface TurnDisplayElement {
	message: string;
	messageType: string;
	/*
	types:
		Turn Header
		Context / Message Header
		Context / Message
		Move Header
		Effect
		Post Effect
		Ability

	*/
}

interface messageElement {
	type: string; // Denotes the type of message
	/*
	types:
		Context / Message Header
		Context / Message
		Move Header
		Effect
		Post Effect
		Ability

	*/
	message: string; // The actual message
}

interface TurnLogEntry {
	messageType: string;
	message: string;
}

interface TurnLog {
	TurnLog: TurnLogEntry[];
}
