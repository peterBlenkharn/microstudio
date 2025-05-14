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
  const thumbsContainer  = detailsContainer.querySelector('.member-thumbs');
  const detailCard       = detailsContainer.querySelector('.member-detail-card');
  const arrowEl          = detailsContainer.querySelector('.details-arrow');

  let teamData = {}, currentTeam = null;

  // Load the JSON file (ensure correct path)
  fetch('/teamData.json')
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

  // Build thumbs + auto-select first
  function buildPanel(teamKey, members) {
    // 1) Thumbnails
    thumbsContainer.innerHTML = Object.entries(members).map(([name, m]) => {
      const imgPath = m['Profile Image Name']
        ? `images/profilepics/${m['Profile Image Name']}.jpg`
        : null;
      return `
        <div class="thumb" data-member="${name}">
          ${imgPath
            ? `<img src="${imgPath}" alt="${name}" class="thumb-img">`
            : `<div class="thumb-img placeholder"></div>`}
          <span class="thumb-name">${name}</span>
        </div>
      `;
    }).join('');

    // 2) Click handlers for thumbs
    thumbsContainer.querySelectorAll('.thumb').forEach(el => {
      el.addEventListener('click', () => selectMember(el.dataset.member));
    });

    // 3) Activate first thumb by default
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
    detailCard.innerHTML = renderMemberDetail(name, memberData);
  }

  // --- Renders the detail card HTML ---
  function renderMemberDetail(name, m) {
    // Profile photo or placeholder
    const photoHTML = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo">`
      : `<div class="detail-photo placeholder"></div>`;

    // Build social icons under name
    const socialHTML = renderLinks(m.Links);

    // Text card
    const textCard = `
      <div class="detail-text-card">
        <div class="detail-header">
          <h4 class="detail-name">${name} ${flagEmoji(m.Nationalities)}</h4>
          <div class="detail-links">${socialHTML}</div>
        </div>
        <p class="detail-blurb">${m.Blurb || ''}</p>
      </div>
    `;

    // Favorite games
    const gamesHTML = renderGames(m['Favourite Games']);

    // Favorites (drinks & snacks)
    const favsHTML = renderSnackSection(m['Favourite Drink'], m['Favourite Snack']);

    return `
      <div class="detail-grid">
        <div class="photo-cell">${photoHTML}</div>
        <div class="text-cell">${textCard}</div>
      </div>
      ${gamesHTML}
      ${favsHTML}
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
            <img src="/microstudio/icons/steam.svg" class="steam-icon" alt="Steam"> 
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
