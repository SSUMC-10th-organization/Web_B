import { useState } from "react";
import EmailStep from "../components/EmailStep";
import PasswordStep from "../components/PasswordStep";
import ProfileStep from "../components/ProfileStep";
import type { UserSignupInformation } from "../utils/validate";

const SignupPage = () => {
	const [step, setStep] = useState(1);

	const handlePrevStep = () => {
		setStep((prev) => prev - 1);
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleEmailNext = (inputEmail: string) => {
		setEmail(inputEmail);
		setStep(2);
	};

	const handlePasswordNext = (inputPassword: string) => {
		setPassword(inputPassword);
		setStep(3);
	};

	const handleFinalSubmit = (finalData: UserSignupInformation) => {};

	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			{step === 1 && <EmailStep onNext={handleEmailNext} />}
			{step === 2 && (
				<PasswordStep
					email={email}
					onNext={handlePasswordNext}
					onPrev={handlePrevStep}
				/>
			)}
			{step === 3 && (
				<ProfileStep
					email={email}
					password={password}
					name={""}
					onNext={handleFinalSubmit}
					onPrev={handlePrevStep}
				/>
			)}
		</div>
	);
};

export default SignupPage;
