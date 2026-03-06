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
try {
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  db = firebase.database();
  console.log("Firebase Admin initialized successfully!");
} catch (e) {
  console.error('Firebase initialization error:', e);
}

const defaultBarangayData = {
  "01_PanelHome": {
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
  }
};

class BarangayAdminPanel {
  constructor() {
      this.dataKey = 'barangayData';
      this.currentData = null;
      this.activityLog = [];
      this.lastSavedData = null;
      this.saveStatusTimeout = null;
      this.isSaving = false;
      this.realtimeDbRef = db ? db.ref('01_PanelHome') : null;
      this.init();
  }

  init() {
      console.log("Admin Panel Initializing...");
      this.setDefaultValuesFromHTML();

      this.loadData().then(() => {
          this.lastSavedData = JSON.parse(JSON.stringify(this.currentData));
          this.setupEventListeners();
          this.updateDashboard();
          this.logActivity('System initialized', 'success');
          this.updateSaveStatus('• Ready to Save');
          this.checkFirebaseConnection();
          this.setupRealtimeListener();
          console.log("Admin Panel Ready!");
      });
  }

  setDefaultValuesFromHTML() {
      console.log("Setting default values from HTML...");
      this.currentData = this.getDefaultData();
      this.populateForms();
  }

  checkFirebaseConnection() {
      if (!db) {
          console.warn('Firebase not connected. Using localStorage only.');
          this.showAlert('Firebase not connected. Data will be saved locally only.', 'warning');
      } 
  }

  getDefaultData() {
      return JSON.parse(JSON.stringify(defaultBarangayData));
  }

  async loadData() {
      console.log("Loading data...");
      if (this.realtimeDbRef) {
          try {
              const snapshot = await this.realtimeDbRef.once('value');
              if (snapshot.exists()) {
                  const firebaseData = snapshot.val();
                  console.log('Data loaded from Firebase Database:', firebaseData);
                  this.currentData = this.mergeWithDefaults(firebaseData);
                  this.populateForms();
                  return;
              } else {
                  console.log('No Firebase data found. Using defaults.');
                  this.currentData = this.getDefaultData();
                  this.populateForms();
                  return;
              }
          } catch (err) {
              console.warn('Firebase read failed:', err.message || err);
              this.showAlert('Cannot connect to Firebase. Using local data.', 'warning');
          }
      }

      let loaded = false;
      const savedData = localStorage.getItem(this.dataKey);
      if (savedData) {
          try {
              const localStorageData = JSON.parse(savedData);
              console.log('Data loaded from localStorage');
              if (localStorageData && localStorageData["01_PanelHome"]) {
                  this.currentData = this.mergeWithDefaults(localStorageData);
              } else {
                  console.warn('LocalStorage data has old structure, using defaults.');
                  this.currentData = this.getDefaultData();
              }
              loaded = true;
          } catch (error) {
              console.error('Error parsing localStorage data:', error);
          }
      }

      if (!loaded) {
          this.currentData = this.getDefaultData();
          console.log('Using default data');
      }
      this.populateForms();
  }

