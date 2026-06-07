// Git Onboarding Sandbox Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Handler
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Set default theme or load saved
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  });

  // Roster Setup
  const FULL_ROSTER = [
    { id: 'mentor', displayName: 'Alex Mercer (Mentor)', type: 'mentor' },
    { id: 'intern-a', displayName: 'Intern A', type: 'intern' },
    { id: 'intern-b', displayName: 'Intern B', type: 'intern' },
    { id: 'intern-c', displayName: 'Intern C', type: 'intern' },
    { id: 'intern-d', displayName: 'Intern D', type: 'intern' },
    { id: 'intern-e', displayName: 'Intern E', type: 'intern' }
  ];

  // DOM Elements
  const cardsContainer = document.getElementById('cards-container');
  const rosterList = document.getElementById('roster-list');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Application State
  let registeredMemberIds = [];
  let loadedProfiles = [];
  let activeFilter = 'all';
  let searchQuery = '';

  // Initialize App
  init();

  async function init() {
    try {
      // 1. Fetch the team database registry
      const response = await fetch('team.json');
      if (!response.ok) {
        throw new Error('Failed to load team.json database.');
      }
      const data = await response.json();
      registeredMemberIds = data.members || [];
      
      // 2. Load profiles for all registered members
      loadedProfiles = await loadAllProfiles(registeredMemberIds);
      
      // 3. Render initial views
      renderOnboardingProgress();
      renderProfiles();

      // 4. Set up Search and Filter listeners
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProfiles();
      });

      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeFilter = btn.getAttribute('data-filter');
          renderProfiles();
        });
      });

    } catch (err) {
      console.error(err);
      renderErrorState(err.message);
    }
  }

  // Load profile file for each registered member ID in parallel
  async function loadAllProfiles(ids) {
    const profilePromises = ids.map(async (id) => {
      try {
        const response = await fetch(`profiles/profile-${id}.json`);
        if (!response.ok) {
          // Special fallback case: if the file name is profile-<id>.json or mentor
          // Let's try direct profiles/mentor.json for mentor, profile-mentor.json etc
          const fallbackPath = id === 'mentor' ? 'profiles/mentor.json' : `profiles/profile-${id}.json`;
          const fallbackResponse = await fetch(fallbackPath);
          if (!fallbackResponse.ok) {
            throw new Error(`Profile file profiles/profile-${id}.json not found.`);
          }
          return await fallbackResponse.json();
        }
        return await response.json();
      } catch (error) {
        // Return placeholder structure to represent a pending/broken merge
        // This is highly educational for the interns
        return {
          id: id,
          name: `Pending Profile: ${id}`,
          role: 'Profile File Missing',
          bio: `The user ID "${id}" is added in team.json, but the corresponding file "profiles/profile-${id}.json" was not merged into this branch yet. Make sure your PR adding the file is approved and merged!`,
          skills: ['Git Merge Needed'],
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
          isPlaceholder: true
        };
      }
    });
    
    return Promise.all(profilePromises);
  }

  // Render Onboarding Progress Section
  function renderOnboardingProgress() {
    rosterList.innerHTML = '';
    let activeCount = 0;

    FULL_ROSTER.forEach(member => {
      const isRegistered = registeredMemberIds.includes(member.id);
      if (isRegistered) {
        activeCount++;
      }

      const li = document.createElement('li');
      li.className = 'roster-item';
      
      const seedName = isRegistered ? member.id : 'anonymous';
      const avatarUrl = member.id === 'mentor' 
        ? 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex'
        : `https://api.dicebear.com/7.x/adventurer/svg?seed=${seedName}`;
      
      li.innerHTML = `
        <img class="roster-avatar" src="${avatarUrl}" alt="${member.displayName}">
        <span>${member.displayName}</span>
        <span class="roster-status-dot ${isRegistered ? 'active' : 'pending'}"></span>
      `;
      rosterList.appendChild(li);
    });

    // Update progress stats
    progressText.textContent = `${activeCount} / ${FULL_ROSTER.length} Completed`;
    const percentage = (activeCount / FULL_ROSTER.length) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  // Filter and Render Profile Cards
  function renderProfiles() {
    cardsContainer.innerHTML = '';
    
    const filtered = loadedProfiles.filter(profile => {
      // Role Filter Logic
      if (activeFilter === 'mentor' && profile.id !== 'mentor') return false;
      if (activeFilter === 'intern' && profile.id === 'mentor') return false;
      
      // Search Box Logic
      if (searchQuery) {
        const nameMatch = profile.name.toLowerCase().includes(searchQuery);
        const bioMatch = profile.bio.toLowerCase().includes(searchQuery);
        const skillMatch = profile.skills.some(skill => skill.toLowerCase().includes(searchQuery));
        return nameMatch || bioMatch || skillMatch;
      }
      
      return true;
    });

    if (filtered.length === 0) {
      cardsContainer.innerHTML = `
        <div class="loading-state">
          <p>No team members match the search query.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(profile => {
      const card = document.createElement('article');
      card.className = `profile-card glass ${profile.isPlaceholder ? 'placeholder-glow' : ''}`;
      card.id = `card-${profile.id}`;

      // Build Skill tags list
      const skillsHTML = profile.skills.map(skill => `<li class="skill-tag">${skill}</li>`).join('');

      card.innerHTML = `
        <div class="profile-header">
          <div class="avatar-container">
            <img class="profile-avatar" src="${profile.avatarUrl}" alt="${profile.name}">
          </div>
          <div class="title-container">
            <h3 class="profile-name">${profile.name}</h3>
            <span class="profile-role-badge">${profile.role}</span>
          </div>
        </div>
        <p class="profile-bio">${profile.bio}</p>
        <div>
          <h4 class="skills-title">Skills</h4>
          <ul class="skills-list">
            ${skillsHTML}
          </ul>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  }

  function renderErrorState(message) {
    cardsContainer.innerHTML = `
      <div class="error-state">
        <span style="font-size: 3rem;">⚠️</span>
        <h3>Roster Load Failed</h3>
        <p>${message}</p>
      </div>
    `;
  }
});
