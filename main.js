const API_KEY = 'DEIN_GOOGLE_FONTS_API_KEY';
let selectedTraits = new Set();

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  document.getElementById('apply-btn').addEventListener('click', applyFilters);
  document.getElementById('reset-btn').addEventListener('click', resetFilters);
});

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
      <span>${trait}</span>
    `;
    
    wrapper.querySelector('input').addEventListener('change', e => {
      if(e.target.checked && selectedTraits.size >= 4) {
        e.target.checked = false;
        return;
      }
      e.target.checked ? selectedTraits.add(trait) : selectedTraits.delete(trait);
    });
    
    container.appendChild(wrapper);
  });
}

async function applyFilters() {
  const headline = document.getElementById('headline-input').value.trim();
  if(!headline) return alert('Bitte Headline eingeben');
  if(selectedTraits.size === 0) return alert('Mindestens 1 Eigenschaft auswählen');

  try {
    const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`);
    const data = await response.json();
    
    const filteredFonts = data.items.filter(font => 
      Array.from(selectedTraits).some(trait => 
        font.category.toLowerCase().includes(trait.toLowerCase()) || 
        font.family.toLowerCase().includes(trait.toLowerCase())
      )
    ).slice(0, 4);

    displayFonts(filteredFonts, headline);
  } catch (error) {
    console.error('Fehler beim Abrufen der Fonts:', error);
    alert('Fehler beim Laden der Schriftarten');
  }
}

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
        <strong>${font.family}</strong>
        <p>Passt zu: ${Array.from(selectedTraits).join(', ')}</p>
        <p>Kategorie: ${font.category}</p>
      </div>
    `;
    
    card.addEventListener('click', () => {
      window.location.href = `font-detail.html?font=${encodeURIComponent(font.family)}&headline=${encodeURIComponent(headline)}`;
    });
    
    container.appendChild(card);
  });
}

function resetFilters() {
  selectedTraits.clear();
  document.querySelectorAll('.filter-item input').forEach(input => input.checked = false);
  document.getElementById('font-container').innerHTML = '';
}
