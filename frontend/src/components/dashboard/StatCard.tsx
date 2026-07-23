import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <p className="stat-card-title">{title}</p>
      <strong className="stat-card-value">{value}</strong>
      <p className="stat-card-description">{description}</p>
    </article>
  );
}

export default StatCard;