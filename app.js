// Initialize Supabase Client
const SUPABASE_URL = 'https://qvgknqjltjawewkrjwxq.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2Z2tucWpsdGphd2V3a3Jqd3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjEyNDUsImV4cCI6MjEwNDQzNzI0NX0.5t-xOr5eG8WMROBImoqJKjJM2kKlhbU1UDo2puYkAN8';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const instagramDefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238e8e8e'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

let currentUser = null;
let selectedTierPrice = 300; 
let selectedTierName = 'Starter Tier';
let paymobPublicKey = 'egy_pk_test_vbzbYyPBfnFoppIsamCZl2ZmO2HiqJef';

const allPortfolioThemes = [
    ['Midnight', '#242a30', '#f5f7f7', '#8da9bd'],
    ['Paper', '#f4f0e8', '#191a18', '#9c978d'],
    ['Slate', '#52606b', '#f5f7f8', '#a9c8dc'],
    ['Mono', '#111111', '#f4f4f0', '#929292'],
    ['Ivory', '#eee5d2', '#33271f', '#c5b28e'],
    ['Graphite', '#303338', '#e7e8e5', '#a7adb5'],
    ['Snow', '#fbfcfa', '#20252a', '#b8d2e4'],
    ['Stone', '#b4aa99', '#171614', '#d5bf9b'],
    ['Ink', '#15191b', '#f0e8d8', '#ba716b'],
    ['Fog', '#d8dadd', '#252a2d', '#8d969d'],
    ['Clean Code', '#f8faf7', '#14263b', '#71a47b'],
    ['Devfolio', '#17283c', '#f4f8fb', '#67b7c8'],
    ['Terminal Lite', '#252b28', '#e8ede5', '#83aa86'],
    ['System', '#d1d5d8', '#151a20', '#7597ba'],
    ['Blueprint', '#173553', '#dbeeff', '#83bfe8'],
    ['Git', '#faf9f5', '#202326', '#d87839'],
    ['Framework', '#36383d', '#f5f5f2', '#b09bd0'],
    ['Compile', '#101212', '#d6d7d3', '#b7cf62'],
    ['Stack', '#f8faf9', '#152d46', '#5eb9c7'],
    ['Source', '#eee6d5', '#171512', '#c88655'],
    ['The Journal', '#f1e9d9', '#1c1916', '#a79b8b'],
    ['Studio', '#f8f7f3', '#181817', '#aaa398'],
    ['Archive', '#d5c3a5', '#32251d', '#a45d5b'],
    ['Index', '#fbfbf8', '#272b2d', '#8a9195'],
    ['Column', '#eeeae0', '#171c19', '#63836d'],
    ['Dispatch', '#ede5d7', '#14283d', '#8897a5'],
    ['Type', '#151515', '#f2f0e9', '#a5a5a0'],
    ['Modernist', '#f8f8f6', '#141414', '#789bb4'],
    ['Print', '#eee5d4', '#171513', '#c68557'],
    ['Volume', '#343839', '#f0eadb', '#c0aa59'],
    ['Obsidian', '#111214', '#f2f2ef', '#9b8bb9'],
    ['Carbon', '#1b1d20', '#dfe2e2', '#7695ad'],
    ['Noir', '#171416', '#f0e4d1', '#934a52'],
    ['Velvet', '#29262e', '#f1eadc', '#9380a7'],
    ['Eclipse', '#111417', '#dfe3e5', '#7592ae'],
    ['Onyx', '#171a18', '#e5e8e1', '#83a681'],
    ['After Hours', '#1d2938', '#f0e6d5', '#c4875d'],
    ['Black Label', '#101010', '#f5f4ef', '#c3a35b'],
    ['Nightshift', '#272e35', '#dce9f3', '#9dbbd1'],
    ['Darkroom', '#151515', '#eee9dd', '#a95d5a'],
    ['Sage', '#e7ebdf', '#222c26', '#7d9a78'],
    ['Ocean', '#f5f8f7', '#122b43', '#5a9f9c'],
    ['Sand', '#d8c3a3', '#35291f', '#8e8170'],
    ['Clay', '#eee0d0', '#3a241b', '#bf7056'],
    ['Moss', '#e8e8d8', '#1e3325', '#718c6a'],
    ['Cloud', '#f8fafb', '#29333b', '#9bbbd2'],
    ['Cedar', '#eee3d1', '#263a2b', '#876348'],
    ['Dawn', '#f6eee3', '#2a2d2c', '#d18c69'],
    ['Gallery', '#f2eee7', '#20201e', '#b46f4b'],
    ['Terminal Pro', '#07130f', '#b9ffd0', '#45f28a'],
    ['Neon Grid', '#17102b', '#f7f0ff', '#e86cff'],
    ['Luxe', '#211d1b', '#f5ead8', '#c7a15a'],
    ['Aurora', '#10252a', '#e4fbf3', '#72d9b0']
].map(([name, background, color, accent]) => ({
    name,
    value: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    background,
    color,
    accent,
    border: accent
}));

