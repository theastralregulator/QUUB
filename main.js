// ===== Starfield =====
const starsContainer = document.getElementById('stars');
if (starsContainer) {
  const COUNT = 55;
  for (let i = 0; i < COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'star-dot';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.top  = Math.random() * 100 + '%';
    const dur   = (2.5 + Math.random() * 4).toFixed(2) + 's';
    const delay = (Math.random() * 5).toFixed(2)        + 's';
    const op    = (0.3 + Math.random() * 0.65).toFixed(2);
    dot.style.setProperty('--dur',   dur);
    dot.style.setProperty('--delay', delay);
    dot.style.setProperty('--op',    op);
    starsContainer.appendChild(dot);
  }
}

// ===== Button ripple =====
function addRipple(btn) {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(255,255,255,0.25);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.55s ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }`;
document.head.appendChild(style);

// ===== Password toggle =====
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const input = toggle.parentElement.querySelector('input');
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Update icon (optional, could toggle between eye and eye-off)
    const icon = toggle.querySelector('svg');
    if (type === 'text') {
      icon.style.color = '#a855f7';
    } else {
      icon.style.color = '';
    }
  });
});

// ===== Password strength meter =====
const passwordInput = document.querySelector('#password');
const strengthSegments = document.querySelectorAll('.meter-segment');

if (passwordInput && strengthSegments.length > 0) {
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let strength = 0;
    
    if (val.length > 5) strength++;
    if (val.length > 8 && /[A-Z]/.test(val)) strength++;
    if (val.length > 10 && /[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    
    strengthSegments.forEach((seg, i) => {
      if (i < strength) {
        seg.style.background = strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : '#22c55e';
        seg.style.boxShadow = `0 0 10px ${seg.style.background}44`;
      } else {
        seg.style.background = '';
        seg.style.boxShadow = '';
      }
    });
  });
}

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(addRipple);

// ===== Intersection observer - fade-in on scroll =====
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animationPlayState = 'running';
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.stats, .features, .trust, .feature-card, .auth-card, .auth-feature-item').forEach(el => {
  observer.observe(el);
});

// ===== Country Selector logic =====
const countrySelector = document.querySelector('#country-selector');
const countryDropdown = document.querySelector('#country-dropdown');
const currentFlag = document.querySelector('#current-flag');
const currentCode = document.querySelector('#current-code');

if (countrySelector && countryDropdown) {
  countrySelector.addEventListener('click', (e) => {
    e.stopPropagation();
    countryDropdown.classList.toggle('active');
  });

  document.querySelectorAll('.country-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = option.getAttribute('data-code');
      const flag = option.getAttribute('data-flag');
      
      currentCode.textContent = code;
      currentFlag.src = `https://flagcdn.com/w20/${flag}.png`;
      currentFlag.alt = flag.toUpperCase();
      
      countryDropdown.classList.remove('active');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    countryDropdown.classList.remove('active');
  });
}

