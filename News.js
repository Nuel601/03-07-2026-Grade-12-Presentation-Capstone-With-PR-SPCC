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
let newsUnsubscribe = null;
let panelUnsubscribe = null;
let readTimeInterval = null;

try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

let newsData = {
    "0A_hero": { title: "News & Announcements", subtitle: "Latest updates, advisories, and community news for Barangay 118." },
    "0B_newsSection": { title: "Latest Stories", subtitle: "Stay updated with the latest news and announcements from Barangay 118" },
    "0C_news": { list: [] },
    "0D_events": { title: "Barangay 118 Community Events Calendar", allEvents: [] }
};

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return dateString;

    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear > 0) return diffYear + " year" + (diffYear > 1 ? "s" : "") + " ago";
    if (diffMonth > 0) return diffMonth + " month" + (diffMonth > 1 ? "s" : "") + " ago";
    if (diffDay > 0) return diffDay + " day" + (diffDay > 1 ? "s" : "") + " ago";
    if (diffHour > 0) return diffHour + " hour" + (diffHour > 1 ? "s" : "") + " ago";
    if (diffMin > 0) return diffMin + " minute" + (diffMin > 1 ? "s" : "") + " ago";
    return "Just now";
}

function updateNewsReadTimes() {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        const newsId = item.getAttribute('data-news-id');
        if (!newsId) return;
        const newsList = newsData["0C_news"]?.list || [];
        const news = newsList.find(n => n.id == newsId);
        if (news) {
            const timeSpan = item.querySelector('.news-item-read-time');
            if (timeSpan) {
                timeSpan.innerHTML = `<i class="far fa-clock"></i> ${getTimeAgo(news.date)}`;
            }
        }
    });
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
                    <img src="${headerData.headerLogo}" alt="Barangay 118 Official Logo" class="logo-image" id="header-logo" width="70" height="70">
                    <h1 id="system-name">${headerData.systemName}</h1>
                </a>

                <input type="checkbox" id="menu-toggle" class="menu-toggle">
                <label for="menu-toggle" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </label>

                <nav class="nav-links" aria-label="Main navigation">
                    <a href="PanelHome.html" ${currentPage === 'PanelHome.html' || currentPage === '' ? 'class="active"' : ''}><i class="fas fa-home"></i><span>Home</span></a>
                    <a href="AboutUs.html" ${currentPage === 'AboutUs.html' ? 'class="active"' : ''}><i class="fas fa-info-circle"></i><span>About Us</span></a>
                    <a href="News.html" ${currentPage === 'News.html' ? 'class="active"' : ''} aria-current="page"><i class="fas fa-newspaper"></i><span>News</span></a>
                    <a href="Emergency.html" ${currentPage === 'Emergency.html' ? 'class="active"' : ''}><i class="fas fa-exclamation-triangle"></i><span>Emergency</span></a>
                    <a href="CreateAnAccount.html" ${currentPage === 'CreateAnAccount.html' ? 'class="active"' : ''}><i class="fas fa-user-plus"></i><span>Create Account</span></a>
                    <a href="LogIn.html" ${currentPage === 'LogIn.html' ? 'class="active"' : ''}><i class="fas fa-sign-in-alt"></i><span>Login</span></a>
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
                                <li><a href="#Events-with-Calendar" id="Events & Calendar-link">evCal</a></li>
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
                                <li id="footer-facebook-item"><i class="fab fa-facebook"></i><a id="footer-facebook-link" href="${footerData.socialMedia.facebook}" target="_blank"><span id="footer-facebook-text"> Facebook</span></a></li>
                                <li id="footer-messenger-item"><i class="fab fa-facebook-messenger"></i><a id="footer-messenger-link" href="${footerData.socialMedia.messenger}" target="_blank"><span id="footer-messenger-text"> Messenger Chat</span></a></li>
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

