import type { ReactNode } from "react";
import Link from "next/link";

import styles from "@/styles/buttons.module.css";

type SharedProps = {
  children: ReactNode;
  className?: string;
};

type Props =
  | (SharedProps & { href: string })
  | (SharedProps & {
      href?: never;
      type?: "button" | "submit";
      disabled?: boolean;
      onClick?: () => void;
    });

function secondaryClassName(className?: string) {
  return className ? `${styles.secondary} ${className}` : styles.secondary;
}

export function SecondaryButton(props: Props) {
  if ("href" in props && props.href) {
    return (
      <Link className={secondaryClassName(props.className)} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const buttonProps = props as Exclude<Props, { href: string }>;

  return (
    <button
      className={secondaryClassName(buttonProps.className)}
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {buttonProps.children}
    </button>
  );
}
