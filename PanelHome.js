const firebaseConfig = {
    apiKey: "AIzaSyADUN3zUupPLgB8Z0p_867XUK7FYKCkwoU",
    authDomain: "barangay118-test-website.firebaseapp.com",
    databaseURL: "https://barangay118-test-website-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "barangay118-test-website",
    storageBucket: "barangay118-test-website.firebasestorage.app",
    messagingSenderId: "459463926150",
    appId: "1:459463926150:web:e66bc57f5e29c2dca24c07",
    measurementId: "G-RQ8JYYJ1G7"
};

let db = null;
let unsubscribe = null;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const defaultData = {
    "0A_Header": {
        systemName: "BARANGAY 118 ONLINE SYSTEM",
        headerLogo: "Logo-Favicon-removebg-preview.png"
    },
    "0B_hero": {
        title: "Your Gateway to Barangay 118 Digital Services",
        description: "Fast, secure, and convenient access to essential services for all residents."
    },
    "0C_welcomeSection": {
        backgroundImage: "8055825756095.png",
        title: "Welcome to Barangay 118",
        subtitle: "A Community of Unity and Progress",
        logo: "308673009_177778618128931_642779678020875763_n.png"
    },
    "0D_footer": {
        title: "Barangay 118 Online System",
        description: "Secure and efficient online services for Barangay 118. Connecting our community through technology.",
        contactInfo: {
            addressLine1: "402 2nd St, Grace Park East, Caloocan",
            addressLine2: "Metro Manila, Philippines",
            phone: "(02) 8123-4567",
            email: "info@barangay118.gov.ph",
            officeHours: "Mon–Fri: 8:00 AM – 5:00 PM"
        },
        socialMedia: {
            facebook: "https://facebook.com/barangay118",
            messenger: "https://m.me/barangay118"
        },
        copyright: "&copy; 2025 Barangay 118 Online System. All Rights Reserved."
    }
};

let currentData = JSON.parse(JSON.stringify(defaultData));
async function loadData() {
    try {
        if (db) {
            const rootRef = db.ref('01_PanelHome');
            const snapshot = await rootRef.once('value');

            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(currentData, firebaseData);
                console.log("Data loaded from Firebase (01_PanelHome)");
            } else {
                console.log("No Firebase data found, using defaults");
            }
        } else {
            console.log("Firebase not available, using defaults");
        }
    } catch (error) {
        console.error("Error loading from Firebase:", error);
    }

    renderHeader();
    renderHero();
    renderWelcome();
    renderFooter();
}

