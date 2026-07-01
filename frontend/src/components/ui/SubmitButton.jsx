import { useFormStatus } from "react-dom";

export const SubmitButton = ({ children, loadingText = "Loading..." }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-nihon-red px-5 py-3 text-sm font-bold text-white transition hover:bg-nihon-red-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? loadingText : children}
    </button>
  );
};
