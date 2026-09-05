import confetti from "canvas-confetti";

export const fireConfetti = (origin: { x: number; y: number }) => {
  const colors = ["#f97316", "#fb923c", "#2563eb", "#fde047", "#ec4899"];

  confetti({
    particleCount: 80,
    spread: 70,
    origin,
    colors,
    startVelocity: 35,
    gravity: 0.8,
    scalar: 0.9,
  });
};

export const fireBigConfetti = () => {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const colors = ["#f97316", "#fb923c", "#2563eb", "#fde047", "#ec4899"];

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.1, y: 0.6 },
      colors,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.9, y: 0.6 },
      colors,
    });
  }, 200);
};

export const fireHeartConfetti = () => {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: "💕", scalar });

  confetti({
    shapes: [heart],
    particleCount: 30,
    spread: 80,
    startVelocity: 25,
    origin: { y: 0.7 },
    scalar,
  });
};