async function loadData() {
    try {
        if (db) {
            const newsRef = db.ref('03_news');
            const snapshot = await newsRef.once('value');
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(newsData, firebaseData);
                console.log("News data loaded from Firebase Realtime Database (03_news) with new keys");
                localStorage.setItem("newsData", JSON.stringify(newsData));
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
    await renderHeader();
    await renderFooter();
    if (readTimeInterval) clearInterval(readTimeInterval);
    updateNewsReadTimes();
    readTimeInterval = setInterval(updateNewsReadTimes, 10000);
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
        const savedData = localStorage.getItem("newsData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            deepMergeData(newsData, parsedData);
            console.log("News data loaded from localStorage");
        } else {
            console.log("Using default News data");
            setDefaultData();
        }
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        setDefaultData();
    }
}

function setDefaultData() {
    newsData = {
        "0A_hero": { title: "News & Announcements", subtitle: "Latest updates, advisories, and community news for Barangay 118." },
        "0B_newsSection": { title: "Latest Stories", subtitle: "Stay updated with the latest news and announcements from Barangay 118" },
        "0C_news": {
            list: [
                { id: 1, title: "Japan builds new facility for Grace Park Health Center in Caloocan (2025)", excerpt: "The Embassy of Japan provided around PHP 6 million to construct the new Grace Park Health Center in Caloocan City.", content: "On March 10, 2025, Embassy of Japan Second Secretary MATSUSHIGE Tomoaki attended the turnover ceremony...", date: "2025-03-10", image: "https://www.ph.emb-japan.go.jp/files/100808323.jpg", category: "Community", isFeatured: true },
                { id: 2, title: "Caloocan Fire: 1 PWD dead, 50 families displaced", excerpt: "A person with disability died after a large fire broke out in Barangay 118, Grace Park, Caloocan in December 2024.", content: "According to Caloocan BFP, the fire started around 2:56 AM at 4th Avenue...", date: "2024-12-29", image: "https://images.gmanews.tv/webpics/2024/12/caloocan_fire_12-29-24_2024_12_29_18_34_08.jpg", category: "Fire", isFeatured: false },
                { id: 3, title: "New Barangay Health Center in Brgy. 118-120, Caloocan", excerpt: "SM Foundation turned over the newly improved Barangay Health Center of Grace Park (Brgy. 118-120) in Caloocan City days before 2024 arrived.", content: "SM Foundation and its partners led this renovation project...", date: "2024-01-16", image: "https://i0.wp.com/marketmonitor.com.ph/wp-content/uploads/2024/01/SMFI-image2.jpg?resize=618%2C927&ssl=1", category: "Health", isFeatured: false }
            ]
        },
        "0D_events": {
            title: "Community Events Calendar",
            allEvents: [
                { id: 1, title: "New Year's Resolution Forum", description: "Community forum to discuss goals and plans for the new year.", date: "2025-01-10", time: "6:00 PM - 8:00 PM", location: "Barangay 118 Multi-purpose Hall", image: "" },
                { id: 2, title: "Barangay Christmas Party", description: "Annual Christmas celebration for all residents of Barangay 118.", date: "2024-12-15", time: "5:00 PM - 10:00 PM", location: "Barangay 118 Covered Court", image: "" },
                { id: 3, title: "Ongoing Community Programs", description: "Ongoing barangay activities and official announcements.", date: "2025-01-20", time: "Updated regularly", location: "Various Locations", image: "" },
                { id: 4, title: "Youth Sports Orientation", description: "Orientation for upcoming inter-barangay youth sports activities.", date: "2025-01-25", time: "3:00 PM - 5:00 PM", location: "Barangay 118 Covered Court", image: "" },
                { id: 5, title: "Anti-Dengue Awareness Campaign", description: "Information drive on dengue prevention and barangay clean zones.", date: "2025-02-02", time: "8:00 AM - 11:00 AM", location: "Barangay 118 Plaza", image: "" },
                { id: 6, title: "Barangay Assembly", description: "Quarterly barangay assembly with residents.", date: "2024-11-05", time: "9:00 AM", location: "Barangay Hall", image: "" },
                { id: 7, title: "Cleanup Drive", description: "Community-wide cleanup.", date: "2024-10-20", time: "7:00 AM", location: "Barangay 118", image: "" }
            ]
        }
    };
}

function setupNewsListener() {
    if (!db) return;
    try {
        const newsRef = db.ref('03_news');
        newsUnsubscribe = newsRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                deepMergeData(newsData, firebaseData);
                updateUI();
                localStorage.setItem("newsData", JSON.stringify(newsData));
                console.log("News data updated from Firebase in real-time (03_news)");
            }
        }, (error) => console.error("Firebase listener error:", error));
    } catch (error) {
        console.error("Failed to setup Firebase listener:", error);
    }
}