const featuredThemeNames = new Set([
    'Midnight', 'Paper', 'Slate', 'Mono', 'Ivory',
    'Graphite', 'Clean Code', 'Devfolio', 'Terminal Lite', 'Blueprint',
    'Git', 'Compile', 'Stack', 'The Journal', 'Studio',
    'Obsidian', 'Noir', 'Ocean', 'Cedar', 'Dawn',
    'Gallery', 'Terminal Pro', 'Neon Grid', 'Luxe', 'Aurora'
]);

const portfolioThemes = allPortfolioThemes.filter(theme => featuredThemeNames.has(theme.name));

function populateThemeSelector(selector) {
    if (!selector || selector.dataset.catalogReady) return;
    selector.innerHTML = portfolioThemes.map((theme, index) => {
        const minimumTier = index < 10 ? 300 : index < 20 ? 600 : 3000;
        return `<option value="${theme.value}" data-min-tier="${minimumTier}">${theme.name}${minimumTier > 300 ? ` - ${minimumTier === 600 ? 'Pro' : 'Enterprise'}` : ''}</option>`;
    }).join('');
    selector.dataset.catalogReady = 'true';
}

function getPortfolioTheme(value) {
    return portfolioThemes.find(theme => theme.value === value) || portfolioThemes[0];
}
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const isDark = localStorage.getItem('aura_theme') === 'dark';
    document.documentElement.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('dark-theme', isDark);
    themeToggleBtn.textContent = isDark ? 'Light' : 'Dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('checkout-is-loading')) return;
        const currentlyDark = document.documentElement.classList.toggle('dark-theme');
        document.body.classList.toggle('dark-theme', currentlyDark);
        
        localStorage.setItem('aura_theme', currentlyDark ? 'dark' : 'light');
        themeToggleBtn.textContent = currentlyDark ? 'Light' : 'Dark';
        themeToggleBtn.setAttribute('aria-label', currentlyDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggleBtn.setAttribute('aria-pressed', String(currentlyDark));
    });
});
document.addEventListener('DOMContentLoaded', async () => {
    initAuthSystem();
    checkUserSession();
    initPlanAndBuilderFlow();
    loadUserOrdersPage();
});

function showNotification(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✨' : '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setCheckoutLoading(isLoading, step = '01 / 03', title = 'Securing your portfolio.', message = 'Saving your build and preparing a protected payment session.') {
    const overlay = document.getElementById('checkout-loading');
    const checkoutButton = document.getElementById('pay-download-btn');
    if (!overlay) return;

    overlay.classList.toggle('hidden', !isLoading);
    document.body.classList.toggle('checkout-is-loading', isLoading);
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn?.toggleAttribute('disabled', isLoading);
    themeToggleBtn?.setAttribute('aria-disabled', String(isLoading));

    if (isLoading) {
        overlay.querySelector('#checkout-loading-step').textContent = step;
        overlay.querySelector('#checkout-loading-title').textContent = title;
        overlay.querySelector('#checkout-loading-message').textContent = message;
        const currentStep = Number.parseInt(step, 10) || 1;
        overlay.style.setProperty('--checkout-progress', `${Math.min(currentStep / 3, 1) * 100}%`);
        overlay.querySelectorAll('.checkout-loading-step').forEach((stepElement, index) => {
            stepElement.classList.toggle('is-active', index < currentStep);
        });
        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.setAttribute('aria-busy', 'true');
        }
    } else if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.removeAttribute('aria-busy');
    }
}

