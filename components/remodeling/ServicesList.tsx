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
          <span>{service.label}</span>
          {service.awaitingOwnerApproval ? (
            <span className={styles.approvalLabel}>
              Awaiting owner approval
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