  mergeWithDefaults(loadedData) {
      const defaults = this.getDefaultData();
      if (!loadedData || typeof loadedData !== 'object') return defaults;
      if (loadedData["01_PanelHome"]) {
          const loadedPanel = loadedData["01_PanelHome"];
          const defaultPanel = defaults["01_PanelHome"];
          if (loadedPanel["0A_Header"]) {
              defaultPanel["0A_Header"] = { ...defaultPanel["0A_Header"], ...loadedPanel["0A_Header"] };
          }
          if (loadedPanel["0B_hero"]) {
              defaultPanel["0B_hero"] = { ...defaultPanel["0B_hero"], ...loadedPanel["0B_hero"] };
          }
          if (loadedPanel["0C_welcomeSection"]) {
              defaultPanel["0C_welcomeSection"] = { ...defaultPanel["0C_welcomeSection"], ...loadedPanel["0C_welcomeSection"] };
          }
          if (loadedPanel["0D_footer"]) {
              const loadedFooter = loadedPanel["0D_footer"];
              const defaultFooter = defaultPanel["0D_footer"];
              defaultFooter.title = loadedFooter.title ?? defaultFooter.title;
              defaultFooter.description = loadedFooter.description ?? defaultFooter.description;
              if (loadedFooter.contactInfo) {
                  defaultFooter.contactInfo = { ...defaultFooter.contactInfo, ...loadedFooter.contactInfo };
              }
              if (loadedFooter.socialMedia) {
                  defaultFooter.socialMedia = { ...defaultFooter.socialMedia, ...loadedFooter.socialMedia };
              }
              defaultFooter.copyright = loadedFooter.copyright ?? defaultFooter.copyright;
          }
      }
      return defaults;
  }

  hasActualChanges() {
      if (!this.lastSavedData) return true;
      return JSON.stringify(this.currentData) !== JSON.stringify(this.lastSavedData);
  }

  async saveData(forceSave = false) {
      if (!forceSave && !this.hasActualChanges()) {
          console.log('No changes detected, skipping save');
          this.updateSaveStatus('No changes to save', 'info');
          return true;
      }

      if (this.isSaving) {
          console.log('Save already in progress...');
          return false;
      }

      this.isSaving = true;
      this.updateSaveStatus('Saving...', 'info');
      const dataToSave = JSON.parse(JSON.stringify(this.currentData));
      let saveSuccessful = false;
      let saveMessage = '';
      let saveType = 'success';

      try {
          localStorage.setItem(this.dataKey, JSON.stringify(dataToSave));
          console.log('Data saved to localStorage');
          saveSuccessful = true;
          saveMessage = 'Saved locally';
          if (this.realtimeDbRef) {
              try {
                  await this.realtimeDbRef.set(dataToSave["01_PanelHome"]);
                  this.lastSavedData = JSON.parse(JSON.stringify(dataToSave));
                  this.currentData = dataToSave;
                  saveMessage = '• Saved to Database';
                  saveSuccessful = true;
              } catch (err) {
                  console.error('Firebase save failed:', err);
                  saveMessage = 'Saved locally (Firebase failed)';
                  saveType = 'warning';
              }
          } else {
              saveMessage = 'Firebase not available, saved locally only';
              saveType = 'warning';
          }

      } catch (e) {
          console.error('Failed writing to localStorage:', e);
          saveMessage = 'Save failed!';
          saveType = 'error';
          saveSuccessful = false;
      }

      if (saveSuccessful) {
          this.lastSavedData = JSON.parse(JSON.stringify(dataToSave));
          this.currentData = dataToSave;
          this.updateDashboard();
          this.updateSaveStatus(saveMessage, saveType);
          this.logActivity(`Data saved`, saveType === 'warning' ? 'warning' : 'success');
      } else {
          this.updateSaveStatus(saveMessage, saveType);
          this.logActivity('Save failed', 'error');
      }
      this.isSaving = false;
      return saveSuccessful;
  }

