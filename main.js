
const API_KEY = 'AIzaSyAsYiOrdnXJe_-D6GhXzbJNbXO6jDcqft8';
let selectedTraits = new Set();

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  document.getElementById('reset-btn').addEventListener('click', resetFilters);
});

// Filter erstellen
function initFilters() {
  const traits = [
    'Innovation', 'Authentizität', 'Vertrauen', 'Qualität', 'Nachhaltigkeit',
    'Leidenschaft', 'Kreativität', 'Zuverlässigkeit', 'Integrität', 'Flexibilität',
    'Effizienz', 'Optimismus', 'Mut', 'Dynamik', 'Vielfalt', 'Gemeinschaft',
    'Benutzerfreundlichkeit', 'Ehrgeiz', 'Durchhaltevermögen', 'Offenheit',
    'Verantwortung', 'Empathie', 'Inspiration', 'Selbstbewusstsein', 'Freude'
  ];

  const container = document.getElementById('filter-container');
  
  traits.forEach(trait => {
    const wrapper = document.createElement('label');
    wrapper.className = 'filter-item';
    wrapper.innerHTML = `
      <input type="checkbox" value="${trait}">
      ${trait}
    `;
    
    wrapper.querySelector('input').addEventListener('change', e => {
      if(e.target.checked && selectedTraits.size >= 4) {
        e.target.checked = false;
        return alert('Maximal 4 Eigenschaften auswählbar');
      }
      e.target.checked ? selectedTraits.add(trait) : selectedTraits.delete(trait);
      updateFonts();
    });
    
    container.appendChild(wrapper);
  });
}

// Fonts aktualisieren
async function updateFonts() {
  const headline = document.getElementById('headline-input').value;
  if(!headline) return;

  const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`);
  const data = await response.json();
  
  const filteredFonts = data.items.filter(font => 
    Array.from(selectedTraits).some(trait => 
      font.category.toLowerCase().includes(trait.toLowerCase()) || 
      font.family.toLowerCase().includes(trait.toLowerCase())
    )
  ).slice(0, 4);

  displayFonts(filteredFonts, headline);
}

// Fonts anzeigen
function displayFonts(fonts, headline) {
  const container = document.getElementById('font-container');
  container.innerHTML = '';

  fonts.forEach(font => {
    const card = document.createElement('div');
    card.className = 'font-card';
    card.innerHTML = `
      <div class="font-preview" style="font-family: '${font.family}'">
        ${headline}
      </div>
      <div class="font-explanation">
        Passt zu: ${Array.from(selectedTraits).join(', ')}
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `font-detail.html?font=${encodeURIComponent(font.family)}&headline=${encodeURIComponent(headline)}`;
    });
    
    container.appendChild(card);
  });
}

// Filter zurücksetzen
function resetFilters() {
  selectedTraits.clear();
  document.querySelectorAll('.filter-item input').forEach(input => input.checked = false);
  document.getElementById('font-container').innerHTML = '';
}
