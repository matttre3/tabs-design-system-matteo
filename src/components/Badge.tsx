import "../styles/components/Badge.scss";

export type BadgeProps = {
  label: string;
  variant?: "neutral" | "positive" | "negative";
  accessibleLabel?: string;
};

export default function Badge({ label, variant = "neutral", accessibleLabel }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {accessibleLabel ? (
        <>
          <span aria-hidden="true">{label}</span>
          <span className="badge__accessible-label">{accessibleLabel}</span>
        </>
      ) : (
        label
      )}
    </span>
  );
}
