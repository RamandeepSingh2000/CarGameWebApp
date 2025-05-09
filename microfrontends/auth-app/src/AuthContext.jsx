import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [playerId, setPlayerId] = useState(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser)); // Load user from localStorage
			} catch (error) {
				console.error("Failed to parse stored user data:", error);
				localStorage.removeItem("user");
			}
		}
		const storedPlayerInfo = localStorage.getItem("playerId");
		if (storedPlayerInfo) {
			setPlayerId(JSON.parse(storedPlayerInfo)); // Load user from localStorage
		}

	}, []);

	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData)); // Store whole user object
	};

	const logout = () => {
		setUser(null);
		setPlayerId(null);
		localStorage.removeItem("user");
		localStorage.removeItem("playerId");
	};

	const setPlayerInfo = (id) => {
		setPlayerId(id);
		localStorage.setItem("playerId", JSON.stringify(id)); // Store whole user object
	};	

	return (
		<AuthContext.Provider value={{ user, login, logout, playerId, setPlayerInfo }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
