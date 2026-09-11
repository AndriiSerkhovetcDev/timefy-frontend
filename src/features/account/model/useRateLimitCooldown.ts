import { useEffect, useState } from "react";

export const useRateLimitCooldown = () => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  return { cooldown, startCooldown: setCooldown };
};
