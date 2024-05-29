// Main API URL
export const API_URL = "http://localhost:8080/api";

// Controllers
export const BATTLE_URL = `${API_URL}/battle`;
export const CONNECT_URL = `${API_URL}/connect`;
export const USER_URL = `${API_URL}/user`;
export const TEAM_URL = `${API_URL}/team`;
export const MONSTER_URL = `${API_URL}/monster`;

// Team endpoints
export const REQUEST_URL = `${TEAM_URL}/request`;
export const UPDATE_URL = `${TEAM_URL}/update`;
export const CREATE_URL = `${TEAM_URL}/create`;

// Monster endpoints
export const COUNT_URL = `${MONSTER_URL}/count`;
export const PING_URL = `${BATTLE_URL}/ping`;
export const RETRIEVE_URL = `${MONSTER_URL}/retrieve`;

// Battle endpoints
export const REMOVE_URL = `${BATTLE_URL}/removeBattle`;
export const RETRIEVE_TIP_URL = `${BATTLE_URL}/retrieveTIP`;
export const PING_BATTLE_URL = `${BATTLE_URL}/ping`;
export const GET_LOG_URL = `${BATTLE_URL}/getLog`;
export const SEND_MOVE_URL = `${BATTLE_URL}/sendMove`;

// Connect endpoints
export const PING_CONNECT_URL = `${CONNECT_URL}/ping`;
export const LOG_OUT_URL = `${CONNECT_URL}/logOut`;
export const SIGN_UP_URL = `${CONNECT_URL}/signUp`;
export const SIGN_IN_URL = `${CONNECT_URL}/signIn`;
