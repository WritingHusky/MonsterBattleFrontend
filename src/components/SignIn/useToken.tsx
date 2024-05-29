import { useState } from "react";

const useToken = () => {
	const getuserToken = () => {
		const userToken = sessionStorage.getItem("userToken");
		if (!userToken) {
			return;
		}
		return JSON.parse(userToken) as string;
	};

	const [userToken, setUserToken] = useState(getuserToken());

	const saveUserToken = (UserToken: { userId: string }) => {
		sessionStorage.setItem("userToken", JSON.stringify(UserToken));
		setUserToken(userToken);
	};

	const removeUserToken = () => {
		sessionStorage.removeItem("userToken");
	};

	return {
		userToken,
		setUserToken: saveUserToken,
		removeUserToken: removeUserToken,
		getuserToken: getuserToken,
	};
};

export default useToken;
