const apiKey = 'AIzaSyAsYiOrdnXJe_-D6GhXzbJNbXO6jDcqft8c';
const apiUrl = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`;
const properties = [
  "Innovation", "Authentizität", "Vertrauen", "Qualität", "Nachhaltigkeit",
  "Leidenschaft", "Kreativität", "Zuverlässigkeit", "Integrität", "Flexibilität",
  "Effizienz", "Optimismus", "Mut", "Dynamik", "Vielfalt", "Gemeinschaft",
  "Benutzerfreundlichkeit", "Ehrgeiz", "Durchhaltevermögen", "Offenheit",
  "Verantwortung", "Empathie", "Inspiration", "Selbstbewusstsein", "Freude"
];

let selectedProperties = [];
let fontsData = [];

document.addEventListener('DOMContentLoaded', () => {
  const filtersContainer = document.getElementById('property-filters');
  properties.forEach(prop => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = prop;
    checkbox.addEventListener('change', handlePropertyChange);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(prop));
    filtersContainer.appendChild(label);
  });

  document.getElementById('apply-filters').addEventListener('click', applyFilters);
  document.getElementById('reset-filters').addEventListener('click', resetFilters);

  fetchFonts();
});

function handlePropertyChange(event) {
  const value = event.target.value;
  if (event.target.checked) {
    if (selectedProperties.length < 4) {
      selectedProperties.push(value);
    } else {
      event.target.checked = false;
      alert('Du kannst maximal 4 Eigenschaften auswählen.');
    }
  } else {
    selectedProperties = selectedProperties.filter(prop => prop !== value);
  }
}

function resetFilters() {
  selectedProperties = [];
  document.querySelectorAll('#property-filters input').forEach(input => {
    input.checked = false;
  });
  displayFonts(fontsData);
}

function applyFilters() {
  if (selectedProperties.length === 0) {
    alert('Bitte wähle mindestens eine Eigenschaft aus.');
    return;
  }
  // Beispielhafte Filterlogik: Hier kannst du deine eigene Logik implementieren
  const filteredFonts = fontsData.filter(font => {
    // Hier könnte man eine Zuordnung von Eigenschaften zu Schriftarten implementieren
    // Für das Beispiel geben wir alle Schriftarten zurück
    return true;
  });
  displayFonts(filteredFonts);
}

function fetchFonts() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      fontsData = data.items;
      displayFonts(fontsData);
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Schriftarten:', error);
    });
}

function displayFonts(fonts) {
  const resultsContainer = document.getElementById('font-results');
  resultsContainer.innerHTML = '';
  const headline = document.getElementById('headline-input').value || 'Beispieltext';

  fonts.slice(0, 20).forEach(font => {
    const fontCard = document.createElement('div');
    fontCard.className = 'font-card';
    fontCard.style.fontFamily = font.family;
    fontCard.innerHTML = `
      <p style="font-family: '${font.family}', sans-serif;">${headline}</p>
      <p>${font.family}</p>
    `;
    fontCard.addEventListener('click', () => {
      const url = `font-detail.html?font=${encodeURIComponent(font.family)}&headline=${encodeURIComponent(headline)}`;
      window.location.href = url;
    });
    resultsContainer.appendChild(fontCard);
  });
}
