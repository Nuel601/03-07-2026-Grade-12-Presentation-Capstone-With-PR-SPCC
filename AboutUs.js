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
let headerListener = null;   
let footerListener = null;  

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const aboutUsContent = {
    "0A_hero": {
        order: 1,
        title: "Barangay Information",
        description: "Learn about our barangay's mission, leadership, services, and commitment to the community."
    },
    "0B_story": {
        order: 2,
        title: "Our Community Story",
        content1: "For over 62 years, Barangay 118 has stood as a pillar of public service committed to delivering efficient, transparent, and accessible government services to our residents. Located in the heart of the city, our barangay is home to a vibrant community of families, businesses, and institutions working together for progress and unity.",
        content2: "Through the launch of our Online System, we are taking our commitment to the next level providing 24/7 access to essential services from the comfort of your home. This digital transformation bridges the gap between the barangay administration and the people we serve, ensuring convenience and connectivity for all.",
        content3: "Behind every program and project is a dedicated team of officials and staff who serve with integrity, transparency, and compassion ensuring that every resident feels heard, supported, and cared for.",
        image: "Screen Shot 2025-11-23 at 10.35.19 AM.png"
    },
    "0C_missionVision": {
        order: 3,
        mission: {
            title: "Our Mission",
            description: "To provide efficient, transparent, and accessible government services to all residents through innovative digital solutions, fostering a connected and empowered community."
        },
        vision: {
            title: "Our Vision",
            description: "To be a model barangay known for excellent public service, community engagement, and technological innovation that improves the quality of life for all residents."
        }
    },
    "0D_officials": {
        order: 4,
        subtitle: "Meet the dedicated team serving our community",
        members: [
            { id: 1, avatar: 'J', name: 'Jerryllyn D. Bolo', position: 'Chairwoman', description: 'Leading Barangay 118 with dedication and commitment to community service.' },
            { id: 2, avatar: 'J', name: 'Jeremy Abesamis', position: 'SK Chairman', description: 'Representing the youth of Barangay 118 and advocating for their needs.' },
            { id: 3, avatar: 'R', name: 'Richard Rayos', position: 'Secretary', description: 'Managing barangay documentation and administrative processes.' },
            { id: 4, avatar: 'C', name: 'Carolina T. Manabat', position: 'Treasurer', description: 'Overseeing barangay finances and budget management.' },
            { id: 5, avatar: 'A', name: 'Annalyn Abesamis', position: 'Kagawad', description: 'Committee on Violence Against Women and Children.' },
            { id: 6, avatar: 'J', name: 'Joemarie F. Dohinog', position: 'Kagawad', description: 'Committee on Infrastructure.' },
            { id: 7, avatar: 'R', name: 'Ronald Allan Mateo', position: 'Kagawad', description: 'Committee on Public Safety.' },
            { id: 8, avatar: 'L', name: 'Lucas Badilla', position: 'Kagawad', description: 'Committee on Health and Sanitation.' },
            { id: 9, avatar: 'N', name: 'Novel Nolasco', position: 'Kagawad', description: 'Committee on Peace and Order.' },
            { id: 10, avatar: 'M', name: 'Ma. Theresa Neri', position: 'Kagawad', description: 'Committee on Education.' },
            { id: 11, avatar: 'A', name: 'Alex Bolo', position: 'Kagawad', description: 'Committee on Environmental.' }
        ]
    },
    "0E_committees": {
        order: 5,
        subtitle: "Our specialized committees addressing various community needs",
        list: [
            {
                id: 1,
                icon: 'fas fa-shield-heart',
                name: 'Committee on Violence Against Women and Children',
                chairperson: 'Annalyn Abesamis',
                description: 'Addressing issues related to violence against women and children and providing support services. This committee ensures protection and empowerment for vulnerable groups in our community.'
            },
            {
                id: 2,
                icon: 'fas fa-hammer',
                name: 'Committee on Infrastructure',
                chairperson: 'Joemarie F. Dohinog',
                description: 'Overseeing barangay infrastructure projects and maintenance of public facilities. This committee ensures our community has well-maintained roads, buildings, and public spaces.'
            },
            {
                id: 3,
                icon: 'fas fa-shield-halved',
                name: 'Committee on Public Safety',
                chairperson: 'Ronald Allan Mateo',
                description: 'Ensuring the safety and security of residents through various safety programs. This committee coordinates with local authorities to maintain a secure environment for all.'
            },
            {
                id: 4,
                icon: 'fas fa-hand-holding-medical',
                name: 'Committee on Health and Sanitation',
                chairperson: 'Lucas Badilla',
                description: 'Promoting health programs and maintaining cleanliness in the community. This committee organizes medical missions and ensures proper waste management.'
            },
            {
                id: 5,
                icon: 'fas fa-balance-scale',
                name: 'Committee on Peace and Order',
                chairperson: 'Novel Nolasco',
                description: 'Maintaining peace and order within the barangay through community policing. This committee resolves disputes and promotes harmonious living.'
            },
            {
                id: 6,
                icon: 'fas fa-graduation-cap',
                name: 'Committee on Education',
                chairperson: 'Ma. Theresa Neri',
                description: 'Supporting educational initiatives and programs for residents of all ages. This committee provides scholarships and organizes literacy programs.'
            },
            {
                id: 7,
                icon: 'fas fa-leaf',
                name: 'Committee on Environmental',
                chairperson: 'Alex Bolo',
                description: 'Implementing environmental programs and sustainability initiatives. This committee promotes green spaces and environmental awareness campaigns.'
            }
        ]
    },
    "0F_documents": {
        order: 6,
        subtitle: "Information about the documents you can request and their requirements",
        files: [
            {
                id: 1,
                icon: 'fas fa-file-alt',
                name: 'Barangay Clearance',
                description: 'Required for various transactions including employment, business permits, and legal matters. This document certifies your good standing in the community.',
                requirements: ['Valid government-issued ID', 'Proof of Residency (utility bill or lease agreement)', 'Community Tax Certificate (cedula)'],
                processingTime: '10-15 minutes'
            },
            {
                id: 2,
                icon: 'fas fa-file-alt',
                name: 'Certificate of Residency',
                description: 'Proof of residency in Barangay 118 for various purposes such as school enrollment, loan applications, and government transactions.',
                requirements: ['Valid government-issued ID', 'Proof of Residency (utility bill or barangay ID)', 'Completed application form'],
                processingTime: 'Same day'
            },
            {
                id: 3,
                icon: 'fas fa-file-alt',
                name: 'Certificate of Indigency',
                description: 'For availing government assistance programs and benefits. This document certifies your eligibility for social welfare programs.',
                requirements: ['Valid ID', 'Proof of Income or Affidavit of No Income', 'Proof of Residency'],
                processingTime: '1-2 days'
            },
            {
                id: 4,
                icon: 'fas fa-file-alt',
                name: 'Barangay ID',
                description: 'Official identification card issued by Barangay 118. Valid for local transactions and as supplementary identification.',
                requirements: ['Valid ID (if available)', 'Proof of Residency', '1x1 ID Photo', 'Completed application form'],
                processingTime: '3-5 working days'
            }
        ]
    },
    "0G_location": {
        order: 7,
        title: "Barangay Location",
        subtitle: "Find our barangay hall and important facilities",
        address: '402 2nd St, Grace Park East, Caloocan, Metro Manila',
        location: 'Barangay 118 Hall, Grace Park East, Caloocan',
        mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.756058428442!2d120.98186107483958!3d14.617918276090184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b5f6a5b2c8b1%3A0x3a5c6c3c3c3c3c3c!2s402%202nd%20St%2C%20Grace%20Park%20East%2C%20Caloocan%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph"
    },
    "0H_contact": {
        order: 8,
        title: "Get In Touch",
        address: '402 2nd St, Grace Park East, Caloocan, Metro Manila',
        email: 'info@barangay118.gov.ph',
        phone: '(02) 8123-4567',
        mapLink: "https://maps.app.goo.gl/vic9Xuyab5eZhxSaA",
        hours: {
            weekdays: 'Monday-Friday: 8:00 AM - 5:00 PM',
            saturday: 'Saturday: 8:00 AM - 12:00 PM'
        },
        mapLinkText: "View on Google Maps"
    },
    "0I_faqs": {
        order: 9,
        list: [
            {
                id: 1,
                question: 'What are the office hours of the barangay hall?',
                answer: 'Our barangay hall is open from Monday to Friday, 8:00 AM to 5:00 PM, and on Saturdays from 8:00 AM to 12:00 PM. We are closed on Sundays and holidays.'
            },
            {
                id: 2,
                question: 'How can I request a Barangay Clearance?',
                answer: 'Required documents: Valid government-issued ID (driver\'s license, passport, voter\'s ID), proof of residency (utility bill, lease/rental contract), completed barangay clearance application form, Community Tax Certificate (cedula), and passport-size photo if required. Fees: Free (no payment required). Processing time: Usually issued immediately (10–15 minutes). Where & How to apply: Apply in person at Barangay 118 Hall, weekdays 8 AM–5 PM. Submit requirements and receive your clearance.'
            },
            {
                id: 3,
                question: 'How can I request a Certificate of Residency?',
                answer: 'Required documents: Government-issued ID, proof of address (utility bill, lease, or cedula), and completed residency certificate form. Fees: Free (no payment required). Processing time: On the spot or same day. Where & How to apply: Apply at Barangay 118 Hall, weekdays 8 AM–5 PM. Present your documents and receive the certificate.'
            },
            {
                id: 4,
                question: 'How can I request a Certificate of Indigency?',
                answer: 'Required documents: Government-issued ID, proof of residence (barangay ID, voter\'s record, or utility bill), supporting income documents if applicable, and purpose statement. Fees: Free. Processing time: Usually issued immediately. Where & How to apply: Submit request at Barangay 118 Hall, weekdays 8 AM–5 PM. The officer will review and issue the certificate.'
            },
            {
                id: 5,
                question: 'How can I get a Barangay ID?',
                answer: 'Required documents: Valid ID (if any), proof of residency (utility bill, barangay certificate, or cedula), 1–2 passport-size photos, and completed application form. Fees: Free. Processing time: Usually issued on the same day. Where & How to apply: Apply at Barangay 118 Hall, weekdays 8 AM–5 PM. Submit your requirements and receive your Barangay ID.'
            },
            {
                id: 6,
                question: 'How can I report a community concern?',
                answer: 'You can report concerns by visiting the Barangay 118 Hall, calling our office at (02) 8123-4567, or using the contact form on our website. For emergencies, contact proper emergency services first. You may also use the "Get In Touch" section on our site; our team will review and assist you accordingly.'
            }
        ]
    }
};

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

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem("aboutUsContent");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            deepMergeData(aboutUsContent, parsedData);
            console.log("AboutUs data loaded from localStorage");
        } else {
            console.log("Using default AboutUs data");
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
    }
}

