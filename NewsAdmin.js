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
    console.log("Database initialized successfully in News Admin Panel");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Updated default data with new keys (0A_, 0B_, 0C_, 0D_)
const defaultNewsData = {
    "0A_hero": {
        title: "News & Announcements",
        subtitle: "Latest updates, advisories, and community news for Barangay 118."
    },
    "0B_newsSection": {
        title: "Latest Stories",
        subtitle: "Stay updated with the latest news and announcements from Barangay 118"
    },
    "0C_news": {
        list: [
            {
                id: 1,
                title: "Japan builds new facility for Grace Park Health Center in Caloocan (2025)",
                excerpt: "The Embassy of Japan provided around PHP 6 million to construct the new Grace Park Health Center in Caloocan City.",
                content: "On March 10, 2025, Embassy of Japan Second Secretary MATSUSHIGE Tomoaki attended the turnover ceremony for the 'Project for the Construction of the Grace Park Health Center in Caloocan City.' Japan allocated USD 120,477 (≈ PHP 6 million) under the Official Development Assistance – Grant Assistance for Grass-roots Human Security Projects (GGP). This new facility replaces the old, flood-prone building to ensure safer, cleaner, and modern healthcare services for approximately 9,600 patients annually.",
                date: "2025-03-10",
                image: "https://www.ph.emb-japan.go.jp/files/100808323.jpg",
                category: "Community",
                readTime: "2 months ago",
                isFeatured: true
            },
            {
                id: 2,
                title: "Caloocan Fire: 1 PWD dead, 50 families displaced",
                excerpt: "A person with disability died after a large fire broke out in Barangay 118, Grace Park, Caloocan in December 2024.",
                content: "According to Caloocan BFP, the fire started around 2:56 AM at 4th Avenue and quickly spread due to houses being built closely together. 'A PWD died in a fire which razed about 20 houses in Caloocan City…' GMA News reported.",
                date: "2024-12-29",
                image: "https://images.gmanews.tv/webpics/2024/12/caloocan_fire_12-29-24_2024_12_29_18_34_08.jpg",
                category: "Fire",
                readTime: "2 months ago",
                isFeatured: false
            },
            {
                id: 3,
                title: "New Barangay Health Center in Brgy. 118-120, Caloocan",
                excerpt: "SM Foundation turned over the newly improved Barangay Health Center of Grace Park (Brgy. 118-120) in Caloocan City days before 2024 arrived.",
                content: "SM Foundation and its partners led this renovation project to turn the facility into a more comfortable and efficient clinic.",
                date: "2024-01-16",
                image: "https://i0.wp.com/marketmonitor.com.ph/wp-content/uploads/2024/01/SMFI-image2.jpg?resize=618%2C927&ssl=1",
                category: "Health",
                readTime: "2 months ago",
                isFeatured: false
            }
        ]
    },
    "0D_events": {
        title: "Community Events Calendar",
        allEvents: [
            {
                id: 1,
                title: "New Year's Resolution Forum",
                description: "Community forum to discuss goals and plans for the new year.",
                date: "2025-01-10",
                time: "6:00 PM - 8:00 PM",
                location: "Barangay 118 Multi-purpose Hall",
                image: ""
            },
            {
                id: 2,
                title: "Barangay Christmas Party",
                description: "Annual Christmas celebration for all residents of Barangay 118.",
                date: "2024-12-15",
                time: "5:00 PM - 10:00 PM",
                location: "Barangay 118 Covered Court",
                image: ""
            },
            {
                id: 3,
                title: "Ongoing Community Programs",
                description: "Ongoing barangay activities and official announcements.",
                date: "2025-01-20",
                time: "Updated regularly",
                location: "Various Locations",
                image: ""
            },
            {
                id: 4,
                title: "Youth Sports Orientation",
                description: "Orientation for upcoming inter-barangay youth sports activities.",
                date: "2025-01-25",
                time: "3:00 PM - 5:00 PM",
                location: "Barangay 118 Covered Court",
                image: ""
            },
            {
                id: 5,
                title: "Anti-Dengue Awareness Campaign",
                description: "Information drive on dengue prevention and barangay clean zones.",
                date: "2025-02-02",
                time: "8:00 AM - 11:00 AM",
                location: "Barangay 118 Plaza",
                image: ""
            }
        ]
    }
};