  updateSaveStatus(message = '• Ready to Save', type = 'default') {
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
      if (!this.currentData || !this.currentData["01_PanelHome"]) return;
      const panel = this.currentData["01_PanelHome"];
      console.log("Populating forms with data:", panel);
      const header = panel["0A_Header"] || {};
      const elSystemName = document.getElementById('system-name');
      if (elSystemName) elSystemName.value = header.systemName || '';
      const elHeaderLogo = document.getElementById('header-logo');
      if (elHeaderLogo) elHeaderLogo.value = header.headerLogo || '';
      const hero = panel["0B_hero"] || {};
      const elHeroTitle = document.getElementById('hero-title');
      if (elHeroTitle) elHeroTitle.value = hero.title || '';
      const elHeroDesc = document.getElementById('hero-description');
      if (elHeroDesc) elHeroDesc.value = hero.description || '';
      const welcome = panel["0C_welcomeSection"] || {};
      const elWelcomeTitle = document.getElementById('welcome-title');
      if (elWelcomeTitle) elWelcomeTitle.value = welcome.title || '';
      const elWelcomeSub = document.getElementById('welcome-subtitle');
      if (elWelcomeSub) elWelcomeSub.value = welcome.subtitle || '';
      const elWelcomeBg = document.getElementById('welcome-background');
      if (elWelcomeBg) elWelcomeBg.value = welcome.backgroundImage || '';
      const elWelcomeLogo = document.getElementById('welcome-logo');
      if (elWelcomeLogo) elWelcomeLogo.value = welcome.logo || '';
      const footer = panel["0D_footer"] || {};
      const elFooterTitle = document.getElementById('footer-title');
      if (elFooterTitle) elFooterTitle.value = footer.title || '';
      const elFooterDesc = document.getElementById('footer-description');
      if (elFooterDesc) elFooterDesc.value = footer.description || '';

      if (footer.contactInfo) {
          const c = footer.contactInfo;
          const a1 = document.getElementById('address-line1');
          if (a1) a1.value = c.addressLine1 || '';
          const a2 = document.getElementById('address-line2');
          if (a2) a2.value = c.addressLine2 || '';
          const phone = document.getElementById('phone');
          if (phone) phone.value = c.phone || '';
          const mail = document.getElementById('email');
          if (mail) mail.value = c.email || '';
          const oh = document.getElementById('office-hours');
          if (oh) oh.value = c.officeHours || '';
      }

      if (footer.socialMedia) {
          const fb = document.getElementById('facebook-url');
          if (fb) fb.value = footer.socialMedia.facebook || '';
          const msg = document.getElementById('messenger-url');
          if (msg) msg.value = footer.socialMedia.messenger || '';
      }

      const copyEl = document.getElementById('copyright-text');
      if (copyEl) copyEl.value = footer.copyright || '';

      this.updateImagePreviews();
  }

  updateImagePreviews() {
      if (!this.currentData["01_PanelHome"]) return;
      const panel = this.currentData["01_PanelHome"];
      const headerLogoPreview = document.getElementById('header-logo-preview');
      const bgPreview = document.getElementById('welcome-bg-preview');
      const logoPreview = document.getElementById('welcome-logo-preview');

      const header = panel["0A_Header"] || {};
      if (headerLogoPreview && header.headerLogo) {
          this.updateSingleImagePreview(headerLogoPreview, header.headerLogo);
      }

      const welcome = panel["0C_welcomeSection"] || {};
      if (bgPreview && welcome.backgroundImage) {
          this.updateSingleImagePreview(bgPreview, welcome.backgroundImage);
      }

      if (logoPreview && welcome.logo) {
          this.updateSingleImagePreview(logoPreview, welcome.logo);
      }
  }

  updateSingleImagePreview(previewElement, imageUrl) {
      let fixedUrl = imageUrl;
      if (fixedUrl.includes('ibb.co') && !fixedUrl.includes('.jpg') && !fixedUrl.includes('.png') && !fixedUrl.includes('.jpeg')) {
          fixedUrl = fixedUrl + '.jpg';
      }

      if (fixedUrl.includes('google.com') && fixedUrl.includes('url=')) {
          try {
              const urlParams = new URL(fixedUrl).searchParams;
              const actualUrl = urlParams.get('url');
              if (actualUrl) {
                  fixedUrl = actualUrl;
              }
          } catch (e) {
              console.warn('Could not parse Google Images URL');
          }
      }

      previewElement.src = fixedUrl;
      if (previewElement.complete) {
          previewElement.classList.add('visible');
      } else {
          previewElement.onload = () => {
              previewElement.classList.add('visible');
              console.log('Image loaded successfully:', fixedUrl);
          };
          previewElement.onerror = () => {
              previewElement.classList.remove('visible');
              console.warn('Failed to load image:', fixedUrl);
              if (fixedUrl !== imageUrl) {
                  console.log('Trying original URL:', imageUrl);
                  previewElement.src = imageUrl;
              }
          };
      }
  }

