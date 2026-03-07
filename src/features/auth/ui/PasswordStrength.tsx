type PasswordStrength = {
  password: string;
};

export const strengthLevels = [
  { width: "0%", backgroundColor: "transparent" },
  { width: "25%", backgroundColor: "#ef4444" },
  { width: "50%", backgroundColor: "#f59e0b" },
  { width: "75%", backgroundColor: "#84cc16" },
  { width: "100%", backgroundColor: "#4ecdc4" },
];
export const PasswordStrength = ({ password = "" }: PasswordStrength) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const score = getStrength(password);
  const barStyle = strengthLevels[score];

  return (
    <div className="mt-1 w-full h-1 bg-transparent">
      <div
        style={{ width: barStyle.width, backgroundColor: barStyle.backgroundColor }}
        className="h-full transition-width duration-300 ease-in-out"
      />
    </div>
  );
};
