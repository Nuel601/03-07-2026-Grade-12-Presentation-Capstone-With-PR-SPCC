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
    console.log("Database initialized successfully for Emergency page");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

let emergencyData = {
    "0A_hero": {
        title: "Emergency Assistance",
        description: "Quick access to emergency services for Barangay 118 residents"
    },
    "0B_quickCall": {
        title: "Emergency Contact Numbers",
        description: "Reference only. Please dial these numbers manually when needed.",
        cards: []
    },
    "0C_contacts": {
        title: "Emergency Contacts Directory",
        description: "Click on each category to view emergency contacts",
        accordions: []
    },
    "0D_procedures": {
        title: "Emergency Procedures",
        description: "Step-by-step guide for different emergencies",
        cards: []
    },
    "0E_facilities": {
        title: "Nearest Emergency Facilities",
        description: "",
        cards: []
    },
    "0F_preparation": {
        title: "Emergency Preparedness Kit",
        description: "Essential items to prepare for emergencies",
        checklist: []
        // tips property removed
    }
};

async function loadData() {
    try {
        if (db) {
            const emergencyRef = db.ref('04_Emergency');
            const snapshot = await emergencyRef.once('value');
            
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(emergencyData, firebaseData);
                console.log("Emergency data loaded from Database (04_Emergency) with new keys");
                localStorage.setItem("emergencyData", JSON.stringify(emergencyData));
            } else {
                console.log("No Firebase data found in Realtime Database at 04_Emergency, using localStorage");
                loadFromLocalStorage();
            }
        } else {
            console.log("Firebase not available, using localStorage");
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error("Error loading from Firebase:", error);
        loadFromLocalStorage();
    }
    updateUI();
    renderHeader();
    renderFooter();
}

function deepMergeData(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMergeData(target[key], source[key]);
        } else if (Array.isArray(source[key])) {
            target[key] = source[key];
        } else {
            target[key] = source[key];
        }
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem("emergencyData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            deepMergeData(emergencyData, parsedData);
            console.log("Emergency data loaded from localStorage");
        } else {
            console.log("Using default Emergency data");
            setDefaultData();
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        setDefaultData();
    }
}