function setupHeaderFooterListener() {
    if (!db) return;
    try {
        const panelRef = db.ref('01_PanelHome');
        panelUnsubscribe = panelRef.on('value', async (snapshot) => {
            if (snapshot.exists()) {
                console.log("PanelHome data updated, re-rendering header and footer");
                await renderHeader();
                await renderFooter();
            }
        }, (error) => console.error("Firebase panel listener error:", error));
    } catch (error) {
        console.error("Failed to setup header/footer listener:", error);
    }
}

function updateUI() {
    try {
        document.getElementById("news-hero-title") && (document.getElementById("news-hero-title").textContent = newsData["0A_hero"]?.title || "News & Announcements");
        document.getElementById("news-hero-description") && (document.getElementById("news-hero-description").textContent = newsData["0A_hero"]?.subtitle || "");
        document.getElementById("news-section-title") && (document.getElementById("news-section-title").textContent = newsData["0B_newsSection"]?.title || "Latest Stories");
        document.getElementById("news-section-subtitle") && (document.getElementById("news-section-subtitle").textContent = newsData["0B_newsSection"]?.subtitle || "");
        document.getElementById("events-title") && (document.getElementById("events-title").textContent = newsData["0D_events"]?.title || "Community Events Calendar");
        renderNews(newsData["0C_news"]?.list || []);
        renderEvents(newsData["0D_events"]?.allEvents || []);
        generateCalendar(currentMonth, currentYear);
    } catch (error) { console.error("Error updating UI:", error); }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderNews(newsList) {
    const newsGrid = document.getElementById('news-grid-container');
    if (!newsGrid) return;
    newsGrid.innerHTML = '';

    if (!newsList || newsList.length === 0) {
        newsGrid.innerHTML = '<div class="no-news" style="text-align: center; color: var(--gray); grid-column: 1 / -1; padding: 40px;">No news available at the moment.</div>';
        return;
    }

    const sortedNews = [...newsList].sort((a, b) => new Date(b.date) - new Date(a.date));
    const featuredNews = sortedNews.find(news => news.isFeatured) || sortedNews[0];
    const regularNews = sortedNews.filter(news => news.id !== featuredNews.id).slice(0, 3);

    const featuredHtml = `
        <div class="featured-news">
            <div class="featured-card">
                <div class="featured-image-container">
                    <img src="${featuredNews.image}" alt="${featuredNews.title}" class="featured-image" onerror="this.src='https://via.placeholder.com/800x400?text=News+Image'">
                    <div class="featured-badge">${featuredNews.category}</div>
                </div>
                <div class="featured-content">
                    <div class="featured-date"><i class="far fa-calendar"></i> ${formatDate(featuredNews.date)}</div>
                    <h3 class="featured-title">${featuredNews.title}</h3>
                    <p class="featured-excerpt">${featuredNews.excerpt}</p>
                    <a href="#" class="featured-read-more" data-news-id="${featuredNews.id}"> Read More <i class="fas fa-arrow-right"></i> </a>
                </div>
            </div>
        </div>`;

    let newsListHtml = `
        <div class="news-list">
            <div class="news-list-header"><h3 class="news-list-title">Mga Balita</h3></div>
            <div class="news-list-items">`;

    regularNews.forEach(news => {
        newsListHtml += `
            <div class="news-item" data-news-id="${news.id}">
                <div class="news-item-image-container">
                    <img src="${news.image}" alt="${news.title}" class="news-item-image" onerror="this.src='https://via.placeholder.com/300x200?text=News'">
                    <div class="news-item-badge">${news.category}</div>
                </div>
                <div class="news-item-content">
                    <div class="news-item-date"><i class="far fa-calendar"></i> ${formatDate(news.date)}</div>
                    <h4 class="news-item-title">${news.title}</h4>
                    <p class="news-item-excerpt">${news.excerpt}</p>
                    <div class="news-item-meta">
                        <a href="#" class="news-item-read-more" data-news-id="${news.id}"> Read More <i class="fas fa-arrow-right"></i> </a>
                        <span class="news-item-read-time"><i class="far fa-clock"></i> ${getTimeAgo(news.date)}</span>
                    </div>
                </div>
            </div>`;
    });

    newsListHtml += `</div></div>`;
    newsGrid.innerHTML = featuredHtml + newsListHtml;
    setupNewsEventListeners();
    updateNewsReadTimes();
}

function renderEvents(eventsList) {
    const today = new Date().toISOString().split('T')[0];
    const pastEvents = eventsList.filter(event => event.date < today);
    const currentEvents = eventsList.filter(event => event.date === today);
    const upcomingEvents = eventsList.filter(event => event.date > today);

    // PAST EVENTS - limitahan sa 5
    const pastContainer = document.getElementById('past-events-list');
    if (pastContainer) {
        pastContainer.innerHTML = '';
        if (pastEvents.length === 0) {
            pastContainer.innerHTML = '<div class="events-list-item"><h4>No Past Events</h4><p>No past events to display.</p></div>';
        } else {
            const sortedPast = [...pastEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
            const displayPast = sortedPast.slice(0, 5); // 5 lang ipapakita
            displayPast.forEach(event => {
                pastContainer.innerHTML += `
                    <div class="events-list-item">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <div class="event-item-footer">
                            <span class="event-date"><i class="far fa-calendar"></i> ${formatDate(event.date)}</span>
                            <a href="#" class="event-read-more" data-date="${event.date}">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>`;
            });
        }
    }

    // CURRENT EVENT (walang binago)
    const currentContainer = document.getElementById('current-event-container');
    if (currentContainer) {
        currentContainer.innerHTML = '';
        if (currentEvents.length === 0) {
            const sortedUpcoming = [...upcomingEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
            if (sortedUpcoming.length > 0) {
                const nextEvent = sortedUpcoming[0];
                currentContainer.innerHTML = `
                    <div class="event-card">
                        <div class="event-card-image-container">
                            ${nextEvent.image ? 
                                `<img src="${nextEvent.image}" alt="${nextEvent.title}" class="event-card-image" onerror="this.src='https://via.placeholder.com/350x200?text=Event'">` : 
                                `<div class="event-image-placeholder">UPCOMING</div>`
                            }
                        </div>
                        <div class="event-card-content">
                            <h4>${nextEvent.title} <span style="font-size:0.8rem; background:var(--primary); color:white; padding:2px 8px; border-radius:12px; margin-left:8px;">Next</span></h4>
                            <p class="event-desc">${nextEvent.description}</p>
                            <span class="event-sub"><i class="far fa-calendar"></i> ${formatDate(nextEvent.date)} • ${nextEvent.time || 'All day'} • ${nextEvent.location || 'Barangay 118'}</span>
                            <div style="margin-top: 8px; text-align: right;">
                                <a href="#" class="event-read-more" data-date="${nextEvent.date}">Read More <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>`;
            } else {
                currentContainer.innerHTML = `
                    <div class="event-card">
                        <div class="event-image-placeholder">NO EVENTS</div>
                        <div class="event-card-content">
                            <h4>No upcoming events</h4>
                            <p class="event-desc">Check back later for scheduled activities.</p>
                            <span class="event-sub">Stay tuned!</span>
                        </div>
                    </div>`;
            }
        } else {
            const currentEvent = currentEvents[0];
            currentContainer.innerHTML = `
                <div class="event-card">
                    <div class="event-card-image-container">
                        ${currentEvent.image ? 
                            `<img src="${currentEvent.image}" alt="${currentEvent.title}" class="event-card-image" onerror="this.src='https://via.placeholder.com/350x200?text=Event'">` : 
                            `<div class="event-image-placeholder">TODAY</div>`
                        }
                    </div>
                    <div class="event-card-content">
                        <h4>${currentEvent.title}</h4>
                        <p class="event-desc">${currentEvent.description}</p>
                        <span class="event-sub"><i class="far fa-clock"></i> ${currentEvent.time || 'All day'} • ${currentEvent.location || 'Barangay 118'}</span>
                        <div style="margin-top: 8px; text-align: right;">
                            <a href="#" class="event-read-more" data-date="${currentEvent.date}">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>`;
        }
    }

    // UPCOMING EVENTS - limitahan sa 5
    const upcomingContainer = document.getElementById('upcoming-events-list');
    if (upcomingContainer) {
        upcomingContainer.innerHTML = '';
        if (upcomingEvents.length === 0) {
            upcomingContainer.innerHTML = '<div class="events-list-item"><h4>No Upcoming Events</h4><p>No upcoming events scheduled.</p></div>';
        } else {
            const sortedUpcoming = [...upcomingEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
            const displayUpcoming = sortedUpcoming.slice(0, 5); // 5 lang ipapakita
            displayUpcoming.forEach(event => {
                upcomingContainer.innerHTML += `
                    <div class="events-list-item">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <div class="event-item-footer">
                            <span class="event-date"><i class="far fa-calendar"></i> ${formatDate(event.date)}</span>
                            <a href="#" class="event-read-more" data-date="${event.date}">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>`;
            });
        }
    }
}

function showNewsModal(newsId) {
    const newsList = newsData["0C_news"]?.list || [];
    const newsItem = newsList.find(item => item.id == newsId);
    if (newsItem) {
        document.getElementById('news-modal-title').textContent = newsItem.title;
        document.getElementById('news-modal-date').innerHTML = `<i class="far fa-calendar"></i> ${formatDate(newsItem.date)}`;
        document.getElementById('news-modal-category').textContent = newsItem.category;
        document.getElementById('news-modal-image').src = newsItem.image;
        document.getElementById('news-modal-image').alt = newsItem.title;
        document.getElementById('news-modal-body').innerHTML = `
            <p>${newsItem.content}</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--gray-light); color: var(--gray);">
                <i class="far fa-clock"></i> ${getTimeAgo(newsItem.date)}
            </div>`;
        document.getElementById('news-modal').style.display = 'flex';
    }
}

function closeNewsModal() {
    document.getElementById('news-modal').style.display = 'none';
}

function setupNewsEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('featured-read-more') || 
            e.target.classList.contains('news-item-read-more') ||
            e.target.parentElement.classList.contains('featured-read-more') ||
            e.target.parentElement.classList.contains('news-item-read-more')) {
            e.preventDefault();
            const newsId = e.target.getAttribute('data-news-id') || e.target.parentElement.getAttribute('data-news-id');
            showNewsModal(newsId);
        }
    });

    document.body.addEventListener('click', function(e) {
        const newsItem = e.target.closest('.news-item');
        if (newsItem && !e.target.closest('a')) { 
            e.preventDefault();
            const newsId = newsItem.getAttribute('data-news-id');
            showNewsModal(newsId);
        }
    });
    
    document.getElementById('news-modal-close')?.addEventListener('click', closeNewsModal);
    document.getElementById('news-modal-close-btn')?.addEventListener('click', closeNewsModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('news-modal')) closeNewsModal();
    });
}

