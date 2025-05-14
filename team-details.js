/*
  Enhanced team-details.js
  ------------------------
  - Builds thumbnail list
  - Handles selection & arrow positioning
  - Renders detail card on the right
*/

/* team-details.js — Final Refinement */

document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  const thumbsContainer  = detailsContainer.querySelector('.member-thumbs-vertical');
  const detailCard       = detailsContainer.querySelector('.member-detail-card');
  const arrowEl          = detailsContainer.querySelector('.details-arrow');

  let teamData = {}, currentTeam = null;

  // Load the JSON file (ensure correct path)
  fetch('/microstudio/teamdata.json')
    .then(r => r.json())
    .then(json => teamData = json)
    .catch(err => console.error('Failed to load teamData.json', err));

  // Listen for "Learn More" clicks
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    e.preventDefault();

    const gameCard = e.target.closest('.game-card');
    const teamKey  = gameCard.dataset.team;
    if (!teamData[teamKey]) return;

    // Toggle panel
    if (currentTeam === teamKey) {
      detailsContainer.hidden = true;
      currentTeam = null;
    } else {
      currentTeam = teamKey;
      buildPanel(teamKey, teamData[teamKey]);
      detailsContainer.hidden = false;
    }
  });

function buildPanel(teamKey, members) {
  // Vertical list of thumbs
  thumbsContainer.innerHTML = Object.entries(members).map(([name, m]) => {
    const img = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="thumb-img" alt="${name}">`
      : `<div class="thumb-img placeholder"></div>`;
    return `<div class="thumb" data-member="${name}">${img}<span class="thumb-name">${name}</span></div>`;
  }).join('');

  // Click handlers
  thumbsContainer.querySelectorAll('.thumb').forEach(el => el.addEventListener('click', () => selectMember(el.dataset.member)));
  selectMember(Object.keys(members)[0]);
}

  // Show details for a specific member
  function selectMember(name) {
    // Highlight active thumb
    thumbsContainer.querySelectorAll('.thumb').forEach(el => {
      el.classList.toggle('active', el.dataset.member === name);
    });

    // Position arrow under active thumb
    const activeThumb = thumbsContainer.querySelector('.thumb.active');
    const thumbRect   = activeThumb.getBoundingClientRect();
    const parentRect  = detailsContainer.getBoundingClientRect();
    const centerX     = thumbRect.left + thumbRect.width/2;
    arrowEl.style.left = (centerX - parentRect.left) + 'px';

    // Render detail card content
    const memberData = teamData[currentTeam][name];
    // After injecting the detail card HTML:
    detailCard.innerHTML = renderMemberDetail(name, memberData);
    if (window.twemoji) {
      // parse only within the detail card container
      twemoji.parse(detailCard, {
        folder: 'svg',
        ext: '.svg'
      });
    } else {
      console.warn('Twemoji not loaded — flags may not render');
    }
  }

  // --- Renders the detail card HTML ---
function renderMemberDetail(name, m) {
  // Profile photo or placeholder
  const photo = m['Profile Image Name']
    ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo" alt="${name}">`
    : `<div class="detail-photo placeholder"></div>`;

  // Header: name above links
  const links = renderLinks(m.Links);
  const header = `
    <div class="detail-header">
      ${photo}
      <div class="detail-title-links">
        <h4 class="detail-name">${name} ${flagEmoji(m.Nationalities)}</h4>
        <div class="detail-links">${links}</div>
      </div>
    </div>
  `;

  // Blurb block below header
  const blurb = `<div class="detail-blurb-block"><p class="detail-blurb">${m.Blurb || ''}</p></div>`;

  // Favorite Games horizontal row
  const games = renderGamesRow(m['Favourite Games']);

  // Favorites row
  const favs  = renderSnackSection(m['Favourite Drink'], m['Favourite Snack']);

  return header + blurb + games + favs;
}

  // New helper for horizontal games row
function renderGamesRow(games={}){
  const list = Object.values(games).filter(g=>g['Game Name']); if(!list.length) return '';
  return `
    <div class="detail-section">
      <h5 class="section-heading">Favorite Games</h5>
      <div class="games-row">
        ${list.map(g=>{
          const thumb = g['Image Name']
            ? `<div class="game-thumb" style="background-image:url('images/gamepics/${g['Image Name']}.jpg')"></div>`
            : `<div class="game-thumb placeholder"></div>`;
          return `
            <a href="${g['Steam Link']}" target="_blank" class="game-item">
              <img src="/microstudio/icons/steamicon.svg" class="game-steam-icon" alt="Steam">
              <span class="game-title">${g['Game Name']}</span>
              ${thumb}
            </a>`;
        }).join('')}
      </div>
    </div>
  `;
}

  // 5) Helpers
  function flagEmoji(codes=[]) {
    const A=0x1F1E6; return (codes||[])
      .map(cc => String.fromCodePoint(A+cc.charCodeAt(0)-65, A+cc.charCodeAt(1)-65))
      .join(' ');
  }
  
  // renderGames():
  function renderGames(games = {}) {
    const list = Object.values(games).filter(g => g['Game Name']);
    if (!list.length) return '';
    return `<div class="member-games">
      ${list.map(g => {
        const imgUrl = g['Image Name']
          ? `images/gamepics/${g['Image Name']}.jpg`
          : null;
        return `
          <a href="${g['Steam Link']}" target="_blank" class="game-link">
            <img src="/microstudio/icons/steamicon.svg" class="steam-icon" alt="Steam"> 
            ${imgUrl
              ? `<div class="game-thumb" style="background-image:url('${imgUrl}')"></div>`
              : `<div class="game-thumb placeholder"></div>`}
            <span class="game-title">${g['Game Name']}</span>
          </a>
        `;
      }).join('')}
    </div>`;
  }
  function renderSnack(type,obj={}){
    const key=type.charAt(0).toUpperCase()+type.slice(1)+' Name';
    if(!obj[key])return'';
    return `<div class="member-${type}">
      <img src="images/${type}pics/${obj['Image Name']}.jpg" alt="${obj[key]}" class="${type}-thumb">
      <span>${obj[key]}</span>
    </div>`;
  }

  // New: renderSnackSection
  function renderSnackSection(drink = {}, snack = {}) {
    const drinkHTML = drink['Drink Name']
      ? `<div class="snack-item">
           <img src="images/drinkpics/${drink['Image Name']}.jpg" alt="${drink['Drink Name']}" class="snack-thumb">
           <span>${drink['Drink Name']}</span>
         </div>`
      : '';
    const snackHTML = snack['Snack Name']
      ? `<div class="snack-item">
           <img src="images/snackpics/${snack['Image Name']}.jpg" alt="${snack['Snack Name']}" class="snack-thumb">
           <span>${snack['Snack Name']}</span>
         </div>`
      : '';
    if (!drinkHTML && !snackHTML) return '';
    return `<div class="detail-snacks">
      <h5>Favorites</h5>
      <div class="snack-row">${drinkHTML}${snackHTML}</div>
    </div>`;
  }
  
  function renderLinks(links={}){
    const map={
      Github:'/microstudio/icons/github.svg',
      LinkedIn:'/microstudio/icons/linkedin.svg',
      itchio:'/microstudio/icons/itchio.svg',
      Instagram:'/microstudio/icons/instagram.svg',
      TikTok:'/microstudio/icons/tiktok.svg',
      Website:'/microstudio/icons/link.svg',
      itchio:'/microstudio/icons/itchio.svg',
      Portfolio:'/microstudio/icons/link.svg'};
    const html=Object.entries(links).filter(([,u])=>u).map(([k,u])=>{
      const h=u.startsWith('http')?u:'https://'+u;
      return `<a href="${h}" target="_blank" class="member-link">
        <img src="${map[k]||'/icons/link.svg'}" alt="${k}" class="link-icon">
      </a>`;
    }).join('');
    return html?`<div class="member-links">${html}</div>`:'';
  }
});
