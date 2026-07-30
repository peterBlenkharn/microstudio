// ===== Team Details, Staff Section & FAQ =====
// Fetches teamdata.json (cohort-based schema), powers the expandable
// team detail panel, populates the staff section, and handles FAQ accordion.

document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById('team-details');
  const thumbsContainer = detailsContainer.querySelector('.member-thumbs-vertical');
  const detailCard = detailsContainer.querySelector('.member-detail-card');
  let teamData = {};
  let currentTeam = null;

  // Profile-pic format fallback: jpg → png.
  // Capture phase because `error` events don't bubble.
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    const base = img.dataset.profileFallback;
    if (!base || img.dataset.profileFallbackTried === '1') return;
    img.dataset.profileFallbackTried = '1';
    img.src = `images/profilepics/${base}.png`;
  }, true);

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

  // Get the named leader for a team, where that metadata is available.
  function getTeamLeader(teamKey) {
    const currentCohort = teamData.cohorts?.['2026'];
    return currentCohort?.subteams?.[teamKey]?.leader
      || teamData.teams?.[teamKey]?.leader
      || '';
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
        const profileName = member['Profile Image Name'];

        const isLeader = samePerson(name, leaderName) || samePerson(displayName, leaderName);

        return `
          <article class="card game-card team-member-card${isLeader ? ' is-team-leader' : ''}"
            data-subteam="${escapeHtml(teamTitle)}"
            data-team="${escapeHtml(subteamKey)}"
            data-member="${escapeHtml(name)}">

            <div class="game-art team-member-art">
              ${profileName
                ? profileImgTag(profileName, name)
                : '<div class="team-member-placeholder" aria-hidden="true"></div>'}
            </div>

            <div class="card-body team-member-card-content">
              <p class="eyebrow">${escapeHtml(teamTitle)}</p>

              <h3 class="project-title">
                ${escapeHtml(displayName)} ${flagIcons(member.Nationalities)}
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
      const profileName = m['Profile Image Name'];
      return `
        <div class="thumb" data-member="${escapeHtml(name)}" tabindex="0" role="button" aria-label="View ${escapeHtml(name)}">
          ${profileName
            ? profileImgTag(profileName, name, 'thumb-img')
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
    const member = members[name];
    const leaderName = getTeamLeader(currentTeam);
    const isLeader = samePerson(name, leaderName)
      || samePerson(member['Preferred Name'], leaderName);
    detailCard.innerHTML = renderMemberDetail(name, member, isLeader);
  }

  // Render member detail HTML
  function renderMemberDetail(name, m, isLeader = false) {
    const photo = m['Profile Image Name']
      ? profileImgTag(m['Profile Image Name'], name, 'detail-photo')
      : '<div class="detail-photo placeholder"></div>';

    const links = buildSocialLinks(m.Links || {});

    const role = m.role || m.Title || '';
    const roleHtml = role
      ? `<span class="role-badge">${escapeHtml(role)}</span>`
      : '';
    const leaderHtml = isLeader
      ? '<span class="team-leader-badge team-leader-badge--detail">Team Leader</span>'
      : '';
    const badgesHtml = roleHtml || leaderHtml
      ? `<div class="detail-badges">${roleHtml}${leaderHtml}</div>`
      : '';

    const header = `
      <div class="detail-header">
        ${photo}
        <div class="detail-title-links">
          <h4 class="detail-name">${escapeHtml(name)} ${flagIcons(m.Nationalities)}</h4>
          ${badgesHtml}
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

  // Render favourite games and the optional drink/snack details
  function renderGamesRow(member) {
    const list = Object.values(member['Favourite Games'] || {}).filter(g => g['Game Name']);

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
    const gamesSection = gamesHtml
      ? `
        <div class="favourites-group">
          <h5 class="favourites-heading">
            <img src="icons/steamicon.png" class="favourites-heading-icon" alt="">
            Favourite games
          </h5>
          <div class="favourite-games-grid">
            ${gamesHtml}
          </div>
        </div>
      `
      : '';
    const metaSection = drinkHtml || snackHtml
      ? `
        <div class="favourite-meta-grid">
          ${drinkHtml}
          ${snackHtml}
        </div>
      `
      : '';

    if (!gamesSection && !metaSection) return '';

    return `
      <div class="detail-section">
        ${gamesSection}
        ${metaSection}
      </div>
    `;
  }

  // Helper for drink/snack items
  function renderSnackHtml(item, type) {
    const key = `${type} Name`;
    if (!item?.[key]) return '';
    const label = `Favourite ${type.toLowerCase()}`;
    const icon = type === 'Drink'
      ? `<svg class="favourite-meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M7 8h10l-1 12H8L7 8Z"></path>
          <path d="M9 4h7l2-2"></path>
          <path d="M10 12h4"></path>
        </svg>`
      : `<svg class="favourite-meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8"></circle>
          <circle cx="9" cy="9" r="1"></circle>
          <circle cx="15" cy="11" r="1"></circle>
          <circle cx="11" cy="15" r="1"></circle>
        </svg>`;

    return `
      <div class="favourite-meta-item">
        <div class="favourite-meta-label">
          ${icon}
          <span>${label}</span>
        </div>
        <p class="favourite-meta-value">${escapeHtml(item[key])}</p>
      </div>
    `;
  }

  function samePerson(a, b) {
    return String(a || '')
      .trim()
      .toLowerCase() === String(b || '')
      .trim()
      .toLowerCase();
  }

  // Escape HTML to prevent XSS from data
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Build an <img> for a profile picture. Tries .jpg first;
  // the delegated error listener at the top swaps to .png if the .jpg 404s.
  function profileImgTag(profileName, alt = '', className = '') {
    if (!profileName) return '';
    const safeName  = escapeHtml(profileName);
    const safeAlt   = escapeHtml(alt);
    const safeClass = escapeHtml(className);
    return `<img
      src="images/profilepics/${safeName}.jpg"
      data-profile-fallback="${safeName}"
      alt="${safeAlt}"
      class="${safeClass}"
      loading="lazy">`;
  }

  // Flag images from ISO country codes.
  // Uses FlagsAPI instead of emoji flags because Windows does not reliably render
  // regional indicator emoji as flag glyphs.
  function flagIcons(codes = []) {
    return (codes || [])
      .filter(cc => typeof cc === 'string' && cc.trim().length === 2)
      .map(cc => {
        const code = cc.trim().toUpperCase();
        const safeCode = escapeHtml(code);

        return `
          <span class="flag-icon-wrap" title="${safeCode}" aria-label="${safeCode} flag">
            <img
              src="https://flagsapi.com/${safeCode}/flat/24.png"
              alt="${safeCode} flag"
              class="flag-icon"
              width="24"
              height="18"
              loading="lazy"
              onerror="this.closest('.flag-icon-wrap').classList.add('flag-icon-wrap--failed')"
            >
            <span class="flag-code" aria-hidden="true">${safeCode}</span>
          </span>
        `;
      })
      .join('');
  }

  // ===== Staff Section =====
  function buildStaffSection(staffArray) {
    const container = document.getElementById('staff-cards');
    if (!container || !staffArray || !staffArray.length) return;

    container.innerHTML = staffArray.map(m => {
      const name = m.name || '';
      const photo = m['Profile Image Name']
        ? profileImgTag(m['Profile Image Name'], name, 'staff-card-photo')
        : '<div class="staff-card-photo placeholder"></div>';

      const links = buildSocialLinks(m.Links || {});
      const role = m.role || m.Title || '';

      return `
        <div class="staff-card">
          ${photo}
          <h3 class="staff-card-name">${escapeHtml(name)} ${flagIcons(m.Nationalities)}</h3>
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
