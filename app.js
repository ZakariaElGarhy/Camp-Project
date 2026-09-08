// REPLACE with your Supabase URL and anon public key from your Project Settings > API
const SUPABASE_URL = 'https://qvgknqjltjawewkrjwxq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2Z2tucWpsdGphd2V3a3Jqd3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjEyNDUsImV4cCI6MjEwNDQzNzI0NX0.5t-xOr5eG8WMROBImoqJKjJM2kKlhbU1UDo2puYkAN8';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let selectedPlan = null;
let selectedPrice = null;
let isSignUpMode = true;

document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
    initEventListeners();
    
    // Check if the user just came back from Paymob Checkout redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
        showNotification('Payment verified successfully! Your portfolio code is downloading.', 'success');
        triggerStaticCodeDownload();
    }
});
function showNotification(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    const icon = type === 'success' ? '✨' : '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Automatically remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function initEventListeners() {
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.getElementById('close-modal');

    authBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => authModal.classList.add('hidden'));

    const authSwitchContainer = document.getElementById('auth-switch-text');
    authSwitchContainer.addEventListener('click', (e) => {
        if (e.target.id === 'switch-mode') {
            e.preventDefault();
            isSignUpMode = !isSignUpMode;
            document.getElementById('modal-title').textContent = isSignUpMode ? 'Create Account' : 'Sign In to Aura';
            document.getElementById('auth-submit-btn').textContent = isSignUpMode ? 'Create Account' : 'Sign In';
            authSwitchContainer.innerHTML = isSignUpMode 
                ? 'Already have an account? <a href="#" id="switch-mode">Sign In</a>' 
                : 'Don\'t have an account? <a href="#" id="switch-mode">Register</a>';
        }
    });

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        if (isSignUpMode) {
            const { error } = await supabaseClient.auth.signUp({ email, password });
            if (error) alert(error.message);
            else {
                showNotification('Registration successful! You can now sign in.', 'success');
                isSignUpMode = false;
                document.getElementById('modal-title').textContent = 'Sign In to Aura';
                document.getElementById('auth-submit-btn').textContent = 'Sign In';
                authSwitchContainer.innerHTML = 'Don\'t have an account? <a href="#" id="switch-mode">Register</a>';
            }
        } else {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
            else {
                currentUser = data.user;
                authModal.classList.add('hidden');
                updateAuthUI();
            }
        }
    });

    // Plan selections
    document.querySelectorAll('.select-plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!currentUser) {
                showNotification('Please sign in or register first.', 'error');
                authModal.classList.remove('hidden');
                return;
            }
            const card = e.target.closest('.pricing-card');
            selectedPlan = card.dataset.plan;
            selectedPrice = card.dataset.price;

            setupPlanConfigurationUI(selectedPlan);
        });
    });

    // Real-time Live Preview Binding
    document.getElementById('p-name').addEventListener('input', (e) => {
        const val = e.target.value || 'Alexander Wright';
        document.getElementById('prev-name').textContent = val;
        document.getElementById('prev-nav-logo').textContent = val.split(' ').map(n => n[0]).join('');
    });
    
    document.getElementById('p-bio').addEventListener('input', (e) => {
        document.getElementById('prev-bio').textContent = e.target.value || 'Your bio statement will appear here.';
    });
    
    const pImg = document.getElementById('p-img');
    if (pImg) {
        pImg.addEventListener('input', (e) => {
            const imgBox = document.getElementById('prev-img-box');
            const imgEl = document.getElementById('prev-img');
            if (e.target.value) {
                imgEl.src = e.target.value;
                imgBox.classList.remove('hidden');
            } else {
                imgBox.classList.add('hidden');
            }
        });
    }

    const pSocials = document.getElementById('p-socials');
    if (pSocials) {
        pSocials.addEventListener('input', (e) => {
            const box = document.getElementById('prev-socials-box');
            if(e.target.value) {
                box.classList.remove('hidden');
                box.innerHTML = e.target.value.split(',').map(s => `<span>${s.trim()}</span>`).join('');
            } else {
                box.classList.add('hidden');
            }
        });
    }

    // Template switcher tabs
    document.querySelectorAll('.template-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const templateName = e.target.dataset.template;
            const preview = document.getElementById('live-preview');
            preview.className = `template-preview ${templateName}`;
        });
    });

    // Open Modern Paymob Split-Screen Checkout Redirect
    document.getElementById('pay-download-btn').addEventListener('click', async () => {
        if (!currentUser) {
            authModal.classList.remove('hidden');
            return;
        }
        await redirectToPaymobCheckout(selectedPrice);
    });
}

async function checkUserSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        currentUser = session.user;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    authBtn.textContent = 'Signed In';
    authBtn.classList.remove('btn-outline');
    authBtn.classList.add('btn-solid');
}

async function redirectToPaymobCheckout(amount) {
    try {
        const functionUrl = 'https://qvgknqjltjawewkrjwxq.supabase.co/functions/v1/paymob-checkout';
        
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                amount: parseInt(amount),
                userEmail: currentUser.email
            })
        });
        
        const data = await response.json();
        
        // Check if the server returned an error property
        if (!response.ok || data.error) {
            console.error("Backend error details:", data);
            showNotification('Checkout error: ' + (data.error || 'Server rejected request'), 'error');
            return;
        }
        
        if (data.client_secret) {
            const publicKey = "egy_pk_test_vbzbYyPBfnFoppIsamCZl2ZmO2HiqJef"; 
            const uniqueSession = new Date().getTime();
            window.location.href = `https://eg.checkout.paymob.com/?publicKey=${publicKey}&clientSecret=${data.client_secret}&_t=${uniqueSession}`;
        } else {
            showNotification('Error: No client secret received from server.', 'error');
        }
    } catch (err) {
        console.error("Network or parsing error:", err);
        showNotification('Network error connecting to payment gateway.', 'error');
    }
}

