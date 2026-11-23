import type { InputHTMLAttributes } from "react";

import styles from "@/styles/forms.module.css";

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
};

export function FormField({
  id,
  label,
  required,
  error,
  className,
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.field} ${className ?? ""}`.trim()}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? " (required)" : null}
      </label>
      <input
        {...inputProps}
        className={styles.control}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : inputProps["aria-describedby"]}
      />
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