// Function to update all avatar elements across the DOM and cache it
function setCachedAvatar(avatarUrl) {
    if (avatarUrl) {
        sessionStorage.setItem('aura_cached_avatar', avatarUrl);
    }
    
    const cachedUrl = avatarUrl || sessionStorage.getItem('aura_cached_avatar');
    
    if (cachedUrl) {
        document.querySelectorAll('#nav-avatar-img, #dropdown-avatar-preview, #modal-preview-avatar').forEach(img => {
            if (img) img.src = cachedUrl;
        });
    }
}

async function handleUserSession(user) {
    const cached = sessionStorage.getItem('aura_cached_avatar');
    if (cached) {
        setCachedAvatar(cached);
    }

    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    if (profile && profile.avatar_url) {
        setCachedAvatar(profile.avatar_url);
    }
}

document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    sessionStorage.removeItem('aura_cached_avatar');
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
});

function initPlanAndBuilderFlow() {
    const builderSection = document.getElementById('builder');
    populateThemeSelector(document.getElementById('template-selector'));
    
    const savedPrice = sessionStorage.getItem('selectedTierPrice');
    const savedName = sessionStorage.getItem('selectedTierName');
    if (savedPrice && builderSection) {
        selectedTierPrice = parseInt(savedPrice, 10);
        selectedTierName = savedName || 'Starter Tier';
        builderSection.style.display = 'block';
        applyTierRestrictions(selectedTierPrice);
    }

    document.querySelectorAll('.select-plan-btn').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (!currentUser) {
                showNotification('Please sign in or register first to select a plan.', 'error');
                document.getElementById('auth-modal')?.classList.remove('hidden');
                return;
            }

            selectedTierPrice = parseInt(e.currentTarget.getAttribute('data-price') || '300', 10);
            selectedTierName = e.currentTarget.getAttribute('data-name') || 'Starter Tier';

            sessionStorage.setItem('selectedTierPrice', selectedTierPrice);
            sessionStorage.setItem('selectedTierName', selectedTierName);

            if (builderSection) {
                builderSection.style.display = 'block';
                builderSection.scrollIntoView({ behavior: 'smooth' });
            }

            applyTierRestrictions(selectedTierPrice);
            showNotification(`Unlocked builder for ${selectedTierName} (${selectedTierPrice} EGP)!`, 'success');
            initBuilderCanvasListeners();
        });
    });

    if (builderSection && savedPrice) {
        initBuilderCanvasListeners();
    }
}

function applyTierRestrictions(price) {
    window.selectedTierPrice = price;

    const templateSelector = document.getElementById('template-selector');
    if (templateSelector) {
        populateThemeSelector(templateSelector);
        templateSelector.querySelectorAll('option[data-min-tier]').forEach(option => {
            option.disabled = price < Number(option.dataset.minTier);
        });
        const selectedOption = templateSelector.selectedOptions[0];
        if (!selectedOption || selectedOption.disabled) {
            templateSelector.value = price >= 3000 ? portfolioThemes[30].value : price >= 600 ? portfolioThemes[10].value : portfolioThemes[0].value;
        }
    }

    const imgGroup = document.getElementById('img-group');
    const contactsGroup = document.getElementById('contacts-section-wrap') || document.getElementById('contacts-container')?.closest('.form-group');
    const socialsGroup = document.getElementById('socials-section-wrap') || document.getElementById('socials-container')?.closest('.form-group');
    const projectGroup = document.getElementById('project-section-wrap') || document.getElementById('projects-container')?.closest('.form-group');

    const prevImgWrap = document.getElementById('prev-img-wrap');
    const prevContacts = document.getElementById('prev-contacts');
    const prevSocials = document.getElementById('prev-socials');
    const prevProjectWrap = document.getElementById('prev-project-container') || document.querySelector('.project-card-preview');

    if (price === 300) {
        if (imgGroup) imgGroup.style.display = 'none';
        if (contactsGroup) contactsGroup.style.display = 'none';
        if (socialsGroup) socialsGroup.style.display = 'none';
        if (projectGroup) projectGroup.style.display = 'none';
        
        if (prevImgWrap) prevImgWrap.style.display = 'none';
        if (prevContacts) prevContacts.innerHTML = '';
        if (prevSocials) prevSocials.innerHTML = '';
        if (prevProjectWrap) prevProjectWrap.style.display = 'none';
    } 
    else if (price === 600) {
        if (imgGroup) imgGroup.style.display = 'block';
        if (contactsGroup) contactsGroup.style.display = 'block';
        if (socialsGroup) socialsGroup.style.display = 'block';
        if (projectGroup) projectGroup.style.display = 'none';
        
        if (prevImgWrap) prevImgWrap.style.display = 'block';
        if (prevProjectWrap) prevProjectWrap.style.display = 'none';
        
        updateContactsAndSocialsPreview();
    } 
    else {
        if (imgGroup) imgGroup.style.display = 'block';
        if (contactsGroup) contactsGroup.style.display = 'block';
        if (socialsGroup) socialsGroup.style.display = 'block';
        if (projectGroup) projectGroup.style.display = 'block';
        
        if (prevImgWrap) prevImgWrap.style.display = 'block';
        if (prevProjectWrap) prevProjectWrap.style.display = 'block';
        
        updateContactsAndSocialsPreview();
    }
}

