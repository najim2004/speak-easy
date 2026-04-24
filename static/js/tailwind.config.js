document.head.appendChild(
  Object.assign(document.createElement("style"), {
    type: "text/tailwindcss",
    textContent: `
      @theme {
        --color-brand-bg: #090909;
        --color-brand-surface: #121212;
        --color-brand-panel: #1b1b1b;
        --color-brand-card: #242424;
        --color-brand-line: rgba(255, 255, 255, 0.09);
        --color-brand-text: #ffffff;
        --color-brand-muted: #b8b8b8;
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
