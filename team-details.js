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

  // Convert a member array into the object format used by the detail panel.
  function normaliseMembers(members) {
    if (!members) return null;
    if (Array.isArray(members)) {
      return Object.fromEntries(
        members
          .filter(m => m && m.name)
          .map(m => [m.name, m])
      );
    }
    return members;
  }

  // Get members for a team key — supports:
  // 1. current cohort subteams: cohorts.2026.subteams.X.members
  // 2. older team schema: teams.X.members
  // 3. legacy root keys
  function getTeamMembers(teamKey) {
    const currentCohort = teamData.cohorts?.['2026'];
    const subteamMembers = currentCohort?.subteams?.[teamKey]?.members;
    if (subteamMembers) {
      return normaliseMembers(subteamMembers);
    }

    if (teamData.teams && teamData.teams[teamKey]) {
      return normaliseMembers(teamData.teams[teamKey].members);
    }

    if (teamData[teamKey]) {
      return normaliseMembers(teamData[teamKey]);
    }

    return null;
  }

  // ===== Team Member Cards from Subteams =====
  function buildTeamCards(subteams) {
    const container = document.getElementById('team-cards');
    if (!container) return;

    const entries = Object.entries(subteams || {});
    const hasMembers = entries.some(([, st]) =>
      Array.isArray(st.members) && st.members.length > 0
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

    container.innerHTML = entries.flatMap(([subteamKey, subteam]) => {
  const teamTitle = subteam.title || subteam.name || subteamKey;
  const leaderName = subteam.leader || '';

  return (subteam.members || []).map(member => {
    const name = member.name || '';
    const displayName = member['Preferred Name'] || name;
    const imgUrl = member['Profile Image Name']
      ? `images/profilepics/${member['Profile Image Name']}.jpg`
      : null;

    const isLeader = samePerson(name, leaderName) || samePerson(displayName, leaderName);

    return `
      <article class="card game-card team-member-card${isLeader ? ' is-team-leader' : ''}"
        data-subteam="${escapeHtml(teamTitle)}"
        data-team="${escapeHtml(subteamKey)}"
        data-member="${escapeHtml(name)}">

        <div class="game-art team-member-art">
          ${imgUrl
            ? `<img src="${imgUrl}" alt="${escapeHtml(name)}" loading="lazy">`
            : '<div class="team-member-placeholder" aria-hidden="true"></div>'}
        </div>

        <div class="card-body team-member-card-content">
          <p class="eyebrow">${escapeHtml(teamTitle)}</p>

          <h3 class="project-title">
            ${escapeHtml(displayName)} ${flagEmoji(member.Nationalities)}
          </h3>

          ${isLeader ? '<span class="team-leader-badge">Team Leader</span>' : ''}

          <a href="#" class="btn btn-primary small btn-learn-more">Learn More</a>
        </div>
      </article>
    `;
  });
}).join('');
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

      // Filter cards by subteam
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
      const selectedMember = gameCard?.dataset.member || null;
      buildPanel(teamKey, members, selectedMember);
      detailsContainer.hidden = false;

      setTimeout(() => {
        detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  });

  // Build thumbnail sidebar + auto-select first member
  function buildPanel(teamKey, members, initialMember = null) {
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

    const firstMember = Object.keys(members)[0];
    const memberToSelect = initialMember && members[initialMember]
      ? initialMember
      : firstMember;
    selectMember(memberToSelect);
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

  // ===== Escape Key to Close Detail Panel =====
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !detailsContainer.hidden) {
      detailsContainer.hidden = true;
      currentTeam = null;
    }
  });

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
