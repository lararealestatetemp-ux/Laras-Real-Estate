import type { ReactNode } from "react";
import Link from "next/link";

import styles from "@/styles/buttons.module.css";

type Props =
  | { href: string; children: ReactNode }
  | {
      href?: never;
      children: ReactNode;
      type?: "button" | "submit";
      disabled?: boolean;
      onClick?: () => void;
    };

export function SecondaryButton(props: Props) {
  if ("href" in props && props.href) {
    return (
      <Link className={styles.secondary} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as Exclude<Props, { href: string }>;

  return (
    <button
      className={styles.secondary}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </button>
  );
}
