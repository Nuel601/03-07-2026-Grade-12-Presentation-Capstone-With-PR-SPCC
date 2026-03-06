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

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database initialized successfully in Emergency Admin Panel");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

const defaultEmergencyData = {
    "0A_hero": {
        order: 1,
        title: "Emergency Assistance",
        description: "Quick access to emergency services for Barangay 118 residents"
    },
    "0B_quickCall": {
        order: 2,
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
        order: 3,
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
        order: 4,
        title: "Emergency Procedures",
        description: "Step-by-step guide for different emergencies.",
        warning: "Warning: Calling these emergency numbers should never be done as a joke. Misuse may result in penalties, and authorities may automatically track your location when you contact these numbers.",
        cards: [
            { id: 1, icon: "fas fa-fire", title: "Fire Emergency", steps: [ "Shout \"Fire!\" to alert everyone", "Call (02) 8288-6350 Caloocan Fire Station Hotline", "Use stairs, not elevators", "Crawl low under smoke" ] },
            { id: 2, icon: "fas fa-heartbeat", title: "Medical Emergency", steps: [ "Ensure area is safe", "Call 911 immediately", "Provide basic care if trained", "Clear path for responders" ] },
            { id: 3, icon: "fas fa-house-tsunami", title: "Earthquake", steps: [ "DROP to the ground", "COVER under sturdy furniture", "HOLD ON until shaking stops", "Evacuate if necessary", "Caloocan City CDRRMO Rescue & Extraction 0975-802-8223 or 0956-242-2079" ] },
            { id: 4, icon: "fas fa-cloud-showers-heavy", title: "Typhoon/Flood", steps: [ "Stay updated on warnings", "Move to higher ground if flooding", "Avoid flood waters", "Have emergency kit ready", "Caloocan CDRRMO Hotline: 0975-802-8223" ] }
        ]
    },
    "0E_facilities": {
        order: 5,
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
        order: 6,
        title: "Emergency Preparedness Kit",
        description: "Essential items to prepare for emergencies",
        checklist: [
            { id: 1, category: "Medical & First Aid", items: [ "Bandages and antiseptic", "Prescription medications", "Pain relievers", "Medical gloves" ] },
            { id: 2, category: "Food & Water", items: [ "3-day water supply (1 gallon/person/day)", "Non-perishable food", "Manual can opener", "Energy bars" ] },
            { id: 3, category: "Light & Communication", items: [ "Flashlight with extra batteries", "Portable phone charger", "Battery-powered radio", "Whistle" ] },
            { id: 4, category: "Important Documents", items: [ "Copies of IDs in waterproof container", "Insurance papers", "Medical records", "Emergency contact list" ] }
        ]
        // tips property removed
    }
};

class EmergencyAdminPanel {
    constructor() {
        this.dataKey = 'emergencyData';
        this.currentData = null;
        this.activityLog = [];
        this.lastSavedData = null;
        this.saveStatusTimeout = null;
        this.renderedTabs = new Set();
        this.db = db;
        this.unsubscribe = null;
        this.lastUpdated = null;
        this.isDataLoaded = false;
        this.init();
    }

    init() {
        if (this.db) {
            this.checkFirebaseConnection();
        }
        this.loadData();
        this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
        this.setupEventListeners();
        this.updateDashboard();
        this.logActivity('System initialized with Firebase Realtime Database integration (new keys)', 'success');
        this.updateSaveStatus('• Ready to Save');
        this.setupFirebaseListener();             
        this.hideAllTabs();
        this.switchTab('dashboard');
    }

    hideAllTabs() {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
    }

    getDefaultData() {
        return JSON.parse(JSON.stringify(defaultEmergencyData));
    }

