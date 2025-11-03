export default function PageWrapper({ title, children }) {
  return (
    <div className="min-h-screen bg-background p-6">
      {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
      {children}
    </div>
  );
}
