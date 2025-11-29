"use client";
import { Amplify } from "aws-amplify";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: "us-east-1_ymTXv2doc",
        userPoolClientId: "755qu45khqjvaug4o5u230gh52",
      },
    },
  },
  { ssr: true }
);

export function ConfigureAmplify() {
  return null;
}
