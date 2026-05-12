/**
 * Practice Lab: full leaderboard modal (<dialog>).
 */
(function () {
  const dialog = document.getElementById("leaderboard-dialog");
  const openBtn = document.querySelector("[data-leaderboard-open]");
  if (!dialog || !openBtn || typeof dialog.showModal !== "function") return;

  const closeButtons = dialog.querySelectorAll("[data-leaderboard-close]");

  function openModal() {
    dialog.showModal();
  }

  function closeModal() {
    dialog.close();
  }

  openBtn.addEventListener("click", openModal);

  closeButtons.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeModal();
  });
})();
