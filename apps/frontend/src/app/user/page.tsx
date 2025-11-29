"use client";
import React, { useEffect, useState } from "react";
import {
  Lock,
  Mail,
  LogIn,
  UserPlus,
  Sparkles,
  LogOut,
  User,
} from "lucide-react";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log("Navigate to Register page");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-1">Login to continue</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Email Address
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-blue-500 transition-all">
                <Mail className="text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-blue-500 transition-all">
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

            <button
              onClick={async () => {
                await signIn({
                  username: email,
                  password,
                  options: {
                    userAttributes: {
                      email,
                    },
                  },
                });
                onSignedIn();
                router.push("/");
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            {/* Register Button */}
            <button
              onClick={() => router.push("/register")}
              className="w-full border-2 border-purple-400 text-purple-600 px-6 py-3 rounded-xl font-semibold shadow-md bg-white hover:bg-purple-50 hover:border-purple-500 transition-all flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Logout({ onSignedOut }: { onSignedOut: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full text-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            {/* <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1> */}
            {/* <p className="text-gray-500">{user.email}</p> */}
          </div>

          {/* Logout Button */}
          <button
            onClick={async () => {
              await signOut();
              onSignedOut();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          {/* Optional message */}
          <p className="text-gray-400 text-sm">You can log out at any time.</p>
        </div>
      </div>
    </main>
  );
}

export default function UserPage() {
  const [user, setUser] = useState<object | null | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currUser = await getCurrentUser();
        setUser(currUser);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  if (user === undefined) return <p>Loading</p>;

  if (user) return <Logout onSignedOut={async () => setUser(null)} />;

  return (
    <Login
      onSignedIn={async () => {
        try {
          const currUser = await getCurrentUser();
          setUser(currUser);
        } catch (e) {
          setUser(null);
        }
      }}
    />
  );
}
