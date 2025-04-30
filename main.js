const properties = [
  "Innovation", "Authentizität", "Vertrauen", "Qualität", "Nachhaltigkeit",
  "Leidenschaft", "Kreativität", "Zuverlässigkeit", "Integrität", "Flexibilität",
  "Effizienz", "Optimismus", "Mut", "Dynamik", "Vielfalt", "Gemeinschaft",
  "Benutzerfreundlichkeit", "Ehrgeiz", "Durchhaltevermögen", "Offenheit",
  "Verantwortung", "Empathie", "Inspiration", "Selbstbewusstsein", "Freude"
];

let fontsData = [];
let selectedProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.getElementById("filters-container");
  const applyButton = document.getElementById("apply-filters");
  const resetButton = document.getElementById("reset-filters");
  const resultsContainer = document.getElementById("results");
  const headlineInput = document.getElementById("headline-input");

  // Checkboxen erstellen
  properties.forEach(prop => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = prop;
    checkbox.addEventListener("change", () => {
      selectedProperties = Array.from(filtersContainer.querySelectorAll("input:checked")).map(cb => cb.value);
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(prop));
    filtersContainer.appendChild(label);
  });

  // Fonts-Daten laden
  fetch("fonts.json")
    .then(response => response.json())
    .then(data => {
      fontsData = data;
      renderFonts(fontsData);
    });

  // Filter anwenden
  applyButton.addEventListener("click", () => {
    const filteredFonts = fontsData.filter(font =>
      selectedProperties.every(prop => font.properties.includes(prop))
    );
    renderFonts(filteredFonts);
  });

  // Filter zurücksetzen
  resetButton.addEventListener("click", () => {
    filtersContainer.querySelectorAll("input").forEach(cb => cb.checked = false);
    selectedProperties = [];
    renderFonts(fontsData);
  });

  function renderFonts(fonts) {
    resultsContainer.innerHTML = "";
    const headlineText = headlineInput.value || "Beispieltext";

    fonts.forEach(font => {
      const card = document.createElement("div");
      card.className = "font-card";
      card.innerHTML = `
        <div class="font-name">${font.name}</div>
        <div class="font-preview" style="font-family: '${font.name}', sans-serif;">${headlineText}</div>
        <p>${font.description}</p>
      `;
      card.addEventListener("click", () => {
        const weightsParam = font.weights.join(",");
        const url = `font-detail.html?font=${encodeURIComponent(font.name)}&weights=${encodeURIComponent(weightsParam)}&text=${encodeURIComponent(headlineText)}`;
        window.open(url, "_blank");
      });
      resultsContainer.appendChild(card);

      // Schriftart laden
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css?family=${font.name.replace(/ /g, "+")}`;
      document.head.appendChild(link);
    });
  }
});