function setDefaultData() {
    emergencyData = {
        "0A_hero": {
            title: "Emergency Assistance",
            description: "Quick access to emergency services for Barangay 118 residents"
        },
        "0B_quickCall": {
            title: "Emergency Contact Numbers",
            description: "Reference only. Please dial these numbers manually when needed.",
            warning: "Warning: Only use these numbers for real emergencies. Misuse may delay response times.",
            cards: [
                { id: 1, type: "critical", title: "Medical Emergency", subtitle: "Ambulance & Medical Assistance", number: "911" },
                { id: 2, type: "urgent", title: "Fire Emergency", subtitle: "Fire Department & Rescue", number: "(02) 8426-0219" },
                { id: 3, type: "important", title: "Police Emergency", subtitle: "Crime & Police Assistance", number: "117" },
                { id: 4, type: "normal", title: "Barangay Hotline", subtitle: "Local Emergency Assistance", number: "(02) 8123-4567" }
            ]
        },
        "0C_contacts": {
            title: "Emergency Contacts Directory",
            description: "Click on each category to view emergency contacts",
            warning: "Warning: Use these numbers only for actual emergencies. Misuse may delay real emergency responses.",
            accordions: [
                {
                    id: 1,
                    title: "Medical Services",
                    items: [
                        { id: 1, title: "Emergency Medical Services", number: "911", description: "24/7 ambulance and emergency medical response", hours: "Available: 24/7" },
                        { id: 2, title: "Caloocan City Medical Center", number: "(02) 8292-1111", description: "Nearest public hospital for emergencies", hours: "Emergency Room: 24/7" }
                    ]
                },
                {
                    id: 2,
                    title: "Fire Department",
                    items: [
                        { id: 3, title: "Caloocan Fire Department", number: "(02) 8426-0219", description: "Fire emergencies and rescue operations", hours: "Available: 24/7" }
                    ]
                },
                {
                    id: 3,
                    title: "Police Services",
                    items: [
                        { id: 4, title: "Caloocan Police Department", number: "117 / (02) 83612629", description: "Police assistance and crime reporting", hours: "Emergency Hotline: 117 (24/7)" }
                    ]
                },
                {
                    id: 4,
                    title: "Barangay Services",
                    items: [
                        { id: 5, title: "Barangay 118 Emergency", number: "(02) 8123-4567", description: "Local emergencies and community assistance", hours: "Office: 8AM–5PM (Mon–Fri)<br>Emergency: 24/7" },
                        { id: 6, title: "Barangay 118 Disaster Council", number: "0999-123-4567", description: "Disaster response team", hours: "Mobile: 24/7 during disasters" }
                    ]
                }
            ]
        },
        "0D_procedures": {
            title: "Emergency Procedures",
            description: "Step-by-step guide for different emergencies.",
            description: "Warning: Calling these emergency numbers should never be done as a joke. Misuse may result in penalties, and authorities may automatically track your location when you contact these numbers.",
            cards: [
                { id: 1, icon: "fas fa-fire", title: "Fire Emergency", steps: [ "Shout \"Fire!\" to alert everyone", "Call (02) 8288-6350 Caloocan Fire Station Hotline", "Use stairs, not elevators", "Crawl low under smoke" ] },
                { id: 2, icon: "fas fa-heartbeat", title: "Medical Emergency", steps: [ "Ensure area is safe", "Call 911 immediately", "Provide basic care if trained", "Clear path for responders" ] },
                { id: 3, icon: "fas fa-house-tsunami", title: "Earthquake", steps: [ "DROP to the ground", "COVER under sturdy furniture", "HOLD ON until shaking stops", "Evacuate if necessary", "Caloocan City CDRRMO Rescue & Extraction 0975-802-8223 or 0956-242-2079" ] },
                { id: 4, icon: "fas fa-cloud-showers-heavy", title: "Typhoon/Flood", steps: [ "Stay updated on warnings", "Move to higher ground if flooding", "Avoid flood waters", "Have emergency kit ready", "Caloocan CDRRMO Hotline: 0975-802-8223" ] }
            ]
        },
        "0E_facilities": {
            title: "Nearest Emergency Facilities",
            description: "#123",
            cards: [
                { id: 1, type: "fire", title: "Caloocan Fire Station Main", address: "226 Maria Clara St, Grace Park East, Caloocan, 1403 Metro Manila", distance: "730 m from Barangay 118", hours: "24/7 Service", mapLink: "https://maps.app.goo.gl/BNyMdWZcx3sgE5TV8" },
                { id: 2, type: "medical", title: "Caloocan City Medical Center", address: "3rd Street, 9th Ave, Grace Park East, Caloocan, Metro Manila", distance: "950 m from Barangay 118", hours: "24/7 Emergency Room", mapLink: "https://maps.app.goo.gl/jqq6xJQ7yRbdTT779" },
                { id: 3, type: "police", title: "Caloocan Police Station 2", address: "C3 Road, 8th Street, de Jesus, Caloocan, 1404 Metro Manila", distance: "650 m from Barangay 118", hours: "24/7 Emergency", mapLink: "https://maps.app.goo.gl/gabonpQy56tayH469" },
                { id: 4, type: "barangay", title: "Barangay 118 Hall", address: "402 2nd St, Grace Park East, Caloocan, Metro Manila", distance: "Within Barangay 118", hours: "8AM-5PM (Mon-Fri)", mapLink: "https://maps.app.goo.gl/rnBHFzifAcRywgjx5" }
            ]
        },
        "0F_preparation": {
            title: "Emergency Preparedness Kit",
            description: "Essential items to prepare for emergencies",
            checklist: [
                { id: 1, category: "Medical & First Aid", items: [ "Bandages and antiseptic", "Prescription medications", "Pain relievers", "Medical gloves" ] },
                { id: 2, category: "Food & Water", items: [ "3-day water supply (1 gallon/person/day)", "Non-perishable food", "Manual can opener", "Energy bars" ] },
                { id: 3, category: "Light & Communication", items: [ "Flashlight with extra batteries", "Portable phone charger", "Battery-powered radio", "Whistle" ] },
                { id: 4, category: "Important Documents", items: [ "Copies of IDs in waterproof container", "Insurance papers", "Medical records", "Emergency contact list" ] }
            ]
            // tips removed
        }
    };
}

