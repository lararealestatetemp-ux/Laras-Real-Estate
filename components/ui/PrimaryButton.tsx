import type { ReactNode } from "react";
import Link from "next/link";

import styles from "@/styles/buttons.module.css";

type Props =
  | { href: string; children: ReactNode; type?: never; disabled?: never }
  | {
      href?: never;
      children: ReactNode;
      type?: "button" | "submit";
      disabled?: boolean;
      onClick?: () => void;
    };

export function PrimaryButton(props: Props) {
  if ("href" in props && props.href) {
    return (
      <Link className={styles.primary} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as Exclude<Props, { href: string }>;

  return (
    <button
      className={styles.primary}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </button>
  );
}
