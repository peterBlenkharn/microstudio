// ===== Team Details & Staff Section =====
// Fetches teamdata.json (cohort-based schema), powers the expandable
// team detail panel and populates the staff section.

document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  const thumbsContainer = detailsContainer.querySelector('.member-thumbs-vertical');
  const detailCard = detailsContainer.querySelector('.member-detail-card');
  let teamData = {};
  let currentTeam = null;

  // Load JSON
  fetch('teamdata.json')
    .then(r => r.json())
    .then(json => {
      teamData = json;
      // Build staff from current cohort's management + creatives
      const currentCohort = json.cohorts?.['2026'];
      if (currentCohort) {
        const staffMembers = [
          ...(currentCohort.management || []),
          ...(currentCohort.creatives || [])
        ];
        buildStaffSection(staffMembers);
      }
    })
    .catch(e => console.error('teamdata.json load error:', e));

  // Get members for a team key — supports new schema (teams.X.members)
  // and falls back to old schema (direct root keys) for compatibility
  function getTeamMembers(teamKey) {
    if (teamData.teams && teamData.teams[teamKey]) {
      return teamData.teams[teamKey].members;
    }
    // Fallback for old schema
    if (teamData[teamKey]) {
      return teamData[teamKey];
    }
    return null;
  }

  // Toggle team details on "Learn More"
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    e.preventDefault();

    const gameCard = e.target.closest('.game-card');
    const teamKey = gameCard.dataset.team;
    const members = getTeamMembers(teamKey);
    if (!members) return;

    if (currentTeam === teamKey) {
      detailsContainer.hidden = true;
      currentTeam = null;
    } else {
      currentTeam = teamKey;
      buildPanel(teamKey, members);
      detailsContainer.hidden = false;

      // Smooth scroll to details
      setTimeout(() => {
        detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  });

  // Build thumbnail sidebar + auto-select first member
  function buildPanel(teamKey, members) {
    thumbsContainer.innerHTML = Object.entries(members).map(([name, m]) => {
      const imgUrl = m['Profile Image Name']
        ? `images/profilepics/${m['Profile Image Name']}.jpg`
        : null;
      return `
        <div class="thumb" data-member="${escapeHtml(name)}">
          ${imgUrl
            ? `<img src="${imgUrl}" alt="${escapeHtml(name)}" class="thumb-img" loading="lazy">`
            : '<div class="thumb-img placeholder"></div>'}
          <span class="thumb-name">${escapeHtml(name.split(' ')[0])}</span>
        </div>
      `;
    }).join('');

    thumbsContainer.querySelectorAll('.thumb').forEach(el =>
      el.addEventListener('click', () => selectMember(el.dataset.member))
    );

    selectMember(Object.keys(members)[0]);
  }

  // Select and render a member
  function selectMember(name) {
    thumbsContainer.querySelectorAll('.thumb').forEach(el =>
      el.classList.toggle('active', el.dataset.member === name)
    );
    const members = getTeamMembers(currentTeam);
    if (!members || !members[name]) return;
    detailCard.innerHTML = renderMemberDetail(name, members[name]);
  }

  // Render member detail HTML
  function renderMemberDetail(name, m) {
    const photo = m['Profile Image Name']
      ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="detail-photo" alt="${escapeHtml(name)}" loading="lazy">`
      : '<div class="detail-photo placeholder"></div>';

    const links = buildSocialLinks(m.Links || {});

    // Show role if present
    const role = m.role || m.Title || '';
    const roleHtml = role
      ? `<span class="role-badge">${escapeHtml(role)}</span>`
      : '';

    const header = `
      <div class="detail-header">
        ${photo}
        <div class="detail-title-links">
          <h4 class="detail-name">${escapeHtml(name)} ${flagEmoji(m.Nationalities)}</h4>
          ${roleHtml}
          <div class="detail-links">${links}</div>
        </div>
      </div>
    `;

    const blurb = m.Blurb
      ? `<div class="detail-blurb-block"><p class="detail-blurb">${escapeHtml(m.Blurb)}</p></div>`
      : '';

    const rowHtml = renderGamesRow(m);
    return header + blurb + rowHtml;
  }

  // Build social link icons
  function buildSocialLinks(linksObj) {
    const iconMap = {
      Github: 'icons/github.svg',
      LinkedIn: 'icons/linkedin.svg',
      itchio: 'icons/itchio.svg',
      Instagram: 'icons/instagram.svg',
      Tiktok: 'icons/tiktok.svg'
    };

    return Object.entries(linksObj)
      .filter(([, url]) => url && url.trim())
      .map(([key, url]) => {
        const href = url.startsWith('http') ? url : `https://${url}`;
        const icon = iconMap[key] || 'icons/link.svg';
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="social-link" title="${escapeHtml(key)}">
          <img src="${icon}" alt="${escapeHtml(key)}" class="social-icon">
        </a>`;
      }).join('');
  }

  // Render favourite games + drink/snack row
  function renderGamesRow(member) {
    const list = Object.values(member['Favourite Games'] || {}).filter(g => g['Game Name']);
    if (!list.length) return '';

    const gamesHtml = list.map(g => {
      const thumbHtml = g['Image Name']
        ? `<div class="game-thumb" style="background-image:url('images/gamepics/${g['Image Name']}.jpg')"></div>`
        : '<div class="game-thumb placeholder"></div>';

      return `
        <div class="game-fav-item">
          ${thumbHtml}
          <div class="game-info">
            <img src="icons/steamicon.png" class="game-steam-icon" alt="Steam">
            <span class="game-title">${escapeHtml(g['Game Name'])}</span>
          </div>
        </div>
      `;
    }).join('');

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

  // Helper for drink/snack items
  function renderSnackHtml(item, type) {
    const key = `${type} Name`;
    if (!item?.[key]) return '';
    return `
      <div class="game-fav-item">
        <div class="game-info">
          <span class="game-title">${escapeHtml(item[key])}</span>
        </div>
      </div>
    `;
  }

  // Escape HTML to prevent XSS from data
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Flag emoji from ISO country codes
  function flagEmoji(codes = []) {
    const A = 0x1F1E6;
    return (codes || []).map(cc =>
      String.fromCodePoint(A + cc.charCodeAt(0) - 65, A + cc.charCodeAt(1) - 65)
    ).join(' ');
  }

  // ===== Staff Section =====
  // Now reads from an array of staff objects (management + creatives)
  // instead of the old "Management Team" keyed object
  function buildStaffSection(staffArray) {
    const container = document.getElementById('staff-cards');
    if (!container || !staffArray || !staffArray.length) return;

    container.innerHTML = staffArray.map(m => {
      const name = m.name || '';
      const photo = m['Profile Image Name']
        ? `<img src="images/profilepics/${m['Profile Image Name']}.jpg" class="staff-card-photo" alt="${escapeHtml(name)}" loading="lazy">`
        : '<div class="staff-card-photo placeholder"></div>';

      const links = buildSocialLinks(m.Links || {});
      const role = m.role || m.Title || '';
      const category = m.category || '';
      const blurb = m.Blurb || '<em>Bio coming soon.</em>';

      return `
        <div class="staff-card">
          ${photo}
          <h3 class="staff-card-name">${escapeHtml(name)} ${flagEmoji(m.Nationalities)}</h3>
          ${role ? `<p class="staff-card-role">${escapeHtml(role)}</p>` : ''}
          <p class="staff-card-blurb">${m.Blurb ? escapeHtml(m.Blurb) : '<em>Bio coming soon.</em>'}</p>
          <div class="staff-card-links">${links}</div>
        </div>
      `;
    }).join('');
  }
});
