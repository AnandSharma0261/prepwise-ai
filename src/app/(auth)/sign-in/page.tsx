import { Suspense } from "react";
import { AuthForm } from "@/components/shared/auth-form";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
