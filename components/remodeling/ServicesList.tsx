import styles from "@/styles/remodeling.module.css";

type RemodelingService = {
  id: string;
  label: string;
  awaitingOwnerApproval: boolean;
};

type ServicesListProps = {
  services: readonly RemodelingService[];
};

export function ServicesList({ services }: ServicesListProps) {
  return (
    <ul className={styles.servicesList}>
      {services.map((service) => (
        <li className={styles.service} key={service.id}>
          <span className={styles.serviceCheck} aria-hidden="true">
            ✓
          </span>
          <span>{service.label}</span>
        </li>
      ))}
    </ul>
  );
}
