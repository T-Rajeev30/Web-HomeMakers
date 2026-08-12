import { useToast } from "../store/useToast";
import Icon from "./Icon";

export default function Toast() {
  const toast = useToast();
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  return (
    <div
      key={toast.id}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-4 py-3 rounded-xl shadow-modal max-w-[90vw] animate-fade-in ${
        isSuccess
          ? "bg-primary-fixed text-on-primary-fixed"
          : "bg-error-container text-on-error-container"
      }`}
    >
      <Icon
        name={isSuccess ? "check_circle" : "error"}
        fill
        className="text-[20px] shrink-0"
      />
      <span className="text-label-lg font-label-lg">{toast.message}</span>
    </div>
  );
}