    deepMergeData(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMergeData(target[key], source[key]);
            } else if (Array.isArray(source[key])) {
                target[key] = [...source[key]];
            } else {
                target[key] = source[key];
            }
        }
    }

    checkFirebaseConnection() {
        const statusElement = document.getElementById('system-status');
        if (!statusElement) return;
        
        if (this.db) {
            statusElement.textContent = 'Online';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = 'Local Mode';
            statusElement.style.color = '#ffc107';
        }
    }

    async loadData() {
        let loaded = false;
        if (this.db) {
            try {
                const emergencyRef = this.db.ref('04_Emergency');
                const snapshot = await emergencyRef.once('value');
                
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();
                    this.currentData = this.getDefaultData();
                    this.deepMergeData(this.currentData, firebaseData);
                    console.log('Emergency data loaded from Firebase Realtime Database (04_Emergency) with new keys');
                    this.isDataLoaded = true;
                    loaded = true;
                } else {
                    this.currentData = this.getDefaultData();
                    this.isDataLoaded = true;
                    await this.saveData(true);
                    console.log('Default Emergency data saved to Firebase with new keys');
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
                    console.log('Emergency data loaded from localStorage');
                    this.isDataLoaded = true;
                    loaded = true;
                } catch (error) {
                    console.error('Error parsing localStorage data:', error);
                }
            }
        }
        
        if (!loaded) {
            this.currentData = this.getDefaultData();
            console.log('Using pre-loaded default Emergency data');
            this.isDataLoaded = true;
        }
        
        this.populateForms();
        this.lastUpdated = new Date();
        this.updateDashboard();
    }

    setupFirebaseListener() {
        if (!this.db) return;
        
        try {
            const emergencyRef = this.db.ref('04_Emergency');
            
            this.unsubscribe = emergencyRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();
                    
                    this.deepMergeData(this.currentData, firebaseData);
                    this.isDataLoaded = true;
                    this.populateForms();
                    this.renderQuickCallTable();
                    this.renderContacts();
                    this.renderProcedures();
                    this.renderFacilitiesTable();
                    this.renderPreparation();
                    this.lastUpdated = new Date();
                    this.updateDashboard();

                    localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
                    
                    this.logActivity('Emergency data updated from Firebase Realtime Database in real-time', 'info');
                    this.showAlert('Emergency data synchronized from Firebase Realtime Database', 'info');
                }
            }, (error) => {
                console.error("Firebase Realtime Database listener error:", error);
            });
        } catch (error) {
            console.error("Failed to setup Firebase Realtime Database listener:", error);
        }
    }

    hasActualChanges() {
        if (!this.lastSavedData) return true;
        
        const currentDataStr = JSON.stringify(this.currentData);
        const lastSavedDataStr = JSON.stringify(this.lastSavedData); 
        return currentDataStr !== lastSavedDataStr;
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
                await this.db.ref('04_Emergency').set(this.currentData);
                console.log('Emergency data saved to Firebase Realtime Database (04_Emergency) with new keys');
                this.isDataLoaded = true;
            }
            
            localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
            console.log('Emergency data saved to localStorage');
            saved = true;
            
            this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
            this.lastUpdated = new Date();
            
            this.updateDashboard();
            this.updateSaveStatus('• Saved to Database', 'success');
            this.logActivity('Emergency data saved successfully to Firebase Realtime Database (04_Emergency)', 'success');
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.dataKey,
                newValue: JSON.stringify(this.currentData)
            }));
            
        } catch (error) {
            console.error('Save failed:', error);
            this.updateSaveStatus('Save failed', 'error');
            this.logActivity('Emergency data save failed', 'error');
            saved = false;
        }
        
        return saved;
    }
    
    updateSaveStatus(message = '• Ready to Save', type = 'default') {
        const statusElement = document.getElementById('save-status');
        if (!statusElement) return;
        
        if (this.saveStatusTimeout) {
            clearTimeout(this.saveStatusTimeout);
        }
        
        statusElement.textContent = message;
        statusElement.className = 'save-status';
        
        if (type === 'success') {
            statusElement.classList.add('success');
        } else if (type === 'warning') {
            statusElement.classList.add('warning');
        } else if (type === 'error') {
            statusElement.classList.add('error');
        } else if (type === 'info') {
            statusElement.classList.add('info');
        }
        
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
        // no tips form to populate
    }

    setupEventListeners() {
        document.querySelector('.sidebar-menu').addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hasAttribute('data-tab')) {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                this.switchTab(tabId);
            }
        });

        document.querySelectorAll('[data-quickcall-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-quickcall-tab');
                document.querySelectorAll('[data-quickcall-tab]').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#quickcall .sub-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`${tabId}-quickcall`).classList.add('active');
            });
        });

        document.querySelectorAll('[data-contacts-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-contacts-tab');
                document.querySelectorAll('[data-contacts-tab]').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#contacts .sub-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`${tabId}-contacts`).classList.add('active');
            });
        });

        document.querySelectorAll('[data-procedures-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-procedures-tab');
                document.querySelectorAll('[data-procedures-tab]').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#procedures .sub-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`${tabId}-procedures`).classList.add('active');
            });
        });

        document.querySelectorAll('[data-facilities-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-facilities-tab');
                document.querySelectorAll('[data-facilities-tab]').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#facilities .sub-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`${tabId}-facilities`).classList.add('active');
            });
        });

        document.querySelectorAll('[data-preparation-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-preparation-tab');
                document.querySelectorAll('[data-preparation-tab]').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#preparation .sub-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                tab.classList.add('active');
                document.getElementById(`${tabId}-preparation`).classList.add('active');
            });
        });

        document.getElementById('preview-site-btn').addEventListener('click', () => {
            window.open('Emergency.html', '_blank');
        });

        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('backup-data-btn').addEventListener('click', () => {
            this.exportData();
            this.showAlert('Backup created successfully!', 'success');
        });

        document.getElementById('refresh-data-btn').addEventListener('click', () => {
            this.loadData();
            this.showAlert('Data refreshed from Firebase Realtime Database!', 'success');
        });

        document.getElementById('clear-data-btn').addEventListener('click', () => {
            this.clearAllData();
        });

        this.setupFormListeners();
        document.getElementById('quickcall-search').addEventListener('input', (e) => {
            this.searchQuickCall(e.target.value);
        });

        document.getElementById('contacts-search').addEventListener('input', (e) => {
            this.searchContacts(e.target.value);
        });

        document.getElementById('procedures-search').addEventListener('input', (e) => {
            this.searchProcedures(e.target.value);
        });

        document.getElementById('facilities-search').addEventListener('input', (e) => {
            this.searchFacilities(e.target.value);
        });

        document.getElementById('preparation-search').addEventListener('input', (e) => {
            this.searchPreparation(e.target.value);
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        });
    }

    setupFormListeners() {
        document.getElementById('hero-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldData = {...this.currentData["0A_hero"]};
            const newData = {
                title: document.getElementById('hero-title').value,
                description: document.getElementById('hero-description').value
            };
            
            if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                this.currentData["0A_hero"] = newData;
                this.currentData["0A_hero"].order = 1;
                
                await this.saveData();
                this.showAlert('Hero section updated successfully!', 'success');
                this.logActivity('Hero section updated', 'success');
            } else {
                this.showAlert('No changes detected in Hero section', 'info');
            }
        });

        document.getElementById('hero-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Hero section to defaults?')) {
                const defaultData = this.getDefaultData();
                
                this.currentData["0A_hero"] = {...defaultData["0A_hero"]};
                this.currentData["0A_hero"].order = 1;
                
                document.getElementById('hero-title').value = defaultData["0A_hero"].title;
                document.getElementById('hero-description').value = defaultData["0A_hero"].description;
                
                await this.saveData(true);
                this.showAlert('Hero section reset to defaults!', 'success');
                this.logActivity('Hero section reset to defaults', 'warning');
            }
        });

        document.getElementById('quickcall-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('quickcall-edit-id').value;
            const isEditing = editId !== '';
            const quickCallData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0B_quickCall"].cards.length > 0 ? 
                    Math.max(...this.currentData["0B_quickCall"].cards.map(c => c.id)) + 1 : 1),
                type: document.getElementById('quickcall-type').value,
                title: document.getElementById('quickcall-title').value,
                subtitle: document.getElementById('quickcall-subtitle').value,
                number: document.getElementById('quickcall-number').value
            };

            if (isEditing) {
                const index = this.currentData["0B_quickCall"].cards.findIndex(c => c.id == editId);
                if (index !== -1) {
                    this.currentData["0B_quickCall"].cards[index] = quickCallData;
                }
                this.showAlert('Quick call contact updated successfully!', 'success');
                this.logActivity(`Quick call contact "${quickCallData.title}" updated`, 'success');
            } else {
                this.currentData["0B_quickCall"].cards.push(quickCallData);
                this.showAlert('Quick call contact added successfully!', 'success');
                this.logActivity(`Quick call contact "${quickCallData.title}" added`, 'success');
            }

            await this.saveData();
            this.renderQuickCallTable();
            document.querySelector('[data-quickcall-tab="existing"]').click();
            document.getElementById('quickcall-form').reset();
            document.getElementById('quickcall-edit-id').value = '';
        });

        document.getElementById('quickcall-reset-btn').addEventListener('click', () => {
            document.getElementById('quickcall-form').reset();
            document.getElementById('quickcall-edit-id').value = '';
        });

        document.getElementById('quickcall-cancel-edit').addEventListener('click', () => {
            document.getElementById('quickcall-form').reset();
            document.getElementById('quickcall-edit-id').value = '';
            document.getElementById('quickcall-cancel-edit').style.display = 'none';
            document.getElementById('quickcall-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Contact';
            document.querySelector('[data-quickcall-tab="existing"]').click();
        });

        document.getElementById('contacts-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('contacts-edit-id').value;
            const isEditing = editId !== '';
            const items = [];
            const itemElements = document.querySelectorAll('#contacts-items-container .contact-item');
            itemElements.forEach((item, index) => {
                const title = item.querySelector('.contact-item-title').value;
                const number = item.querySelector('.contact-item-number').value;
                const description = item.querySelector('.contact-item-description').value;
                const hours = item.querySelector('.contact-item-hours').value;
                
                if (title && number) {
                    items.push({
                        id: index + 1,
                        title: title,
                        number: number,
                        description: description,
                        hours: hours
                    });
                }
            });

            const contactsData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0C_contacts"].accordions.length > 0 ? 
                    Math.max(...this.currentData["0C_contacts"].accordions.map(a => a.id)) + 1 : 1),
                title: document.getElementById('contacts-category-title').value,
                items: items
            };

            if (isEditing) {
                const index = this.currentData["0C_contacts"].accordions.findIndex(a => a.id == editId);
                if (index !== -1) {
                    this.currentData["0C_contacts"].accordions[index] = contactsData;
                }
                this.showAlert('Contacts category updated successfully!', 'success');
                this.logActivity(`Contacts category "${contactsData.title}" updated`, 'success');
            } else {
                this.currentData["0C_contacts"].accordions.push(contactsData);
                this.showAlert('Contacts category added successfully!', 'success');
                this.logActivity(`Contacts category "${contactsData.title}" added`, 'success');
            }

            await this.saveData();
            this.renderContacts();

            document.querySelector('[data-contacts-tab="existing"]').click();
            document.getElementById('contacts-form').reset();
            document.getElementById('contacts-edit-id').value = '';
            document.getElementById('contacts-items-container').innerHTML = '';
        });

        document.getElementById('add-contact-item-btn').addEventListener('click', () => {
            this.addContactItem();
        });

        document.getElementById('contacts-reset-btn').addEventListener('click', () => {
            document.getElementById('contacts-form').reset();
            document.getElementById('contacts-edit-id').value = '';
            document.getElementById('contacts-items-container').innerHTML = '';
        });

        document.getElementById('contacts-cancel-edit').addEventListener('click', () => {
            document.getElementById('contacts-form').reset();
            document.getElementById('contacts-edit-id').value = '';
            document.getElementById('contacts-items-container').innerHTML = '';
            document.getElementById('contacts-cancel-edit').style.display = 'none';
            document.getElementById('contacts-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Category';
            document.querySelector('[data-contacts-tab="existing"]').click();
        });

        document.getElementById('procedures-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('procedures-edit-id').value;
            const isEditing = editId !== '';

            const steps = [];
            document.querySelectorAll('#procedures-steps-container .step-input').forEach(input => {
                if (input.value.trim()) {
                    steps.push(input.value.trim());
                }
            });

            const procedureData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0D_procedures"].cards.length > 0 ? 
                    Math.max(...this.currentData["0D_procedures"].cards.map(p => p.id)) + 1 : 1),
                icon: document.getElementById('procedures-icon').value,
                title: document.getElementById('procedures-title').value,
                steps: steps
            };

            if (isEditing) {
                const index = this.currentData["0D_procedures"].cards.findIndex(p => p.id == editId);
                if (index !== -1) {
                    this.currentData["0D_procedures"].cards[index] = procedureData;
                }
                this.showAlert('Procedure updated successfully!', 'success');
                this.logActivity(`Procedure "${procedureData.title}" updated`, 'success');
            } else {
                this.currentData["0D_procedures"].cards.push(procedureData);
                this.showAlert('Procedure added successfully!', 'success');
                this.logActivity(`Procedure "${procedureData.title}" added`, 'success');
            }

            await this.saveData();
            this.renderProcedures();

            document.querySelector('[data-procedures-tab="existing"]').click();
            document.getElementById('procedures-form').reset();
            document.getElementById('procedures-edit-id').value = '';
            document.getElementById('procedures-steps-container').innerHTML = '';
        });

        document.getElementById('add-step-btn').addEventListener('click', () => {
            this.addProcedureStep();
        });

        document.getElementById('procedures-reset-btn').addEventListener('click', () => {
            document.getElementById('procedures-form').reset();
            document.getElementById('procedures-edit-id').value = '';
            document.getElementById('procedures-steps-container').innerHTML = '';
        });

        document.getElementById('procedures-cancel-edit').addEventListener('click', () => {
            document.getElementById('procedures-form').reset();
            document.getElementById('procedures-edit-id').value = '';
            document.getElementById('procedures-steps-container').innerHTML = '';
            document.getElementById('procedures-cancel-edit').style.display = 'none';
            document.getElementById('procedures-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Procedure';
            document.querySelector('[data-procedures-tab="existing"]').click();
        });

        document.getElementById('facilities-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('facilities-edit-id').value;
            const isEditing = editId !== '';

            const facilityData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0E_facilities"].cards.length > 0 ? 
                    Math.max(...this.currentData["0E_facilities"].cards.map(f => f.id)) + 1 : 1),
                type: document.getElementById('facilities-type').value,
                title: document.getElementById('facilities-name').value,
                address: document.getElementById('facilities-address').value,
                distance: document.getElementById('facilities-distance').value,
                hours: document.getElementById('facilities-hours').value,
                mapLink: document.getElementById('facilities-map-link').value
            };

            if (isEditing) {
                const index = this.currentData["0E_facilities"].cards.findIndex(f => f.id == editId);
                if (index !== -1) {
                    this.currentData["0E_facilities"].cards[index] = facilityData;
                }
                this.showAlert('Facility updated successfully!', 'success');
                this.logActivity(`Facility "${facilityData.title}" updated`, 'success');
            } else {
                this.currentData["0E_facilities"].cards.push(facilityData);
                this.showAlert('Facility added successfully!', 'success');
                this.logActivity(`Facility "${facilityData.title}" added`, 'success');
            }

            await this.saveData();
            this.renderFacilitiesTable();
            document.querySelector('[data-facilities-tab="existing"]').click();
            document.getElementById('facilities-form').reset();
            document.getElementById('facilities-edit-id').value = '';
        });

        document.getElementById('facilities-reset-btn').addEventListener('click', () => {
            document.getElementById('facilities-form').reset();
            document.getElementById('facilities-edit-id').value = '';
        });

        document.getElementById('facilities-cancel-edit').addEventListener('click', () => {
            document.getElementById('facilities-form').reset();
            document.getElementById('facilities-edit-id').value = '';
            document.getElementById('facilities-cancel-edit').style.display = 'none';
            document.getElementById('facilities-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Facility';
            document.querySelector('[data-facilities-tab="existing"]').click();
        });

        document.getElementById('preparation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('preparation-edit-id').value;
            const isEditing = editId !== '';

            const items = [];
            document.querySelectorAll('#preparation-items-container .category-input').forEach(input => {
                if (input.value.trim()) {
                    items.push(input.value.trim());
                }
            });

            const preparationData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0F_preparation"].checklist.length > 0 ? 
                    Math.max(...this.currentData["0F_preparation"].checklist.map(c => c.id)) + 1 : 1),
                category: document.getElementById('preparation-category').value,
                items: items
            };

            if (isEditing) {
                const index = this.currentData["0F_preparation"].checklist.findIndex(c => c.id == editId);
                if (index !== -1) {
                    this.currentData["0F_preparation"].checklist[index] = preparationData;
                }
                this.showAlert('Preparation category updated successfully!', 'success');
                this.logActivity(`Preparation category "${preparationData.category}" updated`, 'success');
            } else {
                this.currentData["0F_preparation"].checklist.push(preparationData);
                this.showAlert('Preparation category added successfully!', 'success');
                this.logActivity(`Preparation category "${preparationData.category}" added`, 'success');
            }

            await this.saveData();
            this.renderPreparation();
            document.querySelector('[data-preparation-tab="existing"]').click();
            document.getElementById('preparation-form').reset();
            document.getElementById('preparation-edit-id').value = '';
            document.getElementById('preparation-items-container').innerHTML = '';
        });

        document.getElementById('add-checklist-item-btn').addEventListener('click', () => {
            this.addChecklistItem();
        });

        document.getElementById('preparation-reset-btn').addEventListener('click', () => {
            document.getElementById('preparation-form').reset();
            document.getElementById('preparation-edit-id').value = '';
            document.getElementById('preparation-items-container').innerHTML = '';
        });

        document.getElementById('preparation-cancel-edit').addEventListener('click', () => {
            document.getElementById('preparation-form').reset();
            document.getElementById('preparation-edit-id').value = '';
            document.getElementById('preparation-items-container').innerHTML = '';
            document.getElementById('preparation-cancel-edit').style.display = 'none';
            document.getElementById('preparation-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Category';
            document.querySelector('[data-preparation-tab="existing"]').click();
        });
    }

    switchTab(tabId) {
        document.querySelectorAll('.sidebar-menu a').forEach(item => {
            item.classList.remove('active');
        });
        const targetLink = document.querySelector(`[data-tab="${tabId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        document.querySelector('.admin-content').scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        if (tabId === 'quickcall') {
            this.renderQuickCallTable();
        } else if (tabId === 'contacts') {
            this.renderContacts();
        } else if (tabId === 'procedures') {
            this.renderProcedures();
        } else if (tabId === 'facilities') {
            this.renderFacilitiesTable();
        } else if (tabId === 'preparation') {
            this.renderPreparation();
        }
    }

    updateDashboard() {
        if (!this.currentData) return;
        const lastUpdatedText = this.lastUpdated ? 
            `${this.lastUpdated.getMonth()+1}/${this.lastUpdated.getDate()}/${this.lastUpdated.getFullYear()}` : 'Never';
        document.getElementById('last-updated').textContent = lastUpdatedText;
        document.getElementById('total-contacts').textContent = this.currentData["0C_contacts"]?.accordions?.reduce((total, acc) => total + (acc.items?.length || 0), 0) || 0;
        document.getElementById('total-facilities').textContent = this.currentData["0E_facilities"]?.cards?.length || 0;
        const dataSize = JSON.stringify(this.currentData).length;
        document.getElementById('data-size').textContent = `${Math.round(dataSize / 1024)} KB`;
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
            </div>
        `).join('');
    }

    renderQuickCallTable() {
        const tbody = document.getElementById('quickcall-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!this.currentData["0B_quickCall"]?.cards || this.currentData["0B_quickCall"].cards.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--gray); padding: 30px;">No quick call contacts yet. Click "Add New Contact" to add your first contact!</td></tr>`;
            return;
        }

        this.currentData["0B_quickCall"].cards.forEach((contact, index) => {
            const typeText = contact.type.charAt(0).toUpperCase() + contact.type.slice(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${typeText}</td>
                <td><strong>${contact.title}</strong><br><small>${contact.subtitle || ''}</small></td>
                <td>${contact.number}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-quickcall" data-id="${contact.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-quickcall" data-id="${contact.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.delete-quickcall').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteQuickCall(id);
            });
        });

        document.querySelectorAll('.edit-quickcall').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.editQuickCall(id);
            });
        });
    }

    renderContacts() {
        const container = document.getElementById('contacts-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (!this.currentData["0C_contacts"]?.accordions || this.currentData["0C_contacts"].accordions.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--gray); padding: 40px; grid-column: 1/-1;">
                <h3>No contact categories yet</h3>
                <p>Click "Add New Category" to get started!</p>
            </div>`;
            return;
        }

        this.currentData["0C_contacts"].accordions.forEach((accordion, index) => {
            const card = document.createElement('div');
            card.className = 'simple-card';
            card.setAttribute('data-id', accordion.id);
            
            let itemsHTML = '';
            if (accordion.items && accordion.items.length > 0) {
                accordion.items.forEach((item, itemIndex) => {
                    itemsHTML += `
                        <div class="simple-list-item">
                            <div class="simple-list-content">
                                <strong>${item.title}</strong><br>
                                <small>${item.number}</small><br>
                                <small style="color: var(--gray);">${item.description}</small>
                            </div>
                        </div>`;
                });
            } else {
                itemsHTML = `<div style="text-align: center; color: var(--gray); padding: 10px;">
                    No contact items
                </div>`;
            }
            
            card.innerHTML = `
                <div class="simple-card-header">
                    <div class="simple-card-title">${accordion.title}</div>
                </div>
                <div class="simple-card-body">
                    <div class="simple-list">
                        ${itemsHTML}
                    </div>
                </div>
                <div class="simple-card-footer">
                    <button class="btn btn-primary btn-sm edit-contacts" data-id="${accordion.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-contacts" data-id="${accordion.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>`;
            
            container.appendChild(card);
        });

        document.querySelectorAll('.edit-contacts').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.editContacts(id);
            });
        });

        document.querySelectorAll('.delete-contacts').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteContacts(id);
            });
        });
    }

    renderProcedures() {
        const container = document.getElementById('procedures-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (!this.currentData["0D_procedures"]?.cards || this.currentData["0D_procedures"].cards.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--gray); padding: 40px; grid-column: 1/-1;">
                <h3>No procedures yet</h3>
                <p>Click "Add New Procedure" to get started!</p>
            </div>`;
            return;
        }

        this.currentData["0D_procedures"].cards.forEach((procedure, index) => {
            const card = document.createElement('div');
            card.className = 'simple-card';
            card.setAttribute('data-id', procedure.id);
            
            let stepsHTML = '';
            if (procedure.steps && procedure.steps.length > 0) {
                procedure.steps.forEach((step, stepIndex) => {
                    stepsHTML += `
                        <div class="simple-list-item">
                            <div class="simple-list-content">
                                <strong>${stepIndex + 1}.</strong> ${step}
                            </div>
                        </div>`;
                });
            } else {
                stepsHTML = `<div style="text-align: center; color: var(--gray); padding: 10px;">
                    No steps defined
                </div>`;
            }
            
            card.innerHTML = `
                <div class="simple-card-header">
                    <div class="simple-card-title">${procedure.title}</div>
                </div>
                <div class="simple-card-body">
                    <div class="simple-list">
                        ${stepsHTML}
                    </div>
                </div>
                <div class="simple-card-footer">
                    <button class="btn btn-primary btn-sm edit-procedures" data-id="${procedure.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-procedures" data-id="${procedure.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>`;
            
            container.appendChild(card);
        });

        document.querySelectorAll('.edit-procedures').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.editProcedures(id);
            });
        });

        document.querySelectorAll('.delete-procedures').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteProcedures(id);
            });
        });
    }

    renderFacilitiesTable() {
        const tbody = document.getElementById('facilities-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!this.currentData["0E_facilities"]?.cards || this.currentData["0E_facilities"].cards.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--gray); padding: 30px;">No facilities yet. Click "Add New Facility" to add your first facility!</td></tr>`;
            return;
        }

        this.currentData["0E_facilities"].cards.forEach((facility, index) => {
            const typeText = facility.type.charAt(0).toUpperCase() + facility.type.slice(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${typeText}</td>
                <td><strong>${facility.title}</strong></td>
                <td>${facility.address.substring(0, 40)}${facility.address.length > 40 ? '...' : ''}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-facilities" data-id="${facility.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm delete-facilities" data-id="${facility.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.delete-facilities').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.deleteFacilities(id);
            });
        });

        document.querySelectorAll('.edit-facilities').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.editFacilities(id);
            });
        });
    }

    renderPreparation() {
        const container = document.getElementById('preparation-container');
        if (!container) return;
        
        container.innerHTML = '';

        if (!this.currentData["0F_preparation"]?.checklist || this.currentData["0F_preparation"].checklist.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--gray); padding: 40px; grid-column: 1/-1;">
                <h3>No preparation categories yet</h3>
                <p>Click "Add New Category" to get started!</p>
            </div>`;
        } else {
            this.currentData["0F_preparation"].checklist.forEach((category, index) => {
                const card = document.createElement('div');
                card.className = 'simple-card';
                card.setAttribute('data-id', category.id);
                
                let itemsHTML = '';
                if (category.items && category.items.length > 0) {
                    category.items.forEach((item, itemIndex) => {
                        itemsHTML += `
                            <div class="simple-list-item">
                                <div class="simple-list-content">${item}</div>
                            </div>`;
                    });
                } else {
                    itemsHTML = `<div style="text-align: center; color: var(--gray); padding: 10px;">
                        No items in this category
                    </div>`;
                }
                
                card.innerHTML = `
                    <div class="simple-card-header">
                        <div class="simple-card-title">${category.category}</div>
                    </div>
                    <div class="simple-card-body">
                        <div class="simple-list">
                            ${itemsHTML}
                        </div>
                    </div>
                    <div class="simple-card-footer">
                        <button class="btn btn-primary btn-sm edit-preparation" data-id="${category.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-preparation" data-id="${category.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>`;
                
                container.appendChild(card);
            });

            document.querySelectorAll('.edit-preparation').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                    this.editPreparation(id);
                });
            });

            document.querySelectorAll('.delete-preparation').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.closest('button').getAttribute('data-id'));
                    this.deletePreparation(id);
                });
            });
        }
        // No tips rendering
    }

    editQuickCall(id) {
        const contact = this.currentData["0B_quickCall"].cards.find(c => c.id === id);
        if (!contact) return;               
        document.getElementById('quickcall-edit-id').value = contact.id;
        document.getElementById('quickcall-title').value = contact.title;
        document.getElementById('quickcall-subtitle').value = contact.subtitle || '';
        document.getElementById('quickcall-number').value = contact.number;
        document.getElementById('quickcall-type').value = contact.type;               
        document.getElementById('quickcall-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Contact';
        document.getElementById('quickcall-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-quickcall-tab="add"]').click();
    }

    editContacts(id) {
        const accordion = this.currentData["0C_contacts"].accordions.find(a => a.id === id);
        if (!accordion) return;
        
        document.getElementById('contacts-edit-id').value = accordion.id;
        document.getElementById('contacts-category-title').value = accordion.title;
        const itemsContainer = document.getElementById('contacts-items-container');
        itemsContainer.innerHTML = '';
        
        accordion.items.forEach((item, index) => {
            this.addContactItem(item);
        });
        
        document.getElementById('contacts-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Category';
        document.getElementById('contacts-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-contacts-tab="add"]').click();
    }

    editProcedures(id) {
        const procedure = this.currentData["0D_procedures"].cards.find(p => p.id === id);
        if (!procedure) return;
        
        document.getElementById('procedures-edit-id').value = procedure.id;
        document.getElementById('procedures-title').value = procedure.title;
        document.getElementById('procedures-icon').value = procedure.icon;
        
        const stepsContainer = document.getElementById('procedures-steps-container');
        stepsContainer.innerHTML = '';
        
        procedure.steps.forEach((step, index) => {
            this.addProcedureStep(step);
        });
        
        document.getElementById('procedures-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Procedure';
        document.getElementById('procedures-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-procedures-tab="add"]').click();
    }

    editFacilities(id) {
        const facility = this.currentData["0E_facilities"].cards.find(f => f.id === id);
        if (!facility) return;
        
        document.getElementById('facilities-edit-id').value = facility.id;
        document.getElementById('facilities-name').value = facility.title;
        document.getElementById('facilities-type').value = facility.type;
        document.getElementById('facilities-address').value = facility.address;
        document.getElementById('facilities-distance').value = facility.distance || '';
        document.getElementById('facilities-hours').value = facility.hours || '';
        document.getElementById('facilities-map-link').value = facility.mapLink;              
        document.getElementById('facilities-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Facility';
        document.getElementById('facilities-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-facilities-tab="add"]').click();
    }

    editPreparation(id) {
        const category = this.currentData["0F_preparation"].checklist.find(c => c.id === id);
        if (!category) return;
        
        document.getElementById('preparation-edit-id').value = category.id;
        document.getElementById('preparation-category').value = category.category;

        const itemsContainer = document.getElementById('preparation-items-container');
        itemsContainer.innerHTML = '';
        
        category.items.forEach((item, index) => {
            this.addChecklistItem(item);
        });
        
        document.getElementById('preparation-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Category';
        document.getElementById('preparation-cancel-edit').style.display = 'inline-flex';
        document.querySelector('[data-preparation-tab="add"]').click();
    }

    async deleteQuickCall(id) {
        if (confirm('Are you sure you want to delete this quick call contact?')) {
            this.currentData["0B_quickCall"].cards = this.currentData["0B_quickCall"].cards.filter(c => c.id !== id);
            await this.saveData();
            this.renderQuickCallTable();
            this.showAlert('Quick call contact deleted successfully', 'success');
            this.logActivity('Quick call contact deleted', 'warning');
        }
    }

    async deleteContacts(id) {
        if (confirm('Are you sure you want to delete this contact category and all its items?')) {
            this.currentData["0C_contacts"].accordions = this.currentData["0C_contacts"].accordions.filter(a => a.id !== id);
            await this.saveData();
            this.renderContacts();
            this.showAlert('Contact category deleted successfully', 'success');
            this.logActivity('Contact category deleted', 'warning');
        }
    }

    async deleteProcedures(id) {
        if (confirm('Are you sure you want to delete this procedure?')) {
            this.currentData["0D_procedures"].cards = this.currentData["0D_procedures"].cards.filter(p => p.id !== id);
            await this.saveData();
            this.renderProcedures();
            this.showAlert('Procedure deleted successfully', 'success');
            this.logActivity('Procedure deleted', 'warning');
        }
    }

    async deleteFacilities(id) {
        if (confirm('Are you sure you want to delete this facility?')) {
            this.currentData["0E_facilities"].cards = this.currentData["0E_facilities"].cards.filter(f => f.id !== id);
            await this.saveData();
            this.renderFacilitiesTable();
            this.showAlert('Facility deleted successfully', 'success');
            this.logActivity('Facility deleted', 'warning');
        }
    }

    async deletePreparation(id) {
        if (confirm('Are you sure you want to delete this preparation category?')) {
            this.currentData["0F_preparation"].checklist = this.currentData["0F_preparation"].checklist.filter(c => c.id !== id);
            await this.saveData();
            this.renderPreparation();
            this.showAlert('Preparation category deleted successfully', 'success');
            this.logActivity('Preparation category deleted', 'warning');
        }
    }

    addContactItem(item = null) {
        const container = document.getElementById('contacts-items-container');
        const itemCount = container.children.length + 1;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'contact-item';
        itemDiv.innerHTML = `
            <div style="border: 1px solid var(--border); padding: 15px; border-radius: var(--radius); margin-bottom: 10px;">
                <h5 style="margin-bottom: 15px; color: var(--dark);">Contact Item ${itemCount}</h5>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title *</label>
                        <input type="text" class="form-control contact-item-title" value="${item ? item.title : ''}" placeholder="Contact title" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="text" class="form-control contact-item-number" value="${item ? item.number : ''}" placeholder="Phone number" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <input type="text" class="form-control contact-item-description" value="${item ? item.description : ''}" placeholder="Description">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Hours/Availability</label>
                        <input type="text" class="form-control contact-item-hours" value="${item ? item.hours : ''}" placeholder="e.g., Available: 24/7">
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button type="button" class="btn btn-danger btn-sm remove-contact-item">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm cancel-contact-item">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>`;
        container.appendChild(itemDiv);

        itemDiv.querySelector('.remove-contact-item').addEventListener('click', () => {
            itemDiv.remove();
        });

        itemDiv.querySelector('.cancel-contact-item').addEventListener('click', () => {
            itemDiv.remove();
        });
    }

    addProcedureStep(value = '') {
        const container = document.getElementById('procedures-steps-container');
        const stepCount = container.children.length + 1;

        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div class="step-item-inner" style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <div class="step-number" style="width: 25px; text-align: right;">${stepCount}.</div>
                <input type="text" class="form-control step-input" value="${value}" placeholder="Enter step ${stepCount}" style="flex: 1;">
                <button type="button" class="remove-step" 
                    style="flex-shrink: 0; border: 6px solid white; border-radius: 14px; background-color: #dc2626; color: white; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        container.appendChild(stepDiv);

        stepDiv.querySelector('.remove-step').addEventListener('click', () => {
            stepDiv.remove();
            this.renumberProcedureSteps();
        });
    }

    renumberProcedureSteps() {
        const steps = document.querySelectorAll('#procedures-steps-container .step-item');
        steps.forEach((step, index) => {
            step.querySelector('.step-number').textContent = `${index + 1}.`;
            step.querySelector('.step-input').placeholder = `Enter step ${index + 1}`;
        });
    }

    addChecklistItem(value = '') {
        const container = document.getElementById('preparation-items-container');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'category-item';
        itemDiv.innerHTML = `
            <div class="category-item-inner" style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <input type="text" class="form-control category-input" value="${value}" placeholder="Enter checklist item" style="flex: 1;">
                <button type="button" class="remove-checklist-item" 
                    style="flex-shrink: 0; border: 6px solid white; border-radius: 14px; background-color: #dc2626; color: white; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        container.appendChild(itemDiv);

        itemDiv.querySelector('.remove-checklist-item').addEventListener('click', () => {
            itemDiv.remove();
        });
    }

    searchQuickCall(query) {
        const tbody = document.getElementById('quickcall-table-body');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            rows.forEach(row => row.style.display = '');
            return;
        }
        
        rows.forEach(row => {
            const title = row.cells[2].textContent.toLowerCase();
            const number = row.cells[3].textContent.toLowerCase();
            
            if (title.includes(searchText) || number.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchContacts(query) {
        const container = document.getElementById('contacts-container');
        if (!container) return;
        
        const cards = container.querySelectorAll('.simple-card');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            cards.forEach(card => card.style.display = '');
            return;
        }
        
        cards.forEach(card => {
            const title = card.querySelector('.simple-card-title').textContent.toLowerCase();
            const items = card.querySelectorAll('.simple-list-content');
            let found = title.includes(searchText);
            
            if (!found) {
                items.forEach(item => {
                    if (item.textContent.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
            }
            
            card.style.display = found ? '' : 'none';
        });
    }

    searchProcedures(query) {
        const container = document.getElementById('procedures-container');
        if (!container) return;
        
        const cards = container.querySelectorAll('.simple-card');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            cards.forEach(card => card.style.display = '');
            return;
        }
        
        cards.forEach(card => {
            const title = card.querySelector('.simple-card-title').textContent.toLowerCase();
            const steps = card.querySelectorAll('.simple-list-content');
            let found = title.includes(searchText);
            
            if (!found) {
                steps.forEach(step => {
                    if (step.textContent.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
            }
            
            card.style.display = found ? '' : 'none';
        });
    }

    searchFacilities(query) {
        const tbody = document.getElementById('facilities-table-body');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            rows.forEach(row => row.style.display = '');
            return;
        }
        
        rows.forEach(row => {
            const name = row.cells[2].textContent.toLowerCase();
            const address = row.cells[3].textContent.toLowerCase();
            const type = row.cells[1].textContent.toLowerCase();
            
            if (name.includes(searchText) || address.includes(searchText) || type.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchPreparation(query) {
        const container = document.getElementById('preparation-container');
        if (!container) return;
        
        const cards = container.querySelectorAll('.simple-card');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            cards.forEach(card => card.style.display = '');
            return;
        }
        
        cards.forEach(card => {
            const title = card.querySelector('.simple-card-title').textContent.toLowerCase();
            const items = card.querySelectorAll('.simple-list-content');
            let found = title.includes(searchText);
            
            if (!found) {
                items.forEach(item => {
                    if (item.textContent.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
            }
            
            card.style.display = found ? '' : 'none';
        });
    }

    exportData() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `emergency-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showAlert('Emergency data exported successfully!', 'success');
        this.logActivity('Emergency data exported', 'success');
    }

    async clearAllData() {
        if (confirm('Clear ALL data? This will remove everything and cannot be undone.')) {
            try {
                if (this.db) {
                    await this.db.ref('04_Emergency').remove();
                }
                localStorage.removeItem(this.dataKey);
                this.currentData = this.getDefaultData();
                this.populateForms();
                await this.saveData(true);
                this.showAlert('All Emergency data has been cleared from Database!', 'success');
                this.logActivity('All Emergency data cleared', 'warning');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showAlert('Error clearing Emergency data from Database', 'error');
            }
        }
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `<strong><i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}</strong>`;
        
        const currentTab = document.querySelector('.tab-content.active');
        if (currentTab) {
            const firstSection = currentTab.querySelector('.admin-section');
            if (firstSection) {
                firstSection.insertBefore(alert, firstSection.firstChild);
            } else {
                currentTab.insertBefore(alert, currentTab.firstChild);
            }
        }
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }

    logActivity(message, type) {
        const activity = {
            timestamp: new Date().toLocaleTimeString(),
            message: message,
            type: type
        };
        this.activityLog.unshift(activity);
        
        if (this.activityLog.length > 10) {
            this.activityLog.pop();
        }
        
        this.updateActivityLog();
    }

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.emergencyAdminPanel = new EmergencyAdminPanel();
    window.addEventListener('beforeunload', () => {
        if (window.emergencyAdminPanel) {
            window.emergencyAdminPanel.cleanup();
        }
    });
});