import type { SelectHTMLAttributes } from "react";

import styles from "@/styles/forms.module.css";

type FormSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
};

export function FormSelect({
  id,
  label,
  required,
  error,
  className,
  children,
  ...selectProps
}: FormSelectProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.field} ${className ?? ""}`.trim()}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? " (required)" : null}
      </label>
      <select
        {...selectProps}
        className={styles.control}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : selectProps["aria-describedby"]}
      >
        {children}
      </select>
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
