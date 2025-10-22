export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition";
  const styles = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary:
      "bg-white border border-primary text-primary hover:bg-primary-light",
  };
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}
