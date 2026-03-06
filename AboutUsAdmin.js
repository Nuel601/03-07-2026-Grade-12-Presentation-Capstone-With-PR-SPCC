function myFunction() {
    location.reload();
}

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
let feedbackUnsubscribe = null;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database initialized successfully in Admin Panel");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const defaultAboutUsData = {
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
        title: "Our Mission & Vision",
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
            { id: 1, icon: 'fas fa-shield-heart', name: 'Committee on Violence Against Women and Children', chairperson: 'Annalyn Abesamis', description: 'Addressing issues related to violence against women and children and providing support services. This committee ensures protection and empowerment for vulnerable groups in our community.' },
            { id: 2, icon: 'fas fa-hammer', name: 'Committee on Infrastructure', chairperson: 'Joemarie F. Dohinog', description: 'Overseeing barangay infrastructure projects and maintenance of public facilities. This committee ensures our community has well-maintained roads, buildings, and public spaces.' },
            { id: 3, icon: 'fas fa-user-shield', name: 'Committee on Public Safety', chairperson: 'Ronald Allan Mateo', description: 'Ensuring the safety and security of residents through various safety programs. This committee coordinates with local authorities to maintain a secure environment for all.' },
            { id: 4, icon: 'fas fa-hand-holding-medical', name: 'Committee on Health and Sanitation', chairperson: 'Lucas Badilla', description: 'Promoting health programs and maintaining cleanliness in the community. This committee organizes medical missions and ensures proper waste management.' },
            { id: 5, icon: 'fas fa-peace', name: 'Committee on Peace and Order', chairperson: 'Novel Nolasco', description: 'Maintaining peace and order within the barangay through community policing. This committee resolves disputes and promotes harmonious living.' },
            { id: 6, icon: 'fas fa-graduation-cap', name: 'Committee on Education', chairperson: 'Ma. Theresa Neri', description: 'Supporting educational initiatives and programs for residents of all ages. This committee provides scholarships and organizes literacy programs.' },
            { id: 7, icon: 'fas fa-leaf', name: 'Committee on Environmental', chairperson: 'Alex Bolo', description: 'Implementing environmental programs and sustainability initiatives. This committee promotes green spaces and environmental awareness campaigns.' }
        ]
    },
    "0F_documents": {
        order: 6,
        subtitle: "Information about the documents you can request and their requirements",
        files: [
            { id: 1, icon: 'fas fa-file-alt', name: 'Barangay Clearance', description: 'Required for various transactions including employment, business permits, and legal matters. This document certifies your good standing in the community.', requirements: ['Valid government-issued ID', 'Proof of Residency (utility bill or lease agreement)', 'Community Tax Certificate (cedula)'], processingTime: '10-15 minutes' },
            { id: 2, icon: 'fas fa-file-alt', name: 'Certificate of Residency', description: 'Proof of residency in Barangay 118 for various purposes such as school enrollment, loan applications, and government transactions.', requirements: ['Valid government-issued ID', 'Proof of Residency (utility bill or barangay ID)', 'Completed application form'], processingTime: 'Same day' },
            { id: 3, icon: 'fas fa-file-alt', name: 'Certificate of Indigency', description: 'For availing government assistance programs and benefits. This document certifies your eligibility for social welfare programs.', requirements: ['Valid ID', 'Proof of Income or Affidavit of No Income', 'Proof of Residency'], processingTime: '1-2 days' },
            { id: 4, icon: 'fas fa-file-alt', name: 'Barangay ID', description: 'Official identification card issued by Barangay 118. Valid for local transactions and as supplementary identification.', requirements: ['Valid ID (if available)', 'Proof of Residency', '1x1 ID Photo', 'Completed application form'], processingTime: '3-5 working days' }
        ]
    },
    "0G_location": {
        order: 7,
        title: "Barangay Location",
        subtitle: "Find our barangay hall and important facilities",
        mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.756058428442!2d120.98186107483958!3d14.617918276090184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b5f6a5b2c8b1%3A0x3a5c6c3c3c3c3c3c!2s402%202nd%20St%2C%20Grace%20Park%20East%2C%20Caloocan%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1690000000000!5m2!1sen!2sph",
        address: '402 2nd St, Grace Park East, Caloocan, Metro Manila',
        location: 'Barangay 118 Hall, Grace Park East, Caloocan'
    },
    "0H_contact": {
        order: 8,
        title: "Get In Touch",
        address: '402 2nd St, Grace Park East, Caloocan, Metro Manila',
        email: 'info@barangay118.gov.ph',
        phone: '(02) 8123-4567',
        mapLink: "https://maps.app.goo.gl/vic9Xuyab5eZhxSaA",
        mapLinkText: "View on Google Maps",
        hours: {
            weekdays: 'Monday-Friday: 8:00 AM - 5:00 PM',
            saturday: 'Saturday: 8:00 AM - 12:00 PM'
        }
    },
    "0I_faqs": {
        order: 9,
        list: [
            { id: 1, question: 'What are the office hours of the barangay hall?', answer: 'Our barangay hall is open from Monday to Friday, 8:00 AM to 5:00 PM, and on Saturdays from 8:00 AM to 12:00 PM. We are closed on Sundays and holidays.' },
            { id: 2, question: 'How can I request a Barangay Clearance?', answer: 'Required documents: Valid government-issued ID (driver\'s license, passport, voter\'s ID), proof of residency (utility bill, lease/rental contract), completed barangay clearance application form, Community Tax Certificate (cedula), and passport-size photo if required. Fees: Free (no payment required). Processing time: Usually issued immediately (10–15 minutes). Where & How to apply: Apply in person at Barangay 118 Hall, weekdays 8 AM–5 PM. Submit requirements and receive your clearance.' },
            { id: 3, question: 'How can I request a Certificate of Residency?', answer: 'Required documents: Government-issued ID, proof of address (utility bill, lease, or cedula), and completed residency certificate form. Fees: Free (no payment required). Processing time: On the spot or same day. Where & How to apply: Apply at Barangay 118 Hall, weekdays 8 AM–5 PM. Present your documents and receive the certificate.' },
            { id: 4, question: 'How can I request a Certificate of Indigency?', answer: 'Required documents: Government-issued ID, proof of residence (barangay ID, voter\'s record, or utility bill), supporting income documents if applicable, and purpose statement. Fees: Free. Processing time: Usually issued immediately. Where & How to apply: Submit request at Barangay 118 Hall, weekdays 8 AM–5 PM. The officer will review and issue the certificate.' },
            { id: 5, question: 'How can I get a Barangay ID?', answer: 'Required documents: Valid ID (if any), proof of residency (utility bill, barangay certificate, or cedula), 1–2 passport-size photos, and completed application form. Fees: Free. Processing time: Usually issued on the same day. Where & How to apply: Apply at Barangay 118 Hall, weekdays 8 AM–5 PM. Submit your requirements and receive your Barangay ID.' },
            { id: 6, question: 'How can I report a community concern?', answer: 'You can report concerns by visiting the Barangay 118 Hall, calling our office at (02) 8123-4567, or using the contact form on our website. For emergencies, contact proper emergency services first. You may also use the "Get In Touch" section on our site; our team will review and assist you accordingly.' }
        ]
    }
};

