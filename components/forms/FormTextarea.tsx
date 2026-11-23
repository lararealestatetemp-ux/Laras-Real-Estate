import type { TextareaHTMLAttributes } from "react";

import styles from "@/styles/forms.module.css";

type FormTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> & {
  id: string;
  label: string;
  error?: string;
};

export function FormTextarea({
  id,
  label,
  required,
  error,
  className,
  ...textareaProps
}: FormTextareaProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.field} ${className ?? ""}`.trim()}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? " (required)" : null}
      </label>
      <textarea
        {...textareaProps}
        className={`${styles.control} ${styles.textarea}`}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : textareaProps["aria-describedby"]}
      />
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
