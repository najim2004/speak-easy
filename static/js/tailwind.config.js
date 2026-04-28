document.head.appendChild(
  Object.assign(document.createElement("style"), {
    type: "text/tailwindcss",
    textContent: `
      @custom-variant dark (&:where(.dark, .dark *));

      @theme {
        --color-brand-accent: #38EF08;
        --color-brand-strong: #5DD62C;
        --font-inter: "Inter", sans-serif;
        --font-changa-one: "Changa One", sans-serif;
        --container-section: 1200px;
        --shadow-glow: 0 22px 60px rgba(80, 255, 0, 0.14);
      }
    `,
  }),
);
