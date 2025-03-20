import { router } from "expo-router";
import { apiUrl } from "./index";
import Toast from "react-native-toast-message";
import { authenticated } from "../store/slices/userSlice";
export const registerRequest = async (dataToSend, dispatch, setLoadingRegister, setIsLogin) => {
	setLoadingRegister(true);
	console.log("dataToSend", dataToSend);
	try {
		const response = await fetch(`${apiUrl}auth/register`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(dataToSend),
		});
		const data = await response.json();
		console.log("data", data);
		setLoadingRegister(false);
		if (data.code === 200) {
			Toast.show({
				type: "success",
				text1: "Inscription réussie",
				text2: "Vous pouvez maintenant vous connecter",
			});
			setIsLogin(true);
		} else {
			Toast.show({
				type: "error",
				text1: "Erreur lors de l'inscription",
				text2: data.message,
			});
		}
		return data;
	} catch (error) {
		console.log("error", error);
		setLoadingRegister(false);
	}
};

export const loginRequest = async (dataToSend, dispatch, setLoadingLogin) => {
	setLoadingLogin(true);
	console.log("dataToSend", dataToSend);
	try {
		const response = await fetch(`${apiUrl}auth/login`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(dataToSend),
		});
		const data = await response.json();
		console.log("data", data);
		setLoadingLogin(false);
		if (data.code === 200) {
			dispatch(authenticated({ token: data.token, user: data.user }));
			Toast.show({
				type: "success",
				text1: "Connexion réussie",
				text2: "Vous pouvez maintenant accéder à votre compte",
			});
			if (data.user.role === "employer") {
				router.push("../../pro/(tabs)");
			  } else {
				router.push("../../candidat/(tabs)");
			  }
		} else {
			Toast.show({
				type: "error",
				text1: "Erreur lors de la connexion",
				text2: data.message,
			});
		}
		return data;
	} catch (error) {
		console.log("error", error);
		setLoadingLogin(false);
	}
};

export const forgotPasswordRequest = async (dataToSend, setLoadingForgotPassword, setStep, setEmail) => {
	setLoadingForgotPassword(true);
	console.log("dataToSend", dataToSend);
	try {
		const response = await fetch(`${apiUrl}auth/forgot-password`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(dataToSend),
		});
		const data = await response.json();
		console.log("data", data);
		setLoadingForgotPassword(false);
		if (data.code === 200) {
			setEmail(dataToSend.email);
			setStep(2);
			Toast.show({
				type: "success",
				text1: "Email envoyé",
				text2: "Vous recevrez un email pour réinitialiser votre mot de passe",
			});
		}else{
			Toast.show({
				type: "error",
				text1: "Erreur lors de l'envoi de l'email",
				text2: data.message,
			});
		}
	} catch (error) {
		console.log("error", error);
		setLoadingForgotPassword(false);
	}
}

export const verifyOtpRequest = async (dataToSend, setLoadingOtp, setStep) => {
	setLoadingOtp(true);
	console.log("dataToSend", dataToSend);
	try {
		const response = await fetch(`${apiUrl}auth/verify-otp`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(dataToSend),
		});
		const data = await response.json();
		console.log("data", data);
		setLoadingOtp(false);
		if (data.code === 200) {
			Toast.show({
				type: "success",
				text1: "OTP vérifié",
				text2: "Vous pouvez maintenant réinitialiser votre mot de passe",
			});
			setStep(3);
		} else {
			Toast.show({
				type: "error",
				text1: "Erreur lors de la vérification du OTP",
				text2: data.message,
			});
		}
	} catch (error) {
		console.log("error", error);
		setLoadingOtp(false);
	}
}

export const resetPasswordRequest = async (dataToSend, setLoadingResetPassword, setStep) => {
	setLoadingResetPassword(true);
	console.log("dataToSend", dataToSend);
	try {
		const response = await fetch(`${apiUrl}auth/reset-password`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(dataToSend),
		});
		const data = await response.json();
		console.log("data", data);
		setLoadingResetPassword(false);
		if (data.code === 200) {
			Toast.show({
				type: "success",
				text1: "Mot de passe réinitialisé",
				text2: "Vous pouvez maintenant vous connecter",
			});
			setStep(4);
		} else {
			Toast.show({
				type: "error",
				text1: "Erreur lors de la réinitialisation du mot de passe",
				text2: data.message,
			});
		}
	} catch (error) {
		console.log("error", error);
		setLoadingResetPassword(false);
	}
}


