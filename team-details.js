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
    // games first
    // With this:
    const rowHtml = renderGamesRow(m);
    return header + blurb + rowHtml;
  }

  function renderGamesRow(member) {
  const list = Object.values(member['Favourite Games'] || {}).filter(g => g['Game Name']);
  if (!list.length) return '';

  // build each game item
  const gamesHtml = list.map(g => {
    const thumbHtml = g['Image Name']
      ? `<div class="game-thumb" style="background-image:url('images/gamepics/${g['Image Name']}.jpg')"></div>`
      : `<div class="game-thumb placeholder"></div>`;

    return `
      <div class="game-fav-item">
        ${thumbHtml}
        <div class="game-info">
          <img src="/microstudio/icons/steamicon.png"
               class="game-steam-icon"
               alt="Steam">
          <span class="game-title">${g['Game Name']}</span>
        </div>
      </div>
    `;
  }).join('');

  // then your drink/snack markup (re-use your renderSnackHtml helper)
   const drinkHtml = renderSnackHtml(member['Favourite Drink'], 'Drink');
   const snackHtml = renderSnackHtml(member['Favourite Snack'], 'Snack');

  return `
    <div class="detail-section">
      <div class="combined-row">
        ${gamesHtml}
        ${drinkHtml}
        ${snackHtml}
      </div>
    </div>
  `;
}

  // Helper for favorites inside same row:
function renderSnackHtml(item, type) {
  const key = `${type} Name`;
  if (!item?.[key]) return '';
  return `
    <div class="game-fav-item">
      <div class="game-info">
        <span class="game-title">${item[key]}</span>
      </div>
      <img src="images/${type.toLowerCase()}pics/${item['Image Name']}.jpg" class="snack-thumb" alt="${item[key]}">
    </div>
  `;
}


  // flagEmoji unchanged
function flagEmoji(codes=[]) { const A=0x1F1E6; return (codes||[]).map(cc=>
    String.fromCodePoint(A+cc.charCodeAt(0)-65, A+cc.charCodeAt(1)-65)
  ).join(' '); }
});
