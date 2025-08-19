// Utilities
const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

/* Header */
const menuToggle = $('#menuToggle');
const nav = $('#nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

/* Year */
$('#year').textContent = new Date().getFullYear();

/* Theme (Dark/Light) */
const themeToggle = $('#themeToggle');
const ROOT = document.documentElement;
const THEME_KEY = 'itinerary_theme';
const applyTheme = (mode) => {
  if(mode === 'light'){
    ROOT.style.setProperty('--bg', '#f6f7fb');
    ROOT.style.setProperty('--panel', '#fff');
    ROOT.style.setProperty('--text', '#121212');
    ROOT.style.setProperty('--muted','#555');
    ROOT.style.setProperty('--card','#ffffff');
    ROOT.style.setProperty('--border', '#e6e6ef');
  }else{
    ROOT.style.removeProperty('--bg');
    ROOT.style.removeProperty('--panel');
    ROOT.style.removeProperty('--text');
    ROOT.style.removeProperty('--muted');
    ROOT.style.removeProperty('--card');
    ROOT.style.removeProperty('--border');
  }
  localStorage.setItem(THEME_KEY, mode);
  themeToggle.textContent = mode === 'light' ? '☀️' : '🌙';
};
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggle.addEventListener('click', () => {
  const cur = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});

/* Day Switcher */
const chips = $$('.chip');
const days = $$('.day');
chips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    chips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const d = chip.dataset.day;
    days.forEach(day=>{
      day.classList.toggle('visible', day.dataset.day === d);
    });
    // Scroll into view on mobile
    $('#schedule').scrollIntoView({behavior:'smooth', block:'start'});
  });
});

/* Back to Top */
const backToTop = $('#backToTop');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 400) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
});
backToTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* Packing List Persistence */
const CHECK_KEY = 'itinerary_checks_v1';
const loadChecks = () => JSON.parse(localStorage.getItem(CHECK_KEY) || '{}');
const saveChecks = (state) => localStorage.setItem(CHECK_KEY, JSON.stringify(state));
const state = loadChecks();

$$('.checklist').forEach(list=>{
  const listName = list.dataset.list;
  // restore checked
  $$('.checklist input', list).forEach((cb, i)=>{
    const key = `${listName}:${i}`;
    cb.checked = Boolean(state[key]);
    cb.addEventListener('change', ()=>{
      state[key] = cb.checked;
      saveChecks(state);
    });
  });
});

// Add new item
$('#addItemForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const text = $('#newItemText').value.trim();
  const listName = $('#newItemList').value;
  if(!text) return;
  const list = $(`.checklist[data-list="${listName}"]`);
  const li = document.createElement('li');
  const idx = $$('.checklist li', list).length;
  li.innerHTML = `<label><input type="checkbox"> ${text}</label>`;
  list.appendChild(li);
  // track in state
  const cb = $('input', li);
  const key = `${listName}:${idx}`;
  cb.addEventListener('change', ()=>{
    state[key] = cb.checked;
    saveChecks(state);
  });
  $('#newItemText').value = '';
});

// Clear all checks
$('#clearChecked').addEventListener('click', ()=>{
  $$('.checklist input').forEach(cb=> cb.checked = false);
  localStorage.removeItem(CHECK_KEY);
});

// Print
$('#printBtn').addEventListener('click', ()=> window.print());