function setupEventCardListeners() {
    document.body.addEventListener('click', function(e) {
        const readMore = e.target.closest('.event-read-more');
        if (readMore) {
            e.preventDefault();
            e.stopPropagation();
            const dateStr = readMore.dataset.date;
            if (dateStr) {
                const [year, month, day] = dateStr.split('-').map(Number);
                showEventDetails(day, month - 1, year);
            }
            return;
        }

        const card = e.target.closest(".event-card");
        if (!card) return;
        const eventTitleElement = card.querySelector('h4');
        if (!eventTitleElement) return; 
        let eventTitle = eventTitleElement.childNodes[0]?.nodeValue?.trim() || eventTitleElement.innerText.split('Next')[0].trim();     
        const eventsList = newsData["0D_events"]?.allEvents || [];
        const event = eventsList.find(ev => ev.title === eventTitle);
        
        if (event) {
            const eventDate = new Date(event.date);
            showEventDetails(eventDate.getDate(), eventDate.getMonth(), eventDate.getFullYear());
        }
    });
}

function generateCalendar(month, year) {
    const calendarDates = document.getElementById('calendar-dates');
    if (!calendarDates) return;
    calendarDates.innerHTML = '';

    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    document.getElementById('calendar-month') && (document.getElementById('calendar-month').textContent = `${monthNames[month]} ${year}`);

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        calendarDates.appendChild(dayElement);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date other-month';
        calendarDates.appendChild(emptyCell);
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.dataset.date = `${year}-${month + 1}-${i}`;

        const dateNumber = document.createElement('span');
        dateNumber.className = 'date-number';
        dateNumber.textContent = i;
        dateElement.appendChild(dateNumber);

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dateElement.classList.add('today');
        }

        const eventsForDate = (newsData["0D_events"]?.allEvents || []).filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        if (eventsForDate.length > 0) {
            dateElement.classList.add('event');
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'event-indicator';
            eventsForDate.forEach(() => {
                const eventDot = document.createElement('div');
                eventDot.className = 'event-dot';
                eventIndicator.appendChild(eventDot);
            });
            dateElement.appendChild(eventIndicator);
            dateElement.addEventListener('click', () => showEventDetails(i, month, year));
        } else {
            dateElement.addEventListener('click', () => {
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = `
                    <div class="modal-event-date"><i class="far fa-calendar-alt"></i><span>${monthNames[month]} ${i}, ${year}</span></div>
                    <h3 class="modal-event-title">No Events Scheduled</h3>
                    <p class="modal-event-description">There are no events scheduled for this date. Check back later for updates!</p>`;
                document.getElementById('event-modal').style.display = 'flex';
            });
        }
        calendarDates.appendChild(dateElement);
    }

    const totalCells = 42;
    const cellsUsed = firstDay + daysInMonth;
    const remainingCells = totalCells - cellsUsed;
    for (let i = 1; i <= remainingCells; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date other-month';
        calendarDates.appendChild(emptyCell);
    }
}

