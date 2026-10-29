const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector(".header nav");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "فتح القائمة");
      menuToggle.textContent = "☰";
    });
  });
}

// Keep order links usable without exposing any credentials or requiring a backend.
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});