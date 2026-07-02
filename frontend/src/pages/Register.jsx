import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useActionState, useEffect } from "react";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../components/ui/Input";
import { SubmitButton } from "../components/ui/SubmitButton";

const initialState = {
  error: null,
};

export const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const registerAction = async (previousState, formData) => {
    try {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (password !== confirmPassword) {
        return {
          error: "Passwords do not match.",
        };
      }

      await register({ name, email, password });

      navigate("/dashboard", { replace: true });

      return {
        error: null,
      };
    } catch (error) {
      return {
        error: getApiErrorMessage(error),
      };
    }
  };

  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start studying Japanese with lessons, exercises and flashcards."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-nihon-red hover:text-nihon-red-dark"
          >
            Log in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-5">
        {state.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-200">
            {state.error}
          </div>
        )}

        <Input
          id="name"
          label="Name"
          name="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          required
        />
        <Input
          id="email"
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          min-length={8}
          required
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          min-length={8}
          required
        />

        <SubmitButton loadingText="Creating account...">
          Create account
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};