function showEventDetails(day, month, year) {
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const eventsForDate = (newsData["0D_events"]?.allEvents || []).filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const modalBody = document.getElementById('modal-body');

    if (eventsForDate.length > 1) {
        modalBody.innerHTML = `
            <div class="modal-event-date"><i class="far fa-calendar-alt"></i><span>${monthNames[month]} ${day}, ${year}</span> <span class="event-count">${eventsForDate.length} events</span></div>`;
        
        eventsForDate.forEach(event => {
            modalBody.innerHTML += `
                <div class="modal-event-card" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--gray-light);">
                    <h4 class="modal-event-title" style="color: var(--primary); font-size: 1.1rem;">${event.title}</h4>
                    <p class="modal-event-description" style="color: var(--gray);">${event.description}</p>
                    <div class="modal-event-details">
                        <div class="modal-event-detail"><i class="far fa-clock"></i><span>${event.time || 'All day'}</span></div>
                        <div class="modal-event-detail"><i class="fas fa-map-marker-alt"></i><span>${event.location}</span></div>
                    </div>
                </div>`;
        });
    } else if (eventsForDate.length === 1) {
        const event = eventsForDate[0];
        modalBody.innerHTML = `
            <div class="modal-event-date"><i class="far fa-calendar-alt"></i><span>${monthNames[month]} ${day}, ${year}</span></div>
            <h3 class="modal-event-title" style="color: var(--primary);">${event.title}</h3>
            <p class="modal-event-description" style="color: var(--gray);">${event.description}</p>
            <div class="modal-event-details">
                <div class="modal-event-detail"><i class="far fa-clock"></i><span>${event.time || 'All day'}</span></div>
                <div class="modal-event-detail"><i class="fas fa-map-marker-alt"></i><span>${event.location}</span></div>
            </div>`;
    }

    document.getElementById('event-modal').style.display = 'flex';
}

function setupCalendarEventListeners() {
    document.getElementById('prev-month')?.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        generateCalendar(currentMonth, currentYear);
    });
    document.getElementById('next-month')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        generateCalendar(currentMonth, currentYear);
    });
    document.getElementById('close-modal')?.addEventListener('click', () => document.getElementById('event-modal').style.display = 'none');
    document.getElementById('close-modal-btn')?.addEventListener('click', () => document.getElementById('event-modal').style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('event-modal')) document.getElementById('event-modal').style.display = 'none';
    });
}

function showToast(message, type = 'info') {
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNewsListener(); 
    setupHeaderFooterListener();
    generateCalendar(currentMonth, currentYear);
    setupCalendarEventListeners();
    setupEventCardListeners();
    window.addEventListener('storage', function(e) {
        if (e.key === 'newsData') {
            loadFromLocalStorage();
            updateUI();
            renderHeader();
            renderFooter();
        }
    });
});

window.addEventListener('beforeunload', function() {
    if (newsUnsubscribe) newsUnsubscribe();
    if (panelUnsubscribe) panelUnsubscribe();
    if (readTimeInterval) clearInterval(readTimeInterval);
});