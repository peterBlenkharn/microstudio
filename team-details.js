// ===== Team Details, Staff Section & FAQ =====
// Fetches teamdata.json (cohort-based schema), powers the expandable
// team detail panel, populates the staff section, and handles FAQ accordion.

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
      const currentCohort = json.cohorts?.['2026'];
      if (currentCohort) {
        // Build staff from management + creatives
        const staffMembers = [
          ...(currentCohort.management || []),
          ...(currentCohort.creatives || [])
        ];
        buildStaffSection(staffMembers);

        // Build team member cards from subteams
        buildTeamCards(currentCohort.subteams || {});
      }
    })
    .catch(e => console.error('teamdata.json load error:', e));

  // Get members for a team key — supports new schema (teams.X.members)
  // and falls back to old schema (direct root keys) for compatibility
  function getTeamMembers(teamKey) {
    if (teamData.teams && teamData.teams[teamKey]) {
      return teamData.teams[teamKey].members;
    }
    if (teamData[teamKey]) {
      return teamData[teamKey];
    }
    return null;
  }

  // ===== Team Member Cards from Subteams =====
  function buildTeamCards(subteams) {
    const container = document.getElementById('team-cards');
    if (!container) return;

    // If subteams have no members yet, show a placeholder
    const hasMembers = Object.values(subteams).some(st =>
      st.members && st.members.length > 0
    );

    if (!hasMembers) {
      container.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <h3>Team roster coming soon</h3>
          <p>Our Cohort 3 team members will be announced here shortly.</p>
        </div>
      `;
      return;
    }

    // Build cards for each subteam member
    // (Implementation for when members are populated)
  }

  // ===== Subteam Tab Filtering =====
  const tabNav = document.querySelector('.subteam-nav');
  if (tabNav) {
    tabNav.addEventListener('click', e => {
      const tab = e.target.closest('.subteam-tab');
      if (!tab) return;

      tabNav.querySelectorAll('.subteam-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards by subteam (when populated)
      const filter = tab.dataset.filter;
      const cards = document.querySelectorAll('#team-cards .game-card');
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.subteam === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Toggle team details on "Learn More"
  document.body.addEventListener('click', e => {
    if (!e.target.matches('.btn-learn-more')) return;
    e.preventDefault();

    const gameCard = e.target.closest('.game-card, .archive-card');
    const teamKey = gameCard?.dataset.team;
    const members = getTeamMembers(teamKey);
    if (!members) return;

    if (currentTeam === teamKey) {
      detailsContainer.hidden = true;
      currentTeam = null;
    } else {
      currentTeam = teamKey;
      buildPanel(teamKey, members);
      detailsContainer.hidden = false;

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
        <div class="thumb" data-member="${escapeHtml(name)}" tabindex="0" role="button" aria-label="View ${escapeHtml(name)}">
          ${imgUrl
            ? `<img src="${imgUrl}" alt="${escapeHtml(name)}" class="thumb-img" loading="lazy">`
            : '<div class="thumb-img placeholder"></div>'}
          <span class="thumb-name">${escapeHtml(name.split(' ')[0])}</span>
        </div>
      `;
    }).join('');

    thumbsContainer.querySelectorAll('.thumb').forEach(el => {
      el.addEventListener('click', () => selectMember(el.dataset.member));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectMember(el.dataset.member);
        }
      });
    });

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

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
