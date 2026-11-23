import styles from "@/styles/forms.module.css";

export function Honeypot({ id }: { id: string }) {
  return (
    <div className={styles.visuallyHidden} aria-hidden="true">
      <label htmlFor={id}>Company</label>
      <input
        id={id}
        name="company"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
