/*
  Enhanced team-details.js
  ------------------------
  - Builds thumbnail list
  - Handles selection & arrow positioning
  - Renders detail card on the right
*/

document.addEventListener('DOMContentLoaded', () => {
  const details = document.getElementById('team-details');
  const thumbsContainer = details.querySelector('.member-thumbs');
  const cardContainer  = details.querySelector('.member-detail-card');
  const arrowEl        = details.querySelector('.details-arrow');

  let teamData = {}, currentTeam = null;

  // Load JSON data
  fetch('/microstudio/teamdata.json')
    .then(r => r.json())
    .then(json => teamData = json)
    .catch(err => console.error('Error loading teamdata.json', err));

  // Learn More -> show panel and build thumbs
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    const card = e.target.closest('.game-card');
    const teamKey = card.dataset.team;
    if (!teamData[teamKey]) return;
    e.preventDefault();

    // If same team, hide panel
    if (currentTeam === teamKey) {
      details.hidden = true;
      currentTeam = null;
      return;
    }

    // Show and build panel
    currentTeam = teamKey;
    buildPanel(teamKey, teamData[teamKey]);
    details.hidden = false;
  });

  function buildPanel(teamKey, members) {
    // Render thumbnail list
    thumbsContainer.innerHTML = Object.entries(members).map(([name,m]) => {
      const imgSrc = m['Profile Image Name']
        ? `images/profilepics/${m['Profile Image Name']}.jpg`
        : null;
      return `
        <div class="thumb" data-member="${name}">
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${name}" class="thumb-img">`
            : `<div class="thumb-img placeholder"></div>`
          }
          <span class="thumb-name">${name}</span>
        </div>
      `;
    }).join('');
  
    // Attach click handlers
    thumbsContainer.querySelectorAll('.thumb').forEach(el => {
      el.addEventListener('click', () => selectMember(el.dataset.member));
    });
  
    // Auto-select first
    selectMember(Object.keys(members)[0]);
  }

  function selectMember(name) {
    const memberData = teamData[currentTeam][name];
    if (!memberData) return;

    // 4. Render detail card HTML
    cardContainer.innerHTML = renderMemberDetail(name, memberData);

    // 5. Position arrow under the correct thumbnail
    const btn = thumbsContainer.querySelector(`button[data-member="${name}"]`);
    const rect = btn.getBoundingClientRect();
    const parentRect = details.getBoundingClientRect();
    const offsetLeft = rect.left + rect.width/2 - parentRect.left;
    arrowEl.style.left = offsetLeft + 'px';
  }

  function renderMemberDetail(name, m) {
    // Profile vs placeholder
    const profileHTML = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo">`
      : `<div class="detail-photo placeholder"></div>`;
  
    // Social icons (smaller)
    const linksHTML = renderLinks(m.Links);
  
    // Text block
    const textCard = `
      <div class="detail-text-card">
        <div class="detail-header">
          <h4 class="detail-name">${name} ${flagEmoji(m.Nationalities)}</h4>
          <div class="detail-links">${linksHTML}</div>
        </div>
        <p class="detail-blurb">${m.Blurb || ''}</p>
      </div>
    `;
  
    // Games row with Steam icon before title
    const gamesHTML = renderGames(m['Favourite Games']);
  
    // Snacks & drinks
    const snacksHTML = renderSnackSection(m['Favourite Drink'], m['Favourite Snack']);
  
    return `
      <div class="detail-grid">
        <div class="photo-cell">${profileHTML}</div>
        <div class="text-cell">${textCard}</div>
      </div>
      ${gamesHTML}
      ${snacksHTML}
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