  setupEventListeners() {
      document.querySelectorAll('.sidebar-menu a').forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const tabId = link.getAttribute('data-tab');
              this.switchTab(tabId);
          });
      });

      const logoutBtn = document.querySelector('.sidebar-logout-btn');
      if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
              if (!confirm('Are you sure you want to logout?')) {
                  e.preventDefault();
              }
          });
      }

      this.setupFormListeners();

      const previewBtn = document.getElementById('preview-site-btn');
      if (previewBtn) previewBtn.addEventListener('click', () => window.open('PanelHome.html', '_blank'));

      const exportBtn = document.getElementById('export-data-btn');
      if (exportBtn) exportBtn.addEventListener('click', () => {
          this.exportData();
      });

      const backupBtn = document.getElementById('backup-btn');
      if (backupBtn) backupBtn.addEventListener('click', () => {
          this.exportData();
          this.showAlert('Backup created successfully!', 'success');
      });

      const refreshBtn = document.getElementById('refresh-btn');
      if (refreshBtn) refreshBtn.addEventListener('click', () => {
          this.loadData();
          this.showAlert('Data refreshed!', 'success');
      });

      const clearBtn = document.getElementById('clear-all-data-btn');
      if (clearBtn) clearBtn.addEventListener('click', () => {
          if (confirm('Clear ALL data? This will remove everything and cannot be undone.')) {
              this.clearAllData();
          }
      });

      const headerLogoInput = document.getElementById('header-logo');
      if (headerLogoInput) headerLogoInput.addEventListener('input', (e) => {
          this.updateSingleImagePreview(document.getElementById('header-logo-preview'), e.target.value);
      });

      const welcomeBg = document.getElementById('welcome-background');
      if (welcomeBg) welcomeBg.addEventListener('input', (e) => {
          this.updateSingleImagePreview(document.getElementById('welcome-bg-preview'), e.target.value);
      });

      const welcomeLogo = document.getElementById('welcome-logo');
      if (welcomeLogo) welcomeLogo.addEventListener('input', (e) => {
          this.updateSingleImagePreview(document.getElementById('welcome-logo-preview'), e.target.value);
      });

      document.querySelectorAll('form').forEach(form => {
          form.addEventListener('submit', (e) => e.preventDefault());
      });
  }

  setupFormListeners() {
      const headerForm = document.getElementById('header-form');
      if (headerForm) {
          headerForm.addEventListener('submit', async (e) => {
              e.preventDefault();

              const newSystemName = document.getElementById('system-name').value;
              const newHeaderLogo = document.getElementById('header-logo').value;

              const panel = this.currentData["01_PanelHome"];
              const oldSystemName = panel["0A_Header"]?.systemName;
              const oldHeaderLogo = panel["0A_Header"]?.headerLogo;

              if (oldSystemName !== newSystemName || oldHeaderLogo !== newHeaderLogo) {
                  if (!panel["0A_Header"]) panel["0A_Header"] = {};
                  panel["0A_Header"].systemName = newSystemName;
                  panel["0A_Header"].headerLogo = newHeaderLogo;

                  const saved = await this.saveData();
                  if (saved) {
                      this.showAlert('Header updated successfully!', 'success');
                      this.logActivity('Header updated', 'success');
                  }
              } else {
                  this.showAlert('No changes detected in Header', 'info');
              }
          });
      }

      const headerReset = document.getElementById('header-reset-btn');
      if (headerReset) {
          headerReset.addEventListener('click', async () => {
              if (confirm('Reset Header section to defaults? This will reset and save immediately.')) {
                  const defaultData = this.getDefaultData();
                  const defaultHeader = defaultData["01_PanelHome"]["0A_Header"];

                  const panel = this.currentData["01_PanelHome"];
                  panel["0A_Header"] = { ...defaultHeader };

                  document.getElementById('system-name').value = defaultHeader.systemName;
                  document.getElementById('header-logo').value = defaultHeader.headerLogo;

                  this.updateImagePreviews();
                  await this.saveData(true);
                  this.showAlert('Header section reset to defaults!', 'success');
                  this.logActivity('Header section reset to defaults', 'warning');
              }
          });
      }

      const heroForm = document.getElementById('hero-form');
      if (heroForm) {
          heroForm.addEventListener('submit', async (e) => {
              e.preventDefault();

              const newTitle = document.getElementById('hero-title').value;
              const newDesc = document.getElementById('hero-description').value;

              const panel = this.currentData["01_PanelHome"];
              const oldTitle = panel["0B_hero"]?.title;
              const oldDesc = panel["0B_hero"]?.description;

              if (oldTitle !== newTitle || oldDesc !== newDesc) {
                  if (!panel["0B_hero"]) panel["0B_hero"] = {};
                  panel["0B_hero"].title = newTitle;
                  panel["0B_hero"].description = newDesc;

                  const saved = await this.saveData();
                  if (saved) {
                      this.showAlert('Hero section updated successfully!', 'success');
                      this.logActivity('Hero section updated', 'success');
                  }
              } else {
                  this.showAlert('No changes detected in Hero section', 'info');
              }
          });
      }

      const heroReset = document.getElementById('hero-reset-btn');
      if (heroReset) {
          heroReset.addEventListener('click', async () => {
              if (confirm('Reset Hero section to defaults? This will reset and save immediately.')) {
                  const defaultData = this.getDefaultData();
                  const defaultHero = defaultData["01_PanelHome"]["0B_hero"];

                  const panel = this.currentData["01_PanelHome"];
                  panel["0B_hero"] = { ...defaultHero };

                  document.getElementById('hero-title').value = defaultHero.title;
                  document.getElementById('hero-description').value = defaultHero.description;

                  await this.saveData(true);
                  this.showAlert('Hero section reset to defaults!', 'success');
                  this.logActivity('Hero section reset to defaults', 'warning');
              }
          });
      }

      const welcomeForm = document.getElementById('welcome-form');
      if (welcomeForm) {
          welcomeForm.addEventListener('submit', async (e) => {
              e.preventDefault();

              const newData = {
                  backgroundImage: document.getElementById('welcome-background').value,
                  title: document.getElementById('welcome-title').value,
                  subtitle: document.getElementById('welcome-subtitle').value,
                  logo: document.getElementById('welcome-logo').value
              };

              const panel = this.currentData["01_PanelHome"];
              const oldData = { ...panel["0C_welcomeSection"] } || {};

              if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                  panel["0C_welcomeSection"] = newData;

                  const saved = await this.saveData();
                  if (saved) {
                      this.showAlert('Welcome section updated successfully!', 'success');
                      this.logActivity('Welcome section updated', 'success');
                  }
              } else {
                  this.showAlert('No changes detected in Welcome section', 'info');
              }
          });
      }

      const welcomeReset = document.getElementById('welcome-reset-btn');
      if (welcomeReset) {
          welcomeReset.addEventListener('click', async () => {
              if (confirm('Reset Welcome section to defaults? This will reset and save immediately.')) {
                  const defaultData = this.getDefaultData();
                  const defaultWelcome = defaultData["01_PanelHome"]["0C_welcomeSection"];

                  const panel = this.currentData["01_PanelHome"];
                  panel["0C_welcomeSection"] = { ...defaultWelcome };

                  document.getElementById('welcome-title').value = defaultWelcome.title;
                  document.getElementById('welcome-subtitle').value = defaultWelcome.subtitle;
                  document.getElementById('welcome-background').value = defaultWelcome.backgroundImage;
                  document.getElementById('welcome-logo').value = defaultWelcome.logo;

                  this.updateImagePreviews();
                  await this.saveData(true);
                  this.showAlert('Welcome section reset to defaults!', 'success');
                  this.logActivity('Welcome section reset to defaults', 'warning');
              }
          });
      }

      const footerForm = document.getElementById('footer-form');
      if (footerForm) {
          footerForm.addEventListener('submit', async (e) => {
              e.preventDefault();

              const newData = {
                  title: document.getElementById('footer-title').value,
                  description: document.getElementById('footer-description').value,
                  contactInfo: {
                      addressLine1: document.getElementById('address-line1').value,
                      addressLine2: document.getElementById('address-line2').value,
                      phone: document.getElementById('phone').value,
                      email: document.getElementById('email').value,
                      officeHours: document.getElementById('office-hours').value
                  },
                  socialMedia: {
                      facebook: document.getElementById('facebook-url').value,
                      messenger: document.getElementById('messenger-url').value
                  },
                  copyright: document.getElementById('copyright-text').value
              };

              const panel = this.currentData["01_PanelHome"];
              const oldData = { ...panel["0D_footer"] } || {};

              if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
                  panel["0D_footer"] = newData;

                  const saved = await this.saveData();
                  if (saved) {
                      this.showAlert('Footer updated successfully!', 'success');
                      this.logActivity('Footer updated', 'success');
                  }
              } else {
                  this.showAlert('No changes detected in footer', 'info');
              }
          });
      }

      const footerReset = document.getElementById('footer-reset-btn');
      if (footerReset) {
          footerReset.addEventListener('click', async () => {
              if (confirm('Reset Footer section to defaults? This will reset and save immediately.')) {
                  const defaultData = this.getDefaultData();
                  const defaultFooter = defaultData["01_PanelHome"]["0D_footer"];

                  const panel = this.currentData["01_PanelHome"];
                  panel["0D_footer"] = JSON.parse(JSON.stringify(defaultFooter));

                  document.getElementById('footer-title').value = defaultFooter.title;
                  document.getElementById('footer-description').value = defaultFooter.description;
                  document.getElementById('address-line1').value = defaultFooter.contactInfo.addressLine1;
                  document.getElementById('address-line2').value = defaultFooter.contactInfo.addressLine2;
                  document.getElementById('phone').value = defaultFooter.contactInfo.phone;
                  document.getElementById('email').value = defaultFooter.contactInfo.email;
                  document.getElementById('office-hours').value = defaultFooter.contactInfo.officeHours;
                  document.getElementById('facebook-url').value = defaultFooter.socialMedia.facebook;
                  document.getElementById('messenger-url').value = defaultFooter.socialMedia.messenger;
                  document.getElementById('copyright-text').value = defaultFooter.copyright;

                  await this.saveData(true);
                  this.showAlert('Footer section reset to defaults!', 'success');
                  this.logActivity('Footer section reset to defaults', 'warning');
              }
          });
      }
  }

  switchTab(tabId) {
      document.querySelectorAll('.sidebar-menu a').forEach(item => {
          item.classList.remove('active');
      });
      const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
      if (activeLink) activeLink.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(tab => {
          tab.classList.remove('active');
      });
      const selectedTab = document.getElementById(tabId);
      if (selectedTab) selectedTab.classList.add('active');
      this.updateQuickGuide(tabId);
      const adminContent = document.querySelector('.admin-content');
      if (adminContent) adminContent.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateQuickGuide(tabId) {
      document.querySelectorAll('.guide-section').forEach(section => {
          section.style.display = 'none';
      });
      const guide = document.getElementById(`${tabId}-guide`);
      if (guide) guide.style.display = 'block';
  }

  updateDashboard() {
      if (!this.currentData) return;

      const status = document.getElementById('system-status');
      if (status) {
          if (db && this.realtimeDbRef) {
              status.textContent = 'Online';
              status.style.color = 'var(--success)';
          } else {
              status.textContent = 'Local Mode';
              status.style.color = 'var(--warning)';
          }
      }

      const users = document.getElementById('user-count');
      if (users) users.textContent = '0';

      const last = document.getElementById('last-updated');
      if (last) {
          const now = new Date();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          const year = now.getFullYear();
          last.textContent = `${month}/${day}/${year}`;
      }

      const dataSize = document.getElementById('data-size');
      if (dataSize) {
          const size = JSON.stringify(this.currentData).length;
          dataSize.textContent = `${Math.round(size / 1024)} KB`;
      }
  }

  exportData() {
      const dataStr = JSON.stringify(this.currentData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barangay118-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.logActivity('Data exported successfully', 'success');
      this.showAlert('Data exported successfully!', 'success');
  }

  clearAllData() {
      localStorage.removeItem(this.dataKey);

      if (this.realtimeDbRef) {
          this.realtimeDbRef.remove().then(() => {
              console.log('Firebase data removed');
          }).catch(err => {
              console.error('Error removing Firebase data:', err);
          });
      }

      this.currentData = this.getDefaultData();
      this.populateForms();
      this.saveData(true);

      this.logActivity('All data cleared', 'error');
      this.showAlert('All data has been cleared! Default data restored.', 'success');
  }

  showAlert(message, type) {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.innerHTML = `
          <strong>
              <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> 
              ${message}
          </strong>`;

      const currentTab = document.querySelector('.tab-content.active');
      if (currentTab) {
          currentTab.insertBefore(alert, currentTab.firstChild);
          setTimeout(() => {
              if (alert.parentNode) alert.remove();
          }, 5000);
      }
  }

  logActivity(message, type) {
      const activity = {
          timestamp: new Date().toLocaleTimeString(),
          message: message,
          type: type
      };

      this.activityLog.unshift(activity);
      if (this.activityLog.length > 10) this.activityLog.pop();

      this.updateActivityLog();
  }

  updateActivityLog() {
      const container = document.getElementById('recent-activity');
      if (!container) return;

      if (this.activityLog.length === 0) {
          container.innerHTML = `
              <p style="color: var(--gray); text-align: center; padding: 20px;">
                  <i class="fas fa-clock"></i> No recent activity
              </p>`;
          return;
      }

      container.innerHTML = this.activityLog.map(activity => `
          <div style="padding:10px 15px; border-left:3px solid ${
          activity.type === 'success' ? 'var(--success)' :
              activity.type === 'error' ? 'var(--error)' :
                  'var(--warning)'
      }; margin-bottom:10px; background:var(--gray-light); border-radius:0 var(--radius) var(--radius) 0;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:15px;">
                  <span style="font-weight:600;">${activity.message}</span>
                  <small style="color:var(--gray);">${activity.timestamp}</small>
              </div>
          </div>
      `).join('');
  }

  setupRealtimeListener() {
      if (!this.realtimeDbRef) return;
      try {
          this.realtimeDbRef.on('value', (snapshot) => {
              if (!snapshot.exists()) return;

              const remoteData = snapshot.val();
              const localPanel = this.currentData["01_PanelHome"];
              const localDataStr = JSON.stringify(localPanel);
              const remoteDataStr = JSON.stringify(remoteData);

              if (localDataStr !== remoteDataStr) {
                  this.currentData["01_PanelHome"] = remoteData;
                  this.populateForms();
                  this.updateDashboard();
                  this.logActivity('Data synced from Firebase', 'info');
              }
          }, (error) => {
              console.warn('Firebase listener error:', error);
          });
      } catch (error) {
          console.warn('Failed to setup Firebase listener:', error);
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new BarangayAdminPanel();
  console.log("Barangay 118 Admin Panel Loaded");
});