/**
 * Practice Lab page only: weekly leaderboard overlay open/close.
 */
(function () {
  const root = document.getElementById("leaderboard-modal");
  const openBtn = document.querySelector("[data-leaderboard-open]");
  if (!root || !openBtn) return;

  function isOpen() {
    return root.classList.contains("leaderboard-modal--open");
  }

  function openModal() {
    root.classList.add("leaderboard-modal--open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }

  function closeModal() {
    if (!isOpen()) return;
    root.classList.remove("leaderboard-modal--open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
  }

  openBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });

  root.querySelectorAll("[data-leaderboard-close]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      closeModal();
    }
  });
})();
