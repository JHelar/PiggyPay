import { router } from "expo-router";
import { useEffect } from "react";
import { SignInScreen, useSignInStore } from "@/screens/SignIn";

export default function SignIn() {
	useEffect(() => {
		useSignInStore
			.getState()
			.start()
			.then((result) => {
				if (result === "success") {
					router.dismissTo("/(screens)/Groups");
				} else {
					router.back();
				}
			});
	}, []);
	return <SignInScreen />;
}
