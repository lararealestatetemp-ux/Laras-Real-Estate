import styles from "@/styles/forms.module.css";

type FormStatusProps = {
  id: string;
  status: "idle" | "pending" | "success" | "error";
  message?: string;
};

export function FormStatus({ id, status, message }: FormStatusProps) {
  if (status === "idle" || !message) {
    return null;
  }

  return (
    <p
      id={id}
      className={`${styles.status} ${styles[status]}`}
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      tabIndex={status === "error" ? -1 : undefined}
    >
      {message}
    </p>
  );
}
