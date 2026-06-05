import Link from "next/link";

type DecisionCardProps = {
  title: string;
  eyebrow: string;
  meta: string;
  badges?: string[];
  decision: {
    title: string;
    confidence: string;
    body: string;
    csvContext?: string;
  };
  href?: string;
};

export function DecisionCard({ title, eyebrow, meta, badges = [], decision, href }: DecisionCardProps) {
  const content = (
    <article className="record-card">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <div className="meta">{meta}</div>
      </div>
      <div className="badge-row">
        {badges.map((badge) => (
          <span className="badge" key={badge}>
            {badge}
          </span>
        ))}
      </div>
      <div className="result">
        <strong>{decision.title}</strong>
        <p>{decision.body}</p>
        {decision.csvContext ? <p className="meta">{decision.csvContext}</p> : null}
        <span className="badge warn">Confidence: {decision.confidence}</span>
      </div>
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