class NewsAdminPanel {
    constructor() {
        this.dataKey = 'newsData';
        this.currentData = null;
        this.activityLog = [];
        this.lastSavedData = null;
        this.saveStatusTimeout = null;
        this.renderedTabs = new Set();
        this.db = db;
        this.unsubscribe = null;
        this.lastUpdated = null;
        this.newsRef = null;
        this.init();
    }

    init() {
        if (this.db) {
            this.newsRef = this.db.ref('03_news');
        }
        this.loadData();
        this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
        this.setupEventListeners();
        this.updateDashboard();
        this.logActivity('System initialized with Database integration', 'success');
        this.updateSaveStatus('• Ready to Save');
        this.setupFirebaseListener();
        this.checkFirebaseConnection();
        
        this.hideAllTabs();
        this.switchTab('dashboard');
    }

    hideAllTabs() {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
    }

    getDefaultData() {
        return JSON.parse(JSON.stringify(defaultNewsData));
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
            console.log('Firebase connected successfully for News Admin');
        } else {
            statusElement.textContent = 'Local Mode';
            statusElement.style.color = '#ffc107'; 
            console.warn('Firebase not connected. Using localStorage only for News Admin.');
        }
    }

    async loadData() {
        let loaded = false;
        if (this.newsRef) {
            try {
                const snapshot = await this.newsRef.once('value');
                
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();
                    this.currentData = this.getDefaultData();
                    this.deepMergeData(this.currentData, firebaseData);
                    console.log('News data loaded from Database (03_news) with new keys');
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
                    console.log('News data loaded from localStorage');
                    loaded = true;
                } catch (error) {
                    console.error('Error parsing localStorage data:', error);
                }
            }
        }

        if (!loaded) {
            this.currentData = this.getDefaultData();
            console.log('Using pre-loaded default News data');
        }
        
        this.populateForms();
        this.lastUpdated = new Date();
        this.updateDashboard();
    }

    setupFirebaseListener() {
        if (!this.newsRef) return;
        
        try {
            this.unsubscribe = this.newsRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const firebaseData = snapshot.val();

                    this.deepMergeData(this.currentData, firebaseData);
                    this.populateForms();
                    this.renderNewsTable();
                    this.renderEventsTables();
                    this.lastUpdated = new Date();
                    this.updateDashboard();
                    
                    localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
                    
                    this.logActivity('News data updated from Database', 'info');
                    this.showAlert('News data synchronized Database', 'info');
                }
            }, (error) => {
                console.error("Database listener error:", error);
            });
        } catch (error) {
            console.error("Failed to setup Database listener:", error);
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
            if (this.newsRef) {
                await this.newsRef.set(this.currentData);
                console.log('News data saved to Database (03_news)');
            }

            localStorage.setItem(this.dataKey, JSON.stringify(this.currentData));
            console.log('News data saved to localStorage');
            saved = true;
            
            this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
            this.lastUpdated = new Date();
            
            this.updateDashboard();
            this.updateSaveStatus('• Saved to Database', 'success');
            this.logActivity('News data saved successfully to Database (03_news)', 'success');
            
        } catch (error) {
            console.error('Save failed:', error);
            this.updateSaveStatus('Save failed', 'error');
            this.logActivity('News data save failed', 'error');
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
        document.getElementById('events-title').value = this.currentData["0D_events"]?.title || 'Community Events Calendar';
        document.getElementById('hero-title').value = this.currentData["0A_hero"]?.title || '';
        document.getElementById('hero-subtitle').value = this.currentData["0A_hero"]?.subtitle || '';
        document.getElementById('news-section-title').value = this.currentData["0B_newsSection"]?.title || '';
        document.getElementById('news-section-subtitle').value = this.currentData["0B_newsSection"]?.subtitle || '';
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

        document.querySelectorAll('[data-news-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchNewsTab(tab.getAttribute('data-news-tab'));
            });
        });

        document.querySelectorAll('[data-events-tab]').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchEventsTab(tab.getAttribute('data-events-tab'));
            });
        });

        document.getElementById('preview-site-btn').addEventListener('click', () => {
            window.open('News.html', '_blank');
        });

        document.getElementById('export-news-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('backup-news-btn').addEventListener('click', () => {
            this.exportData();
            this.showAlert('Backup created successfully!', 'success');
        });

        document.getElementById('refresh-news-btn').addEventListener('click', () => {
            this.loadData();
            this.showAlert('Data refreshed from Firebase Realtime Database!', 'success');
        });

        document.getElementById('clear-news-data-btn').addEventListener('click', () => {
            // Removed duplicate confirm - now directly calls clearAllData() which has its own confirmation
            this.clearAllData();
        });

        this.setupFormListeners();

        document.getElementById('news-excerpt').addEventListener('input', (e) => {
            document.getElementById('excerpt-counter').textContent = e.target.value.length;
        });

        document.getElementById('news-image').addEventListener('input', (e) => {
            this.updateImagePreview('news-image-preview', e.target.value);
        });

        document.getElementById('event-image').addEventListener('input', (e) => {
            this.updateImagePreview('event-image-preview', e.target.value);
        });

        document.getElementById('news-search').addEventListener('input', (e) => {
            this.searchNews(e.target.value);
        });

        document.getElementById('events-search').addEventListener('input', (e) => {
            this.searchEvents(e.target.value);
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-news')) {
                const id = e.target.closest('.edit-news').getAttribute('data-id');
                this.editNews(parseInt(id));
            }

            if (e.target.closest('.delete-news')) {
                const id = e.target.closest('.delete-news').getAttribute('data-id');
                this.deleteNews(parseInt(id));
            }

            if (e.target.closest('.toggle-featured-btn')) {
                const id = e.target.closest('.toggle-featured-btn').getAttribute('data-id');
                this.toggleFeaturedNews(parseInt(id));
            }

            if (e.target.closest('.edit-event')) {
                const id = e.target.closest('.edit-event').getAttribute('data-id');
                this.editEvent(id);
            }

            if (e.target.closest('.delete-event')) {
                const id = e.target.closest('.delete-event').getAttribute('data-id');
                this.deleteEvent(id);
            }
        });
    }

    setupFormListeners() {
        document.getElementById('hero-form').addEventListener('submit', async (e) => {
            e.preventDefault();      
            const oldEventsTitle = this.currentData["0D_events"]?.title;
            const newEventsTitle = document.getElementById('events-title').value;
            const oldHeroData = {...this.currentData["0A_hero"]};
            const oldNewsSectionData = {...this.currentData["0B_newsSection"]};
            const newHeroData = {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value
            };
            
            const newNewsSectionData = {
                title: document.getElementById('news-section-title').value,
                subtitle: document.getElementById('news-section-subtitle').value
            };
            
            if (oldEventsTitle !== newEventsTitle ||
                JSON.stringify(oldHeroData) !== JSON.stringify(newHeroData) ||
                JSON.stringify(oldNewsSectionData) !== JSON.stringify(newNewsSectionData)) {

                if (!this.currentData["0D_events"]) {
                    this.currentData["0D_events"] = {};
                }
                this.currentData["0D_events"].title = newEventsTitle;
                this.currentData["0A_hero"] = newHeroData;
                this.currentData["0B_newsSection"] = newNewsSectionData;
                
                await this.saveData();
                this.showAlert('Community Events Calendar settings updated successfully!', 'success');
                this.logActivity('Community Events Calendar settings updated', 'success');
            } else {
                this.showAlert('No changes detected in Community Events Calendar settings', 'info');
            }
        });

        document.getElementById('hero-reset-btn').addEventListener('click', async () => {
            if (confirm('Reset Community Events Calendar settings to defaults? This will reset and save immediately.')) {
                const defaultData = this.getDefaultData();

                this.currentData["0D_events"].title = defaultData["0D_events"].title;
                this.currentData["0A_hero"] = {...defaultData["0A_hero"]};
                this.currentData["0B_newsSection"] = {...defaultData["0B_newsSection"]};

                document.getElementById('events-title').value = defaultData["0D_events"].title;
                document.getElementById('hero-title').value = defaultData["0A_hero"].title;
                document.getElementById('hero-subtitle').value = defaultData["0A_hero"].subtitle;
                document.getElementById('news-section-title').value = defaultData["0B_newsSection"].title;
                document.getElementById('news-section-subtitle').value = defaultData["0B_newsSection"].subtitle;
                
                await this.saveData(true);
                this.showAlert('Community Events Calendar settings reset to defaults and saved to Database!', 'success');
                this.logActivity('Community Events Calendar settings reset to defaults and saved', 'warning');
            }
        });

        document.getElementById('news-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('news-edit-id').value;
            const isEditing = editId !== '';
            const newsData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0C_news"].list.length > 0 ? 
                    Math.max(...this.currentData["0C_news"].list.map(n => n.id)) + 1 : 1),
                title: document.getElementById('news-title').value,
                excerpt: document.getElementById('news-excerpt').value,
                content: document.getElementById('news-content').value,
                date: document.getElementById('news-date').value,
                category: document.getElementById('news-category').value,
                image: document.getElementById('news-image').value,
                readTime: document.getElementById('news-read-time').value || '2 months ago',
                isFeatured: document.getElementById('news-featured').checked
            };

            if (isEditing) {
                const index = this.currentData["0C_news"].list.findIndex(n => n.id == editId);
                if (index !== -1) {
                    this.currentData["0C_news"].list[index] = newsData;
                }
                this.logActivity(`News updated: "${newsData.title}"`, 'success');
                this.showAlert('News updated successfully!', 'success');
            } else {
                this.currentData["0C_news"].list.push(newsData);
                this.logActivity(`News added: "${newsData.title}"`, 'success');
                this.showAlert('News added successfully!', 'success');
            }

            if (newsData.isFeatured) {
                this.currentData["0C_news"].list.forEach(n => {
                    if (n.id !== newsData.id) n.isFeatured = false;
                });
            }

            await this.saveData();
            this.renderNewsTable();

            document.getElementById('news-form').reset();
            document.getElementById('news-edit-id').value = '';
            document.getElementById('news-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add News';
            document.getElementById('news-cancel-edit').style.display = 'none';
            document.getElementById('excerpt-counter').textContent = '0';

            if (isEditing) {
                this.switchNewsTab('existing');
            }
        });

        document.getElementById('news-reset-btn').addEventListener('click', () => {
            document.getElementById('news-form').reset();
            document.getElementById('news-edit-id').value = '';
            document.getElementById('news-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add News';
            document.getElementById('news-cancel-edit').style.display = 'none';
            document.getElementById('excerpt-counter').textContent = '0';
        });

        document.getElementById('event-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('event-edit-id').value;
            const isEditing = editId !== '';

            const eventData = {
                id: isEditing ? parseInt(editId) : (this.currentData["0D_events"].allEvents.length > 0 ? 
                    Math.max(...this.currentData["0D_events"].allEvents.map(e => e.id)) + 1 : 1),
                title: document.getElementById('event-title').value,
                description: document.getElementById('event-description').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value,
                image: document.getElementById('event-image').value
            };

            if (isEditing) {
                const index = this.currentData["0D_events"].allEvents.findIndex(e => e.id == editId);
                if (index !== -1) {
                    this.currentData["0D_events"].allEvents[index] = eventData;
                }
                this.logActivity(`Event updated: "${eventData.title}"`, 'success');
                this.showAlert('Event updated successfully!', 'success');
            } else {
                this.currentData["0D_events"].allEvents.push(eventData);
                this.logActivity(`Event added: "${eventData.title}"`, 'success');
                this.showAlert('Event added successfully!', 'success');
            }

            await this.saveData();
            this.renderEventsTables();

            document.getElementById('event-form').reset();
            document.getElementById('event-edit-id').value = '';
            document.getElementById('event-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Event';
            document.getElementById('event-cancel-edit').style.display = 'none';

            if (isEditing) {
                this.switchEventsTab('upcoming');
            }
        });

        document.getElementById('news-cancel-edit').addEventListener('click', () => {
            document.getElementById('news-form').reset();
            document.getElementById('news-edit-id').value = '';
            document.getElementById('news-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add News';
            document.getElementById('news-cancel-edit').style.display = 'none';
            document.getElementById('excerpt-counter').textContent = '0';
        });

        document.getElementById('event-cancel-edit').addEventListener('click', () => {
            document.getElementById('event-form').reset();
            document.getElementById('event-edit-id').value = '';
            document.getElementById('event-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Event';
            document.getElementById('event-cancel-edit').style.display = 'none';
        });

        document.getElementById('event-reset-btn').addEventListener('click', () => {
            document.getElementById('event-form').reset();
            document.getElementById('event-edit-id').value = '';
            document.getElementById('event-submit-btn').innerHTML = '<i class="fas fa-plus-circle"></i> Add Event';
            document.getElementById('event-cancel-edit').style.display = 'none';
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

        if (tabId === 'news') {
            this.renderNewsTable();
        }
        else if (tabId === 'events') {
            this.renderEventsTables();
        }
    }

    switchNewsTab(tab) {
        document.querySelectorAll('[data-news-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-news-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('#news .sub-tab-content').forEach(t => t.classList.remove('active'));
        
        let targetId = '';
        if (tab === 'existing') targetId = 'existing-news';
        else if (tab === 'add') targetId = 'add-news';
        
        document.getElementById(targetId).classList.add('active');
    }

    switchEventsTab(tab) {
        document.querySelectorAll('[data-events-tab]').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-events-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('#events .sub-tab-content').forEach(t => t.classList.remove('active'));
        
        let targetId = '';
        if (tab === 'past') targetId = 'past-events';
        else if (tab === 'upcoming') targetId = 'upcoming-events';
        else if (tab === 'add') targetId = 'add-event';
        
        document.getElementById(targetId).classList.add('active');
    }

    updateDashboard() {
        if (!this.currentData) return;

        const lastUpdatedText = this.lastUpdated ? this.lastUpdated.toLocaleDateString() : 'Never';
        document.getElementById('last-updated').textContent = lastUpdatedText;       
        document.getElementById('total-news').textContent = this.currentData["0C_news"]?.list?.length || 0;
        document.getElementById('total-events').textContent = this.currentData["0D_events"]?.allEvents?.length || 0;
        
        const dataSize = JSON.stringify(this.currentData).length;
        document.getElementById('data-size').textContent = `${Math.round(dataSize / 1024)} KB`;
    }

    updateImagePreview(previewId, url) {
        const preview = document.getElementById(previewId);
        if (preview) {
            if (url) {
                preview.src = url;
                preview.classList.add('visible');
            } else {
                preview.classList.remove('visible');
            }
        }
    }

    renderNewsTable() {
        const tbody = document.getElementById('news-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!this.currentData["0C_news"]?.list || this.currentData["0C_news"].list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--gray); padding: 30px;">No news yet. Add your first news article!</td></tr>`;
            return;
        }

        const sortedNews = [...this.currentData["0C_news"].list].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        sortedNews.forEach((news, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="width: 60px; height: 40px; border-radius: 4px; overflow: hidden;">
                        <img src="${news.image}" alt="${news.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/60x40?text=Image'">
                    </div>
                </td>
                <td><strong>${news.title}</strong></td>
                <td><span class="category-badge">${news.category}</span></td>
                <td>${this.formatDate(news.date)}</td>
                <td>
                    <button class="btn ${news.isFeatured ? 'btn-warning' : 'btn-secondary'} btn-sm toggle-featured-btn" data-id="${news.id}">
                        <i class="fas ${news.isFeatured ? 'fa-star' : 'fa-star'}"></i> ${news.isFeatured ? 'Featured' : 'Set as Featured'}
                    </button>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm edit-news" data-id="${news.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-news" data-id="${news.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>`;
            tbody.appendChild(row);
        });
    }

    async toggleFeaturedNews(id) {
        const newsItem = this.currentData["0C_news"].list.find(n => n.id === id);
        if (!newsItem) return;
        
        if (newsItem.isFeatured) {
            newsItem.isFeatured = false;
            this.logActivity(`News "${newsItem.title}" unfeatured`, 'info');
            this.showAlert('News unfeatured successfully!', 'success');
        } else {
            this.currentData["0C_news"].list.forEach(n => {
                n.isFeatured = false;
            });

            newsItem.isFeatured = true;
            this.logActivity(`News "${newsItem.title}" set as featured`, 'success');
            this.showAlert('News set as featured successfully!', 'success');
        }
        
        await this.saveData();
        this.renderNewsTable();
    }

    renderEventsTables() {
        this.renderPastEvents();
        this.renderUpcomingEvents();
    }

    renderPastEvents() {
        const tbody = document.getElementById('past-events-table');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!this.currentData["0D_events"]?.allEvents) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No events.</td></tr>`;
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const pastEvents = this.currentData["0D_events"].allEvents.filter(event => event.date < today);

        if (pastEvents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No past events.</td></tr>`;
            return;
        }

        const sortedEvents = [...pastEvents].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        sortedEvents.forEach((event, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${event.title}</strong></td>
                <td>${this.formatDate(event.date)}</td>
                <td>${event.description.substring(0, 50)}${event.description.length > 50 ? '...' : ''}</td>
                <td>
                    ${event.time ? `<div><i class="far fa-clock"></i> ${event.time}</div>` : ''}
                    ${event.location ? `<div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm edit-event" data-id="${event.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-event" data-id="${event.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>`;
            tbody.appendChild(row);
        });
    }

    renderUpcomingEvents() {
        const tbody = document.getElementById('upcoming-events-table');
        if (!tbody) return;       
        tbody.innerHTML = '';
        if (!this.currentData["0D_events"]?.allEvents) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No events.</td></tr>`;
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents = this.currentData["0D_events"].allEvents.filter(event => event.date >= today);

        if (upcomingEvents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--gray); padding: 30px;">No upcoming events.</td></tr>`;
            return;
        }

        const sortedEvents = [...upcomingEvents].sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        sortedEvents.forEach((event, index) => {
            const isToday = event.date === today;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <strong>${event.title}</strong>
                    ${isToday ? ' <span class="badge" style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Today</span>' : ''}
                </td>
                <td>${this.formatDate(event.date)}</td>
                <td>${event.description.substring(0, 50)}${event.description.length > 50 ? '...' : ''}</td>
                <td>
                    ${event.time ? `<div><i class="far fa-clock"></i> ${event.time}</div>` : ''}
                    ${event.location ? `<div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>` : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm edit-event" data-id="${event.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-event" data-id="${event.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>`;
            tbody.appendChild(row);
        });
    }

    editNews(id) {
        const news = this.currentData["0C_news"].list.find(n => n.id === id);
        if (!news) return;      
        this.switchNewsTab('add');        
        document.getElementById('news-edit-id').value = news.id;
        document.getElementById('news-title').value = news.title;
        document.getElementById('news-excerpt').value = news.excerpt;
        document.getElementById('news-content').value = news.content;
        document.getElementById('news-date').value = news.date;
        document.getElementById('news-category').value = news.category;
        document.getElementById('news-image').value = news.image;
        document.getElementById('news-read-time').value = news.readTime;
        document.getElementById('news-featured').checked = news.isFeatured;               
        document.getElementById('news-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update News';
        document.getElementById('news-cancel-edit').style.display = 'inline-block';
        document.getElementById('excerpt-counter').textContent = news.excerpt.length;       
        this.updateImagePreview('news-image-preview', news.image);
        this.logActivity(`Editing news: "${news.title}"`, 'info');
    }

    editEvent(id) {
        const event = this.currentData["0D_events"].allEvents.find(e => e.id == id);       
        if (!event) return;       
        this.switchEventsTab('add');
        
        document.getElementById('event-edit-id').value = event.id;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time || '';
        document.getElementById('event-location').value = event.location || '';
        document.getElementById('event-image').value = event.image || '';                
        document.getElementById('event-submit-btn').innerHTML = '<i class="fas fa-save"></i> Update Event';
        document.getElementById('event-cancel-edit').style.display = 'inline-block';       
        this.updateImagePreview('event-image-preview', event.image);
        this.logActivity(`Editing event: "${event.title}"`, 'info');
    }

    async deleteNews(id) {
        if (confirm('Are you sure you want to delete this news article?')) {
            this.currentData["0C_news"].list = this.currentData["0C_news"].list.filter(n => n.id !== id);
            await this.saveData();
            this.renderNewsTable();
            this.logActivity('News article deleted', 'error');
            this.showAlert('News deleted successfully', 'success');
        }
    }

    async deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.currentData["0D_events"].allEvents = this.currentData["0D_events"].allEvents.filter(e => e.id != id);           
            await this.saveData();
            this.renderEventsTables();
            this.logActivity('Event deleted', 'error');
            this.showAlert('Event deleted successfully', 'success');
        }
    }

    searchNews(query) {
        const tbody = document.getElementById('news-table-body');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        const searchText = query.trim().toLowerCase();
        
        if (searchText === '') {
            rows.forEach(row => row.style.display = '');
            return;
        }
        
        rows.forEach(row => {
            const title = row.cells[2].textContent.toLowerCase();
            const category = row.cells[3].textContent.toLowerCase();
            
            if (title.includes(searchText) || category.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchEvents(query) {
        const tables = ['past-events-table', 'upcoming-events-table'];
        const searchText = query.trim().toLowerCase();
        
        tables.forEach(tableId => {
            const tbody = document.getElementById(tableId);
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr');
            
            if (searchText === '') {
                rows.forEach(row => row.style.display = '');
                return;
            }
            
            rows.forEach(row => {
                const title = row.cells[1].textContent.toLowerCase();
                const description = row.cells[3].textContent.toLowerCase();
                
                if (title.includes(searchText) || description.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    exportData() {
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `news-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.logActivity('News data exported successfully', 'success');
        this.showAlert('News data exported successfully!', 'success');
    }

    async clearAllData() {
        // Updated confirmation message
        if (confirm('Clear ALL data? This will remove everything and cannot be undone.')) {
            try {
                if (this.newsRef) {
                    await this.newsRef.remove();
                }
                localStorage.removeItem(this.dataKey);
                this.currentData = this.getDefaultData();
                this.populateForms();
                await this.saveData(true);
                this.logActivity('All News data cleared from Database', 'error');
                this.showAlert('All News data has been cleared from Database!', 'success');
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showAlert('Error clearing News data from Database', 'error');
            }
        }
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `<strong><i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}</strong>`;
        
        const currentTab = document.querySelector('.tab-content.active');
        if (currentTab) {
            currentTab.insertBefore(alert, currentTab.firstChild);
        }
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
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

    cleanup() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.newsAdminPanel = new NewsAdminPanel();
    window.addEventListener('beforeunload', () => {
        if (window.newsAdminPanel) {
            window.newsAdminPanel.cleanup();
        }
    });
});