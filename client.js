// client.js
async function loadModules() {
  const container = document.getElementById('modules-container');
  container.innerHTML = 'Chargement...';
  try {
    const resp = await fetch('/api/files');
    if (!resp.ok) throw new Error('Erreur API');
    const data = await resp.json();
    const modules = data.modules || [];

    if (!modules.length) {
      container.innerHTML = '<p>Aucun document trouvé dans /files/. Dépose des PDFs et recharge la page.</p>';
      return;
    }

    container.innerHTML = '';
    modules.forEach(m => {
      const card = document.createElement('div');
      card.className = 'module-card';
      const coursBtn = m.cours ? `<a class="btn" href="/files/${encodeURIComponent(m.cours)}" target="_blank">📘 Cours</a>` : '';
      const tdBtn = m.td ? `<a class="btn" href="/files/${encodeURIComponent(m.td)}" target="_blank">📗 TD</a>` : '';
      card.innerHTML = `<h3>${m.name}</h3><div>${coursBtn}${tdBtn}</div>`;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p>Erreur lors du chargement (${err.message}).</p>`;
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadModules);
