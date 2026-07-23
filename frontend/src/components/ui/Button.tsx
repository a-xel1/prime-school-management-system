import "./Button.css";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

function Button({
  children,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      className="app-button"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;