function setupFirebaseListener() {
    if (!db) return;
    try {
        const emergencyRef = db.ref('04_Emergency');
        let isFirstLoad = true;
        
        unsubscribe = emergencyRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(emergencyData, firebaseData);     
                updateUI();
                renderHeader();
                renderFooter();
                localStorage.setItem("emergencyData", JSON.stringify(emergencyData));
                console.log("Emergency data updated from Firebase in real-time (04_Emergency) with new keys");
                
                if (!isFirstLoad) {
                    showToast('Emergency content updated from admin!', 'success');
                } else {
                    isFirstLoad = false;
                }
            }
        }, (error) => {
            console.error("Firebase listener error:", error);
        });
    } catch (error) {
        console.error("Failed to setup Firebase listener:", error);
    }
}

async function loadHeaderData() {
    if (!db) return null;
    try {
        const snapshot = await db.ref('01_PanelHome/0A_Header').once('value');
        if (snapshot.exists()) {
            return snapshot.val();
        }
    } catch (error) {
        console.error("Error loading header from Firebase:", error);
    }
    return null;
}

async function loadFooterData() {
    if (!db) return null;
    try {
        const snapshot = await db.ref('01_PanelHome/0D_footer').once('value');
        if (snapshot.exists()) {
            return snapshot.val();
        }
    } catch (error) {
        console.error("Error loading footer from Firebase:", error);
    }
    return null;
}

async function renderHeader() {
    const headerContainer = document.getElementById('dynamic-header');
    if (!headerContainer) return;

    let headerData = {
        systemName: "BARANGAY 118 ONLINE SYSTEM",
        headerLogo: "Logo-Favicon-removebg-preview.png"
    };

    const fbHeader = await loadHeaderData();
    if (fbHeader) {
        headerData.systemName = fbHeader.systemName || headerData.systemName;
        headerData.headerLogo = fbHeader.headerLogo || headerData.headerLogo;
    }

    const currentPage = window.location.pathname.split('/').pop();
    headerContainer.innerHTML = `
        <div class="container">
            <div class="navbar">
                <a href="PanelHome.html" id="home-logo" class="logo" aria-label="Barangay 118 Online System Home">
                    <img src="${headerData.headerLogo}" 
                         alt="Barangay 118 Official Logo" 
                         class="logo-image" 
                         id="header-logo" 
                         width="50" height="50">
                    <h1 id="system-name">${headerData.systemName}</h1>
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
                    <a href="Emergency.html" ${currentPage === 'Emergency.html' ? 'class="active"' : ''} aria-current="page" aria-label="Barangay Emergency page">
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
        </div>
    `;
}

async function renderFooter() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (!footerContainer) return;

    let footerData = {
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
    };

    const fbFooter = await loadFooterData();
    if (fbFooter) {
        footerData.title = fbFooter.title || footerData.title;
        footerData.description = fbFooter.description || footerData.description;
        if (fbFooter.contactInfo) {
            footerData.contactInfo = { ...footerData.contactInfo, ...fbFooter.contactInfo };
        }
        if (fbFooter.socialMedia) {
            footerData.socialMedia = { ...footerData.socialMedia, ...fbFooter.socialMedia };
        }
        footerData.copyright = fbFooter.copyright || footerData.copyright;
    }

    footerContainer.innerHTML = `
    <div class="container" id="footer-container">
        <div class="footer-content">
    
            <!-- System Info -->
            <div class="footer-column">
                <h3 class="footer-title">${footerData.title}</h3>
                <p class="footer-description">${footerData.description}</p>
            </div>
    
            <!-- Center Footer -->
            <div class="footer-center">
                <div class="footer-row">
                    <div class="footer-column" id="footer-quick-links">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#" id="go-to-home-btn">Safety</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>Contact Info</h3>
                        <ul class="footer-contact-info">
                            <li><i class="fas fa-map-marker-alt"></i>${footerData.contactInfo.addressLine1}</li>
                            <li><i class="fas fa-map-pin"></i>${footerData.contactInfo.addressLine2}</li>
                            <li><i class="fas fa-phone"></i>${footerData.contactInfo.phone}</li>
                            <li><i class="fas fa-envelope"></i>${footerData.contactInfo.email}</li>
                            <li><i class="fas fa-clock"></i>${footerData.contactInfo.officeHours}</li>
                        </ul>
                    </div>    
                    <!-- Social / Links -->
                    <div class="footer-column">
                        <h3>Follow Us</h3>
                        <ul class="footer-links">
                            <li><i class="fab fa-facebook"></i><a href="${footerData.socialMedia.facebook}" target="_blank"> Facebook</a></li>
                            <li><i class="fab fa-facebook-messenger"></i><a href="${footerData.socialMedia.messenger}" target="_blank"> Messenger Chat</a></li>
                        </ul>
                    </div>    
                </div>
            </div>   
        </div>
    
        <!-- Copyright -->
        <div class="copyright">
            <p>${footerData.copyright}</p>
        </div>
    </div>`;
}

