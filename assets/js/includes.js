document.addEventListener("DOMContentLoaded", () => {
  const includeTargets = Array.from(document.querySelectorAll("[data-include]"));

  Promise.all(includeTargets.map(loadPartial))
    .then(initializeInteractiveElements)
    .catch((error) => {
      console.error("Failed to bootstrap page", error);
    });
});

async function loadPartial(node) {
  const src = node.getAttribute("data-include");
  if (!src) {
    return;
  }

  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Unable to load partial: ${src} (${response.status})`);
  }

  const html = await response.text();
  const template = document.createElement("template");
  template.innerHTML = html.trim();

  node.replaceWith(template.content.cloneNode(true));
}

function initializeInteractiveElements() {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".site-nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navList.classList.toggle("open");
    });

    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navList.classList.contains("open")) {
          navList.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}
