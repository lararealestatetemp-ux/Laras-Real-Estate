import styles from "@/styles/forms.module.css";

type FormStatusProps = {
  status: "idle" | "pending" | "success" | "error";
  message?: string;
};

export function FormStatus({ status, message }: FormStatusProps) {
  if (status === "idle" || !message) {
    return null;
  }

  return (
    <p
      className={`${styles.status} ${styles[status]}`}
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
    >
      {message}
    </p>
  );
}