class AboutUsAdminPanel {
    constructor() {
        this.dataKey = 'aboutUsContent';
        this.currentData = null;
        this.activityLog = [];
        this.lastSavedData = null;
        this.saveStatusTimeout = null;
        this.currentFeedbackFilter = 'all';
        this.renderedTabs = new Set();
        this.currentFeedbackKey = null;
        this.db = db;
        this.unsubscribe = null;
        this.feedbackUnsubscribe = null;
        this.feedbackData = {};
        this.lastUpdated = null;
        this.init();
    }

    init() {
        this.loadData();
        this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
        this.setupEventListeners();
        this.updateDashboard();
        this.logActivity('System initialized with Firebase Realtime Database integration', 'success');
        this.updateSaveStatus('• Ready to Save');
        this.setupFirebaseListener();
        this.setupFeedbackListener();
        this.hideAllTabs();
        this.switchTab('welcome');
        this.setupFeedbackModal();
        this.checkFirebaseConnection();
    }

    checkFirebaseConnection() {
        const systemStatus = document.getElementById('system-status');
        if (!systemStatus) return;
        if (this.db) {
            systemStatus.textContent = 'Online';
            systemStatus.style.color = 'var(--success)';
        } else {
            systemStatus.textContent = 'Offline';
            systemStatus.style.color = 'var(--error)';
        }
    }

    hideAllTabs() {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    }

    getDefaultData() {
        return JSON.parse(JSON.stringify(defaultAboutUsData));
    }

