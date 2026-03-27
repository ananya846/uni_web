import { supabase } from './supabaseClient.js'

async function loadFest() {
  const { data: fest, error } = await supabase
    .from('fests')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !fest) {
    console.error("No active fest found", error);
    return;
  }

  document.body.className = 'theme-' + fest.theme;

  document.getElementById('festName').innerHTML = fest.short_name;
  document.getElementById('festSub').textContent = fest.tagline;
  document.getElementById('festDate').textContent =
    `📅 ${fest.date} · ${fest.location}`;

  document.getElementById('fstat1').textContent = fest.participants;
  document.getElementById('fstat2').textContent = fest.events_count;
  document.getElementById('fstat3').textContent = fest.prize_pool;

  spawnParticles(
    fest.theme === 'phaseshift' ? '#00FFD1' : '#FFB347'
  );

  loadEvents(fest.id);
}

async function loadEvents(festId) {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('fest_id', festId);

  if (error) {
    console.error("Error loading events", error);
    return;
  }

  const container = document.getElementById('eventsGrid');
  container.innerHTML = '';

  events.forEach(e => {
    container.innerHTML += `
      <div class="event-card">
        <div class="event-icon">${e.icon}</div>
        <div class="event-name">${e.name}</div>
        <div class="event-type">${e.type}</div>
      </div>
    `;
  });
}

function spawnParticles(color) {
  const container = document.getElementById('particles');
  container.innerHTML = '';

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 8 + 4;

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      background:${color};
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*8+6}s;
      animation-delay:${Math.random()*5}s;
      opacity:0.3;
    `;

    container.appendChild(p);
  }
}

function setTheme(theme, btn) {
  // Remove active from all buttons
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Remove all theme classes
  document.body.classList.remove('theme-phaseshift', 'theme-utsav');

  // Add new theme class if not default
  if (theme !== 'default') {
    document.body.classList.add('theme-' + theme);
  }

  // Update fest content based on theme
  updateFestContent(theme);

  // Generate particles
  if (theme === 'default') {
    document.getElementById('particles').innerHTML = '';
  } else {
    spawnParticles(theme === 'phaseshift' ? '#00FFD1' : '#FFB347');
  }
}

function updateFestContent(theme) {
  const eyebrow = document.getElementById('festEyebrow');
  const name = document.getElementById('festName');
  const sub = document.getElementById('festSub');
  const date = document.getElementById('festDate');
  const stat1 = document.getElementById('fstat1');
  const stat2 = document.getElementById('fstat2');
  const stat3 = document.getElementById('fstat3');
  const eventsTitle = document.getElementById('eventsTitle');
  const eventsGrid = document.getElementById('eventsGrid');

  if (theme === 'phaseshift') {
    eyebrow.textContent = 'BMS College of Engineering Presents';
    name.innerHTML = 'PHASE<span>SHIFT</span>';
    sub.textContent = 'Annual Technical & Cultural Extravaganza';
    date.textContent = '📅 April 19–21, 2024 · BMSCE Campus, Bengaluru';
    stat1.textContent = '10K+';
    stat2.textContent = '50+';
    stat3.textContent = '₹5L+';
    eventsTitle.textContent = 'Technical Events';
    eventsGrid.innerHTML = `
      <div class="event-card"><div class="event-icon">💻</div><div class="event-name">Hackathon — 24 hrs</div><div class="event-type">Technical · Team of 4</div></div>
      <div class="event-card"><div class="event-icon">🤖</div><div class="event-name">Robo Wars</div><div class="event-type">Technical · Combat Robotics</div></div>
      <div class="event-card"><div class="event-icon">🧠</div><div class="event-name">Paper Presentation</div><div class="event-type">Technical · Research</div></div>
      <div class="event-card"><div class="event-icon">🎮</div><div class="event-name">Gaming Arena</div><div class="event-type">Cultural · Esports</div></div>
      <div class="event-card"><div class="event-icon">🎤</div><div class="event-name">Battle of Bands</div><div class="event-type">Cultural · Music</div></div>
      <div class="event-card"><div class="event-icon">💡</div><div class="event-name">Startup Pitch</div><div class="event-type">Technical · Entrepreneurship</div></div>
    `;
  } else if (theme === 'utsav') {
    eyebrow.textContent = 'BMS College of Engineering Presents';
    name.innerHTML = 'UTSA<span>V</span>';
    sub.textContent = 'Annual Cultural Fest';
    date.textContent = '📅 February 14–16, 2024 · BMSCE Campus, Bengaluru';
    stat1.textContent = '5K+';
    stat2.textContent = '30+';
    stat3.textContent = '₹2L+';
    eventsTitle.textContent = 'Cultural Events';
    eventsGrid.innerHTML = `
      <div class="event-card"><div class="event-icon">💃</div><div class="event-name">Dance Competition</div><div class="event-type">Cultural · Solo/Group</div></div>
      <div class="event-card"><div class="event-icon">🎭</div><div class="event-name">Dramatics</div><div class="event-type">Cultural · Theater</div></div>
      <div class="event-card"><div class="event-icon">🎨</div><div class="event-name">Art Exhibition</div><div class="event-type">Cultural · Fine Arts</div></div>
      <div class="event-card"><div class="event-icon">👗</div><div class="event-name">Fashion Show</div><div class="event-type">Cultural · Modeling</div></div>
      <div class="event-card"><div class="event-icon">🎵</div><div class="event-name">Music Night</div><div class="event-type">Cultural · Singing</div></div>
      <div class="event-card"><div class="event-icon">🏆</div><div class="event-name">Talent Hunt</div><div class="event-type">Cultural · Variety</div></div>
    `;
  } else {
    // Default theme - hide fest content
    return;
  }
}

// Make setTheme global for onclick
window.setTheme = setTheme;

loadFest();