async function loadData() {
    try {
        if (db) {
            const aboutUsRef = db.ref('02_aboutUs');
            const snapshot = await aboutUsRef.once('value');

            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(aboutUsContent, firebaseData);
                console.log("AboutUs data loaded from Firebase Realtime Database (02_aboutUs)");
                localStorage.setItem("aboutUsContent", JSON.stringify(aboutUsContent));
            } else {
                console.log("No Firebase data found, using localStorage");
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
}

function setupFirebaseListener() {
    if (!db) return;
    try {
        const aboutUsRef = db.ref('02_aboutUs');
        unsubscribe = aboutUsRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(aboutUsContent, firebaseData);
                updateUI(); 
                localStorage.setItem("aboutUsContent", JSON.stringify(aboutUsContent));
                console.log("AboutUs data updated from Firebase in real-time");
            }
        }, (error) => {
            console.error("Firebase listener error:", error);
        });
    } catch (error) {
        console.error("Failed to setup Firebase listener:", error);
    }
}

async function renderHeader(providedData) {
    const headerContainer = document.getElementById('dynamic-header');
    if (!headerContainer) return;

    let headerData = {
        systemName: "BARANGAY 118 ONLINE SYSTEM",
        headerLogo: "Logo-Favicon-removebg-preview.png"
    };

    if (providedData) {
        headerData = { ...headerData, ...providedData };
    } else {
        try {
            if (db) {
                const headerRef = db.ref('01_PanelHome/0A_Header');
                const snapshot = await headerRef.once('value');
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (data.systemName) headerData.systemName = data.systemName;
                    if (data.headerLogo) headerData.headerLogo = data.headerLogo;
                }
            }
        } catch (error) {
            console.error("Error loading header data from Firebase:", error);
        }
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
                         width="70" height="70">
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
                        <i class="fas fa-home" aria-hidden="true"></i>
                        <span>Home</span>
                    </a>
                    <a href="AboutUs.html" ${currentPage === 'AboutUs.html' ? 'class="active"' : ''} aria-current="page" aria-label="About Barangay 118 page">
                        <i class="fas fa-info-circle" aria-hidden="true"></i>
                        <span>About Us</span>
                    </a>
                    <a href="News.html" ${currentPage === 'News.html' ? 'class="active"' : ''} aria-label="Barangay News page">
                        <i class="fas fa-newspaper" aria-hidden="true"></i>
                        <span>News</span>
                    </a>
                    <a href="Emergency.html" ${currentPage === 'Emergency.html' ? 'class="active"' : ''} aria-label="Barangay Emergency page">
                        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                        <span>Emergency</span>
                    </a>
                    <a href="CreateAnAccount.html" ${currentPage === 'CreateAnAccount.html' ? 'class="active"' : ''} aria-label="Create an account page">
                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                        <span>Create Account</span>
                    </a>
                    <a href="LogIn.html" ${currentPage === 'LogIn.html' ? 'class="active"' : ''} aria-label="Login page">
                        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
                        <span>Login</span>
                    </a>
                </nav>
            </div>
        </div>`;
}

async function renderFooter(providedData) {
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

    if (providedData) {
        footerData = {
            ...footerData,
            ...providedData,
            contactInfo: { ...footerData.contactInfo, ...(providedData.contactInfo || {}) },
            socialMedia: { ...footerData.socialMedia, ...(providedData.socialMedia || {}) }
        };
    } else {
        try {
            if (db) {
                const footerRef = db.ref('01_PanelHome/0D_footer');
                const snapshot = await footerRef.once('value');
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    if (data.title) footerData.title = data.title;
                    if (data.description) footerData.description = data.description;
                    if (data.contactInfo) {
                        if (data.contactInfo.addressLine1) footerData.contactInfo.addressLine1 = data.contactInfo.addressLine1;
                        if (data.contactInfo.addressLine2) footerData.contactInfo.addressLine2 = data.contactInfo.addressLine2;
                        if (data.contactInfo.phone) footerData.contactInfo.phone = data.contactInfo.phone;
                        if (data.contactInfo.email) footerData.contactInfo.email = data.contactInfo.email;
                        if (data.contactInfo.officeHours) footerData.contactInfo.officeHours = data.contactInfo.officeHours;
                    }
                    if (data.socialMedia) {
                        if (data.socialMedia.facebook) footerData.socialMedia.facebook = data.socialMedia.facebook;
                        if (data.socialMedia.messenger) footerData.socialMedia.messenger = data.socialMedia.messenger;
                    }
                    if (data.copyright) footerData.copyright = data.copyright;
                }
            }
        } catch (error) {
            console.error("Error loading footer data from Firebase:", error);
        }
    }

    footerContainer.innerHTML = `
        <div class="container" id="footer-container">
            <div class="footer-content" id="footer-content">
                <div class="footer-column" id="footer-system-column">
                    <h3 id="footer-title" class="footer-title">
                        ${footerData.title}
                    </h3>
                    <p id="footer-description" class="footer-description">
                        ${footerData.description}
                    </p>
                </div>

                <div class="footer-center" id="footer-center">
                    <div class="footer-row" id="footer-row">
                        <div class="footer-column" id="footer-quick-links">
                            <h3>Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="#">Home</a></li>
                                <li><a href="#barangay-info">Information</a></li>
                                <li><a href="#Map">Map</a></li>
                                <li><a href="#Faqs">FAQs</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>
                        <div class="footer-column" id="footer-contact-column">
                            <h3 id="footer-contact-title">Contact Info</h3>
                            <ul id="footer-contact-info" class="footer-contact-info">
                                <li>
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span id="footer-address-line1">
                                        ${footerData.contactInfo.addressLine1}
                                    </span>
                                </li>
                                <li>
                                    <i class="fas fa-map-pin"></i>
                                    <span id="footer-address-line2">
                                        ${footerData.contactInfo.addressLine2}
                                    </span>
                                </li>
                                <li>
                                    <i class="fas fa-phone"></i>
                                    <span id="footer-phone">
                                        ${footerData.contactInfo.phone}
                                    </span>
                                </li>
                                <li>
                                    <i class="fas fa-envelope"></i>
                                    <span id="footer-email">
                                        ${footerData.contactInfo.email}
                                    </span>
                                </li>
                                <li>
                                    <i class="fas fa-clock"></i>
                                    <span id="footer-office-hours">
                                        ${footerData.contactInfo.officeHours}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div class="footer-column" id="footer-links-column">
                            <h3 id="footer-social-title">Follow Us</h3>
                            <ul class="footer-links" id="footer-social-links">
                                <li id="footer-facebook-item">
                                    <i class="fab fa-facebook"></i>
                                    <a id="footer-facebook-link" href="${footerData.socialMedia.facebook}" target="_blank">
                                        <span id="footer-facebook-text"> Facebook</span>
                                    </a>
                                </li>
                                <li id="footer-messenger-item">
                                    <i class="fab fa-facebook-messenger"></i>
                                    <a id="footer-messenger-link" href="${footerData.socialMedia.messenger}" target="_blank">
                                        <span id="footer-messenger-text"> Messenger Chat</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="copyright" id="footer-copyright">
                <p id="copyright-text">
                    ${footerData.copyright}
                </p>
            </div>
        </div>`;
}

function updateUI() {
    try {
        const heroTitle = document.getElementById("about-hero-title");
        if (heroTitle && aboutUsContent["0A_hero"]?.title) heroTitle.textContent = aboutUsContent["0A_hero"].title;
        const heroDesc = document.getElementById("about-hero-description");
        if (heroDesc && aboutUsContent["0A_hero"]?.description) heroDesc.textContent = aboutUsContent["0A_hero"].description;

        const storyTitle = document.getElementById("about-story-title");
        if (storyTitle && aboutUsContent["0B_story"]?.title) storyTitle.textContent = aboutUsContent["0B_story"].title;
        const storyContent1 = document.getElementById("about-story-content-1");
        if (storyContent1 && aboutUsContent["0B_story"]?.content1) storyContent1.textContent = aboutUsContent["0B_story"].content1;
        const storyContent2 = document.getElementById("about-story-content-2");
        if (storyContent2 && aboutUsContent["0B_story"]?.content2) storyContent2.textContent = aboutUsContent["0B_story"].content2;
        const storyContent3 = document.getElementById("about-story-content-3");
        if (storyContent3 && aboutUsContent["0B_story"]?.content3) storyContent3.textContent = aboutUsContent["0B_story"].content3;
        const barangayImage = document.getElementById("about-barangay-image");
        if (barangayImage && aboutUsContent["0B_story"]?.image) barangayImage.src = aboutUsContent["0B_story"].image;

        const missionTitle = document.getElementById("mission-title");
        if (missionTitle && aboutUsContent["0C_missionVision"]?.mission?.title) missionTitle.textContent = aboutUsContent["0C_missionVision"].mission.title;
        const missionDesc = document.getElementById("mission-description");
        if (missionDesc && aboutUsContent["0C_missionVision"]?.mission?.description) missionDesc.textContent = aboutUsContent["0C_missionVision"].mission.description;
        const visionTitle = document.getElementById("vision-title");
        if (visionTitle && aboutUsContent["0C_missionVision"]?.vision?.title) visionTitle.textContent = aboutUsContent["0C_missionVision"].vision.title;
        const visionDesc = document.getElementById("vision-description");
        if (visionDesc && aboutUsContent["0C_missionVision"]?.vision?.description) visionDesc.textContent = aboutUsContent["0C_missionVision"].vision.description;

        const officialsSubtitle = document.getElementById("officials-subtitle");
        if (officialsSubtitle && aboutUsContent["0D_officials"]?.subtitle) officialsSubtitle.textContent = aboutUsContent["0D_officials"].subtitle;
        renderOfficials(aboutUsContent["0D_officials"]?.members || []);

        const committeesSubtitle = document.getElementById("committees-subtitle");
        if (committeesSubtitle && aboutUsContent["0E_committees"]?.subtitle) committeesSubtitle.textContent = aboutUsContent["0E_committees"].subtitle;
        renderCommittees(aboutUsContent["0E_committees"]?.list || []);

        const documentsSubtitle = document.getElementById("documents-subtitle");
        if (documentsSubtitle && aboutUsContent["0F_documents"]?.subtitle) documentsSubtitle.textContent = aboutUsContent["0F_documents"].subtitle;
        renderDocuments(aboutUsContent["0F_documents"]?.files || []);

        const locationTitle = document.getElementById("location-title");
        if (locationTitle && aboutUsContent["0G_location"]?.title) locationTitle.textContent = aboutUsContent["0G_location"].title;
        const locationSubtitle = document.getElementById("location-subtitle");
        if (locationSubtitle && aboutUsContent["0G_location"]?.subtitle) locationSubtitle.textContent = aboutUsContent["0G_location"].subtitle;
        const barangayAddress = document.getElementById("barangay-address");
        if (barangayAddress && aboutUsContent["0G_location"]?.address) barangayAddress.textContent = aboutUsContent["0G_location"].address;
        const barangayLocation = document.getElementById("barangay-location");
        if (barangayLocation && aboutUsContent["0G_location"]?.location) barangayLocation.textContent = aboutUsContent["0G_location"].location;
        const mapIframe = document.getElementById("barangay-map-iframe");
        if (mapIframe && aboutUsContent["0G_location"]?.mapLink) {
            mapIframe.src = aboutUsContent["0G_location"].mapLink;
        }

        const contactSectionTitle = document.getElementById("contact-section-title");
        if (contactSectionTitle && aboutUsContent["0H_contact"]?.title) contactSectionTitle.textContent = aboutUsContent["0H_contact"].title;
        const contactAddress = document.getElementById("contact-address");
        if (contactAddress && aboutUsContent["0H_contact"]?.address) contactAddress.textContent = aboutUsContent["0H_contact"].address;
        const contactEmail = document.getElementById("contact-email");
        if (contactEmail && aboutUsContent["0H_contact"]?.email) contactEmail.textContent = aboutUsContent["0H_contact"].email;
        const contactPhone = document.getElementById("contact-phone");
        if (contactPhone && aboutUsContent["0H_contact"]?.phone) contactPhone.textContent = aboutUsContent["0H_contact"].phone;
        const contactHoursWeekdays = document.getElementById("contact-hours-weekdays");
        if (contactHoursWeekdays && aboutUsContent["0H_contact"]?.hours?.weekdays) contactHoursWeekdays.textContent = aboutUsContent["0H_contact"].hours.weekdays;
        const contactHoursSaturday = document.getElementById("contact-hours-saturday");
        if (contactHoursSaturday && aboutUsContent["0H_contact"]?.hours?.saturday) contactHoursSaturday.textContent = aboutUsContent["0H_contact"].hours.saturday;
        const mapLinkText = document.getElementById("map-link-text");
        if (mapLinkText && aboutUsContent["0H_contact"]?.mapLinkText) mapLinkText.textContent = aboutUsContent["0H_contact"].mapLinkText;
        const mapLinkButton = document.querySelector('.map-link-button');
        if (mapLinkButton && aboutUsContent["0H_contact"]?.mapLink) {
            mapLinkButton.href = aboutUsContent["0H_contact"].mapLink;
        }

        renderFAQs(aboutUsContent["0I_faqs"]?.list || []);

        console.log("AboutUs UI updated successfully");
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

function renderOfficials(officials) {
    const container = document.getElementById('officials-container');
    if (!container) return;
    container.innerHTML = '';
    if (officials.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1 / -1;">No officials information available.</p>';
        return;
    }

    officials.forEach(official => {
        const card = document.createElement('div');
        card.className = 'official-card';

        let avatarHTML = '';
        if (official.avatar && official.avatar.startsWith('http')) {
            avatarHTML = `<img src="${official.avatar}" alt="${official.name}" class="official-avatar-img">`;
            card.innerHTML = `
                <div class="official-avatar" style="background: none; padding: 0;">
                    ${avatarHTML}
                </div>
                <div class="official-name">${official.name || 'Unnamed Official'}</div>
                <div class="official-position">${official.position || 'Position not specified'}</div>
                <p>${official.description || 'No description available.'}</p>`;
        } else {
            card.innerHTML = `
                <div class="official-avatar">${official.avatar || (official.name ? official.name.charAt(0) : '?')}</div>
                <div class="official-name">${official.name || 'Unnamed Official'}</div>
                <div class="official-position">${official.position || 'Position not specified'}</div>
                <p>${official.description || 'No description available.'}</p>`;
        }

        container.appendChild(card);
    });
}

function renderCommittees(committees) {
    const container = document.getElementById('committees-container');
    if (!container) return;
    container.innerHTML = '';
    if (committees.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); width: 100%;">No committees information available.</p>';
        return;
    }

    committees.forEach(committee => {
        const card = document.createElement('div');
        card.className = 'committee-card';
        card.innerHTML = `
            <div class="committee-icon"><i class="${committee.icon || 'fas fa-users'}"></i></div>
            <div class="committee-name">${committee.name || 'Unnamed Committee'}</div>
            <div class="committee-chairperson">${committee.chairperson ? 'Chairperson: ' + committee.chairperson : 'No chairperson specified'}</div>
            <p>${committee.description || 'No description available.'}</p>`;
        container.appendChild(card);
    });
}

function renderDocuments(documents) {
    const container = document.getElementById('documents-container');
    if (!container) return;
    container.innerHTML = '';
    if (documents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray); grid-column: 1 / -1;">No documents information available.</p>';
        return;
    }

    documents.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'document-card';

        let requirementsHTML = '';
        if (doc.requirements && doc.requirements.length > 0) {
            requirementsHTML = `
                <p><strong>Requirements:</strong></p>
                <ul class="requirements-list">
                    ${doc.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>`;
        }

        let processingHTML = '';
        if (doc.processingTime) {
            processingHTML = `<div class="processing-time"><i class="fas fa-clock"></i> Processing Time: ${doc.processingTime}</div>`;
        }

        card.innerHTML = `
            <div class="document-icon"><i class="${doc.icon || 'fas fa-file-alt'}"></i></div>
            <div class="document-name">${doc.name || 'Unnamed Document'}</div>
            <div class="document-description">
                <p>${doc.description || 'No description available.'}</p>
                ${requirementsHTML}
                ${processingHTML}
            </div>`;

        container.appendChild(card);
    });
}

function renderFAQs(faqs) {
    const container = document.getElementById('faq-container');
    if (!container) return;
    container.innerHTML = '';
    if (faqs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray);">No FAQs available.</p>';
        return;
    }

    faqs.forEach(faq => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <div class="faq-question">
                <span>${faq.question || 'Question not available'}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${faq.answer || 'Answer not available'}</p>
            </div>`;
        container.appendChild(item);
    });
}