function setupPlanConfigurationUI(plan) {
    const extraFields = document.getElementById('extra-fields');
    if (plan === '3000') {
        extraFields.classList.remove('hidden');
    } else {
        extraFields.classList.add('hidden');
    }
    document.getElementById('builder-section').classList.remove('hidden');
    window.scrollTo({ top: document.getElementById('builder-section').offsetTop, behavior: 'smooth' });
}

// Inside initEventListeners or your Pay button handler:
document.getElementById('pay-download-btn').addEventListener('click', async () => {
    if (!currentUser) {
        showNotification('Please sign in or register first.', 'error');
        document.getElementById('auth-modal').classList.remove('hidden');
        return;
    }

    // 1. Gather current values from the form inputs
    const portfolioData = {
        user_id: currentUser.id,
        full_name: document.getElementById('p-name').value || 'Alexander Wright',
        bio: document.getElementById('p-bio').value || 'Curator of digital environments.',
        image_url: document.getElementById('p-img') ? document.getElementById('p-img').value : '',
        socials: document.getElementById('p-socials') ? document.getElementById('p-socials').value : '',
        template_class: document.getElementById('live-preview').className
    };

    // 2. Save/Upsert values into Supabase portfolios table
    const { error: dbError } = await supabaseClient
        .from('portfolios')
        .upsert(portfolioData, { onConflict: 'user_id' });

    if (dbError) {
        showNotification('Error saving portfolio data: ' + dbError.message, 'error');
        return;
    }

    // 3. Proceed to Paymob Checkout
    await redirectToPaymobCheckout(selectedPrice);
});
document.addEventListener('DOMContentLoaded', async () => {
    checkUserSession();
    initEventListeners();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
        showNotification('Payment verified successfully!', 'success');
        
        // Fetch the saved portfolio record from Supabase
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            const { data, error } = await supabaseClient
                .from('portfolios')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
                
            if (data && !error) {
                triggerStaticCodeDownloadWithData(data);
            } else {
                showNotification('Could not retrieve saved portfolio data.', 'error');
            }
        }
    }
});
function triggerStaticCodeDownload() {
const name = portfolio.full_name;
    const bio = portfolio.bio;
    const imgUrl = portfolio.image_url;
    const socials = portfolio.socials;
    const templateClass = portfolio.template_class;
    // Fully self-contained single HTML file with full-page styling
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent-warm: #d4af37;
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body.standalone-body {
            width: 100vw;
            height: 100vh;
            margin: 0;
            font-family: var(--font-body);
            overflow: hidden;
        }

        .template-preview {
            width: 100vw;
            height: 100vh;
            padding: 4rem 6rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 0;
            box-shadow: none;
            max-width: none;
        }

        .template-preview.minimalist { background: #fdfbf7; color: #1a1a1a; }
        .template-preview.minimalist .preview-logo { color: #1a1a1a; }
        .template-preview.editorial { background: #0d0d0d; color: #ffffff; }
        .template-preview.editorial .preview-logo { color: var(--accent-warm); }
        .template-preview.warm { background: #2b211d; color: #f3ece4; }
        .template-preview.warm .preview-logo { color: #d4af37; }

        .preview-nav { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .preview-logo { font-family: var(--font-heading); font-weight: 700; font-size: 1.4rem; letter-spacing: -0.5px; }
        .preview-nav-links { display: flex; gap: 2.5rem; font-size: 0.95rem; }
        .preview-nav-links a { text-decoration: none; color: inherit; opacity: 0.8; transition: opacity 0.2s; }
        .preview-nav-links a:hover { opacity: 1; }
        
        .preview-body { text-align: center; max-width: 600px; margin: 0 auto; width: 100%; }
        .preview-footer { text-align: center; font-size: 0.85rem; opacity: 0.6; width: 100%; }
        
        .preview-img-container img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 1.5rem auto;
            border: 2px solid var(--accent-warm);
        }
        
        h1 { font-family: var(--font-heading); font-size: 3.5rem; margin-bottom: 1rem; font-weight: 600; }
        p { font-size: 1.1rem; line-height: 1.6; opacity: 0.9; }
        
        .socials-list { margin-top: 1.5rem; display: flex; gap: 1.5rem; justify-content: center; font-size: 0.95rem; font-weight: 500; }
        .hidden { display: none !important; }
    </style>
</head>
<body class="standalone-body">
    <div class="template-preview ${templateClass}">
        <header class="preview-nav">
            <span class="preview-logo">${name.split(' ').map(n => n[0]).join('')}</span>
            <nav class="preview-nav-links">
                <a href="#work">Work</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </nav>
        </header>
        
        <div class="preview-body">
            ${imgUrl ? `<div class="preview-img-container"><img src="${imgUrl}" alt="Portrait"></div>` : ''}
            <h1>${name}</h1>
            <p>${bio}</p>
            ${socials ? `<div class="socials-list">${socials.split(',').map(s => `<span>${s.trim()}</span>`).join('')}</div>` : ''}
        </div>

        <footer class="preview-footer">
            <p>&copy; 2026 ${name}. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);
}