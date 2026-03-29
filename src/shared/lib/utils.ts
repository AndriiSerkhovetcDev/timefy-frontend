export const hideEmail = (email: string) => {
  if (!email) return "";

  const [name, domain] = email.split("@");

  if (name.length < 2) {
    return `${name}***@${domain}`;
  }

  if (name.length <= 4) {
    return `${name.slice(0, 2)}***@${domain}`;
  }

  const secureName = name.slice(0, 2) + "*".repeat(name.length - 4) + name.slice(-2);

  return `${secureName}@${domain}`;
};
