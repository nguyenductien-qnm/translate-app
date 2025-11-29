"use client";
import React, { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  ShieldCheck,
  RefreshCcw,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  autoSignIn,
  confirmSignUp,
  SignInOutput,
  signUp,
  SignUpOutput,
} from "aws-amplify/auth";

type ISignUpState = SignUpOutput["nextStep"];
type ISignInState = SignInOutput["nextStep"];

function RegistrationForm({
  onStepChange,
  email,
  onEmailChange,
}: {
  onStepChange: (step: ISignUpState) => void;
  email: string;
  onEmailChange: (email: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const goBack = () => router.push("/user");

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
          }
          try {
            const { nextStep } = await signUp({
              username: email,
              password: password,
              options: {
                userAttributes: { email },
                autoSignIn: true,
              },
            });

            console.log(nextStep.signUpStep);
            onStepChange(nextStep);
          } catch (e) {}
        }}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Create Account
            </h1>
            <p className="text-gray-500 mt-1">Register to get started</p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Email Address
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-purple-500 transition-all">
                <Mail className="text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 outline-none"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-purple-500 transition-all">
                <Lock className="text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-purple-500 transition-all">
                <Lock className="text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </button>

            {/* Back Button */}
            <button
              onClick={goBack}
              className="w-full border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function VerifyCode({
  onStepChange,
  email,
}: {
  onStepChange: (step: ISignUpState) => void;
  email: string;
}) {
  const [code, setCode] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Verify Email
            </h1>
            <p className="text-gray-500 mt-1">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="space-y-5">
            {/* Verification Code */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Verification Code
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-purple-500 transition-all">
                <ShieldCheck className="text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter code"
                  maxLength={6}
                  className="flex-1 outline-none tracking-widest text-lg font-semibold"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const { nextStep } = await confirmSignUp({
                    confirmationCode: code,
                    username: email,
                  });
                  console.log(nextStep.signUpStep);
                  onStepChange(nextStep);
                } catch (e) {}
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Verify
            </button>

            {/* Resend Code */}
            <button className="w-full border-2 border-purple-400 text-purple-600 px-6 py-3 rounded-xl font-semibold bg-white hover:bg-purple-50 hover:border-purple-500 transition-all flex items-center justify-center gap-2">
              <RefreshCcw className="w-5 h-5" />
              Resend Code
            </button>

            {/* Back */}
            <button className="w-full border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function AuthToSignIn({
  onStepChange,
}: {
  onStepChange: (step: ISignInState) => void;
}) {
  useEffect(() => {
    const asyncAutoSignIn = async () => {
      const { nextStep } = await autoSignIn();
      console.log(nextStep);
      onStepChange(nextStep);
    };
    asyncAutoSignIn();
  }, []);

  return <>Signing...</>;
}

export default function Register() {
  const [step, setStep] = useState<ISignInState | ISignUpState | null>(null);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!step) return;
    if ((step as ISignInState).signInStep === "DONE") router.push("/");
  }, [step, router]);

  if (step) {
    if ((step as ISignUpState).signUpStep === "CONFIRM_SIGN_UP") {
      return <VerifyCode email={email} onStepChange={setStep} />;
    }

    if ((step as ISignUpState).signUpStep === "COMPLETE_AUTO_SIGN_IN") {
      return <AuthToSignIn onStepChange={setStep} />;
    }
  }

  return (
    <>
      <RegistrationForm
        onStepChange={setStep}
        email={email}
        onEmailChange={setEmail}
      />
    </>
  );
}
