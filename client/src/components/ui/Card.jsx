export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-surface shadow-card rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
}
