export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "Щонайменше 8 символів",
    isMet: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Велика літера A–Z",
    isMet: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Цифра 0–9",
    isMet: (password: string) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Спецсимвол !@#$%^&*",
    isMet: (password: string) => /[!@#$%^&*]/.test(password),
  },
] as const;

export const getPasswordRequirementResults = (password: string) =>
  PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    met: requirement.isMet(password),
  }));

export const getPasswordStrength = (password: string) => {
  const score = getPasswordRequirementResults(password).filter(
    (requirement) => requirement.met,
  ).length;

  if (!password) return { score, label: "Ще не введено" } as const;
  if (score <= 1) return { score, label: "Слабкий" } as const;
  if (score === 2) return { score, label: "Середній" } as const;
  if (score === 3) return { score, label: "Добрий" } as const;
  return { score, label: "Надійний" } as const;
};
