import { CreateUser } from "./components/CreateUser";
import { EmailSubmit } from "./components/EmailSubmit";
import { VerifyCode } from "./components/VerifyCode";
import { useSignInStore } from "./SignIn.store";

export function SignInScreen() {
	const state = useSignInStore(({ currentState }) => currentState);

	if (state === "EmailSubmit") return <EmailSubmit />;
	if (state === "VerifyCode") return <VerifyCode />;
	if (state === "NewUser") return <CreateUser />;
}