function updateUI() {
    try {
        const heroTitle = document.getElementById("emergency-hero-title");
        if (heroTitle && emergencyData["0A_hero"]?.title) heroTitle.textContent = emergencyData["0A_hero"].title;
        
        const heroDesc = document.getElementById("emergency-hero-description");
        if (heroDesc && emergencyData["0A_hero"]?.description) heroDesc.textContent = emergencyData["0A_hero"].description;

        const quickCallTitle = document.getElementById("quickcall-section-title");
        if (quickCallTitle && emergencyData["0B_quickCall"]?.title) {
            quickCallTitle.innerHTML = `<i class="fas fa-phone-alt"></i> ${emergencyData["0B_quickCall"].title}`;
        }
        
        const quickCallDesc = document.getElementById("quickcall-section-description");
        if (quickCallDesc && emergencyData["0B_quickCall"]?.description) {
            quickCallDesc.textContent = emergencyData["0B_quickCall"].description;
        }
        
        // Display warning if exists
        const quickCallWarning = document.getElementById('quickcall-warning');
        if (quickCallWarning && emergencyData["0B_quickCall"]?.warning) {
            quickCallWarning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${emergencyData["0B_quickCall"].warning}`;
            quickCallWarning.style.display = 'block';
        }
        
        const contactsTitle = document.getElementById("contacts-section-title");
        if (contactsTitle && emergencyData["0C_contacts"]?.title) {
            contactsTitle.innerHTML = `<i class="fas fa-address-book"></i> ${emergencyData["0C_contacts"].title}`;
        }
        
        const contactsDesc = document.getElementById("contacts-section-description");
        if (contactsDesc && emergencyData["0C_contacts"]?.description) {
            contactsDesc.textContent = emergencyData["0C_contacts"].description;
        }
        
        const contactsWarning = document.getElementById('contacts-warning');
        if (contactsWarning && emergencyData["0C_contacts"]?.warning) {
            contactsWarning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${emergencyData["0C_contacts"].warning}`;
            contactsWarning.style.display = 'block';
        }
        
        const proceduresTitle = document.getElementById("procedures-section-title");
        if (proceduresTitle && emergencyData["0D_procedures"]?.title) {
            proceduresTitle.innerHTML = `<i class="fas fa-list-check"></i> ${emergencyData["0D_procedures"].title}`;
        }
        
        const proceduresDesc = document.getElementById("procedures-section-description");
        if (proceduresDesc && emergencyData["0D_procedures"]?.description) {
            proceduresDesc.textContent = emergencyData["0D_procedures"].description;
        }
        
        const proceduresWarning = document.getElementById('procedures-warning');
        if (proceduresWarning && emergencyData["0D_procedures"]?.warning) {
            proceduresWarning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${emergencyData["0D_procedures"].warning}`;
            proceduresWarning.style.display = 'block';
        }
        
        const facilitiesTitle = document.getElementById("facilities-section-title");
        if (facilitiesTitle && emergencyData["0E_facilities"]?.title) {
            facilitiesTitle.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${emergencyData["0E_facilities"].title}`;
        }
        
        const preparationTitle = document.getElementById("preparation-section-title");
        if (preparationTitle && emergencyData["0F_preparation"]?.title) {
            preparationTitle.innerHTML = `<i class="fas fa-kit-medical"></i> ${emergencyData["0F_preparation"].title}`;
        }
        
        const preparationDesc = document.getElementById("preparation-section-description");
        if (preparationDesc && emergencyData["0F_preparation"]?.description) {
            preparationDesc.textContent = emergencyData["0F_preparation"].description;
        }

        renderQuickCall();
        renderContacts();
        renderProcedures();
        renderFacilities();
        renderPreparation();
        
        console.log("Emergency UI updated successfully with new keys");
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

function renderQuickCall() {
    const container = document.getElementById('quickcall-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!emergencyData["0B_quickCall"]?.cards || emergencyData["0B_quickCall"].cards.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-phone fa-2x" style="margin-bottom: 15px; display: block; color: var(--primary);"></i>
                <h3>No emergency contacts available</h3>
                <p>Emergency contacts will appear here once configured by the admin.</p>
            </div>`;
        return;
    }
    
    emergencyData["0B_quickCall"].cards.forEach(card => {
        const typeClass = getTypeClass(card.type);
        const cardElement = document.createElement('div');
        cardElement.className = `call-card ${typeClass}`;
        cardElement.innerHTML = `
            <div class="call-card-header">
                <div class="call-info">
                    <h3>${card.title}</h3>
                    <p>${card.subtitle || ''}</p>
                </div>
            </div>
            <div class="call-number">${formatPhoneNumber(card.number)}</div>`;
        container.appendChild(cardElement);
    });
}

function renderContacts() {
    const container = document.getElementById('contacts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!emergencyData["0C_contacts"]?.accordions || emergencyData["0C_contacts"].accordions.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); padding: 40px;">
                <i class="fas fa-address-book fa-2x" style="margin-bottom: 15px; display: block; color: var(--primary);"></i>
                <h3>No contact categories available</h3>
                <p>Contact categories will appear here once configured by the admin.</p>
            </div>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'contacts-grid';

    const accordions = emergencyData["0C_contacts"].accordions;
    const half = Math.ceil(accordions.length / 2);
    const leftColumn = accordions.slice(0, half);
    const rightColumn = accordions.slice(half);
    const leftCol = document.createElement('div');
    leftCol.className = 'accordion-column';
    leftColumn.forEach(accordion => {
        leftCol.appendChild(createAccordionElement(accordion));
    });

    const rightCol = document.createElement('div');
    rightCol.className = 'accordion-column';
    rightColumn.forEach(accordion => {
        rightCol.appendChild(createAccordionElement(accordion));
    });
    
    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    container.appendChild(grid);

    const firstAccordion = container.querySelector('.accordion-item');
    if (firstAccordion) {
        firstAccordion.classList.add('active');
    }
}

function createAccordionElement(accordion) {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.setAttribute('data-id', accordion.id);
    
    let itemsHTML = '';
    if (accordion.items && accordion.items.length > 0) {
        accordion.items.forEach(item => {
            itemsHTML += `
                <div class="contact-detail">
                    <h4>${item.title}</h4>
                    <div class="contact-number">${formatPhoneNumber(item.number)}</div>
                    <p>${item.description}</p>
                    <div class="contact-hours">${item.hours}</div>
                </div>`;
        });
    } else {
        itemsHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); padding: 20px;">
                <i class="fas fa-exclamation-circle"></i> No contact items
            </div>`;
    }
    
    accordionItem.innerHTML = `
        <div class="accordion-header">
            <span class="accordion-title">${accordion.title}</span>
            <i class="accordion-icon fas fa-chevron-down"></i>
        </div>
        <div class="accordion-content">
            <div class="contact-details">
                ${itemsHTML}
            </div>
        </div>
    `;
    
    return accordionItem;
}

function renderProcedures() {
    const container = document.getElementById('procedures-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!emergencyData["0D_procedures"]?.cards || emergencyData["0D_procedures"].cards.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-list-check fa-2x" style="margin-bottom: 15px; display: block; color: var(--primary);"></i>
                <h3>No emergency procedures available</h3>
                <p>Emergency procedures will appear here once configured by the admin.</p>
            </div>`;
        return;
    }
    
    emergencyData["0D_procedures"].cards.forEach(procedure => {
        const card = document.createElement('div');
        card.className = 'procedure-card';
        
        let stepsHTML = '';
        if (procedure.steps && procedure.steps.length > 0) {
            procedure.steps.forEach((step, index) => {
                stepsHTML += `<li>${step}</li>`;
            });
        }
        
        card.innerHTML = `
            <div class="procedure-icon">
                <i class="${procedure.icon}"></i>
            </div>
            <h3>${procedure.title}</h3>
            <ol class="procedure-steps">
                ${stepsHTML}
            </ol>`;
        container.appendChild(card);
    });
}

function renderFacilities() {
    const container = document.getElementById('facilities-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!emergencyData["0E_facilities"]?.cards || emergencyData["0E_facilities"].cards.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-map-marker-alt fa-2x" style="margin-bottom: 15px; display: block; color: var(--primary);"></i>
                <h3>No emergency facilities available</h3>
                <p>Emergency facilities will appear here once configured by the admin.</p>
            </div>`;
        return;
    }
    
    emergencyData["0E_facilities"].cards.forEach(facility => {
        const card = document.createElement('a');
        card.className = 'facility-card';
        card.href = facility.mapLink || '#';
        card.target = '_blank';
        
        const typeClass = getFacilityTypeClass(facility.type);
        
        card.innerHTML = `
            <div class="facility-icon ${typeClass}">
                <i class="${getFacilityIcon(facility.type)}"></i>
            </div>
            <div class="facility-details">
                <h3>${facility.title}</h3>
                <p class="facility-address">${facility.address}</p>
                <p class="facility-distance">${facility.distance}</p>
                <div class="facility-hours">${facility.hours}</div>
            </div>`;
        container.appendChild(card);
    });
}

function renderPreparation() {
    const container = document.getElementById('preparation-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!emergencyData["0F_preparation"]?.checklist || emergencyData["0F_preparation"].checklist.length === 0) {
        container.innerHTML = `
            <div class="no-data" style="text-align: center; color: var(--gray); grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-kit-medical fa-2x" style="margin-bottom: 15px; display: block; color: var(--success);"></i>
                <h3>No preparation categories available</h3>
                <p>Preparation checklist will appear here once configured by the admin.</p>
            </div>`;
    } else {
        emergencyData["0F_preparation"].checklist.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'kit-category';
            
            let itemsHTML = '';
            if (category.items && category.items.length > 0) {
                category.items.forEach(item => {
                    itemsHTML += `<li>${item}</li>`;
                });
            }
            
            categoryElement.innerHTML = `
                <h3>${category.category}</h3>
                <ul>
                    ${itemsHTML}
                </ul>`;
            container.appendChild(categoryElement);
        });
    }
}