function initCarousel() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    let currentSlide = 0;

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) prevSlide();
                else nextSlide();
            }
        });

        let slideInterval = setInterval(nextSlide, 25000);
        carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 25000);
        });
    }
}

function initFAQs() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.faq-question')) {
            const item = e.target.closest('.faq-item');
            item.classList.toggle('active');
        }
    });
}

function initContactForm() {
    emailjs.init("KkQSfG62Jg8W8uies");

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        const emailInput = document.querySelector('input[name="from_email"]');
        if (emailInput) emailInput.addEventListener('input', validateEmail);
    }

    function isValidGmail(email) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    }

    function validateEmail(e) {
        const email = e.target.value.trim();
        e.target.style.borderColor = email && !isValidGmail(email) ? 'var(--error)' : 'var(--gray-border)';
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const emailInput = e.target.from_email;
        const email = emailInput.value.trim();

        if (!isValidGmail(email)) {
            showToast('Please use a valid Gmail address (@gmail.com only)', 'error');
            emailInput.style.borderColor = 'var(--error)';
            return;
        }
        emailInput.style.borderColor = 'var(--gray-border)';

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });

        if (db) {
            try {
                const feedbackRef = db.ref('02_aboutUs/0J_userFeedback');
                const snapshot = await feedbackRef.once('value');
                let nextId = 1;
                if (snapshot.exists()) {
                    const feedbacks = snapshot.val();
                    const ids = Object.keys(feedbacks).map(Number);
                    nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
                }
                await feedbackRef.child(nextId.toString()).set({
                    userName: e.target.from_name.value,
                    userEmail: e.target.from_email.value,
                    subject: e.target.subject.value,
                    message: e.target.message.value,
                    status: 'unread',
                    date: now.toLocaleDateString(),
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    timestamp: now.getTime()
                });
                console.log('Feedback saved with ID:', nextId);
            } catch (error) {
                console.error('Error saving feedback to Firebase:', error);
            }
        }

        const baseParams = {
            from_name: e.target.from_name.value,
            from_email: e.target.from_email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
            time: formattedTime,
            date: formattedTime
        };
        const userParams = { ...baseParams, to_email: e.target.from_email.value };
        const adminParams = { ...baseParams, to_email: 'info@barangay118.gov.ph' };
        const serviceId = 'service_ql63h29';
        const templateId = 'template_4loo5dp';

        Promise.all([
            emailjs.send(serviceId, templateId, userParams),
            emailjs.send(serviceId, templateId, adminParams)
        ])
        .then((responses) => {
            console.log('Both emails sent successfully', responses);
            showToast('Message sent successfully! Check your email.', 'success');
            e.target.reset();
        })
        .catch((error) => {
            console.error('Error sending emails:', error);
            showToast('Message saved but email delivery failed. We will contact you soon.', 'info');
            e.target.reset();
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
}

function showToast(message, type = 'info') {
    const toast = document.querySelector('.toast');
    if (toast) {
        const icon = type === 'success' ? 'fa-check-circle' :
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        toast.style.background = type === 'success' ? 'var(--success)' :
                                 type === 'error' ? 'var(--error)' : 'var(--primary)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupFirebaseListener();

    if (db) {
        headerListener = db.ref('01_PanelHome/0A_Header').on('value', (snapshot) => {
            renderHeader(snapshot.val() || {}); 
        }, (error) => {
            console.error("Header listener error:", error);
        });

        footerListener = db.ref('01_PanelHome/0D_footer').on('value', (snapshot) => {
            renderFooter(snapshot.val() || {});
        }, (error) => {
            console.error("Footer listener error:", error);
        });
    } else {
        renderHeader();
        renderFooter();
    }

    initCarousel();
    initFAQs();
    initContactForm();

    window.addEventListener('storage', function(e) {
        if (e.key === 'aboutUsContent') {
            loadFromLocalStorage();
            updateUI();
        }
    });
    console.log("AboutUs page loaded successfully");
});

window.addEventListener('beforeunload', function() {
    if (unsubscribe) unsubscribe();
    if (headerListener) db.ref('01_PanelHome/0A_Header').off('value', headerListener);
    if (footerListener) db.ref('01_PanelHome/0D_footer').off('value', footerListener);
});