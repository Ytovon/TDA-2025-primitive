import styles from "./ToggleButton.module.css";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function ToggleButton({ isOn, onToggle }: ToggleButtonProps) {
  return (
    <button
      className={`${styles.toggle} ${isOn ? styles.on : ""}`}
      onClick={onToggle}
    >
      <span className={styles.circle}></span>
    </button>
  );
}
