import styles from "./States.module.css";
export default function EmptyState({ title, children, action }) {
  return (
    <div className={styles.empty}>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