    deepMergeData(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMergeData(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    async loadData() {
        let loaded = false;
        if (this.db) {
            try {
                const aboutUsRef = this.db.ref('02_aboutUs');
                const snapshot = await aboutUsRef.once('value');
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();
                    this.currentData = this.getDefaultData();
                    this.deepMergeData(this.currentData, firebaseData);
                    console.log('AboutUs data loaded from Firebase Realtime Database (02_aboutUs)');
                    loaded = true;
                }
            } catch (error) {
                console.error('Error loading from Firebase Realtime Database:', error);
            }
        }

        if (!loaded) {
            const savedData = localStorage.getItem(this.dataKey);
            if (savedData) {
                try {
                    this.currentData = JSON.parse(savedData);
                    console.log('AboutUs data loaded from localStorage');
                    loaded = true;
                } catch (error) {
                    console.error('Error parsing localStorage data:', error);
                }
            }
        }

        if (!loaded) {
            this.currentData = this.getDefaultData();
            console.log('Using pre-loaded default AboutUs data');
        }

        this.populateForms();
        this.lastUpdated = new Date();
        this.updateDashboard();
    }

    setupFirebaseListener() {
        if (!this.db) return;
        try {
            const aboutUsRef = this.db.ref('02_aboutUs');
            this.unsubscribe = aboutUsRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();
                    this.deepMergeData(this.currentData, firebaseData);
                    this.populateForms();
                    this.renderOfficialsTable();
                    this.renderCommitteesTable();
                    this.renderDocumentsTable();
                    this.renderFAQTable();
                    this.lastUpdated = new Date();
                    this.updateDashboard();
                    localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
                    this.logActivity('AboutUs data updated from Database in real-time', 'info');
                }
            }, (error) => {
                console.error("Firebase Realtime Database listener error:", error);
            });
        } catch (error) {
            console.error("Failed to setup Firebase Realtime Database listener:", error);
        }
    }

    setupFeedbackListener() {
        if (!this.db) return;
        try {
            const feedbackRef = this.db.ref('02_aboutUs/0J_userFeedback');
            this.feedbackUnsubscribe = feedbackRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    this.feedbackData = snapshot.val() || {};
                    this.renderFeedbackTable(this.currentFeedbackFilter);
                    this.updateDashboard();
                    this.logActivity('User feedback updated from Firebase', 'info');
                }
            }, (error) => {
                console.error("Firebase feedback listener error:", error);
            });
        } catch (error) {
            console.error("Failed to setup Firebase feedback listener:", error);
        }
    }

    hasActualChanges() {
        if (!this.lastSavedData) return true;
        return JSON.stringify(this.currentData) !== JSON.stringify(this.lastSavedData);
    }

    async saveData(forceSave = false) {
        if (!forceSave && !this.hasActualChanges()) {
            console.log('No changes detected, skipping save');
            this.updateSaveStatus('No changes to save', 'info');
            this.showAlert('No changes to save', 'info');
            return true;
        }

        let saved = false;
        try {
            if (this.db) {
                await this.db.ref('02_aboutUs').set(this.currentData);
                console.log('AboutUs data saved to Firebase Realtime Database (02_aboutUs)');
            }
            localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
            console.log('AboutUs data saved to localStorage');
            saved = true;
            this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
            this.lastUpdated = new Date();
            this.updateDashboard();
            this.updateSaveStatus('• Saved to Database', 'success');
            this.logActivity('AboutUs data saved successfully to Firebase Realtime Database (02_aboutUs)', 'success');
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.dataKey,
                newValue: JSON.stringify(this.currentData)
            }));
        } catch (error) {
            console.error('Save failed:', error);
            this.updateSaveStatus('Save failed', 'error');
            this.logActivity('AboutUs data save failed', 'error');
            saved = false;
        }
        return saved;
    }

    updateSaveStatus(message = '• Manual Save', type = 'default') {
        const statusElement = document.getElementById('save-status');
        if (!statusElement) return;
        if (this.saveStatusTimeout) clearTimeout(this.saveStatusTimeout);
        statusElement.textContent = message;
        statusElement.className = 'save-status';
        if (type === 'success') statusElement.classList.add('success');
        else if (type === 'warning') statusElement.classList.add('warning');
        else if (type === 'error') statusElement.classList.add('error');
        else if (type === 'info') statusElement.classList.add('info');
        if (type === 'success' || type === 'info' || type === 'warning') {
            this.saveStatusTimeout = setTimeout(() => {
                statusElement.textContent = '• Ready to Save';
                statusElement.className = 'save-status';
            }, 3000);
        }
    }

    populateForms() {
        if (!this.currentData) return;
        document.getElementById('hero-title').value = this.currentData["0A_hero"]?.title || '';
        document.getElementById('hero-description').value = this.currentData["0A_hero"]?.description || '';
        document.getElementById('story-title').value = this.currentData["0B_story"]?.title || '';
        document.getElementById('story-content1').value = this.currentData["0B_story"]?.content1 || '';
        document.getElementById('story-content2').value = this.currentData["0B_story"]?.content2 || '';
        document.getElementById('story-content3').value = this.currentData["0B_story"]?.content3 || '';
        document.getElementById('story-image').value = this.currentData["0B_story"]?.image || '';
        document.getElementById('mission-vision-title').value = this.currentData["0C_missionVision"]?.title || '';
        document.getElementById('mission-title').value = this.currentData["0C_missionVision"]?.mission?.title || '';
        document.getElementById('mission-text').value = this.currentData["0C_missionVision"]?.mission?.description || '';
        document.getElementById('vision-title').value = this.currentData["0C_missionVision"]?.vision?.title || '';
        document.getElementById('vision-text').value = this.currentData["0C_missionVision"]?.vision?.description || '';
        document.getElementById('officials-subtitle').value = this.currentData["0D_officials"]?.subtitle || '';
        document.getElementById('committees-subtitle').value = this.currentData["0E_committees"]?.subtitle || '';
        document.getElementById('documents-subtitle').value = this.currentData["0F_documents"]?.subtitle || '';
        document.getElementById('location-title').value = this.currentData["0G_location"]?.title || '';
        document.getElementById('location-subtitle').value = this.currentData["0G_location"]?.subtitle || '';
        document.getElementById('map-link').value = this.currentData["0G_location"]?.mapLink || '';
        document.getElementById('map-address').value = this.currentData["0G_location"]?.address || '';
        document.getElementById('map-location').value = this.currentData["0G_location"]?.location || '';
        document.getElementById('contact-title').value = this.currentData["0H_contact"]?.title || '';
        document.getElementById('contact-address').value = this.currentData["0H_contact"]?.address || '';
        document.getElementById('contact-email').value = this.currentData["0H_contact"]?.email || '';
        document.getElementById('contact-phone').value = this.currentData["0H_contact"]?.phone || '';
        document.getElementById('contact-map-link').value = this.currentData["0H_contact"]?.mapLink || '';
        document.getElementById('contact-map-link-text').value = this.currentData["0H_contact"]?.mapLinkText || '';
        document.getElementById('contact-hours-weekdays').value = this.currentData["0H_contact"]?.hours?.weekdays || '';
        document.getElementById('contact-hours-saturday').value = this.currentData["0H_contact"]?.hours?.saturday || '';
        this.updateImagePreviews();
    }

    updateImagePreviews() {
        const storyPreview = document.getElementById('story-image-preview');
        const officialPreview = document.getElementById('official-avatar-preview');
        if (storyPreview && this.currentData["0B_story"]?.image) {
            storyPreview.src = this.currentData["0B_story"].image;
            storyPreview.classList.add('visible');
        }
        if (officialPreview) officialPreview.classList.remove('visible');
    }

    setupEventListeners() {
        document.querySelector('.sidebar-menu').addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hasAttribute('data-tab')) {
                e.preventDefault();
                this.switchTab(link.getAttribute('data-tab'));
            }
        });

        document.querySelector('.sidebar-logout-btn').addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to logout?')) e.preventDefault();
        });

        document.querySelectorAll('[data-official-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchOfficialTab(tab.getAttribute('data-official-tab')));
        });

        document.querySelectorAll('[data-committee-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchCommitteeTab(tab.getAttribute('data-committee-tab')));
        });

        document.querySelectorAll('[data-document-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchDocumentTab(tab.getAttribute('data-document-tab')));
        });

        document.querySelectorAll('[data-faq-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchFAQTab(tab.getAttribute('data-faq-tab')));
        });

        document.querySelectorAll('[data-feedback-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchFeedbackTab(tab.getAttribute('data-feedback-tab')));
        });

        this.setupFormListeners();

        document.getElementById('preview-site-btn').addEventListener('click', () => window.open('AboutUs.html', '_blank'));
        document.getElementById('export-news-btn').addEventListener('click', async () => await this.exportNewsData());
        document.getElementById('backup-btn').addEventListener('click', () => { this.backupData(); this.showAlert('Backup created successfully!', 'success'); });
        document.getElementById('refresh-btn').addEventListener('click', () => { this.loadData(); this.showAlert('Data refreshed from Database!', 'success'); });
        document.getElementById('clear-all-data-btn').addEventListener('click', () => this.clearAllData());
        document.getElementById('story-image').addEventListener('input', (e) => this.updateImagePreview('story-image-preview', e.target.value));
        document.getElementById('official-avatar').addEventListener('input', (e) => this.updateImagePreview('official-avatar-preview', e.target.value));
        document.getElementById('officials-search').addEventListener('input', (e) => this.searchOfficials(e.target.value));
        document.getElementById('committees-search').addEventListener('input', (e) => this.searchCommittees(e.target.value));
        document.getElementById('documents-search').addEventListener('input', (e) => this.searchDocuments(e.target.value));
        document.getElementById('faq-search').addEventListener('input', (e) => this.searchFAQ(e.target.value));
        document.getElementById('feedback-search').addEventListener('input', (e) => this.searchFeedback(e.target.value));
        document.querySelectorAll('form').forEach(form => form.addEventListener('submit', (e) => e.preventDefault()));
    }

    async exportNewsData() {
        if (!this.db) { this.showAlert('Firebase not connected. Cannot export news data.', 'error'); return; }
        this.showAlert('Exporting news data from Firebase...', 'info');
        try {
            const newsRef = this.db.ref('03_news');
            const snapshot = await newsRef.once('value');
            if (!snapshot.exists()) { this.showAlert('No news data found in Firebase.', 'warning'); return; }
            const newsData = snapshot.val();
            const dataStr = JSON.stringify(newsData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `barangay118-news-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            this.showAlert('News data exported successfully!', 'success');
            this.logActivity('News data exported from Firebase', 'success');
        } catch (error) {
            console.error('Error exporting news data:', error);
            this.showAlert('Failed to export news data: ' + error.message, 'error');
        }
    }

    setupFormListeners() {
        document.getElementById('hero-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = { heroTitle: this.currentData["0A_hero"].title, heroDescription: this.currentData["0A_hero"].description };
            const newData = { heroTitle: document.getElementById('hero-title').value, heroDescription: document.getElementById('hero-description').value };
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0A_hero"].title = newData.heroTitle;
                this.currentData["0A_hero"].description = newData.heroDescription;
                this.currentData["0A_hero"].order = 1;
                await this.saveData();
                this.showAlert('Hero section updated successfully!', 'success');
                this.logActivity('Hero section updated', 'success');
            } else this.showAlert('No changes detected in Hero section', 'info');
        });

        document.getElementById('hero-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Hero section to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0A_hero"] = {...defaultData["0A_hero"]};
                this.currentData["0A_hero"].order = 1;
                document.getElementById('hero-title').value = defaultData["0A_hero"].title;
                document.getElementById('hero-description').value = defaultData["0A_hero"].description;
                await this.saveData(true);
                this.showAlert('Hero section reset to defaults and saved to Database!', 'success');
                this.logActivity('Hero section reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('story-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = {...this.currentData["0B_story"]};
            const newData = {
                title: document.getElementById('story-title').value,
                content1: document.getElementById('story-content1').value,
                content2: document.getElementById('story-content2').value,
                content3: document.getElementById('story-content3').value,
                image: document.getElementById('story-image').value
            };
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0B_story"] = newData;
                this.currentData["0B_story"].order = 2;
                await this.saveData();
                this.showAlert('Story section updated successfully!', 'success');
                this.logActivity('Story section updated', 'success');
            } else this.showAlert('No changes detected in Story section', 'info');
        });

        document.getElementById('story-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Story section to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0B_story"] = {...defaultData["0B_story"]};
                this.currentData["0B_story"].order = 2;
                document.getElementById('story-title').value = defaultData["0B_story"].title;
                document.getElementById('story-content1').value = defaultData["0B_story"].content1;
                document.getElementById('story-content2').value = defaultData["0B_story"].content2;
                document.getElementById('story-content3').value = defaultData["0B_story"].content3;
                document.getElementById('story-image').value = defaultData["0B_story"].image;
                this.updateImagePreviews();
                await this.saveData(true);
                this.showAlert('Story section reset to defaults and saved to Database!', 'success');
                this.logActivity('Story section reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('mission-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = {...this.currentData["0C_missionVision"]};
            const newData = {
                title: document.getElementById('mission-vision-title').value,
                mission: { title: document.getElementById('mission-title').value, description: document.getElementById('mission-text').value },
                vision: { title: document.getElementById('vision-title').value, description: document.getElementById('vision-text').value }
            };
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0C_missionVision"] = newData;
                this.currentData["0C_missionVision"].order = 3;
                await this.saveData();
                this.showAlert('Mission & Vision updated successfully!', 'success');
                this.logActivity('Mission & Vision updated', 'success');
            } else this.showAlert('No changes detected in Mission & Vision', 'info');
        });

        document.getElementById('mission-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Mission & Vision to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0C_missionVision"] = {...defaultData["0C_missionVision"]};
                this.currentData["0C_missionVision"].order = 3;
                document.getElementById('mission-vision-title').value = defaultData["0C_missionVision"].title;
                document.getElementById('mission-title').value = defaultData["0C_missionVision"].mission.title;
                document.getElementById('mission-text').value = defaultData["0C_missionVision"].mission.description;
                document.getElementById('vision-title').value = defaultData["0C_missionVision"].vision.title;
                document.getElementById('vision-text').value = defaultData["0C_missionVision"].vision.description;
                await this.saveData(true);
                this.showAlert('Mission & Vision reset to defaults and saved to Firebase Realtime Database!', 'success');
                this.logActivity('Mission & Vision reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('officials-subtitle').addEventListener('change', async (e) => {
            if (this.currentData["0D_officials"].subtitle !== e.target.value) {
                this.currentData["0D_officials"].subtitle = e.target.value;
                await this.saveData();
                this.showAlert('Officials subtitle updated!', 'success');
            }
        });

        document.getElementById('official-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('official-edit-id').value;
            const isEditing = editId !== '';
            const officialData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0D_officials"].members.length > 0 ? Math.max(...this.currentData["0D_officials"].members.map(o => o.id)) + 1 : 1),
                name: document.getElementById('official-name').value,
                position: document.getElementById('official-position').value,
                description: document.getElementById('official-description').value,
                avatar: document.getElementById('official-avatar').value || ''
            };
            if (!officialData.avatar || officialData.avatar === '') officialData.avatar = officialData.name.charAt(0);

            if (isEditing) {
                const index = this.currentData["0D_officials"].members.findIndex(o => o.id == editId);
                if (index !== -1) this.currentData["0D_officials"].members[index] = officialData;
                this.logActivity(`Official updated: "${officialData.name}"`, 'success');
                this.showAlert('Official updated successfully!', 'success');
            } else {
                this.currentData["0D_officials"].members.push(officialData);
                this.logActivity(`Official added: "${officialData.name}"`, 'success');
                this.showAlert('Official added successfully!', 'success');
            }
            await this.saveData();
            this.renderOfficialsTable();
            document.getElementById('official-form').reset();
            document.getElementById('official-edit-id').value = '';
            document.getElementById('official-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Official';
            document.getElementById('official-cancel-edit').style.display = 'none';
            if (isEditing) this.switchOfficialTab('existing');
        });

        document.getElementById('committees-subtitle').addEventListener('change', async (e) => {
            if (this.currentData["0E_committees"].subtitle !== e.target.value) {
                this.currentData["0E_committees"].subtitle = e.target.value;
                await this.saveData();
                this.showAlert('Committees subtitle updated!', 'success');
            }
        });

        document.getElementById('committee-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('committee-edit-id').value;
            const isEditing = editId !== '';
            const committeeData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0E_committees"].list.length > 0 ? Math.max(...this.currentData["0E_committees"].list.map(c => c.id)) + 1 : 1),
                name: document.getElementById('committee-name').value,
                chairperson: document.getElementById('committee-chairperson').value,
                description: document.getElementById('committee-description').value,
                icon: document.getElementById('committee-icon').value || 'fas fa-users'
            };
            if (isEditing) {
                const index = this.currentData["0E_committees"].list.findIndex(c => c.id == editId);
                if (index !== -1) this.currentData["0E_committees"].list[index] = committeeData;
                this.logActivity(`Committee updated: "${committeeData.name}"`, 'success');
                this.showAlert('Committee updated successfully!', 'success');
            } else {
                this.currentData["0E_committees"].list.push(committeeData);
                this.logActivity(`Committee added: "${committeeData.name}"`, 'success');
                this.showAlert('Committee added successfully!', 'success');
            }
            await this.saveData();
            this.renderCommitteesTable();
            document.getElementById('committee-form').reset();
            document.getElementById('committee-edit-id').value = '';
            document.getElementById('committee-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Committee';
            document.getElementById('committee-cancel-edit').style.display = 'none';
            if (isEditing) this.switchCommitteeTab('existing');
        });

        document.getElementById('documents-subtitle').addEventListener('change', async (e) => {
            if (this.currentData["0F_documents"].subtitle !== e.target.value) {
                this.currentData["0F_documents"].subtitle = e.target.value;
                await this.saveData();
                this.showAlert('Documents subtitle updated!', 'success');
            }
        });

        document.getElementById('document-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('document-edit-id').value;
            const isEditing = editId !== '';
            const docData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0F_documents"].files.length > 0 ? Math.max(...this.currentData["0F_documents"].files.map(d => d.id)) + 1 : 1),
                name: document.getElementById('document-title').value,
                description: document.getElementById('document-description').value,
                requirements: document.getElementById('document-requirements').value.split('\n').filter(req => req.trim() !== ''),
                processingTime: document.getElementById('document-processing-time').value || '',
                icon: 'fas fa-file-alt'  
            };
            if (isEditing) {
                const index = this.currentData["0F_documents"].files.findIndex(d => d.id == editId);
                if (index !== -1) this.currentData["0F_documents"].files[index] = docData;
                this.logActivity(`Document updated: "${docData.name}"`, 'success');
                this.showAlert('Document updated successfully!', 'success');
            } else {
                this.currentData["0F_documents"].files.push(docData);
                this.logActivity(`Document added: "${docData.name}"`, 'success');
                this.showAlert('Document added successfully!', 'success');
            }
            await this.saveData();
            this.renderDocumentsTable();
            document.getElementById('document-form').reset();
            document.getElementById('document-edit-id').value = '';
            document.getElementById('document-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Document';
            document.getElementById('document-cancel-edit').style.display = 'none';
            if (isEditing) this.switchDocumentTab('existing');
        });

        document.getElementById('faq-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('faq-edit-id').value;
            const isEditing = editId !== '';
            const faqData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0I_faqs"].list.length > 0 ? Math.max(...this.currentData["0I_faqs"].list.map(f => f.id)) + 1 : 1),
                question: document.getElementById('faq-question').value,
                answer: document.getElementById('faq-answer').value
            };
            if (isEditing) {
                const index = this.currentData["0I_faqs"].list.findIndex(f => f.id == editId);
                if (index !== -1) this.currentData["0I_faqs"].list[index] = faqData;
                this.logActivity(`FAQ updated: "${faqData.question}"`, 'success');
                this.showAlert('FAQ updated successfully!', 'success');
            } else {
                this.currentData["0I_faqs"].list.push(faqData);
                this.logActivity(`FAQ added: "${faqData.question}"`, 'success');
                this.showAlert('FAQ added successfully!', 'success');
            }
            await this.saveData();
            this.renderFAQTable();
            document.getElementById('faq-form').reset();
            document.getElementById('faq-edit-id').value = '';
            document.getElementById('faq-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add FAQ';
            document.getElementById('faq-cancel-edit').style.display = 'none';
            if (isEditing) this.switchFAQTab('existing');
        });

        document.getElementById('location-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = {...this.currentData["0G_location"]};
            const newData = {
                title: document.getElementById('location-title').value,
                subtitle: document.getElementById('location-subtitle').value,
                mapLink: document.getElementById('map-link').value,
                address: document.getElementById('map-address').value,
                location: document.getElementById('map-location').value
            };
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0G_location"] = newData;
                this.currentData["0G_location"].order = 7;
                await this.saveData();
                this.showAlert('Location section updated successfully!', 'success');
                this.logActivity('Location section updated', 'success');
            } else this.showAlert('No changes detected in Location section', 'info');
        });

        document.getElementById('location-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Location section to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0G_location"] = {...defaultData["0G_location"]};
                this.currentData["0G_location"].order = 7;
                document.getElementById('location-title').value = defaultData["0G_location"].title;
                document.getElementById('location-subtitle').value = defaultData["0G_location"].subtitle;
                document.getElementById('map-link').value = defaultData["0G_location"].mapLink;
                document.getElementById('map-address').value = defaultData["0G_location"].address;
                document.getElementById('map-location').value = defaultData["0G_location"].location;
                await this.saveData(true);
                this.showAlert('Location section reset to defaults and saved to Firebase Realtime Database!', 'success');
                this.logActivity('Location section reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = {...this.currentData["0H_contact"]};
            const newData = {
                title: document.getElementById('contact-title').value,
                address: document.getElementById('contact-address').value,
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-phone').value,
                mapLinkText: document.getElementById('contact-map-link-text').value,
                mapLink: document.getElementById('contact-map-link').value,
                hours: {
                    weekdays: document.getElementById('contact-hours-weekdays').value,
                    saturday: document.getElementById('contact-hours-saturday').value
                }
            };
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0H_contact"] = newData;
                this.currentData["0H_contact"].order = 8;
                await this.saveData();
                this.showAlert('Contact information updated successfully!', 'success');
                this.logActivity('Contact information updated', 'success');
            } else this.showAlert('No changes detected in contact information', 'info');
        });

        document.getElementById('contact-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Contact section to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0H_contact"] = {...defaultData["0H_contact"]};
                this.currentData["0H_contact"].order = 8;
                document.getElementById('contact-title').value = defaultData["0H_contact"].title;
                document.getElementById('contact-address').value = defaultData["0H_contact"].address;
                document.getElementById('contact-email').value = defaultData["0H_contact"].email;
                document.getElementById('contact-phone').value = defaultData["0H_contact"].phone;
                document.getElementById('contact-map-link-text').value = defaultData["0H_contact"].mapLinkText;
                document.getElementById('contact-map-link').value = defaultData["0H_contact"].mapLink;
                document.getElementById('contact-hours-weekdays').value = defaultData["0H_contact"].hours.weekdays;
                document.getElementById('contact-hours-saturday').value = defaultData["0H_contact"].hours.saturday;
                await this.saveData(true);
                this.showAlert('Contact section reset to defaults and saved to Firebase Realtime Database!', 'success');
                this.logActivity('Contact section reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('officials-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset ALL officials to defaults? This will remove all current officials and restore defaults.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0D_officials"] = {...defaultData["0D_officials"]};
                this.currentData["0D_officials"].order = 4;
                await this.saveData();
                this.renderOfficialsTable();
                this.showAlert('All officials reset to defaults!', 'success');
                this.logActivity('All officials reset to defaults', 'warning');
            }
        });

        document.getElementById('committees-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset ALL committees to defaults? This will remove all current committees and restore defaults.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0E_committees"] = {...defaultData["0E_committees"]};
                this.currentData["0E_committees"].order = 5;
                await this.saveData();
                this.renderCommitteesTable();
                this.showAlert('All committees reset to defaults!', 'success');
                this.logActivity('All committees reset to defaults', 'warning');
            }
        });

        document.getElementById('documents-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset ALL documents to defaults? This will remove all current documents and restore defaults.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0F_documents"] = {...defaultData["0F_documents"]};
                this.currentData["0F_documents"].order = 6;
                await this.saveData();
                this.renderDocumentsTable();
                this.showAlert('All documents reset to defaults!', 'success');
                this.logActivity('All documents reset to defaults', 'warning');
            }
        });

        document.getElementById('faq-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset ALL FAQs to defaults? This will remove all current FAQs and restore defaults.')) {
                const defaultData = this.getDefaultData();
                this.currentData["0I_faqs"] = {...defaultData["0I_faqs"]};
                this.currentData["0I_faqs"].order = 9;
                await this.saveData();
                this.renderFAQTable();
                this.showAlert('All FAQs reset to defaults!', 'success');
                this.logActivity('All FAQs reset to defaults', 'warning');
            }
        });

        document.getElementById('official-cancel-edit').addEventListener('click', () => {
            document.getElementById('official-form').reset();
            document.getElementById('official-edit-id').value = '';
            document.getElementById('official-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Official';
            document.getElementById('official-cancel-edit').style.display = 'none';
        });

        document.getElementById('committee-cancel-edit').addEventListener('click', () => {
            document.getElementById('committee-form').reset();
            document.getElementById('committee-edit-id').value = '';
            document.getElementById('committee-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Committee';
            document.getElementById('committee-cancel-edit').style.display = 'none';
        });

        document.getElementById('document-cancel-edit').addEventListener('click', () => {
            document.getElementById('document-form').reset();
            document.getElementById('document-edit-id').value = '';
            document.getElementById('document-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Document';
            document.getElementById('document-cancel-edit').style.display = 'none';
        });

        document.getElementById('faq-cancel-edit').addEventListener('click', () => {
            document.getElementById('faq-form').reset();
            document.getElementById('faq-edit-id').value = '';
            document.getElementById('faq-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add FAQ';
            document.getElementById('faq-cancel-edit').style.display = 'none';
        });
    }

    setupFeedbackModal() {
        document.getElementById('feedback-modal-close-btn').addEventListener('click', () => document.getElementById('feedback-modal').classList.remove('active'));
        document.querySelector('#feedback-modal .close-modal').addEventListener('click', () => document.getElementById('feedback-modal').classList.remove('active'));
        document.getElementById('feedback-modal-delete-btn').addEventListener('click', () => {
            if (this.currentFeedbackKey !== null && confirm('Are you sure you want to delete this feedback?')) {
                this.deleteFeedback(this.currentFeedbackKey);
                document.getElementById('feedback-modal').classList.remove('active');
            }
        });
        document.getElementById('feedback-modal-mark-read-btn').addEventListener('click', () => {
            if (this.currentFeedbackKey !== null) {
                this.markFeedbackAsRead(this.currentFeedbackKey);
                document.getElementById('feedback-modal').classList.remove('active');
            }
        });
        document.getElementById('feedback-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('feedback-modal')) document.getElementById('feedback-modal').classList.remove('active');
        });
    }

    switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
        const targetLink = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetLink) targetLink.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) selectedTab.classList.add('active');
        this.updateQuickGuide(tabId);
        document.querySelector('.admin-content').scrollTo({ top: 0, behavior: 'smooth' });

        if (tabId === 'officials' && !this.renderedTabs.has('officials')) {
            this.renderOfficialsTable(); this.renderedTabs.add('officials');
        } else if (tabId === 'committees' && !this.renderedTabs.has('committees')) {
            this.renderCommitteesTable(); this.renderedTabs.add('committees');
        } else if (tabId === 'documents' && !this.renderedTabs.has('documents')) {
            this.renderDocumentsTable(); this.renderedTabs.add('documents');
        } else if (tabId === 'faq' && !this.renderedTabs.has('faq')) {
            this.renderFAQTable(); this.renderedTabs.add('faq');
        } else if (tabId === 'userFeedback' && !this.renderedTabs.has('userFeedback')) {
            this.renderFeedbackTable(); this.renderedTabs.add('userFeedback');
        }
    }

    switchOfficialTab(tab) {
        document.querySelectorAll('[data-official-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-official-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('#officials .sub-tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tab === 'existing' ? 'existing-officials' : 'add-official').classList.add('active');
    }

    switchCommitteeTab(tab) {
        document.querySelectorAll('[data-committee-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-committee-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('#committees .sub-tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tab === 'existing' ? 'existing-committees' : 'add-committee').classList.add('active');
    }

    switchDocumentTab(tab) {
        document.querySelectorAll('[data-document-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-document-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('#documents .sub-tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tab === 'existing' ? 'existing-documents' : 'add-document').classList.add('active');
    }

    switchFAQTab(tab) {
        document.querySelectorAll('[data-faq-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-faq-tab="${tab}"]`).classList.add('active');
        document.querySelectorAll('#faq .sub-tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(tab === 'existing' ? 'existing-faqs' : 'add-faq').classList.add('active');
    }

    switchFeedbackTab(tab) {
        document.querySelectorAll('[data-feedback-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-feedback-tab="${tab}"]`).classList.add('active');
        this.currentFeedbackFilter = tab;
        this.renderFeedbackTable(tab);
    }

    updateQuickGuide(tabId) {
        document.querySelectorAll('.guide-section').forEach(section => section.style.display = 'none');
        const guide = document.getElementById(`${tabId}-guide`);
        if (guide) guide.style.display = 'block';
    }

    updateDashboard() {
        if (!this.currentData) return;
        document.getElementById('last-updated').textContent = this.lastUpdated ? this.lastUpdated.toLocaleDateString() : 'Never';
        document.getElementById('user-feedback-count').textContent = this.feedbackData ? Object.keys(this.feedbackData).length : 0;
        const dataSize = JSON.stringify(this.currentData).length;
        document.getElementById('data-size').textContent = `${Math.round(dataSize / 1024)} KB`;
    }

    updateImagePreview(previewId, url) {
        const preview = document.getElementById(previewId);
        if (preview) {
            if (url) { preview.src = url; preview.classList.add('visible'); }
            else preview.classList.remove('visible');
        }
    }

    renderOfficialsTable() {
        const tbody = document.getElementById('officials-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!this.currentData["0D_officials"].members?.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No officials yet. Add your first official!</td></tr>`;
            return;
        }
        this.currentData["0D_officials"].members.forEach((official, index) => {
            let avatarHTML = '';
            if (official.avatar?.startsWith('http') || official.avatar?.startsWith('data:')) {
                avatarHTML = `<img src="${official.avatar}" alt="${official.name}" class="avatar-preview" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">`;
            } else {
                const initial = official.avatar || official.name.charAt(0);
                avatarHTML = `<div style="width: 50px; height: 50px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">${initial}</div>`;
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><div style="display: flex; align-items: center; gap: 10px;">${avatarHTML}</div></td>
                <td><strong>${official.name}</strong></td>
                <td>${official.position}</td>
                <td>${official.description || 'No description'}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm edit-official" data-id="${official.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm delete-official" data-id="${official.id}"><i class="fas fa-trash"></i> Delete</button>
                </div></td>`;
            tbody.appendChild(row);
        });
        document.querySelectorAll('.delete-official').forEach(btn => btn.addEventListener('click', (e) => this.deleteOfficial(parseInt(e.target.closest('button').getAttribute('data-id')))));
        document.querySelectorAll('.edit-official').forEach(btn => btn.addEventListener('click', (e) => this.editOfficial(parseInt(e.target.closest('button').getAttribute('data-id')))));
    }

    renderCommitteesTable() {
        const tbody = document.getElementById('committees-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!this.currentData["0E_committees"].list?.length) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--gray); padding: 30px;">No committees yet. Add your first committee!</td></tr>`;
            return;
        }
        this.currentData["0E_committees"].list.forEach((committee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${committee.name}</strong></td>
                <td>${committee.chairperson || 'No chairperson'}</td>
                <td>${committee.description ? (committee.description.substring(0, 50) + (committee.description.length > 50 ? '...' : '')) : 'No description'}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm edit-committee" data-id="${committee.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm delete-committee" data-id="${committee.id}"><i class="fas fa-trash"></i> Delete</button>
                </div></td>`;
            tbody.appendChild(row);
        });
        document.querySelectorAll('.delete-committee').forEach(btn => btn.addEventListener('click', (e) => this.deleteCommittee(parseInt(e.target.closest('button').getAttribute('data-id')))));
        document.querySelectorAll('.edit-committee').forEach(btn => btn.addEventListener('click', (e) => this.editCommittee(parseInt(e.target.closest('button').getAttribute('data-id')))));
    }

    renderDocumentsTable() {
        const tbody = document.getElementById('documents-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!this.currentData["0F_documents"].files?.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No documents yet. Add your first document!</td></tr>`;
            return;
        }
        this.currentData["0F_documents"].files.forEach((doc, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${doc.name}</strong></td>
                <td>${doc.description ? (doc.description.substring(0, 50) + (doc.description.length > 50 ? '...' : '')) : 'No description'}</td>
                <td>${doc.requirements ? doc.requirements.join(', ').substring(0, 50) + (doc.requirements.join(', ').length > 50 ? '...' : '') : 'No requirements'}</td>
                <td>${doc.processingTime || 'Not specified'}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm edit-document" data-id="${doc.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm delete-document" data-id="${doc.id}"><i class="fas fa-trash"></i> Delete</button>
                </div></td>`;
            tbody.appendChild(row);
        });
        document.querySelectorAll('.delete-document').forEach(btn => btn.addEventListener('click', (e) => this.deleteDocument(parseInt(e.target.closest('button').getAttribute('data-id')))));
        document.querySelectorAll('.edit-document').forEach(btn => btn.addEventListener('click', (e) => this.editDocument(parseInt(e.target.closest('button').getAttribute('data-id')))));
    }

    renderFAQTable() {
        const tbody = document.getElementById('faq-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!this.currentData["0I_faqs"].list?.length) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--gray); padding: 30px;">No FAQs yet. Add your first FAQ!</td></tr>`;
            return;
        }
        this.currentData["0I_faqs"].list.forEach((faq, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${faq.question}</strong></td>
                <td>${faq.answer ? faq.answer.substring(0, 50) + (faq.answer.length > 50 ? '...' : '') : 'No answer'}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm edit-faq" data-id="${faq.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm delete-faq" data-id="${faq.id}"><i class="fas fa-trash"></i> Delete</button>
                </div></td>`;
            tbody.appendChild(row);
        });
        document.querySelectorAll('.delete-faq').forEach(btn => btn.addEventListener('click', (e) => this.deleteFAQ(parseInt(e.target.closest('button').getAttribute('data-id')))));
        document.querySelectorAll('.edit-faq').forEach(btn => btn.addEventListener('click', (e) => this.editFAQ(parseInt(e.target.closest('button').getAttribute('data-id')))));
    }

    renderFeedbackTable(filter = 'all') {
        const tbody = document.getElementById('feedback-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!this.feedbackData || Object.keys(this.feedbackData).length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--gray); padding: 30px;">No feedback messages found.</td></tr>`;
            return;
        }
        let feedbackArray = Object.entries(this.feedbackData).map(([key, value]) => ({ key, ...value }));
        if (filter === 'unread') feedbackArray = feedbackArray.filter(item => item.status === 'unread');
        else if (filter === 'read') feedbackArray = feedbackArray.filter(item => item.status === 'read');
        if (feedbackArray.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--gray); padding: 30px;">No feedback messages found for this filter.</td></tr>`;
            return;
        }
        feedbackArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        feedbackArray.forEach((item, index) => {
            const statusBadge = item.status === 'unread' ? 
                '<span class="status-badge status-unread"><i class="fas fa-envelope"></i> Unread</span>' : 
                '<span class="status-badge status-read"><i class="fas fa-envelope-open"></i> Read</span>';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${item.userName || 'No Name'}</strong></td>
                <td>${item.subject || 'No Subject'}</td>
                <td>${item.date || 'No Date'}</td>
                <td>${item.time || 'No Time'}</td>
                <td>${statusBadge}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm view-feedback-btn" data-key="${item.key}"><i class="fas fa-eye"></i> View</button>
                    <button class="btn btn-danger btn-sm delete-feedback-btn" data-key="${item.key}"><i class="fas fa-trash"></i> Delete</button>
                </div></td>`;
            tbody.appendChild(row);
        });
        document.querySelectorAll('.view-feedback-btn').forEach(btn => btn.addEventListener('click', (e) => this.viewFeedbackDetails(e.target.closest('button').getAttribute('data-key'))));
        document.querySelectorAll('.delete-feedback-btn').forEach(btn => btn.addEventListener('click', (e) => this.deleteFeedback(e.target.closest('button').getAttribute('data-key'))));
        document.querySelectorAll('.status-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                const key = e.target.closest('button').parentElement.querySelector('.view-feedback-btn').getAttribute('data-key');
                this.toggleFeedbackStatus(key);
            });
        });
    }

    editOfficial(id) {
        const official = this.currentData["0D_officials"].members.find(o => o.id === id);
        if (!official) return;
        this.switchOfficialTab('add');
        document.getElementById('official-edit-id').value = official.id;
        document.getElementById('official-name').value = official.name;
        document.getElementById('official-position').value = official.position;
        document.getElementById('official-description').value = official.description || '';
        document.getElementById('official-avatar').value = official.avatar || '';
        document.getElementById('official-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Official';
        document.getElementById('official-cancel-edit').style.display = 'inline-block';
        this.updateImagePreview('official-avatar-preview', official.avatar);
        this.logActivity(`Editing official: "${official.name}"`, 'info');
    }

    editCommittee(id) {
        const committee = this.currentData["0E_committees"].list.find(c => c.id === id);
        if (!committee) return;
        this.switchCommitteeTab('add');
        document.getElementById('committee-edit-id').value = committee.id;
        document.getElementById('committee-name').value = committee.name;
        document.getElementById('committee-chairperson').value = committee.chairperson || '';
        document.getElementById('committee-description').value = committee.description || '';
        document.getElementById('committee-icon').value = committee.icon || 'fas fa-users';
        document.getElementById('committee-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Committee';
        document.getElementById('committee-cancel-edit').style.display = 'inline-block';
        this.logActivity(`Editing committee: "${committee.name}"`, 'info');
    }

    editDocument(id) {
        const doc = this.currentData["0F_documents"].files.find(d => d.id === id);
        if (!doc) return;
        this.switchDocumentTab('add');
        document.getElementById('document-edit-id').value = doc.id;
        document.getElementById('document-title').value = doc.name;
        document.getElementById('document-description').value = doc.description || '';
        document.getElementById('document-requirements').value = doc.requirements ? doc.requirements.join('\n') : '';
        document.getElementById('document-processing-time').value = doc.processingTime || '';
        document.getElementById('document-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Document';
        document.getElementById('document-cancel-edit').style.display = 'inline-block';
        this.logActivity(`Editing document: "${doc.name}"`, 'info');
    }

    editFAQ(id) {
        const faq = this.currentData["0I_faqs"].list.find(f => f.id === id);
        if (!faq) return;
        this.switchFAQTab('add');
        document.getElementById('faq-edit-id').value = faq.id;
        document.getElementById('faq-question').value = faq.question;
        document.getElementById('faq-answer').value = faq.answer;
        document.getElementById('faq-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update FAQ';
        document.getElementById('faq-cancel-edit').style.display = 'inline-block';
        this.logActivity(`Editing FAQ: "${faq.question}"`, 'info');
    }

    viewFeedbackDetails(key) {
        const item = this.feedbackData[key];
        if (!item) return;
        this.currentFeedbackKey = key;
        document.getElementById('feedback-detail-name').textContent = item.userName || 'No Name';
        document.getElementById('feedback-detail-email').textContent = item.userEmail || 'No Email';
        document.getElementById('feedback-detail-subject').textContent = item.subject || 'No Subject';
        document.getElementById('feedback-detail-message').textContent = item.message || 'No Message';
        const date = new Date(item.timestamp);
        document.getElementById('feedback-detail-date').textContent = date.toLocaleDateString();
        document.getElementById('feedback-detail-time').textContent = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('feedback-modal').classList.add('active');
    }

    async deleteOfficial(id) {
        if (confirm('Are you sure you want to delete this official?')) {
            this.currentData["0D_officials"].members = this.currentData["0D_officials"].members.filter(o => o.id !== id);
            await this.saveData();
            this.renderOfficialsTable();
            this.logActivity('Official deleted', 'error');
            this.showAlert('Official deleted successfully', 'success');
        }
    }

    async deleteCommittee(id) {
        if (confirm('Are you sure you want to delete this committee?')) {
            this.currentData["0E_committees"].list = this.currentData["0E_committees"].list.filter(c => c.id !== id);
            await this.saveData();
            this.renderCommitteesTable();
            this.logActivity('Committee deleted', 'error');
            this.showAlert('Committee deleted successfully', 'success');
        }
    }

    async deleteDocument(id) {
        if (confirm('Are you sure you want to delete this document?')) {
            this.currentData["0F_documents"].files = this.currentData["0F_documents"].files.filter(d => d.id !== id);
            await this.saveData();
            this.renderDocumentsTable();
            this.logActivity('Document deleted', 'error');
            this.showAlert('Document deleted successfully', 'success');
        }
    }

    async deleteFAQ(id) {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            this.currentData["0I_faqs"].list = this.currentData["0I_faqs"].list.filter(f => f.id !== id);
            await this.saveData();
            this.renderFAQTable();
            this.logActivity('FAQ deleted', 'error');
            this.showAlert('FAQ deleted successfully', 'success');
        }
    }

    async toggleFeedbackStatus(key) {
        if (!this.db || !key) return;
        try {
            const feedbackRef = this.db.ref(`02_aboutUs/0J_userFeedback/${key}`);
            const currentStatus = this.feedbackData[key]?.status || 'unread';
            const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
            await feedbackRef.update({ status: newStatus });
            this.logActivity('Feedback status updated', 'success');
            this.showAlert('Feedback status updated', 'success');
        } catch (error) {
            console.error('Error updating feedback status:', error);
            this.showAlert('Error updating feedback status', 'error');
        }
    }

    async deleteFeedback(key) {
        if (!this.db || !key || !confirm('Are you sure you want to delete this feedback?')) return;
        try {
            const feedbackRef = this.db.ref(`02_aboutUs/0J_userFeedback/${key}`);
            await feedbackRef.remove();
            this.logActivity('Feedback deleted', 'error');
            this.showAlert('Feedback deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting feedback:', error);
            this.showAlert('Error deleting feedback', 'error');
        }
    }

    async markFeedbackAsRead(key) {
        if (!this.db || !key) return;
        try {
            const feedbackRef = this.db.ref(`02_aboutUs/0J_userFeedback/${key}`);
            await feedbackRef.update({ status: 'read' });
            this.logActivity('Feedback marked as read', 'success');
            this.showAlert('Feedback marked as read', 'success');
        } catch (error) {
            console.error('Error marking feedback as read:', error);
            this.showAlert('Error marking feedback as read', 'error');
        }
    }

    searchOfficials(query) {
        const tbody = document.getElementById('officials-table-body');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        if (searchText === '') { rows.forEach(row => row.style.display = ''); return; }
        rows.forEach(row => {
            const id = row.cells[0].textContent.toLowerCase();
            const name = row.cells[2].textContent.toLowerCase();
            const position = row.cells[3].textContent.toLowerCase();
            const desc = row.cells[4].textContent.toLowerCase();
            row.style.display = (id.includes(searchText) || name.includes(searchText) || position.includes(searchText) || desc.includes(searchText)) ? '' : 'none';
        });
    }

    searchCommittees(query) {
        const tbody = document.getElementById('committees-table-body');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        if (searchText === '') { rows.forEach(row => row.style.display = ''); return; }
        rows.forEach(row => {
            const id = row.cells[0].textContent.toLowerCase();
            const title = row.cells[1].textContent.toLowerCase();
            const chair = row.cells[2].textContent.toLowerCase();
            const desc = row.cells[3].textContent.toLowerCase();
            row.style.display = (id.includes(searchText) || title.includes(searchText) || chair.includes(searchText) || desc.includes(searchText)) ? '' : 'none';
        });
    }

    searchDocuments(query) {
        const tbody = document.getElementById('documents-table-body');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        if (searchText === '') { rows.forEach(row => row.style.display = ''); return; }
        rows.forEach(row => {
            const id = row.cells[0].textContent.toLowerCase();
            const title = row.cells[1].textContent.toLowerCase();
            const desc = row.cells[2].textContent.toLowerCase();
            const req = row.cells[3].textContent.toLowerCase();
            const time = row.cells[4].textContent.toLowerCase();
            row.style.display = (id.includes(searchText) || title.includes(searchText) || desc.includes(searchText) || req.includes(searchText) || time.includes(searchText)) ? '' : 'none';
        });
    }

    searchFAQ(query) {
        const tbody = document.getElementById('faq-table-body');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        if (searchText === '') { rows.forEach(row => row.style.display = ''); return; }
        rows.forEach(row => {
            const id = row.cells[0].textContent.toLowerCase();
            const q = row.cells[1].textContent.toLowerCase();
            const a = row.cells[2].textContent.toLowerCase();
            row.style.display = (id.includes(searchText) || q.includes(searchText) || a.includes(searchText)) ? '' : 'none';
        });
    }

    searchFeedback(query) {
        const tbody = document.getElementById('feedback-table-body');
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        if (searchText === '') { rows.forEach(row => row.style.display = ''); return; }
        rows.forEach(row => {
            const id = row.cells[0].textContent.toLowerCase();
            const name = row.cells[1].textContent.toLowerCase();
            const subject = row.cells[2].textContent.toLowerCase();
            const date = row.cells[3].textContent.toLowerCase();
            const time = row.cells[4].textContent.toLowerCase();
            const status = row.cells[5].textContent.toLowerCase();
            row.style.display = (id.includes(searchText) || name.includes(searchText) || subject.includes(searchText) || date.includes(searchText) || time.includes(searchText) || status.includes(searchText)) ? '' : 'none';
        });
    }

    backupData() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aboutus-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.logActivity('AboutUs data backed up successfully', 'success');
        this.showAlert('AboutUs data backed up successfully!', 'success');
    }

    async clearAllData() {
        if (confirm('Clear ALL data? This will remove everything and cannot be undone.')) {
            try {
                if (this.db) await this.db.ref('02_aboutUs').remove();
                localStorage.removeItem(this.dataKey);
                this.currentData = this.getDefaultData();
                this.populateForms();
                await this.saveData(true);
                this.logActivity('All AboutUs data cleared', 'error');
                this.showAlert('All AboutUs data has been cleared', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showAlert('Error clearing AboutUs data', 'error');
            }
        }
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `<strong><i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}</strong>`;
        const currentTab = document.querySelector('.tab-content.active');
        if (currentTab) currentTab.insertBefore(alert, currentTab.firstChild);
        setTimeout(() => alert.remove(), 5000);
    }

    logActivity(message, type) {
        const activity = { timestamp: new Date().toLocaleTimeString(), message, type };
        this.activityLog.unshift(activity);
        if (this.activityLog.length > 10) this.activityLog.pop();
        this.updateActivityLog();
    }

    updateActivityLog() {
        const container = document.getElementById('recent-activity');
        if (!container) return;
        if (this.activityLog.length === 0) {
            container.innerHTML = `<p style="color: var(--gray); text-align: center; padding: 20px;"><i class="fas fa-clock"></i> No recent activity</p>`;
            return;
        }
        container.innerHTML = this.activityLog.map(activity => `
            <div style="padding: 10px 15px; border-left: 3px solid ${
                activity.type === 'success' ? 'var(--success)' : 
                activity.type === 'error' ? 'var(--error)' : 'var(--warning)'
            }; margin-bottom: 10px; background: var(--gray-light); border-radius: 0 var(--radius) var(--radius) 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                    <span style="font-weight: 600;">${activity.message}</span>
                    <small style="color: var(--gray);">${activity.timestamp}</small>
                </div>
            </div>`).join('');
    }

    cleanup() {
        if (this.unsubscribe) this.unsubscribe();
        if (this.feedbackUnsubscribe) this.feedbackUnsubscribe();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.aboutUsAdminPanel = new AboutUsAdminPanel();
    window.addEventListener('beforeunload', () => {
        if (window.aboutUsAdminPanel) window.aboutUsAdminPanel.cleanup();
    });
});