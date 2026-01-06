import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { SignInScreen, useSignInStore } from "@/screens/SignIn";

export default function SignIn() {
	const navigation = useNavigation();
	useEffect(() => {
		const remove = navigation.addListener("beforeRemove", () => {
			useSignInStore.getState().abort();
		});

		return () => {
			remove();
		};
	}, [navigation.addListener]);
	return <SignInScreen />;
}
