/*
  team-details.js
  ----------------
  Fetches teamData.json and renders a member grid when "Learn More" is clicked.
  Ensures only one panel is open at a time.
*/

document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  let teamData = null;
  let openTeamKey = null;

  // 1. Fetch team data once
  fetch('/teamData.json')
    .then(resp => resp.json())
    .then(json => { teamData = json; })
    .catch(err => console.error('Error loading teamData.json:', err));

  // 2. Attach click handlers
  document.querySelectorAll('.btn-learn-more').forEach(button => {
    button.addEventListener('click', event => {
      const card = event.currentTarget.closest('.game-card');
      const teamKey = card.dataset.team;
      event.preventDefault();

      if (!teamData || !teamData[teamKey]) return;

      // Toggle off if same team
      if (openTeamKey === teamKey) {
        hideDetails();
      } else {
        showDetails(teamKey);
      }
    });
  });

  // 3. Show details for a team
  function showDetails(teamKey) {
    openTeamKey = teamKey;
    const members = teamData[teamKey];
    detailsContainer.innerHTML = renderDetails(teamKey, members);
    detailsContainer.hidden = false;
  }

  // 4. Hide the details panel
  function hideDetails() {
    openTeamKey = null;
    detailsContainer.hidden = true;
    detailsContainer.innerHTML = '';
  }

  // 5. Render HTML for details panel
  function renderDetails(teamKey, members) {
    const cards = Object.entries(members).map(
      ([name, data]) => renderMemberCard(name, data)
    ).join('');

    return `
      <h3 class="details-heading">${teamKey.replace(/ Team$/, '')} Members</h3>
      <div class="member-grid">
        ${cards}
      </div>
    `;
  }

  // 6. Render individual member card
  function renderMemberCard(name, m) {
    return `
      <div class="member-card">
        <img src="images/profilepics/${m['Profile Image Name']}.jpg"
             alt="${name}" class="member-photo">
        <h4 class="member-name">
          ${name} ${renderFlags(m.Nationalities)}
        </h4>
        ${m.Title ? `<p class="member-title">${m.Title}</p>` : ''}
        ${m.Blurb ? `<p class="member-blurb">${m.Blurb}</p>` : ''}
        ${renderGames(m['Favourite Games'])}
        ${renderSnack('drink', m['Favourite Drink'])}
        ${renderSnack('snack', m['Favourite Snack'])}
        ${renderLinks(m.Links)}
      </div>
    `;
  }

  // 7. Helpers for sub-sections

  // 7a. Country code to emoji flags
  function renderFlags(codes = []) {
    const A = 0x1F1E6;
    return (codes || []).map(cc =>
      String.fromCodePoint(
        A + cc.charCodeAt(0) - 65,
        A + cc.charCodeAt(1) - 65
      )
    ).join(' ');
  }

  // 7b. Favourite games
  function renderGames(games = {}) {
    const list = Object.values(games).filter(g => g['Game Name']);
    if (!list.length) return '';
    return `
      <div class="member-games">
        ${list.map(g => `
          <a href="${g['Steam Link']}" target="_blank" class="game-link">
            <img src="images/gamepics/${g['Image Name']}.jpg"
                 alt="${g['Game Name']}" class="game-thumb">
            <span>${g['Game Name']}</span>
          </a>
        `).join('')}
      </div>
    `;
  }

  // 7c. Favourite drink/snack
  function renderSnack(type, obj = {}) {
    const keyName = type.charAt(0).toUpperCase() + type.slice(1) + ' Name';
    if (!obj || !obj[keyName]) return '';
    return `
      <div class="member-${type}">
        <img src="images/${type}pics/${obj['Image Name']}.jpg"
             alt="${obj[keyName]}" class="${type}-thumb">
        <span>${obj[keyName]}</span>
      </div>
    `;
  }

  // 7d. Profile/social links
  function renderLinks(links = {}) {
    const iconMap = {
      Github: '/icons/github.svg',
      LinkedIn: '/icons/linkedin.svg',
      itchio: '/icons/itchio.svg',
      Instagram: '/icons/instagram.svg',
      TikTok: '/icons/tiktok.svg',
      Website: '/icons/link.svg'
    };
    const items = Object.entries(links)
      .filter(([, url]) => url)
      .map(([k, url]) => {
        const href = url.startsWith('http') ? url : 'https://' + url;
        const icon = iconMap[k] || '/icons/link.svg';
        return `
          <a href="${href}" target="_blank" class="member-link">
            <img src="${icon}" alt="${k}" class="link-icon">
          </a>
        `;
      });
    return items.length ? `<div class="member-links">${items.join('')}</div>` : '';
  }
});