function deepMergeData(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMergeData(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

function renderHeader() {
    const headerContainer = document.getElementById('dynamic-header');
    if (!headerContainer) return;
    const headerData = currentData["0A_Header"] || defaultData["0A_Header"];
    const systemName = headerData.systemName;
    const headerLogo = headerData.headerLogo;
    const currentPage = window.location.pathname.split('/').pop();
    headerContainer.innerHTML = `
        <div class="container">
            <div class="navbar">
                <a href="PanelHome.html" id="home-logo" class="logo" aria-label="Barangay 118 Online System Home">
                    <img src="${headerLogo}" 
                         alt="Barangay 118 Official Logo" 
                         class="logo-image" 
                         id="header-logo" 
                         width="50" height="50">
                    <h1 id="system-name">${systemName}</h1>
                </a>

                <input type="checkbox" id="menu-toggle" class="menu-toggle">
                <label for="menu-toggle" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <nav class="nav-links" aria-label="Main navigation">
                    <a href="PanelHome.html" ${currentPage === 'PanelHome.html' || currentPage === '' ? 'class="active"' : ''} aria-label="Home page">
                        <i class="fas fa-home" aria-hidden="true"></i><span>Home</span>
                    </a>
                    <a href="AboutUs.html" ${currentPage === 'AboutUs.html' ? 'class="active"' : ''} aria-label="About Barangay 118 page">
                        <i class="fas fa-info-circle" aria-hidden="true"></i><span>About Us</span>
                    </a>
                    <a href="News.html" ${currentPage === 'News.html' ? 'class="active"' : ''} aria-label="Barangay News page">
                        <i class="fas fa-newspaper" aria-hidden="true"></i><span>News</span>
                    </a>
                    <a href="Emergency.html" ${currentPage === 'Emergency.html' ? 'class="active"' : ''} aria-label="Barangay Emergency page">
                        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i><span>Emergency</span>
                    </a>
                    <a href="CreateAnAccount.html" ${currentPage === 'CreateAnAccount.html' ? 'class="active"' : ''} aria-label="Create an account page">
                        <i class="fas fa-user-plus" aria-hidden="true"></i><span>Create Account</span>
                    </a>
                    <a href="LogIn.html" ${currentPage === 'LogIn.html' ? 'class="active"' : ''} aria-label="Login page">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i><span>Login</span>
                    </a>
                </nav>
            </div>
        </div>`;
}

function renderHero() {
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-description');
    const heroData = currentData["0B_hero"] || defaultData["0B_hero"];

    if (heroTitle) {
        heroTitle.textContent = heroData.title;
    }
    if (heroDesc) {
        heroDesc.textContent = heroData.description;
    }
}

function renderWelcome() {
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    const welcomeBg = document.getElementById('welcome-background');
    const logoImg = document.getElementById('barangay-logo-img');
    const welcomeData = currentData["0C_welcomeSection"] || defaultData["0C_welcomeSection"];

    if (welcomeTitle) welcomeTitle.textContent = welcomeData.title;
    if (welcomeSubtitle) welcomeSubtitle.textContent = welcomeData.subtitle;
    if (welcomeBg) {
        welcomeBg.style.backgroundImage = `url('${welcomeData.backgroundImage}')`;
    }

    if (logoImg) {
        logoImg.src = welcomeData.logo;
    }
}

function renderFooter() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (!footerContainer) return;

    const footerData = currentData["0D_footer"] || defaultData["0D_footer"];
    footerContainer.innerHTML = `
        <div class="container" id="footer-container">
            <div class="footer-content" id="footer-content">
                <div class="footer-column" id="footer-system-column">
                    <h3 id="footer-title" class="footer-title">${footerData.title}</h3>
                    <p id="footer-description" class="footer-description">${footerData.description}</p>
                </div>

                <div class="footer-center" id="footer-center">
                    <div class="footer-row" id="footer-row">
                        <div class="footer-column" id="footer-quick-links">
                            <h3>Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="#">Home</a></li>
                            </ul>
                        </div>

                        <div class="footer-column" id="footer-contact-column">
                            <h3 id="footer-contact-title">Contact Info</h3>
                            <ul id="footer-contact-info" class="footer-contact-info">
                                <li><i class="fas fa-map-marker-alt"></i><span id="footer-address-line1">${footerData.contactInfo.addressLine1}</span></li>
                                <li><i class="fas fa-map-pin"></i><span id="footer-address-line2">${footerData.contactInfo.addressLine2}</span></li>
                                <li><i class="fas fa-phone"></i><span id="footer-phone">${footerData.contactInfo.phone}</span></li>
                                <li><i class="fas fa-envelope"></i><span id="footer-email">${footerData.contactInfo.email}</span></li>
                                <li><i class="fas fa-clock"></i><span id="footer-office-hours">${footerData.contactInfo.officeHours}</span></li>
                            </ul>
                        </div>

                        <div class="footer-column" id="footer-links-column">
                            <h3 id="footer-social-title">Follow Us</h3>
                            <ul class="footer-links" id="footer-social-links">
                                <li id="footer-facebook-item">
                                    <a id="footer-facebook-link" href="${footerData.socialMedia.facebook}" target="_blank">
                                        <i class="fab fa-facebook"></i> Facebook
                                    </a>
                                </li>
                                <li id="footer-messenger-item">
                                    <a id="footer-messenger-link" href="${footerData.socialMedia.messenger}" target="_blank">
                                        <i class="fab fa-facebook-messenger"></i> Messenger Chat
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="copyright" id="footer-copyright">
                <p id="copyright-text">${footerData.copyright}</p>
            </div>
        </div>`;
}

function setupFirebaseListener() {
    if (!db) return;
    try {
        const rootRef = db.ref('01_PanelHome');
        unsubscribe = rootRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(currentData, firebaseData);
                renderHeader();
                renderHero();
                renderWelcome();
                renderFooter();

                console.log("Data updated from Firebase in real-time");
            }
        }, (error) => {
            console.error("Firebase listener error:", error);
        });
    } catch (error) {
        console.error("Failed to setup Firebase listener:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadData().then(() => {
        setupFirebaseListener();
    });
});

window.addEventListener('beforeunload', function() {
    if (unsubscribe) {
        unsubscribe();
    }
});