import { Suspense } from "react";
import { AuthForm } from "@/components/shared/auth-form";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
