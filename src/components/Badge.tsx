import "../styles/components/Badge.scss";

type BadgeProps = {
  label: string;
  variant?: "neutral" | "positive" | "negative";
};

export default function Badge({ label, variant = "neutral" }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{label}</span>;
}
