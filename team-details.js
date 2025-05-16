document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  const thumbsContainer  = detailsContainer.querySelector('.member-thumbs-vertical');
  const detailCard       = detailsContainer.querySelector('.member-detail-card');
  const arrowEl          = detailsContainer.querySelector('.details-arrow');
  let teamData = {}, currentTeam = null;

  // Load JSON
  fetch('/microstudio/teamdata.json')
    .then(r => r.json())
    .then(json => teamData = json)
    .catch(e => console.error('teamData.json load error', e));

  // Toggle on Learn More
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    e.preventDefault();
    const gameCard = e.target.closest('.game-card');
    const teamKey  = gameCard.dataset.team;
    if (!teamData[teamKey]) return;
    if (currentTeam === teamKey) {
      detailsContainer.hidden = true; currentTeam = null;
    } else {
      currentTeam = teamKey;
      buildPanel(teamKey, teamData[teamKey]);
      detailsContainer.hidden = false;
    }
  });

  // Build thumbnails + auto-select first
  function buildPanel(teamKey, members) {
    thumbsContainer.innerHTML = Object.entries(members).map(([name,m]) => {
      const imgUrl = m['Profile Image Name']
        ? `images/profilepics/${m['Profile Image Name']}.jpg`
        : null;
      return `
        <div class="thumb" data-member="${name}">
          ${imgUrl
            ? `<img src="${imgUrl}" alt="${name}" class="thumb-img">`
            : `<div class="thumb-img placeholder"></div>`}
          <span class="thumb-name">${name}</span>
        </div>
      `;
    }).join('');

    thumbsContainer.querySelectorAll('.thumb').forEach(el =>
      el.addEventListener('click', () => selectMember(el.dataset.member))
    );
    selectMember(Object.keys(members)[0]);
  }

  // Select and render member
  function selectMember(name) {
    // highlight thumb
    thumbsContainer.querySelectorAll('.thumb').forEach(el =>
      el.classList.toggle('active', el.dataset.member === name)
    );
    // position arrow
    const active = thumbsContainer.querySelector('.thumb.active');
    const aRect = active.getBoundingClientRect();
    const pRect = detailsContainer.getBoundingClientRect();
    arrowEl.style.left = `${aRect.top + aRect.height/2 - pRect.top}px`;
    // render details
    detailCard.innerHTML = renderMemberDetail(name, teamData[currentTeam][name]);
  }

  // Render detail HTML
  function renderMemberDetail(name, m) {
    const photo = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo" alt="${name}">`
      : `<div class="detail-photo placeholder"></div>`;

    // Links without extra spaces
    const links = Object.entries(m.Links||{}).filter(([,url])=>url).map(([k,u]) => {
      const href = u.startsWith('http') ? u : `https://${u}`;
      const icon = {
        Github: '/microstudio/icons/github.svg',
        LinkedIn: '/microstudio/icons/linkedin.svg',
        itchio: '/microstudio/icons/itchio.svg'
      }[k] || '/microstudio/icons/link.svg';
      return `<a href="${href}" target="_blank" class="social-link">
        <img src="${icon}" alt="${k}" class="social-icon">
      </a>`;
    }).join('');

    // Header block
    const header = `
      <div class="detail-header">
        ${photo}
        <div class="detail-title-links">
          <h4 class="detail-name">${name} ${flagEmoji(m.Nationalities)}</h4>
          <div class="detail-links">${links}</div>
        </div>
      </div>
    `;

    // Blurb below
    const blurb = `<div class="detail-blurb-block"><p class="detail-blurb">${m.Blurb||''}</p></div>`;

    // Games + favorites in one row
    const items = [];
    // games first
    Object.values(m['Favourite Games']||{}).forEach(g => {
      if (!g['Game Name']) return;
      const thumb = g['Image Name']
        ? `<div class="game-thumb" style="background-image:url('images/gamepics/${g['Image Name']}.jpg')"></div>`
        : `<div class="game-thumb placeholder"></div>`;
      items.push(`
        <a href="${g['Steam Link']}" target="_blank" class="game-fav-item">
          <img src="/microstudio/icons/steamicon.png" class="game-steam-icon" alt="Steam">
          <div class="game-title">${g['Game Name']}</div>
          ${thumb}
        </a>
      `);
    });
    // then drink/snack
    if (m['Favourite Drink']?.['Drink Name']) {
      const d = m['Favourite Drink'];
      items.push(`
        <div class="game-fav-item">
          <div class="game-title">${d['Drink Name']}</div>
          <img src="images/drinkpics/${d['Image Name']}.jpg" class="snack-thumb" alt="${d['Drink Name']}">
        </div>
      `);
    }
    if (m['Favourite Snack']?.['Snack Name']) {
      const s = m['Favourite Snack'];
      items.push(`
        <div class="game-fav-item">
          <div class="game-title">${s['Snack Name']}</div>
          <img src="images/snackpics/${s['Image Name']}.jpg" class="snack-thumb" alt="${s['Snack Name']}">
        </div>
      `);
    }
    const row = `<div class="detail-section combined-row">${items.join('')}</div>`;

    return header + blurb + row;
  }

  // flagEmoji unchanged
  function flagEmoji(codes=[]) { const A=0x1F1E6; return (codes||[]).map(cc=>
    String.fromCodePoint(A+cc.charCodeAt(0)-65, A+cc.charCodeAt(1)-65)
  ).join(' '); }
});
