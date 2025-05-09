import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./playerLogin.css";

const REGISTER = gql`
	mutation Register(
		$username: String!
		$email: String!
		$password: String!
		$role: String!
	) {
		register(
			username: $username
			email: $email
			password: $password
			role: $role
		) {
			id
			username
			email
			role
		}
	}
`;

const LOGIN = gql`
	mutation Login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
			email
			role
		}
	}
`;

const LOGOUT = gql`
	mutation Logout {
		logout
	}
`;

const CREATE_GAME_PROGRESS = gql`
	mutation CreateGameProgress(
		$userId: ID!
		$experiencePoints: Int
		$score: Int
		$progress: String
		$lastPlayed: String
	) {
		createGameProgress(
			userId: $userId
			experiencePoints: $experiencePoints
			score: $score
			progress: $progress
			lastPlayed: $lastPlayed
		) {
			id
			userId
			experiencePoints
			score
			progress
			lastPlayed
		}
	}
`;

function PlayerLogin({ isLoggedIn, userData, gameProgressClient }) {
	const [isRegister, setIsRegister] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [role, setRole] = useState("Player");
	const [username, setUsername] = useState("");

	const [register] = useMutation(REGISTER);
	const [loginMutation] = useMutation(LOGIN);
	const [logoutMutation] = useMutation(LOGOUT);
	const [createGameProgress] = useMutation(CREATE_GAME_PROGRESS, {
		client: gameProgressClient,
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let user;
			if (isRegister) {
				if (password !== repeatPassword) {
					alert("Passwords do not match");
					return;
				}
				const { data } = await register({
					variables: { username, email, password, role },
				});
				console.log("📝 Register response:", data);
				user = data.register;
				if (!user) {
					throw new Error("Registration failed: No user data returned");
				}

				// Automatically log in after registration
				const { data: loginData } = await loginMutation({
					variables: { username, password },
				});
				console.log("🔑 Auto-login response:", loginData);
				user = loginData.login;
				if (!user) {
					throw new Error("Auto-login failed: No user data returned");
				}

				// Only create GameProgress on registration
				try {
					const { data: gameProgressData } = await createGameProgress({
						variables: {
							userId: user.id,
							experiencePoints: 0,
							score: 0,
							progress: "Not started",
							lastPlayed: new Date().toISOString(),
						},
					});
					console.log("🎮 Game progress created:", gameProgressData);
				} catch (gameError) {
					console.error(
						"❌ Failed to create game progress:",
						gameError.message
					);
					// Don’t block registration, but log the failure
				}

				// alert("Registered successfully!");
			} else {
				const { data } = await loginMutation({
					variables: { username, password },
				});
				console.log("🔑 Login response:", data);
				user = data.login;
				if (!user) {
					throw new Error("Login failed: No user data returned");
				}
				// alert("Logged in successfully!");
			}

			// Dispatch login event for both register and login
			if (user) {
				console.log("👤 User authenticated:", user);
				window.dispatchEvent(
					new CustomEvent("loginSuccess", {
						detail: { isLoggedIn: true, userData: user },
					})
				);
			}

			setEmail("");
			setPassword("");
			setRepeatPassword("");
			setUsername("");
		} catch (error) {
			console.error("❌ Auth error:", error);
			// alert(`Authentication error: ${error.message}`);
		}
	};

	const handleLogout = async () => {
		try {
			await logoutMutation();
			setIsRegister(false);
			setUsername("");
			setEmail("");
			setPassword("");
			setRepeatPassword("");
			window.dispatchEvent(
				new CustomEvent("logoutSuccess", {
					detail: { isLoggedIn: false, userData: null },
				})
			);
		} catch (err) {
			console.error("Logout failed:", err.message);
		}
	};

	if (isLoggedIn) {
		return (
			<div className="auth-form">
				<div>
					<p>Welcome, {userData.username}!</p>
					<button onClick={handleLogout}>Logout</button>
				</div>
			</div>
		);
	}

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h3>{isRegister ? "Register" : "Login"}</h3>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			{isRegister && (
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			)}
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			{isRegister && (
				<>
					<input
						type="password"
						placeholder="Repeat Password"
						value={repeatPassword}
						onChange={(e) => setRepeatPassword(e.target.value)} // Fixed from setPassword
						required
					/>
					{/* <div>
						<label>
							<input
								type="radio"
								value="Player"
								checked={role === "Player"}
								onChange={(e) => setRole(e.target.value)}
							/>
							Player
						</label>
						<label>
							<input
								type="radio"
								value="Admin"
								checked={role === "Admin"}
								onChange={(e) => setRole(e.target.value)}
							/>
							Admin
						</label>
					</div> */}
				</>
			)}
			<button type="submit">{isRegister ? "Register" : "Login"}</button>
			<p onClick={() => setIsRegister(!isRegister)} className="toggle-auth">
				{isRegister
					? "Already have an account? Login"
					: "Need an account? Register"}
			</p>
		</form>
	);
}

export default PlayerLogin;
