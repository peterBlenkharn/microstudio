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
    // 1. Create thumbnails
    thumbsContainer.innerHTML = Object.keys(members)
      .map(name => `<button class="thumb-btn" data-member="${name}">${name}</button>`)
      .join('');

    // 2. Hook thumb clicks
    thumbsContainer.querySelectorAll('.thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => selectMember(btn.dataset.member));
    });

    // 3. Auto-select first member
    selectMember(Object.keys(members)[0], members);
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
    // Profile or placeholder
    const photoHTML = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo">`
      : `<div class="detail-photo placeholder"></div>`;

    // Text block
    const textBlock = `
      <div class="detail-text-card">
        <h4 class="detail-name">${name} ${flagEmoji(m.Nationalities)}</h4>
        ${renderLinks(m.Links)}
        <p class="detail-blurb">${m.Blurb || ''}</p>
      </div>
    `;

    // Games row
    const gamesHTML = renderGames(m['Favourite Games']);

    // Drinks/snacks row
    const snacksHTML = `
      <div class="detail-snacks">
        ${renderSnack('drink', m['Favourite Drink'])}
        ${renderSnack('snack', m['Favourite Snack'])}
      </div>
    `;

    return `
      <div class="detail-grid">
        <div class="photo-cell">${photoHTML}</div>
        <div class="text-cell">${textBlock}</div>
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
  function renderGames(g=[]) {
    const list = Object.values(g).filter(x=>x['Game Name']); if(!list.length) return '';
    return `<div class="member-games">${list.map(x=>{
      const url = x['Image Name'] ? `images/gamepics/${x['Image Name']}.jpg` : '';
      return `
        <a href="${x['Steam Link']}" target="_blank" class="game-link">
          ${url ? `<div class="game-thumb" style="background-image:url('${url}')"></div>`
               : `<div class="game-thumb placeholder"></div>`}
          <span>${x['Game Name']}</span>
        </a>`;
    }).join('')}</div>`;
  }
  function renderSnack(type,obj={}){
    const key=type.charAt(0).toUpperCase()+type.slice(1)+' Name';
    if(!obj[key])return'';
    return `<div class="member-${type}">
      <img src="images/${type}pics/${obj['Image Name']}.jpg" alt="${obj[key]}" class="${type}-thumb">
      <span>${obj[key]}</span>
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
