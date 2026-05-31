const searchInput = document.querySelector("[data-recording-search]");
const chapterCards = document.querySelectorAll("[data-chapter-card]");

const showRecordingToast = (message) => {
  if (window.dashboardShowToast) {
    window.dashboardShowToast(message);
    return;
  }
  const toast = document.querySelector("[data-recording-toast]");
  const toastText = document.querySelector("[data-recording-toast-text]");
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("flex");
  window.setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 2200);
};

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  chapterCards.forEach((card) => {
    const title = card.dataset.chapterTitle?.toLowerCase() || "";
    card.classList.toggle("hidden", query.length > 0 && !title.includes(query));
  });
});

document.querySelectorAll("[data-worksheet-button]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    showRecordingToast(
      button.dataset.hasWorksheet === "true"
        ? "Downloading worksheet..."
        : "No worksheet for this lesson",
    );
  });
});

document.querySelectorAll("[data-watch-lesson]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const title = button.closest("article")?.querySelector("h3")?.textContent?.trim();
    showRecordingToast(title ? `Playing: ${title}` : "Opening lesson recording...");
  });
});
