
/*
  team-details.js — Enhanced version
*/
document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  let teamData = {}, openTeamKey = null;

  // 1) Fetch JSON data
  fetch('/microstudio/teamdata.json')
    .then(r => r.json())
    .then(json => teamData = json)
    .catch(e => console.error('teamData.json load error', e));

  // 2) Handle Learn More clicks
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    const card = e.target.closest('.game-card');
    const key = card.dataset.team;
    e.preventDefault();
    if (!teamData[key]) return;
    openTeamKey === key ? hideDetails() : showDetails(key);
  });

  function showDetails(key) {
    openTeamKey = key;
    const members = teamData[key] || {};
    detailsContainer.innerHTML = renderDetails(key, members);
    detailsContainer.hidden = false;
  }
  function hideDetails() {
    openTeamKey = null;
    detailsContainer.hidden = true;
    detailsContainer.innerHTML = '';
  }

  // 3) Render full details panel with carousel
  function renderDetails(key, members) {
    const items = Object.entries(members).map(([name,data]) => renderMember(name, data));
    return `
      <h3 class="details-heading">${key.replace(/ Team$/,'')} Members</h3>
      <div class="member-carousel">${items.join('')}</div>
    `;
  }

  // 4) Render single member card
  function renderMember(name, m) {
  return `
    <div class="member-card">
      <!-- Profile PHOTO or placeholder -->
      ${m['Profile Image Name']
        ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" alt="${name}" class="member-photo">`
        : `<div class="member-photo placeholder"></div>`
      }
      <!-- Name + flags -->
      <h4 class="member-name">${name} ${flagEmoji(m.Nationalities)}</h4>
  
      <!-- Social Links under name -->
      ${renderLinks(m.Links)}
  
      <!-- Fixed-height blurb container -->
      ${m.Blurb
        ? `<div class="member-blurb">${m.Blurb}</div>`
        : `<div class="member-blurb placeholder-blurb"></div>`
      }
  
      <!-- Favourite Games (max 3) -->
      ${renderGames(m['Favourite Games'])}
  
      <!-- Drinks & Snacks -->
      <div class="member-drinks-snacks">
        ${renderSnack('drink', m['Favourite Drink'])}
        ${renderSnack('snack', m['Favourite Snack'])}
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
