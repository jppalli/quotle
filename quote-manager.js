// Remote Quote Management System
class QuoteManager {
    constructor() {
        this.baseQuotes = quotesCalendar; // Fallback to local quotes
        this.remoteQuotes = new Map();
        this.lastUpdateCheck = null;
        this.updateCheckInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.apiEndpoint = 'https://your-api-gateway-url.amazonaws.com/prod/quotes';
        this.cdnEndpoint = 'https://your-cloudfront-url.cloudfront.net/quotes';
        
        // Initialize
        this.init();
    }
    
    async init() {
        console.log('🎯 Initializing Quote Manager...');
        
        // Load cached remote quotes
        await this.loadCachedRemoteQuotes();
        
        // Check for updates if needed
        if (this.shouldCheckForUpdates()) {
            await this.checkForUpdates();
        }
    }
    
    shouldCheckForUpdates() {
        if (!this.lastUpdateCheck) return true;
        
        const now = Date.now();
        const timeSinceLastCheck = now - this.lastUpdateCheck;
        return timeSinceLastCheck > this.updateCheckInterval;
    }
    
    async checkForUpdates() {
        try {
            console.log('🔄 Checking for quote updates...');
            
            // Get the latest update timestamp from server
            const response = await fetch(`${this.apiEndpoint}/version`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const versionInfo = await response.json();
            const serverVersion = versionInfo.version;
            const localVersion = localStorage.getItem('quotesVersion') || '0';
            
            console.log(`📊 Local version: ${localVersion}, Server version: ${serverVersion}`);
            
            if (serverVersion > localVersion) {
                console.log('📥 New quotes available, downloading...');
                await this.downloadUpdatedQuotes();
            } else {
                console.log('✅ Quotes are up to date');
            }
            
            this.lastUpdateCheck = Date.now();
            localStorage.setItem('quotesLastCheck', this.lastUpdateCheck.toString());
            
        } catch (error) {
            console.error('❌ Error checking for updates:', error);
            // Fail silently - game continues with local quotes
        }
    }
    
    async downloadUpdatedQuotes() {
        try {
            // Download from CDN for better performance
            const response = await fetch(`${this.cdnEndpoint}/quotes.json?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const updatedQuotes = await response.json();
            
            // Validate the quotes structure
            if (!this.validateQuotesStructure(updatedQuotes)) {
                throw new Error('Invalid quotes structure received');
            }
            
            // Store remote quotes
            await this.storeRemoteQuotes(updatedQuotes);
            
            console.log(`✅ Downloaded ${updatedQuotes.quotes.length} updated quotes`);
            
        } catch (error) {
            console.error('❌ Error downloading updated quotes:', error);
            throw error;
        }
    }
    
    validateQuotesStructure(data) {
        if (!data || !Array.isArray(data.quotes)) {
            return false;
        }
        
        // Validate a few sample quotes
        const sampleQuotes = data.quotes.slice(0, 3);
        for (const quote of sampleQuotes) {
            if (!quote.text || !quote.author || !quote.date || !Array.isArray(quote.scrambledWords)) {
                return false;
            }
        }
        
        return true;
    }
    
    async storeRemoteQuotes(data) {
        try {
            // Store in localStorage with compression
            const compressedData = this.compressData(JSON.stringify(data));
            localStorage.setItem('remoteQuotes', compressedData);
            localStorage.setItem('quotesVersion', data.version.toString());
            
            // Update in-memory cache
            this.remoteQuotes.clear();
            data.quotes.forEach(quote => {
                this.remoteQuotes.set(quote.date, quote);
            });
            
            console.log(`💾 Stored ${data.quotes.length} remote quotes (version ${data.version})`);
            
        } catch (error) {
            console.error('❌ Error storing remote quotes:', error);
            throw error;
        }
    }
    
    async loadCachedRemoteQuotes() {
        try {
            const compressedData = localStorage.getItem('remoteQuotes');
            if (!compressedData) {
                console.log('📭 No cached remote quotes found');
                return;
            }
            
            const dataStr = this.decompressData(compressedData);
            const data = JSON.parse(dataStr);
            
            if (!this.validateQuotesStructure(data)) {
                console.warn('⚠️ Invalid cached quotes structure, clearing cache');
                localStorage.removeItem('remoteQuotes');
                localStorage.removeItem('quotesVersion');
                return;
            }
            
            // Load into memory
            this.remoteQuotes.clear();
            data.quotes.forEach(quote => {
                this.remoteQuotes.set(quote.date, quote);
            });
            
            this.lastUpdateCheck = parseInt(localStorage.getItem('quotesLastCheck') || '0');
            
            console.log(`📂 Loaded ${data.quotes.length} cached remote quotes (version ${data.version})`);
            
        } catch (error) {
            console.error('❌ Error loading cached remote quotes:', error);
            // Clear corrupted cache
            localStorage.removeItem('remoteQuotes');
            localStorage.removeItem('quotesVersion');
        }
    }
    
    // Simple compression using base64 encoding (you could use a proper compression library)
    compressData(str) {
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            console.warn('⚠️ Compression failed, storing uncompressed');
            return str;
        }
    }
    
    decompressData(str) {
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (error) {
            console.warn('⚠️ Decompression failed, assuming uncompressed');
            return str;
        }
    }
    
    // Main method to get a quote for a specific date
    getQuoteForDate(dateStr) {
        // First check remote quotes
        if (this.remoteQuotes.has(dateStr)) {
            const remoteQuote = this.remoteQuotes.get(dateStr);
            console.log(`📡 Using remote quote for ${dateStr}`);
            return remoteQuote;
        }
        
        // Fallback to local quotes
        const localQuote = this.baseQuotes.find(q => q.date === dateStr);
        if (localQuote) {
            console.log(`📚 Using local quote for ${dateStr}`);
            return localQuote;
        }
        
        console.warn(`⚠️ No quote found for ${dateStr}, using fallback`);
        return this.baseQuotes[0]; // Fallback to first quote
    }
    
    // Get all available quotes (merged remote + local)
    getAllQuotes() {
        const allQuotes = [...this.baseQuotes];
        
        // Override with remote quotes where available
        this.remoteQuotes.forEach((remoteQuote, date) => {
            const localIndex = allQuotes.findIndex(q => q.date === date);
            if (localIndex >= 0) {
                allQuotes[localIndex] = remoteQuote;
            } else {
                allQuotes.push(remoteQuote);
            }
        });
        
        // Sort by date
        return allQuotes.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    // Force update check (for testing or manual refresh)
    async forceUpdate() {
        console.log('🔄 Forcing quote update check...');
        this.lastUpdateCheck = null;
        await this.checkForUpdates();
    }
    
    // Get update status
    getUpdateStatus() {
        return {
            lastCheck: this.lastUpdateCheck,
            remoteQuotesCount: this.remoteQuotes.size,
            localQuotesCount: this.baseQuotes.length,
            version: localStorage.getItem('quotesVersion') || '0'
        };
    }
    
    // Clear all remote data (for testing)
    clearRemoteData() {
        this.remoteQuotes.clear();
        localStorage.removeItem('remoteQuotes');
        localStorage.removeItem('quotesVersion');
        localStorage.removeItem('quotesLastCheck');
        console.log('🗑️ Cleared all remote quote data');
    }
}

// Export for use in other files
window.QuoteManager = QuoteManager;