function getTypeClass(type) {
    switch(type) {
        case 'critical': return 'critical';
        case 'urgent': return 'urgent';
        case 'important': return 'important';
        default: return 'normal';
    }
}

function getFacilityTypeClass(type) {
    switch(type) {
        case 'medical': return 'medical';
        case 'fire': return 'fire';
        case 'police': return 'police';
        case 'barangay': return 'barangay';
        case 'evacuation': return 'evacuation';
        default: return '';
    }
}

function getFacilityIcon(type) {
    switch(type) {
        case 'medical': return 'fas fa-hospital';
        case 'fire': return 'fas fa-fire';
        case 'police': return 'fas fa-shield-alt';
        case 'barangay': return 'fas fa-home';
        case 'evacuation': return 'fas fa-map-marker-alt';
        default: return 'fas fa-map-marker-alt';
    }
}

function formatPhoneNumber(number) {
    if (!number) return '';
    return number.replace(/(\d{3})/g, '$1\u200B');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    
    if (type === 'success') {
        toast.style.background = 'var(--success)';
    } else if (type === 'error') {
        toast.style.background = 'var(--error)';
    } else {
        toast.style.background = 'var(--primary)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function setupEventListeners() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            button.classList.add('active');
            const activeTab = document.getElementById(tabId);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('.accordion-header')) {
            const header = e.target.closest('.accordion-header');
            const item = header.closest('.accordion-item');
            item.classList.toggle('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupFirebaseListener();
    setupEventListeners();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'emergencyData') {
            loadFromLocalStorage();
            updateUI();
            renderHeader();
            renderFooter();
            showToast('Emergency content updated from admin panel!', 'success');
        }
    });
    
    console.log("Emergency page loaded successfully with updated keys");
});

window.addEventListener('beforeunload', function() {
    if (unsubscribe) {
        unsubscribe();
    }
});