function updateContactsAndSocialsPreview() {
    if (typeof selectedTierPrice !== 'undefined' && selectedTierPrice < 600) {
        const contactsPrev = document.getElementById('prev-contacts');
        const socialsPrev = document.getElementById('prev-socials');
        if (contactsPrev) contactsPrev.innerHTML = '';
        if (socialsPrev) socialsPrev.innerHTML = '';
        return;
    }

    const contactInputs = document.querySelectorAll('.contact-input');
    const contactsPrev = document.getElementById('prev-contacts');
    if (contactsPrev) {
        let contactsHtml = '';
        contactInputs.forEach(input => {
            const val = input.value.trim();
            if (val) {
                const isEmail = val.includes('@');
                const iconSvg = isEmail 
                    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
                    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
                contactsHtml += `<span style="display:inline-flex; align-items:center; gap:6px; margin: 0 8px; padding: 6px 12px; background: rgba(255,255,255,0.08); border-radius: 20px; font-size: 0.85rem;">${iconSvg} ${val}</span>`;
            }
        });
        contactsPrev.innerHTML = contactsHtml;
    }

    const socialRows = document.querySelectorAll('#socials-container .dynamic-row');
    const socialsPrev = document.getElementById('prev-socials');
    if (socialsPrev) {
        let socialsHtml = '';
        socialRows.forEach(row => {
            const platformSelect = row.querySelector('.social-platform');
            const platform = platformSelect ? platformSelect.value.toLowerCase() : '';
            const url = row.querySelector('.social-url')?.value || '#';
            
            let svgIcon = '';
            if (platform === 'github') {
                svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
            } else if (platform === 'linkedin') {
                svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
            } else if (platform === 'twitter' || platform === 'twitter / x') {
                svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
            } else if (platform === 'instagram') {
                svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
            } else {
                svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
            }

            if(url) {
                socialsHtml += `<a href="${url}" target="_blank" title="${platform}" style="display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; text-decoration:none; margin: 0 4px; border: 1px solid currentColor; border-radius: 50%; opacity:0.85;">${svgIcon}</a>`;
            }
        });
        socialsPrev.innerHTML = socialsHtml;
    }
}

// Profile Elements Selection
const profileTrigger = document.getElementById('profile-menu-trigger');
const profileDropdown = document.getElementById('profile-dropdown');
const profileModal = document.getElementById('profile-modal');
const closeProfileModal = document.getElementById('close-profile-modal');
const openProfileModal = document.getElementById('open-profile-modal');
const signOutBtn = document.getElementById('sign-out-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');

if (profileTrigger) {
    profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
    });
    window.addEventListener('click', () => profileDropdown.classList.add('hidden'));
}

if (openProfileModal) {
    openProfileModal.addEventListener('click', () => {
        profileModal.classList.remove('hidden');
        profileDropdown.classList.add('hidden');
        loadUserProfileData();
    });
}
if (closeProfileModal) {
    closeProfileModal.addEventListener('click', () => profileModal.classList.add('hidden'));
}

