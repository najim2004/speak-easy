document.querySelector("[data-close-notification]")?.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "overview.html";
  }
});
