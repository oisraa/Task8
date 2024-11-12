import React from "react";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset"; 
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, type = "button", onClick, className }) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {label}
    </button>
  );
};

export default Button;