async function loadUserProfileData() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    document.getElementById('prof-email').value = user.email;

    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const finalAvatar = (profile && profile.avatar_url) ? profile.avatar_url : instagramDefaultAvatar;

    const navAvatar = document.getElementById('nav-avatar-img');
    const dropdownAvatar = document.getElementById('dropdown-avatar-preview');
    const modalPreview = document.getElementById('modal-preview-avatar');
    
    if (navAvatar) navAvatar.src = finalAvatar;
    if (dropdownAvatar) dropdownAvatar.src = finalAvatar;
    if (modalPreview) modalPreview.src = finalAvatar;

    document.getElementById('dropdown-user-email').textContent = user.email;

    if (profile) {
        document.getElementById('prof-sec-email').value = profile.secondary_email || '';
        document.getElementById('prof-phone').value = profile.phone || '';
        document.getElementById('dropdown-user-phone').textContent = profile.phone || 'No phone set';

        const imgInput = document.getElementById('p-img');
        if (imgInput && profile.avatar_url) {
            imgInput.value = profile.avatar_url;
            document.getElementById('prev-img-tag').src = profile.avatar_url;
        }
        if (profile.secondary_email) {
            const contactInput = document.querySelector('.contact-input');
            if (contactInput) contactInput.value = profile.secondary_email;
        }
    } else {
        document.getElementById('dropdown-user-phone').textContent = 'No phone set';
    }
}

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return showNotification('Please sign in first.', 'error');

        let avatarUrl = document.getElementById('modal-preview-avatar').src;
        const fileInput = document.getElementById('avatar-file-input');
        const phone = document.getElementById('prof-phone').value;
        const secondaryEmail = document.getElementById('prof-sec-email').value;

        showNotification('Saving profile updates...', 'info');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                showNotification('Error uploading image: ' + uploadError.message, 'error');
                return;
            }

            const { data: publicUrlData } = supabaseClient.storage
                .from('avatars')
                .getPublicUrl(filePath);

            avatarUrl = publicUrlData.publicUrl;
        }

        const { error } = await supabaseClient
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                phone: phone,
                secondary_email: secondaryEmail,
                avatar_url: avatarUrl,
                updated_at: new Date()
            });

        if (error) {
            showNotification('Error saving profile: ' + error.message, 'error');
        } else {
            showNotification('Profile updated and synchronized!', 'success');
            profileModal.classList.add('hidden');
            loadUserProfileData(); 
        }
    });
}

supabaseClient.auth.onAuthStateChange((event, session) => {
    const authBtn = document.getElementById('auth-btn');
    const profileTrigger = document.getElementById('profile-menu-trigger');

    if (session) {
        currentUser = session.user;
        if (authBtn) authBtn.classList.add('hidden');
        if (profileTrigger) profileTrigger.classList.remove('hidden');
        loadUserProfileData(); 
    } else {
        currentUser = null;
        if (authBtn) authBtn.classList.remove('hidden');
        if (profileTrigger) profileTrigger.classList.add('hidden');
    }
});

if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        window.location.href = 'index.html';
    });
}

function initBuilderCanvasListeners() {
    const nameInput = document.getElementById('p-name');
    const bioInput = document.getElementById('p-bio');
    const imgInput = document.getElementById('p-img');
    const projTitle = document.getElementById('project-title');
    const projDesc = document.getElementById('project-desc');
    const templateSelector = document.getElementById('template-selector');

    const prevName = document.getElementById('prev-name');
    const prevBio = document.getElementById('prev-bio');
    const prevLogo = document.getElementById('prev-logo');
    const prevImgTag = document.getElementById('prev-img-tag');
    const prevImgWrap = document.getElementById('prev-img-wrap');
    const prevProjTitle = document.getElementById('prev-proj-title');
    const prevProjDesc = document.getElementById('prev-proj-desc');
    const livePreview = document.getElementById('live-preview');

    function updatePreview() {
        const nameVal = nameInput?.value || 'Mohammad Alaa';
        if (prevName) prevName.textContent = nameVal;
        if (prevLogo) prevLogo.textContent = nameVal.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'MA';
        if (prevBio) prevBio.textContent = bioInput?.value || '';
        
        if (templateSelector && livePreview) {
            const selectedTheme = templateSelector.value;
            const theme = getPortfolioTheme(selectedTheme);
            livePreview.classList.remove('minimal', 'editorial', 'warm');
            livePreview.classList.add('theme-preview');
            livePreview.classList.toggle('theme-special', theme.name === 'Gallery' || theme.name === 'Terminal Pro' || theme.name === 'Neon Grid' || theme.name === 'Luxe' || theme.name === 'Aurora');
            livePreview.dataset.theme = theme.value;
            livePreview.style.background = theme.background;
            livePreview.style.color = theme.color;
            livePreview.style.borderColor = theme.border;
            livePreview.style.setProperty('--preview-accent', theme.accent);
        }
        
        if (selectedTierPrice >= 600 && imgInput && prevImgTag && prevImgWrap) {
            if (imgInput.value.trim() !== '') {
                prevImgTag.src = imgInput.value;
                prevImgWrap.style.display = 'block';
            } else {
                prevImgWrap.style.display = 'none';
            }
        }

       const prevProjectWrap = document.getElementById('prev-project-card') || document.querySelector('.project-card-preview');

       if (selectedTierPrice >= 3000) {
           if (prevProjectWrap) prevProjectWrap.style.display = 'block';
           if (prevProjTitle) prevProjTitle.textContent = projTitle?.value || '';
           if (prevProjDesc) prevProjDesc.textContent = projDesc?.value || '';
       } else {
           if (prevProjectWrap) prevProjectWrap.style.display = 'none';
       }

        updateContactsAndSocialsPreview();
    }

    [nameInput, bioInput, imgInput, projTitle, projDesc, templateSelector].forEach(el => {
        el?.removeEventListener('input', updatePreview);
        el?.addEventListener('input', updatePreview);
    });
    templateSelector?.addEventListener('change', updatePreview);

    const addContactBtn = document.getElementById('add-contact-btn');
    if (addContactBtn && !addContactBtn.hasAttribute('data-bound')) {
        addContactBtn.setAttribute('data-bound', 'true');
        addContactBtn.addEventListener('click', () => {
            if (selectedTierPrice < 600) return;
            const container = document.getElementById('contacts-container');
            if (!container) return;
            const div = document.createElement('div');
            div.className = 'form-group dynamic-row';
            div.style.display = 'flex';
            div.style.gap = '0.5rem';
            div.style.marginBottom = '0.5rem';
            div.innerHTML = `
                <input type="text" placeholder="Email or Phone number" class="contact-input" style="flex-grow:1;">
                <button type="button" class="btn-outline remove-row-btn" style="padding: 0.5rem 0.8rem; border-color:var(--coral); color:var(--coral);">×</button>
            `;
            container.appendChild(div);
            div.querySelector('.contact-input').addEventListener('input', updatePreview);
            div.querySelector('.remove-row-btn').addEventListener('click', () => { div.remove(); updatePreview(); });
        });
    }

    const addSocialBtn = document.getElementById('add-social-btn');
    if (addSocialBtn && !addSocialBtn.hasAttribute('data-bound')) {
        addSocialBtn.setAttribute('data-bound', 'true');
        addSocialBtn.addEventListener('click', () => {
            if (selectedTierPrice < 600) return;
            const container = document.getElementById('socials-container');
            if (!container) return;
            const div = document.createElement('div');
            div.className = 'form-group dynamic-row';
            div.style.display = 'flex';
            div.style.gap = '0.5rem';
            div.style.marginBottom = '0.5rem';
            div.innerHTML = `
                <select class="social-platform" style="background:var(--bg-primary); color:var(--text-main); border:1px solid var(--border-color); border-radius:10px; padding:0.5rem;">
                    <option value="GitHub">GitHub</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                </select>
                <input type="text" placeholder="https://url" class="social-url" style="flex-grow:1;">
                <button type="button" class="btn-outline remove-row-btn" style="padding: 0.5rem 0.8rem; border-color:var(--coral); color:var(--coral);">×</button>
            `;
            container.appendChild(div);
            div.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));
            div.querySelector('.remove-row-btn').addEventListener('click', () => { div.remove(); updatePreview(); });
        });
    }

    const payDownloadBtn = document.getElementById('pay-download-btn');
    if (payDownloadBtn && !payDownloadBtn.hasAttribute('data-bound')) {
        payDownloadBtn.setAttribute('data-bound', 'true');
        payDownloadBtn.addEventListener('click', async () => {
            if (!currentUser) {
                showNotification('Please sign in or register first.', 'error');
                document.getElementById('auth-modal')?.classList.remove('hidden');
                return;
            }
            setCheckoutLoading(true);

            const previewBox = document.getElementById('live-preview');
            const fullName = nameInput?.value || 'Mohammad Alaa';
            const templateClass = previewBox?.className || 'template-preview minimal';
            const previewInnerHtml = previewBox?.innerHTML || '';

            let extractedCssText = '';
            try {
                
                for (let sheet of document.styleSheets) {
                    try {
                        for (let rule of sheet.cssRules) {
                            extractedCssText += rule.cssText + '\n';
                        }
                    } catch (err) {}
                }
            } catch (e) {}

            const fullWrappedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName} - Portfolio</title>
    <style>
        body { font-family: sans-serif; padding: 4rem; text-align: center; }
        ${extractedCssText}
    </style>
</head>
<body class="${templateClass}" style="background: ${previewBox.style.background}; color: ${previewBox.style.color};">
    <div style="width: 100%; max-width: 900px; margin: 0 auto;">
        ${previewInnerHtml}
    </div>
</body>
</html>`;

            const portfolioData = {
                user_id: currentUser.id,
                full_name: fullName,
                bio: bioInput?.value || '',
                image_url: imgInput?.value || '',
                template_class: templateClass,
                raw_html: fullWrappedHtml
            };

            if (supabaseClient) {
                await supabaseClient.from('portfolios').upsert(portfolioData, { onConflict: 'user_id' });
            }

            showNotification(`Initializing Paymob session for ${selectedTierPrice} EGP...`, 'success');

            try {
                setCheckoutLoading(true, '02 / 03', 'Building a secure checkout.', 'Your portfolio is saved. We are requesting your protected payment session.');
                const { data, error } = await supabaseClient.functions.invoke('paymob-checkout', {
                    body: {
                        amount: selectedTierPrice,
                        userEmail: currentUser.email
                    }
                });

                if (error || !data || !data.url) {
                    throw new Error(error?.message || data?.error || 'Failed to generate checkout link.');
                }
                setCheckoutLoading(true, '03 / 03', 'Opening Paymob securely.', 'Your payment session is ready. Taking you to checkout now.');
                showNotification('Redirecting to Paymob checkout...', 'success');
                setTimeout(() => {
                    window.location.href = data.url;
                }, 1000);

            } catch (err) {
                setCheckoutLoading(false);
                showNotification(err.message, 'error');
            }
        });
    }

    updatePreview();
}

function initAuthSystem() {
    const modal = document.getElementById('auth-modal');
    const authBtn = document.getElementById('auth-btn');
    const closeBtn = document.getElementById('close-auth');
    const switchLink = document.getElementById('switch-mode-link');
    let isSignUp = false;

    authBtn?.addEventListener('click', () => {
        if (currentUser) {
            supabaseClient?.auth.signOut().then(() => {
                window.location.reload();
            });
        } else {
            modal?.classList.remove('hidden');
        }
    });

    closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

    switchLink?.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;
        const authTitle = document.getElementById('auth-title');
        if (authTitle) authTitle.textContent = isSignUp ? 'Create Account' : 'Sign In';
        switchLink.textContent = isSignUp ? 'Sign In' : 'Register';
    });

    document.getElementById('auth-submit-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('auth-email')?.value;
        const password = document.getElementById('auth-password')?.value;
        if (!supabaseClient || !email || !password) return;

        if (isSignUp) {
            const { error } = await supabaseClient.auth.signUp({ email, password });
            if (error) showNotification(error.message, 'error');
            else { showNotification('Registration successful! Please sign in.', 'success'); isSignUp = false; }
        } else {
            const { error, data } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) showNotification(error.message, 'error');
            else {
                currentUser = data.user;
                showNotification('Signed in successfully!', 'success');
                modal?.classList.add('hidden');
                if (authBtn) authBtn.textContent = 'Sign Out';
            }
        }
    });
}

async function checkUserSession() {
    if (!supabaseClient) return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        currentUser = session.user;
        loadUserProfileData();
    }
}

async function loadUserOrdersPage() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList || !supabaseClient) return;

    ordersList.innerHTML = `<div class="order-empty-state"><p>Loading your orders vault...</p></div>`;

    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
        ordersList.innerHTML = `<div class="order-empty-state"><p>Please sign in to view your secure order vault.</p></div>`;
        document.getElementById('auth-modal')?.classList.remove('hidden');
        return;
    }

    const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (ordersError) {
        console.error('Error fetching orders:', ordersError.message);
        ordersList.innerHTML = `<div class="order-empty-state"><p>Error loading orders. Please try again later.</p></div>`;
        return;
    }

    if (!orders || orders.length === 0) {
        ordersList.innerHTML = `<div class="order-empty-state"><p>No prior acquisitions found in your records.</p></div>`;
        return;
    }

    ordersList.innerHTML = orders.map(o => `
        <div class="order-card">
            <div>
                <div class="order-card-header">
                    <span class="order-plan">${o.plan_name}</span>
                    <span class="order-price">${o.amount}</span>
                </div>
                <div class="order-details">
                    <p><strong>Portfolio:</strong> ${o.portfolio_name}</p>
                    <p><strong>Status:</strong> <span style="color:var(--lime);">${o.status === 'active' ? 'Compiled & Active' : 'Compiled & Verified'}</span></p>
                </div>
            </div>
            
            <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
                <div class="order-date">Acquired: ${new Date(o.created_at).toLocaleDateString()}</div>
                ${o.live_url ? `
                    <a href="${o.live_url}" target="_blank" class="btn-solid" style="display:inline-block; text-align:center; padding:0.4rem 0.9rem; font-size:0.75rem; text-decoration:none;">View Live Site ↗</a>
                ` : `
                    <span style="font-size:0.75rem; color:#e74c3c;">Deployment pending</span>
                `}
            </div>
        </div>
    `).join('');
}

function triggerDirectDownload(htmlString, fullName) {
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


// Handle Auto-Deployment and Fallback Download after Paymob Payment Verification
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
        showNotification('Payment verified successfully via Paymob!', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);

        if (supabaseClient) {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const { data: portfolioData } = await supabaseClient
                    .from('portfolios')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();
                    
                if (portfolioData && portfolioData.raw_html) {
                    // 1. Trigger local file download fallback
                    triggerDirectDownload(portfolioData.raw_html, portfolioData.full_name);

                    showNotification('Deploying your portfolio to the cloud...', 'info');

                    try {
    // Explicitly trigger Vercel Edge Function deployment
    const { data: funcData, error: funcError } = await supabaseClient.functions.invoke('deploy-portfolio', {
        body: { 
            htmlContent: portfolioData.raw_html, 
            projectName: `${session.user.email.split('@')[0]}-${portfolioData.full_name || 'portfolio'}` 
        }
    });

    if (funcError) {
        // If it's a FunctionsHttpError, extract the exact message returned by the server
        let detailedMsg = funcError.message;
        if (typeof funcError.context?.json === 'function') {
            try {
                const errBody = await funcError.context.json();
                detailedMsg = errBody.error || detailedMsg;
            } catch (e) {}
        }
        throw new Error(detailedMsg);
    }

    if (!funcData || !funcData.success) {
        throw new Error(funcData?.error || 'Deployment failed');
    }

    // 1. Ensure we have a valid live URL from the Edge Function
const liveUrl = funcData.liveUrl;
const targetProjectName = portfolioData.full_name || 'portfolio';

// Insert the order with all required columns populated
// Insert the order matching your exact table schema
const { error: insertError } = await supabaseClient
    .from('orders')
    .insert([
        {
            user_id: session.user.id,
            plan_name: portfolioData.plan_name || 'Portfolio Plan',
            amount: String(portfolioData.amount || '3000'), // Stored as text in your schema
            project_name: targetProjectName,
            portfolio_name: portfolioData.portfolio_name || targetProjectName,
            live_url: liveUrl,
            status: 'active'
        }
    ]);

if (insertError) {
    console.error('Failed to save order to database:', insertError.message);
    showNotification('Deployment went live, but failed to save order: ' + insertError.message, 'error');
    return;
}



showNotification('Deployment successful! Order saved to your vault.', 'success');
loadUserOrdersPage();

} catch (err) {
    console.error('Deployment Exception:', err);
    showNotification('Cloud deployment note: ' + err.message, 'error');
}
                }
            }
        }
    }
});