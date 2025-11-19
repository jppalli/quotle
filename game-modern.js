// Modern ES6+ Game Engine with PixiJS Integration
class DailyQuotePuzzle {
    constructor() {
        // Initialize quote manager for remote updates
        this.quoteManager = new QuoteManager();
        this.quotes = quotesCalendar; // Fallback
        // Game initialization - will be set in init() after checking for saved state
        this.currentQuote = null;
        // Quote selected for today
        this.activeWord = null;
        this.solvedWords = new Set();
        this.authorSolved = false;
        this.isUnscrambling = false;
        this.gameComplete = false;
        this.startTime = null;
        this.endTime = null;
        this.gameTime = 0;
        this.wordValidationState = 'pending'; // 'pending', 'correct', 'incorrect'
        this.isSelectingLetter = false; // Flag for letter selection mode

        // User input state
        this.userInput = '';
        this.availableLetters = [];
        this.usedLetters = [];
        this.hintsUsedThisPuzzle = 0;

        // Settings
        this.soundEffectsEnabled = true;
        this.backgroundMusicEnabled = true;

        // Unscramble cooldown system
        this.unscrambleCooldown = 60000; // 60 seconds in milliseconds
        this.unscrambleLastUsed = 0;
        this.unscrambleCooldownInterval = null;

        // Achievements system
        this.achievementsManager = new AchievementsManager();
        this.hintsUsedThisPuzzle = 0;

        // Ink drops currency system
        this.inkDrops = 0; // Start with 0 drops by default
        this.maxInkDrops = 50; // Increased to allow accumulation of achievement rewards
        this.firstTimeInkDrops = 5; // First time users get 5 drops
        this.dailyInkDrops = 3; // Daily login gives 3 drops
        this.inkDropsLoaded = false; // Flag to prevent duplicate loading



        // Calendar state
        this.currentCalendarMonth = new Date().getMonth();
        this.currentCalendarYear = new Date().getFullYear();

        // PixiJS Application
        this.pixiApp = null;
        this.particleContainer = null;

        // Sound system
        this.sounds = new Map();

        // Music tracks system
        this.musicTracks = {
            track1: {
                id: 'backgroundMusic',
                name: 'Classic Puzzle',
                unlocked: true,
                cost: 0,
                description: 'The original relaxing puzzle music'
            },
            track2: {
                id: 'backgroundMusic2',
                name: 'Jazz Vibes',
                unlocked: false,
                cost: 50,
                description: 'Smooth jazz for focused solving'
            },
            track3: {
                id: 'backgroundMusic3',
                name: 'Nature Sounds',
                unlocked: false,
                cost: 75,
                description: 'Peaceful nature ambience'
            },
            track4: {
                id: 'backgroundMusic4',
                name: 'Electronic Beats',
                unlocked: false,
                cost: 100,
                description: 'Upbeat electronic puzzle music'
            },
            track5: {
                id: 'backgroundMusic5',
                name: 'Orchestral',
                unlocked: false,
                cost: 150,
                description: 'Epic orchestral puzzle themes'
            }
        };

        this.currentMusicTrack = 'backgroundMusic';

        // Arkadium SDK Integration - REMOVED for standalone version
        // this.arkadium = null;

        // DOM Elements
        this.elements = this.initializeElements();

        // Initialize the game
        this.init();
    }

    initializeElements() {
        const elements = {
            quoteText: document.getElementById('quoteText'),
            quoteAuthor: document.getElementById('quoteAuthor'),
            congrats: document.getElementById('congrats'),
            inputArea: document.getElementById('inputArea'),
            letterCells: document.getElementById('letterCells'),
            availableLetters: document.getElementById('availableLetters'),
            resetBtn: document.getElementById('resetBtn'),
            backspaceBtn: document.getElementById('backspaceBtn'),
            unscrambleBtn: document.getElementById('unscrambleBtn'),
            unscrambleTimer: document.getElementById('unscrambleTimer'),
            revealLetterBtn: document.getElementById('revealLetterBtn'),
            definitionBtn: document.getElementById('definitionBtn'),
            definitionModal: document.getElementById('definitionModal'),
            closeDefinition: document.getElementById('closeDefinition'),
            definitionText: document.getElementById('definitionText'),
            // Hamburger menu elements
            hamburgerMenu: document.getElementById('hamburgerMenu'),
            slideMenu: document.getElementById('slideMenu'),
            menuOverlay: document.getElementById('menuOverlay'),
            closeMenu: document.getElementById('closeMenu'),
            menuStatsLink: document.getElementById('menuStatsLink'),
            menuCalendarLink: document.getElementById('menuCalendarLink'),
            menuAchievementsLink: document.getElementById('menuAchievementsLink'),
            menuHelpLink: document.getElementById('menuHelpLink'),
            menuTestPersistenceLink: document.getElementById('menuTestPersistenceLink'),
            menuChangeSongLink: document.getElementById('menuChangeSongLink'),
            menuSoundEffectsToggle: document.getElementById('menuSoundEffectsToggle'),
            menuBackgroundMusicToggle: document.getElementById('menuBackgroundMusicToggle'),
            // Legacy elements (keeping for backward compatibility)
            helpIcon: document.getElementById('helpIcon'),
            calendarIcon: document.getElementById('calendarIcon'),
            statsIcon: document.getElementById('statsIcon'),
            calendarModal: document.getElementById('calendarModal'),
            closeCalendar: document.getElementById('closeCalendar'),
            calendarDates: document.getElementById('calendarDates'),
            dateLine: document.getElementById('dateLine'),
            calendarStatus: document.getElementById('calendarStatus'),
            welcomeModal: document.getElementById('welcomeModal'),
            closeWelcome: document.getElementById('closeWelcome'),
            helpModal: document.getElementById('helpModal'),
            closeHelp: document.getElementById('closeHelp'),
            statsModal: document.getElementById('statsModal'),
            closeStats: document.getElementById('closeStats'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            settingsIcon: document.getElementById('settingsIcon'),
            soundEffectsToggle: document.getElementById('soundEffectsToggle'),
            backgroundMusicToggle: document.getElementById('backgroundMusicToggle'),
            changeSongBtn: document.getElementById('changeSongBtn'),
            musicSelectionModal: document.getElementById('musicSelectionModal'),
            closeMusicSelection: document.getElementById('closeMusicSelection'),
            musicTracksGrid: document.getElementById('musicTracksGrid'),
            played: document.getElementById('played'),
            winRate: document.getElementById('winRate'),
            currentStreak: document.getElementById('currentStreak'),
            maxStreak: document.getElementById('maxStreak'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            calendarMonthYear: document.getElementById('calendarMonthYear'),
            pastChallengesBtn: document.getElementById('pastChallengesBtn'),
            inkDropsContainer: document.getElementById('inkDropsContainer'),
            inkDropsCount: document.getElementById('inkDropsCount')
        };

        // Validate DOM elements are available

        return elements;
    }

    async init() {
        try {
            console.log('🎮 Starting game initialization...');
            this.startTime = new Date();
            
            console.log('🎨 Initializing PixiJS...');
            await this.initializePixiJS();
            
            console.log('🔊 Initializing sounds...');
            await this.initializeSounds();

            // Initialize Arkadium stub (lightweight version for standalone)
            console.log('🔌 Initializing Arkadium stub...');
            this.arkadium = new ArkadiumIntegration(this);
            console.log('✅ Running in standalone mode with Arkadium stub');

            console.log('⚙️ Loading settings...');
            this.loadSettings();
            
            console.log('💾 Loading user data...');
            await this.loadUserData();

            // Check for shared challenge in URL
            const sharedChallengeLoaded = await this.checkForSharedChallenge();

            // Check for saved current puzzle state
            const savedCurrentPuzzle = await this.loadCurrentPuzzleState();

            if (sharedChallengeLoaded) {
                // Shared challenge takes priority
                console.log('📤 Shared challenge loaded, ignoring saved state');
            } else if (savedCurrentPuzzle) {
                // Restore saved puzzle state
                console.log('🔄 Restoring saved puzzle state:', savedCurrentPuzzle.date);
                await this.loadChallengeForDate(savedCurrentPuzzle.date);
            } else {
                // No saved state, load today's puzzle
                console.log('📅 No saved state found, loading today\'s puzzle');
                this.currentQuote = this.findTodayQuote();
                this.revealedLetters = new Set(); // Clear revealed letters for new puzzle
                this.wordCorrectLetters = {}; // Clear word correct letters for new puzzle
                this.wordValidationState = 'pending'; // Reset validation state for new puzzle

                try {
                    await this.checkQuoteCompletionStatus();
                } catch (error) {
                    console.error('❌ Error checking quote completion status:', error);
                    // Continue with game initialization even if this fails
                }
            }

            console.log('🎨 Rendering quote...');
            this.renderQuote();
            
            console.log('📅 Updating date display...');
            this.updateDateDisplay();
            
            console.log('⌨️ Rendering input area...');
            this.renderInputArea();
            
            console.log('🎯 Setting up event listeners...');
            this.setupEventListeners();

            // Ensure all modals are hidden (using new animation system)
            if (this.elements.calendarModal) {
                this.elements.calendarModal.style.display = 'none';
                this.elements.calendarModal.classList.remove('show');
            }
            if (this.elements.welcomeModal) {
                this.elements.welcomeModal.style.display = 'none';
                this.elements.welcomeModal.classList.remove('show');
            }
            if (this.elements.helpModal) {
                this.elements.helpModal.style.display = 'none';
                this.elements.helpModal.classList.remove('show');
            }
            if (this.elements.statsModal) {
                this.elements.statsModal.style.display = 'none';
                this.elements.statsModal.classList.remove('show');
            }
            if (this.elements.settingsModal) {
                this.elements.settingsModal.style.display = 'none';
                this.elements.settingsModal.classList.remove('show');
            }
            if (this.elements.definitionModal) {
                this.elements.definitionModal.style.display = 'none';
                this.elements.definitionModal.classList.remove('show');
            }

            // Ensure all modals are properly hidden

            // Auto-activate first word only if not already completed
            if (!(await this.isQuoteCompleted()) && this.currentQuote.scrambledWords.length > 0) {
                setTimeout(() => {
                    this.handleWordClick(this.currentQuote.scrambledWords[0], false, false);
                }, 500);
            }

            // Set up audio context and user interaction listeners for background music
            this.setupAudioContext();

            // Check unscramble cooldown status
            this.checkUnscrambleCooldown();

            // Check if this is the first time the player has visited
            this.checkFirstTimeVisit();

            // Update achievements on game load
            this.updateAchievementsOnLoad();

            // Load ink drops currency
            await this.loadInkDrops();

            // Update achievement notification indicators
            this.updateAchievementNotifications();

            // Hide loading screen and show game content - moved to end of successful initialization
            console.log('✅ Game initialization complete, hiding loading screen');
            this.hideLoadingScreen();

        } catch (error) {
            console.error('❌ Critical error during game initialization:', error);
            
            // Always hide loading screen even if there's an error
            this.hideLoadingScreen();

            // Standalone mode - no special environment detection needed

            // Show error message for other environments or if basic initialization fails
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #dc3545;
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;
            errorMessage.innerHTML = `
                <h3>Game Initialization Error</h3>
                <p>There was an error loading the game. Please refresh the page to try again.</p>
                <p style="font-size: 12px; margin-top: 10px;">Error: ${error.message}</p>
                <button onclick="window.location.reload()" style="
                    background: white;
                    color: #dc3545;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Refresh Page</button>
            `;
            document.body.appendChild(errorMessage);

            // Standalone mode - no SDK notification needed
        }
    }

    setupAudioContext() {
        // Create audio context for better audio handling
        try {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Could not create audio context:', error);
        }

        // Add event listeners for user interaction to enable audio
        const enableAudio = this.enableAudioAfterInteraction.bind(this);
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });

        // Also try to start music after a delay (in case user has already interacted)
        setTimeout(() => {
            if (this.backgroundMusicEnabled) {
                this.playBackgroundMusic();
            }
        }, 2000);
    }



    async initializePixiJS() {
        // Temporarily disable PixiJS to avoid visual issues
        // Will be re-enabled when particle effects are implemented
        console.log('PixiJS initialization disabled for now');
        return;

        // Original code commented out for future use:
        /*
        try {
            // Wait a bit for DOM to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Get the game container dimensions
            const gameContainer = document.querySelector('.newspaper-container');
            if (!gameContainer) {
                console.log('Game container not found, skipping PixiJS initialization');
                return;
            }
            
            const containerRect = gameContainer.getBoundingClientRect();
            
            // Ensure we have valid dimensions
            if (containerRect.width === 0 || containerRect.height === 0) {
                console.log('Container has zero dimensions, using fallback size');
                this.pixiApp = new PIXI.Application({
                    width: 800,
                    height: 600,
                    transparent: true,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1
                });
            } else {
                // Create a PixiJS application sized to match the game container
                this.pixiApp = new PIXI.Application({
                    width: containerRect.width,
                    height: containerRect.height,
                    transparent: true,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1
                });
            }
            
            // Create particle container
            this.particleContainer = new PIXI.Container();
            this.pixiApp.stage.addChild(this.particleContainer);
            
            // Position the canvas to overlay the game container
            this.pixiApp.view.style.position = 'absolute';
            this.pixiApp.view.style.top = containerRect.top + 'px';
            this.pixiApp.view.style.left = containerRect.left + 'px';
            this.pixiApp.view.style.pointerEvents = 'none';
            this.pixiApp.view.style.zIndex = '1000';
            
            // Add to body
            document.body.appendChild(this.pixiApp.view);
            
            // Update canvas position on window resize
            window.addEventListener('resize', () => {
                if (this.pixiApp && this.pixiApp.view && gameContainer) {
                    const newRect = gameContainer.getBoundingClientRect();
                    this.pixiApp.view.style.top = newRect.top + 'px';
                    this.pixiApp.view.style.left = newRect.left + 'px';
                }
            });
            
        } catch (error) {
            console.log('PixiJS initialization failed:', error);
        }
        */
    }

    async initializeSounds() {
        const soundFiles = {
            keyType: 'sounds/keytype.mp3',
            wordComplete: 'sounds/word-complete.mp3',
            authorComplete: 'sounds/author-complete.mp3',
            error: 'sounds/error.mp3',
            reset: 'sounds/reset.mp3',
            backspace: 'sounds/backspace.mp3',
            quoteComplete: 'sounds/quote-complete.mp3',
            waterDrop: 'sounds/water-drop.mp3',
            backgroundMusic: 'sounds/background-music.mp3',
            backgroundMusic2: 'sounds/background-music.mp3', // Placeholder for now
            backgroundMusic3: 'sounds/background-music.mp3', // Placeholder for now
            backgroundMusic4: 'sounds/background-music.mp3', // Placeholder for now
            backgroundMusic5: 'sounds/background-music.mp3'  // Placeholder for now
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                const audio = new Audio(path);
                audio.preload = 'auto';

                if (name === 'backgroundMusic') {
                    audio.loop = true;
                    audio.volume = 0.2;
                } else {
                    audio.volume = 0.5;
                }

                audio.addEventListener('error', () => {
                    console.log(`Could not load sound: ${path}`);
                });

                audio.addEventListener('canplaythrough', () => {
                    this.sounds.set(name, audio);
                });

            } catch (error) {
                console.log(`Error loading sound ${name}:`, error);
            }
        }
    }

    playSound(soundName, volume = 0.5) {
        try {
            console.log(`🔊 playSound called: ${soundName}, volume: ${volume}, soundEffectsEnabled: ${this.soundEffectsEnabled}`);
            const audio = this.sounds.get(soundName);
            console.log(`🔊 Audio found for ${soundName}:`, !!audio);

            if (audio && this.soundEffectsEnabled) {
                const audioClone = audio.cloneNode();
                audioClone.volume = volume;
                console.log(`🔊 Playing sound: ${soundName} at volume ${volume}`);
                audioClone.play().catch(e => {
                    console.log(`Could not play sound: ${soundName}`, e);
                });
            } else {
                if (!audio) console.log(`🔊 No audio found for: ${soundName}`);
                if (!this.soundEffectsEnabled) console.log(`🔊 Sound effects disabled`);
            }
        } catch (error) {
            console.log(`Error playing sound ${soundName}:`, error);
        }
    }

    generateTypingSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator.type = 'square';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.log('Could not generate typing sound:', error);
        }
    }

    playTypingSound(isUserAction = true) {
        if (!this.soundEffectsEnabled || !isUserAction) return;

        if (this.sounds.has('keyType')) {
            this.playSound('keyType', 0.3);
        } else {
            this.generateTypingSound();
        }
    }

    playWordCompleteSound() {
        this.playSound('wordComplete', 0.4);
    }

    playAuthorCompleteSound() {
        this.playSound('authorComplete', 0.4);
    }

    playErrorSound() {
        this.playSound('error', 0.4);
    }

    playResetSound() {
        this.playSound('reset', 0.4);
    }

    playBackspaceSound() {
        console.log('🎵 Playing backspace sound...');
        this.playSound('backspace', 0.4);
    }

    playQuoteCompleteSound() {
        this.playSound('quoteComplete', 0.6);
    }

    playBackgroundMusic() {
        try {
            const audio = this.sounds.get(this.currentMusicTrack);
            if (audio && this.backgroundMusicEnabled) {
                if (audio.paused) {
                    audio.currentTime = 0;
                }
                audio.play().catch(e => {
                    console.log('Could not play background music:', e);
                });
            }
        } catch (error) {
            console.log('Error playing background music:', error);
        }
    }

    // Method to enable audio after user interaction
    enableAudioAfterInteraction() {
        // Resume any suspended audio context
        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume();
        }

        // Start background music if enabled
        if (this.backgroundMusicEnabled) {
            setTimeout(() => {
                this.playBackgroundMusic();
            }, 100);
        }

        // Remove the one-time event listeners (they should auto-remove with { once: true })
        console.log('Audio enabled after user interaction');
    }

    pauseBackgroundMusic() {
        try {
            const audio = this.sounds.get(this.currentMusicTrack);
            if (audio) {
                audio.pause();
            }
        } catch (error) {
            console.log('Error pausing background music:', error);
        }
    }

    toggleBackgroundMusic() {
        if (this.backgroundMusicEnabled) {
            const audio = this.sounds.get(this.currentMusicTrack);
            if (audio && audio.paused) {
                this.playBackgroundMusic();
            }
        } else {
            this.pauseBackgroundMusic();
        }
    }

    saveSettings() {
        const settings = {
            soundEffectsEnabled: this.soundEffectsEnabled,
            backgroundMusicEnabled: this.backgroundMusicEnabled
        };
        localStorage.setItem('dailyQuotePuzzleSettings', JSON.stringify(settings));
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('dailyQuotePuzzleSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.soundEffectsEnabled = settings.soundEffectsEnabled !== undefined ? settings.soundEffectsEnabled : true;
                this.backgroundMusicEnabled = settings.backgroundMusicEnabled !== undefined ? settings.backgroundMusicEnabled : true;
            }
        } catch (error) {
            console.log('Could not load settings:', error);
            this.soundEffectsEnabled = true;
            this.backgroundMusicEnabled = true;
        }

        // Update both old and new toggle elements
        if (this.elements.soundEffectsToggle) {
            this.elements.soundEffectsToggle.checked = this.soundEffectsEnabled;
        }
        if (this.elements.backgroundMusicToggle) {
            this.elements.backgroundMusicToggle.checked = this.backgroundMusicEnabled;
        }
        if (this.elements.menuSoundEffectsToggle) {
            this.elements.menuSoundEffectsToggle.checked = this.soundEffectsEnabled;
        }
        if (this.elements.menuBackgroundMusicToggle) {
            this.elements.menuBackgroundMusicToggle.checked = this.backgroundMusicEnabled;
        }
        // Don't auto-start background music due to browser autoplay restrictions
        // this.toggleBackgroundMusic();
    }

    async loadUserData() {
        // Use localStorage for data persistence (Arkadium SDK removed)
        console.log('📂 Loading user data from localStorage...');

        // Load from local storage
        let userData;
        try {
            const legacyData = localStorage.getItem('quotePuzzleUserData');
            userData = legacyData ? JSON.parse(legacyData) : null;
        } catch (error) {
            console.error('❌ Error parsing legacy user data:', error);
            userData = null;
        }

        // Ensure we always return a valid structure
        const defaultUserData = {
            puzzles: {},
            stats: {
                totalSolved: 0,
                currentStreak: 0,
                maxStreak: 0,
                totalTime: 0,
                lastPlayed: null
            },
            achievements: {},
            inkDrops: { count: 0, lastRefresh: null }
        };

        userData = userData || defaultUserData;

        // Ensure all required properties exist
        userData.puzzles = userData.puzzles || {};
        userData.stats = userData.stats || defaultUserData.stats;
        userData.achievements = userData.achievements || {};
        userData.inkDrops = userData.inkDrops || defaultUserData.inkDrops;

        // No migration needed in standalone mode

        // Initialize achievements manager with user data
        this.achievementsManager.initializeFromUserData(userData);

        return userData;
    }

    async saveUserData(userData) {
        // Ensure achievements are synced from achievements manager
        if (this.achievementsManager) {
            userData.achievements = this.achievementsManager.getUserAchievementsData();
            console.log('🏆 Synced achievements to user data:', Object.keys(userData.achievements).length, 'achievements');
        }

        // Save to localStorage (Arkadium SDK removed)
        localStorage.setItem('quotePuzzleUserData', JSON.stringify(userData));
        console.log('💾 User data saved to localStorage');
    }

    async saveCurrentPuzzleState() {
        if (!this.currentQuote) return;

        try {
            const currentState = {
                date: this.currentQuote.date,
                solvedWords: Array.from(this.solvedWords),
                authorSolved: this.authorSolved,
                gameComplete: this.gameComplete,
                activeWord: this.activeWord ? this.activeWord.original : null,
                userInput: this.userInput,
                usedLetters: this.usedLetters,
                hintsUsed: this.hintsUsedThisPuzzle,
                unscrambleLastUsed: this.unscrambleLastUsed,
                timestamp: Date.now()
            };

            // Save to localStorage (Arkadium SDK removed)
            localStorage.setItem('dailyQuotePuzzleCurrentState', JSON.stringify(currentState));
            console.log('💾 Saved current puzzle state:', currentState.date);
        } catch (error) {
            console.error('Error saving current puzzle state:', error);
        }
    }

    async loadCurrentPuzzleState() {
        try {
            let state = null;

            // Load from localStorage (Arkadium SDK removed)
            const stateStr = localStorage.getItem('dailyQuotePuzzleCurrentState');
            if (stateStr) {
                state = JSON.parse(stateStr);
            }

            if (state) {

                // Check if the saved state is from today (if so, don't restore it)
                const today = new Date();
                const todayStr = this.formatDate(today);
                if (state.date === todayStr) {
                    console.log('🗑️ Saved state is from today, clearing it');
                    localStorage.removeItem('dailyQuotePuzzleCurrentState');
                    return null;
                }

                // Check if the saved state is too old (older than 7 days)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const savedDate = new Date(state.date);
                if (savedDate < sevenDaysAgo) {
                    console.log('🗑️ Saved state is too old, clearing it');
                    localStorage.removeItem('dailyQuotePuzzleCurrentState');
                    return null;
                }

                console.log('📂 Found saved puzzle state:', state.date);
                return state;
            }
        } catch (error) {
            console.error('Error loading current puzzle state:', error);
        }

        return null;
    }

    async recordPuzzleCompletion() {
        const userData = await this.loadUserData();

        // Ensure userData has the expected structure
        if (!userData || !userData.puzzles) {
            console.error('❌ Invalid user data structure in recordPuzzleCompletion');
            return;
        }

        const dateStr = this.currentQuote.date;
        this.endTime = new Date();
        this.gameTime = Math.floor((this.endTime - this.startTime) / 1000);

        userData.puzzles[dateStr] = {
            solved: true,
            time: this.gameTime,
            date: dateStr,
            solvedWords: Array.from(this.solvedWords),
            authorSolved: this.authorSolved,
            wordsCompleted: this.solvedWords.size + (this.authorSolved ? 1 : 0),
            hintsUsed: this.hintsUsedThisPuzzle,
            completedAt: new Date().toISOString()
        };

        // Update total solved count
        userData.stats.totalSolved = Object.values(userData.puzzles).filter(p => p.solved).length;

        // Calculate current streak properly
        this.calculateCurrentStreak(userData);

        // Update max streak if current streak is higher
        if (userData.stats.currentStreak > userData.stats.maxStreak) {
            userData.stats.maxStreak = userData.stats.currentStreak;
        }

        // Update total time and recalculate average
        this.updateTotalTimeAndAverage(userData);
        userData.stats.lastPlayed = dateStr;

        // Update achievements
        await this.updateAchievements(userData);

        await this.saveUserData(userData);

        // Clear saved puzzle state when puzzle is completed
        localStorage.removeItem('dailyQuotePuzzleCurrentState');
        console.log('🗑️ Cleared saved puzzle state after completion');
    }

    calculateCurrentStreak(userData) {
        const today = new Date();
        const todayStr = this.formatDate(today);
        let currentStreak = 0;
        let checkDate = new Date(today);

        // Count consecutive days backwards from today
        while (true) {
            const dateStr = this.formatDate(checkDate);
            if (userData.puzzles[dateStr]?.solved) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        userData.stats.currentStreak = currentStreak;
    }

    updateTotalTimeAndAverage(userData) {
        // Calculate total time from all completed puzzles
        const completedPuzzles = Object.values(userData.puzzles).filter(p => p.solved);
        userData.stats.totalTime = completedPuzzles.reduce((total, puzzle) => total + (puzzle.time || 0), 0);
    }

    async updateAchievements(userData) {
        console.log('🏆 updateAchievements called with userData:', userData);

        // Ensure userData has the expected structure
        if (!userData || !userData.puzzles) {
            console.warn('⚠️ Invalid user data structure in updateAchievements');
            return;
        }

        const now = new Date();
        const currentPuzzle = userData.puzzles[this.currentQuote?.date];

        console.log('🏆 Current puzzle data:', currentPuzzle);
        console.log('🏆 Total puzzles completed:', Object.values(userData.puzzles).filter(p => p.solved).length);

        let totalInkDropsReward = 0;

        // Check time-based achievements
        totalInkDropsReward += this.achievementsManager.checkEarlyBird();
        totalInkDropsReward += this.achievementsManager.checkNightOwl();
        totalInkDropsReward += this.achievementsManager.checkWeekendWarrior(userData);

        // Check beginning achievements
        const totalCompleted = Object.values(userData.puzzles).filter(p => p.solved).length;
        totalInkDropsReward += this.achievementsManager.checkBeginningAchievements(totalCompleted);

        // Check quote collector achievements
        totalInkDropsReward += this.achievementsManager.checkQuoteCollector(totalCompleted);

        // Check speed achievements if puzzle was just completed
        if (currentPuzzle && currentPuzzle.solved && currentPuzzle.time) {
            totalInkDropsReward += this.achievementsManager.checkSpeedAchievements(currentPuzzle.time);
            totalInkDropsReward += this.achievementsManager.checkPatientSolver(currentPuzzle.time);
        }

        // Check consistency achievements
        totalInkDropsReward += this.achievementsManager.checkConsistencyAchievements(userData.stats.currentStreak);

        // Calculate total words completed
        let totalWordsCompleted = 0;
        Object.values(userData.puzzles).forEach(puzzle => {
            if (puzzle.solved && puzzle.wordsCompleted) {
                totalWordsCompleted += puzzle.wordsCompleted;
            }
        });
        totalInkDropsReward += this.achievementsManager.checkWordMastery(totalWordsCompleted);

        // Calculate weekly completions for perfect week
        const weekStart = this.getWeekStart(now);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        let weekCompletions = 0;
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
            const dateStr = this.formatDate(d);
            if (userData.puzzles[dateStr]?.solved) {
                weekCompletions++;
            }
        }
        totalInkDropsReward += this.achievementsManager.checkPerfectWeek(weekCompletions);

        // Calculate monthly completions
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let monthCompletions = 0;
        for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
            const dateStr = this.formatDate(d);
            if (userData.puzzles[dateStr]?.solved) {
                monthCompletions++;
            }
        }
        totalInkDropsReward += this.achievementsManager.checkMonthlyMaster(userData.puzzles);

        // Store pending ink drops rewards for collection
        if (totalInkDropsReward > 0) {
            console.log(`🏆 Achievement rewards pending collection: +${totalInkDropsReward} ink drops`);
        }

        // Update user data with achievements
        const achievementsData = this.achievementsManager.getUserAchievementsData();
        userData.achievements = achievementsData;

        console.log('🏆 Updated achievements data:', achievementsData);
        console.log('🏆 Total achievements:', Object.keys(achievementsData).length);
        console.log('🏆 Completed achievements:', Object.values(achievementsData).filter(a => a.completed).length);

        // Show achievement notifications
        this.showAchievementNotifications();

        // Update achievement footer
        this.updateAchievementFooter();

        // Update achievement counter
        this.updateAchievementCounter();

        // Update notification indicators
        this.updateAchievementNotifications();
    }

    showAchievementNotifications() {
        const notifications = this.achievementsManager.getRecentNotifications();

        if (notifications.length === 0) return;

        // Show each achievement notification
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                this.showAchievementNotification(notification);
            }, index * 500); // Stagger notifications by 500ms
        });
    }

    showAchievementNotification(notification) {
        // Remove existing notification if it exists
        const existingNotification = document.querySelector(`[data-notification-id="${notification.id}"]`);
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notificationElement = document.createElement('div');
        notificationElement.className = 'achievement-notification';
        notificationElement.setAttribute('data-notification-id', notification.id);

        notificationElement.innerHTML = `
            <h4>✓ Achievement Unlocked!</h4>
            <p>${notification.name}</p>
        `;

        // Calculate position based on existing notifications
        const existingNotifications = document.querySelectorAll('.achievement-notification');
        const topOffset = 20 + (existingNotifications.length * 120); // 20px from top, 120px spacing between notifications

        notificationElement.style.top = `${topOffset}px`;

        // Add to page
        document.body.appendChild(notificationElement);

        // Show notification
        setTimeout(() => {
            notificationElement.classList.add('show');
        }, 100);

        // Hide and remove after 4 seconds
        setTimeout(() => {
            notificationElement.classList.remove('show');
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.remove();
                }
            }, 300);
        }, 4000);
    }

    showInkDropsRewardNotification(totalReward) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'achievement-notification ink-drops-reward';

        notificationElement.innerHTML = `
            <h4>✓ Ink Drops Added!</h4>
            <p>+${totalReward} ink drops from achievements</p>
        `;

        // Calculate position based on existing notifications
        const existingNotifications = document.querySelectorAll('.achievement-notification');
        const topOffset = 20 + (existingNotifications.length * 120); // 20px from top, 120px spacing between notifications

        notificationElement.style.top = `${topOffset}px`;

        // Add to page
        document.body.appendChild(notificationElement);

        // Show notification
        setTimeout(() => {
            notificationElement.classList.add('show');
        }, 100);

        // Hide and remove after 4 seconds
        setTimeout(() => {
            notificationElement.classList.remove('show');
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.remove();
                }
            }, 300);
        }, 4000);
    }

    showAchievements() {
        const modal = document.getElementById('achievementsModal');
        const grid = document.getElementById('achievementsGrid');

        // Update notification indicators when achievements are shown
        this.updateAchievementNotifications();

        // Clear existing content
        grid.innerHTML = '';

        // Get achievements by category
        const achievementsByCategory = this.achievementsManager.getAchievementsByCategory();

        // Render achievements by category
        Object.keys(achievementsByCategory).forEach(category => {
            const categoryAchievements = achievementsByCategory[category];

            // Create category section
            const categorySection = document.createElement('div');
            categorySection.className = 'achievement-category';
            categorySection.innerHTML = `<h3>${category}</h3>`;

            // Create category grid
            const categoryGrid = document.createElement('div');
            categoryGrid.className = 'achievements-grid';

            // Add achievements to category
            categoryAchievements.forEach(achievement => {
                const card = this.createAchievementCard(achievement);
                categoryGrid.appendChild(card);
            });

            categorySection.appendChild(categoryGrid);
            grid.appendChild(categorySection);
        });

        // Update achievement counter
        this.updateAchievementCounter();

        // Show modal
        this.showModal(modal);
    }

    createAchievementCard(achievement) {
        const card = document.createElement('div');
        const isCompleted = achievement.progress ? achievement.progress.completed : false;

        // Debug logging for progress issues
        if (!achievement.progress) {
            console.warn(`⚠️ No progress data for achievement: ${achievement.id}`, achievement);
        }

        // Get the user achievement data to check pending rewards
        const userAchievement = this.achievementsManager.userAchievements[achievement.id];
        const hasPendingReward = isCompleted && userAchievement && userAchievement.pendingInkDrops && !userAchievement.rewardCollected;
        const isRewardCollected = isCompleted && userAchievement && userAchievement.rewardCollected;

        // Debug logging for reward collection issues
        if (isCompleted && userAchievement) {
            console.log(`🏆 Achievement ${achievement.id}:`, {
                completed: isCompleted,
                pendingInkDrops: userAchievement.pendingInkDrops,
                rewardCollected: userAchievement.rewardCollected,
                hasPendingReward: hasPendingReward
            });
        }

        // Add classes based on completion and collection status
        let cardClasses = 'achievement-card';
        if (isCompleted) cardClasses += ' completed';
        if (isRewardCollected) cardClasses += ' reward-collected';

        card.className = cardClasses;

        card.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
            <div class="achievement-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${achievement.progress ? (achievement.progress.progress * 100) : 0}%"></div>
                </div>
                <div class="progress-text">
                    <span>${achievement.progress ? achievement.progress.current : 0}</span>
                    <span>/</span>
                    <span>${achievement.progress ? achievement.progress.target : achievement.requirement}</span>
                </div>
            </div>
            <div class="achievement-reward">
                <span class="ink-drops-reward ${userAchievement && userAchievement.rewardCollected ? 'collected' : ''}">Reward: <span class="ink-drop-icon">💧</span> +${achievement.inkDropsReward}</span>
                ${hasPendingReward ? `<button class="collect-reward-btn" data-achievement-id="${achievement.id}">Collect</button>` : ''}
            </div>
        `;

        // Add click handler for collect button
        if (hasPendingReward) {
            const collectBtn = card.querySelector('.collect-reward-btn');
            if (collectBtn) {
                console.log(`🎁 Adding click handler for achievement: ${achievement.id}`);
                collectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🎁 Collect button clicked for achievement: ${achievement.id}`);
                    this.collectAchievementReward(achievement.id);
                });
            } else {
                console.error(`🎁 Collect button not found for achievement: ${achievement.id}`);
            }
        }

        return card;
    }

    async collectAchievementReward(achievementId) {
        console.log(`🎁 collectAchievementReward called for: ${achievementId}`);
        try {
            const userData = await this.loadUserData();
            // Use the achievements manager's user achievements data
            const userAchievement = this.achievementsManager.userAchievements[achievementId];
            console.log(`🎁 User achievement data:`, userAchievement);

            if (userAchievement && userAchievement.completed && userAchievement.pendingInkDrops && !userAchievement.rewardCollected) {
                const inkDropsReward = userAchievement.pendingInkDrops;

                console.log(`🎁 Before collection - Current ink drops: ${this.inkDrops}, Reward: +${inkDropsReward}, Max: ${this.maxInkDrops}`);

                // Add ink drops to player's count
                this.inkDrops = Math.min(this.inkDrops + inkDropsReward, this.maxInkDrops);

                console.log(`🎁 After collection - New ink drops total: ${this.inkDrops}`);

                // Also update the user data to ensure consistency
                if (!userData.inkDrops) {
                    userData.inkDrops = {};
                }
                userData.inkDrops.count = this.inkDrops;

                // Update the display
                this.updateInkDropsDisplay();

                // Mark reward as collected in achievements manager
                userAchievement.rewardCollected = true;
                userAchievement.pendingInkDrops = 0;

                // Update user data with achievements manager data
                userData.achievements = this.achievementsManager.getUserAchievementsData();

                // Save the updated data
                await this.saveUserData(userData);
                await this.saveInkDrops();

                // Play word complete sound for reward collection
                this.playWordCompleteSound();

                // Show success notification
                this.showInkDropsRewardNotification(inkDropsReward);

                // Find the achievement card and add the reward-collected class for animation
                const achievementCards = document.querySelectorAll('.achievement-card');
                achievementCards.forEach(card => {
                    const cardAchievementId = card.querySelector('.collect-reward-btn')?.getAttribute('data-achievement-id');
                    if (cardAchievementId === achievementId) {
                        card.classList.add('reward-collected');
                    }
                });

                // Refresh achievements display to update the collect button
                this.showAchievements();

                console.log(`🎁 Achievement reward collected: +${inkDropsReward} ink drops`);
                console.log(`🎁 New ink drops total: ${this.inkDrops}`);
                console.log(`🎁 User data ink drops: ${userData.inkDrops.count}`);
            }
        } catch (error) {
            console.error('Error collecting achievement reward:', error);
        }
    }

    // Debug function to fix achievement reward collection issues
    debugFixAchievementRewards() {
        console.log('🔧 Debug: Fixing achievement reward collection issues...');
        this.achievementsManager.fixRewardCollectionIssues();
        this.saveUserData(this.loadUserData());
        this.showAchievements(); // Refresh the display
        console.log('✅ Debug: Achievement rewards fixed and display refreshed');
    }

    // Update achievement notification indicators
    updateAchievementNotifications() {
        try {
            const hamburgerNotification = document.getElementById('hamburgerNotification');
            const achievementsNotification = document.getElementById('achievementsNotification');

            if (!hamburgerNotification || !achievementsNotification) return;

            // Count uncollected rewards
            let uncollectedCount = 0;
            Object.values(this.achievementsManager.userAchievements).forEach(achievement => {
                if (achievement.completed && achievement.pendingInkDrops && !achievement.rewardCollected) {
                    uncollectedCount++;
                }
            });

            // Show/hide notification dots and update count
            if (uncollectedCount > 0) {
                hamburgerNotification.style.display = 'flex';
                achievementsNotification.style.display = 'flex';

                // Update the count text
                hamburgerNotification.textContent = uncollectedCount;
                achievementsNotification.textContent = uncollectedCount;
            } else {
                hamburgerNotification.style.display = 'none';
                achievementsNotification.style.display = 'none';
            }

            console.log(`🔔 Achievement notifications: ${uncollectedCount > 0 ? 'SHOWING' : 'HIDING'} (uncollected rewards: ${uncollectedCount})`);
        } catch (error) {
            console.error('Error updating achievement notifications:', error);
        }
    }

    async updateStatsDisplay() {
        const userData = await this.loadUserData();

        // Recalculate streak and time to ensure accuracy
        this.calculateCurrentStreak(userData);
        this.updateTotalTimeAndAverage(userData);

        const stats = userData.stats;
        const totalPlayed = Object.keys(userData.puzzles).length;
        const winRate = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;

        this.elements.played.textContent = totalPlayed;
        this.elements.winRate.textContent = `${winRate}%`;
        this.elements.currentStreak.textContent = stats.currentStreak;
        this.elements.maxStreak.textContent = stats.maxStreak;
    }

    async updateCongratsStats() {
        const userData = await this.loadUserData();

        // Recalculate streak and time to ensure accuracy
        this.calculateCurrentStreak(userData);
        this.updateTotalTimeAndAverage(userData);

        const stats = userData.stats;
        const totalPlayed = Object.keys(userData.puzzles).length;
        const winRate = totalPlayed > 0 ? Math.round((stats.totalSolved / totalPlayed) * 100) : 0;

        document.getElementById('congratsPlayed').textContent = totalPlayed;
        document.getElementById('congratsWinRate').textContent = `${winRate}%`;
        document.getElementById('congratsCurrentStreak').textContent = stats.currentStreak;
        document.getElementById('congratsMaxStreak').textContent = stats.maxStreak;
    }

    updateDateDisplay() {
        // Only update date display if the element exists
        if (this.elements.dateLine) {
            const date = new Date(this.currentQuote.date);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            this.elements.dateLine.textContent = date.toLocaleDateString('en-US', options);
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    findTodayQuote() {
        const today = new Date();
        const todayStr = this.formatDate(today);

        console.log('🔍 findTodayQuote() called');
        console.log('📅 Today:', todayStr);

        // Use quote manager to get today's quote (checks remote first, then local)
        const todayQuote = this.quoteManager.getQuoteForDate(todayStr);

        if (todayQuote) {
            console.log(`✅ Found today's quote for ${todayStr}: "${todayQuote.text}"`);
            return this.processQuoteForGame(todayQuote);
        } else {
            console.log(`❌ No quote found for today (${todayStr}), using first quote as fallback`);
            return this.processQuoteForGame(this.quotes[0]);
        }
    }

    processQuoteForGame(quote) {
        if (!quote || !quote.text || !quote.author) {
            console.error('Invalid quote object:', quote);
            return quote;
        }

        // If the quote already has scrambledWords, it's already processed
        if (quote.scrambledWords && quote.scrambledAuthor) {
            return quote;
        }

        console.log('🔄 Processing quote for game:', quote.text);

        const words = quote.text.split(' ');
        const scrambledWords = [];

        // Process words that need to be scrambled based on wordIndices
        if (quote.wordIndices && Array.isArray(quote.wordIndices)) {
            quote.wordIndices.forEach(index => {
                if (index >= 0 && index < words.length) {
                    const originalWordWithPunctuation = words[index];

                    // Check if word contains apostrophes - if so, don't scramble it
                    if (originalWordWithPunctuation.includes("'")) {
                        // Don't scramble words with apostrophes
                        scrambledWords.push({
                            original: originalWordWithPunctuation,
                            originalWordOnly: originalWordWithPunctuation,
                            scrambled: originalWordWithPunctuation, // Keep original
                            punctuation: '',
                            index: index
                        });
                    } else {
                        // Separate the word from its punctuation
                        // Updated regex to handle ? and ! followed by , . or ; as separate punctuation
                        const wordMatch = originalWordWithPunctuation.match(/^([a-zA-Z]+(?:'[a-zA-Z]+)*)([?!][,.;]?|[,.;]|[^a-zA-Z]*)$/);
                        if (wordMatch) {
                            const wordOnly = wordMatch[1];
                            const punctuation = wordMatch[2] || '';

                            // Only scramble the word part, completely exclude punctuation
                            const scrambledWordOnly = scrambleWord(wordOnly);

                            scrambledWords.push({
                                original: originalWordWithPunctuation,
                                originalWordOnly: wordOnly,
                                scrambled: scrambledWordOnly, // Only the word part, no punctuation
                                punctuation: punctuation,
                                index: index
                            });
                        } else {
                            // If no letters found, don't scramble (handles pure punctuation)
                            scrambledWords.push({
                                original: originalWordWithPunctuation,
                                originalWordOnly: '',
                                scrambled: '',
                                punctuation: originalWordWithPunctuation,
                                index: index
                            });
                        }
                    }
                }
            });
        }

        // Create the processed quote object
        const processedQuote = {
            ...quote,
            scrambledWords: scrambledWords,
            scrambledAuthor: scrambleAuthor(quote.author)
        };

        return processedQuote;
    }

    toTitleCase(str) {
        return str.split(' ').map(word => {
            if (!word) return word;

            // Handle single initials (like "T." or "S.")
            if (word.length <= 2 && word.endsWith('.')) {
                return word.toUpperCase();
            }

            // Handle regular words
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }).join(' ');
    }

    getProperCapitalization(word, index, allWords) {
        const lowerWord = word.toLowerCase();

        if (index === 0) {
            return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        }

        if (index > 0) {
            const prevWord = allWords[index - 1];
            if (prevWord && /[.!?]$/.test(prevWord.trim())) {
                return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
            }
        }

        const properNouns = [
            'jobs', 'steve', 'lennon', 'john', 'wilde', 'oscar', 'roosevelt', 'eleanor',
            'disney', 'walt', 'mandela', 'nelson', 'einstein', 'albert', 'gandhi', 'mahatma',
            'luther', 'martin', 'king', 'teresa', 'mother', 'ford', 'henry', 'edison', 'thomas',
            'curie', 'marie', 'lincoln', 'abraham', 'washington', 'george', 'jefferson', 'thomas',
            'franklin', 'benjamin', 'churchill', 'winston', 'kennedy', 'john', 'reagan', 'ronald',
            'obama', 'barack', 'clinton', 'bill', 'bush', 'george', 'carter', 'jimmy',
            'america', 'american', 'united', 'states', 'england', 'britain', 'france', 'germany',
            'italy', 'spain', 'russia', 'china', 'japan', 'india', 'africa', 'europe', 'asia',
            'australia', 'canada', 'mexico', 'brazil', 'argentina', 'egypt', 'israel', 'turkey',
            'greece', 'poland', 'sweden', 'norway', 'denmark', 'finland', 'ireland', 'scotland',
            'wales', 'london', 'paris', 'berlin', 'rome', 'madrid', 'moscow', 'beijing', 'tokyo',
            'delhi', 'mumbai', 'sydney', 'toronto', 'montreal', 'vancouver', 'new', 'york',
            'los', 'angeles', 'chicago', 'houston', 'philadelphia', 'phoenix', 'san', 'antonio',
            'diego', 'dallas', 'jose', 'austin', 'jacksonville', 'francisco', 'columbus',
            'charlotte', 'fort', 'worth', 'indianapolis', 'seattle', 'denver', 'washington',
            'boston', 'nashville', 'baltimore', 'oklahoma', 'portland', 'vegas', 'louisville',
            'milwaukee', 'albuquerque', 'tucson', 'fresno', 'sacramento', 'mesa', 'kansas',
            'atlanta', 'long', 'beach', 'colorado', 'springs', 'raleigh', 'omaha', 'miami',
            'oakland', 'minneapolis', 'tulsa', 'cleveland', 'wichita', 'arlington',
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
            'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
            'september', 'october', 'november', 'december',
            'god', 'lord', 'jesus', 'christ', 'buddha', 'allah', 'christmas', 'easter',
            'thanksgiving', 'halloween', 'valentine', 'patrick', 'internet', 'facebook',
            'google', 'apple', 'microsoft', 'amazon', 'twitter', 'instagram', 'youtube',
            'netflix', 'disney', 'marvel', 'dc', 'batman', 'superman', 'spiderman'
        ];

        if (properNouns.includes(lowerWord)) {
            return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
        }

        if (lowerWord === 'i') {
            return 'I';
        }

        return lowerWord;
    }

    renderQuote() {
        const words = this.currentQuote.text.split(' ');
        let html = '';

        // If game is complete (viewing a completed puzzle), show all words as solved
        if (this.gameComplete) {
            words.forEach((word, index) => {
                const displayWord = this.getProperCapitalization(word, index, words);
                html += `<span class="quote-word">${displayWord}</span> `;
            });
        } else {
            // Normal game logic for active puzzles
            words.forEach((word, index) => {
                const scrambledWord = this.currentQuote.scrambledWords.find(sw => sw.index === index);
                const isSolved = scrambledWord && this.solvedWords.has(scrambledWord.original);

                if (scrambledWord && !isSolved) {
                    const isActive = this.activeWord && this.activeWord.original === scrambledWord.original;

                    // For unsolved words, show asterisks instead of scrambled letters
                    // But show correctly guessed letters if we have them
                    // And show revealed letters if we have them
                    let displayText = '';

                    // Get the correctly guessed letters for this word if any
                    const correctLetters = this.getCorrectLettersForWord(scrambledWord);

                    // Get revealed letters
                    const revealedLetters = this.getRevealedLetters();

                    if (correctLetters && correctLetters.length > 0) {
                        // Show correct letters, revealed letters, asterisks for the rest
                        const wordOnly = scrambledWord.originalWordOnly || scrambledWord.original;
                        displayText = wordOnly.split('').map((letter, i) => {
                            // Check if we have a correct letter at this position
                            const correctLetter = correctLetters.find(cl => cl.position === i);
                            if (correctLetter) {
                                return correctLetter.letter;
                            }
                            // Check if this letter has been revealed
                            if (revealedLetters.has(letter.toLowerCase())) {
                                return letter.toLowerCase();
                            }
                            return '*';
                        }).join('');
                    } else {
                        // Show revealed letters or asterisks
                        const wordOnly = scrambledWord.originalWordOnly || scrambledWord.original;
                        displayText = wordOnly.split('').map(letter => {
                            if (revealedLetters.has(letter.toLowerCase())) {
                                return letter.toLowerCase();
                            }
                            return '*';
                        }).join('');
                    }

                    // Display word with asterisks and punctuation separately
                    const scrambledWordSpan = `<span class="quote-word scrambled ${isActive ? 'active' : ''}"
                                data-word-index="${index}">${displayText}</span>`;
                    const punctuationSpan = scrambledWord.punctuation ? `<span class="quote-punctuation">${scrambledWord.punctuation}</span>` : '';
                    html += `${scrambledWordSpan}${punctuationSpan} `;
                } else {
                    if (isSolved && scrambledWord) {
                        // For solved words, display the word-only part with proper capitalization
                        const displayWord = this.getProperCapitalization(scrambledWord.originalWordOnly, index, words);
                        const wordSpan = `<span class="quote-word">${displayWord}</span>`;
                        const punctuationSpan = scrambledWord.punctuation ? `<span class="quote-punctuation">${scrambledWord.punctuation}</span>` : '';
                        html += `${wordSpan}${punctuationSpan} `;
                    } else {
                        const displayWord = this.getProperCapitalization(word, index, words);
                        html += `<span class="quote-word">${displayWord}</span> `;
                    }
                }
            });
        }

        // Set the quote content without manual quotation marks (handled by CSS)
        this.elements.quoteText.innerHTML = html.trim();

        // Only add click handlers if game is not complete
        if (!this.gameComplete) {
            document.querySelectorAll('.quote-word.scrambled').forEach(el => {
                this.addMobileTouchHandling(el, () => this.handleWordClick(
                    this.currentQuote.scrambledWords.find(sw => sw.index === parseInt(el.dataset.wordIndex)),
                    true,
                    true
                ));
            });
        }

        // Handle author display
        if (this.authorSolved || this.gameComplete) {
            this.elements.quoteAuthor.textContent = `- ${this.currentQuote.author}`;
            this.elements.quoteAuthor.className = 'author';
        } else {
            const isActive = this.activeWord && this.activeWord.isAuthor;
            // Display scrambled author with gaps between words (in lowercase)
            // For author, we'll show asterisks for each letter
            const authorWords = this.currentQuote.author.split(' ');

            // Get correctly guessed letters for the author if any
            const correctLetters = this.wordCorrectLetters ? this.wordCorrectLetters['author'] : [];

            // Get revealed letters
            const revealedLetters = this.getRevealedLetters();

            // Create display text for each word
            const displayWords = authorWords.map(word => {
                if (correctLetters && correctLetters.length > 0) {
                    // Show correct letters, revealed letters, asterisks for the rest
                    // We need to calculate the position within the entire author string
                    let authorIndex = 0;
                    // Find the starting position of this word in the full author string
                    for (let w of authorWords) {
                        if (w === word) break;
                        authorIndex += w.length + 1; // +1 for space
                    }

                    return word.split('').map((letter, i) => {
                        // Check if we have a correct letter at this position
                        // The position in the correctLetters array is the position in the full author string
                        const positionInAuthor = authorIndex + i;
                        const correctLetter = correctLetters.find(cl => cl.position === positionInAuthor);
                        if (correctLetter) {
                            return correctLetter.letter;
                        }
                        // Check if this letter has been revealed
                        if (revealedLetters.has(letter.toLowerCase())) {
                            return letter.toLowerCase();
                        }
                        return '*';
                    }).join('');
                } else {
                    // Show revealed letters or asterisks
                    return word.split('').map(letter => {
                        if (revealedLetters.has(letter.toLowerCase())) {
                            return letter.toLowerCase();
                        }
                        return '*';
                    }).join('');
                }
            });

            const asteriskWords = displayWords.join('   '); // One asterisk per letter with gaps
            this.elements.quoteAuthor.innerHTML = `- <span class="author scrambled ${isActive ? 'active' : ''}"
                                                        id="authorScrambled">${asteriskWords}</span>`;
            const authorElement = document.getElementById('authorScrambled');
            if (authorElement) {
                this.addMobileTouchHandling(authorElement, () => this.handleAuthorClick(true, true));
            }
        }
    }

    handleWordClick(wordData, isUserClick = true, resetInput = true) {
        if (this.solvedWords.has(wordData.original) || this.isUnscrambling) return;

        // Debug logging
        console.log('🔊 handleWordClick called, isUserClick:', isUserClick, 'resetInput:', resetInput);

        // Only play keytype sound for user-initiated clicks
        if (isUserClick) {
            this.playSound('keyType', 0.4);
        }

        // Notify game start on first interaction (if not already started)
        this.notifyGameStartIfNeeded();

        // Reset current input before switching to new word
        if (resetInput) {
            this.resetInput();
        }

        document.querySelectorAll('.quote-word.active').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.author.active').forEach(el => {
            el.classList.remove('active');
        });

        const wordElements = document.querySelectorAll('.quote-word');
        const targetWordEl = Array.from(wordElements).find(el =>
            el.dataset.wordIndex == wordData.index
        );
        if (targetWordEl) {
            targetWordEl.classList.add('active');
        }

        this.activeWord = {
            ...wordData,
            originalWordOnly: wordData.originalWordOnly || wordData.original
        };
        this.userInput = '';
        // Only use the scrambled word part, exclude punctuation from available letters
        this.availableLetters = wordData.scrambled.split('');
        this.usedLetters = [];

        this.renderInputArea();
    }

    handleAuthorClick(isUserClick = true, resetInput = true) {
        if (this.authorSolved || this.isUnscrambling) return;

        // Debug logging
        console.log('🔊 handleAuthorClick called, isUserClick:', isUserClick, 'resetInput:', resetInput);

        // Only play keytype sound for user-initiated clicks
        if (isUserClick) {
            this.playSound('keyType', 0.4);
        }

        // Reset current input before switching to new word
        if (resetInput) {
            this.resetInput();
        }

        document.querySelectorAll('.quote-word.active').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.author.active').forEach(el => {
            el.classList.remove('active');
        });

        const authorEl = document.querySelector('.author.scrambled');
        if (authorEl) {
            authorEl.classList.add('active');
        }

        this.activeWord = {
            original: this.currentQuote.author.toLowerCase(),
            scrambled: this.currentQuote.scrambledAuthor,
            isAuthor: true
        };

        this.userInput = '';
        this.letterFeedback = []; // Initialize letter feedback for new word
        // For authors, keep all letters together without spaces and track word structure
        this.availableLetters = this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('');
        this.authorWordStructure = this.currentQuote.author.split(' ').map(word => word.length);
        this.usedLetters = [];

        this.renderInputArea();
    }

    renderInputArea() {
        if (!this.activeWord) {
            if (this.solvedWords.size === this.currentQuote.scrambledWords.length && this.authorSolved) {
                this.elements.inputArea.classList.remove('show');
                return;
            }

            const firstWord = this.currentQuote.scrambledWords.find(word => !this.solvedWords.has(word.original));
            if (firstWord) {
                setTimeout(() => this.handleWordClick(firstWord, false, false), 100);
            } else if (!this.authorSolved) {
                setTimeout(() => this.handleAuthorClick(false, false), 100);
            }
            return;
        }

        if (this.elements.inputArea) {
            this.elements.inputArea.classList.add('show');
        }

        // Use the word-only length (without punctuation) for input cells
        const targetLength = this.activeWord.originalWordOnly ? this.activeWord.originalWordOnly.length : this.activeWord.original.length;
        if (this.elements.letterCells) {
            this.elements.letterCells.innerHTML = '';
        }

        if (this.activeWord.isAuthor && this.authorWordStructure) {
            // For authors, create word containers that keep letters together
            let userInputIndex = 0;

            this.authorWordStructure.forEach((wordLength, wordIndex) => {
                // Create a container for this word
                const wordContainer = document.createElement('div');
                wordContainer.className = 'author-word-container';
                wordContainer.style.display = 'flex';
                wordContainer.style.flexWrap = 'nowrap';
                wordContainer.style.gap = '12px';
                wordContainer.style.alignItems = 'center';

                // Add cells for this word
                for (let i = 0; i < wordLength; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'letter-cell';
                    
                    // Check if user has typed a letter here
                    const userLetter = this.userInput[userInputIndex] || '';
                    
                    // Check if this position should show a ghost letter (revealed but not typed)
                    // For author, we need to map back to the original author text
                    const authorWords = this.currentQuote.author.split(' ');
                    const targetLetter = authorWords[wordIndex][i];
                    const revealedLetters = this.getRevealedLetters();
                    
                    // Also check if this letter was correctly guessed in the author
                    const correctLetters = this.wordCorrectLetters ? this.wordCorrectLetters['author'] : [];
                    const hasCorrectLetter = correctLetters && correctLetters.some(cl => cl.position === userInputIndex);
                    
                    const shouldShowGhost = !userLetter && targetLetter && (revealedLetters.has(targetLetter.toLowerCase()) || hasCorrectLetter);
                    
                    if (shouldShowGhost) {
                        // Show ghost letter
                        cell.textContent = targetLetter.toLowerCase();
                        cell.style.color = '#ccc';
                        cell.style.fontStyle = 'italic';
                        cell.classList.add('ghost-letter');
                    } else {
                        // Show user input or empty
                        cell.textContent = userLetter.toLowerCase();
                        cell.style.color = '#000000';
                        cell.style.fontStyle = 'normal';
                        cell.classList.remove('ghost-letter');
                    }

                    // Apply Wordle-like feedback colors if available
                    if (this.letterFeedback && this.letterFeedback[userInputIndex]) {
                        const feedback = this.letterFeedback[userInputIndex];
                        switch (feedback.status) {
                            case 'correct': // Green
                                cell.style.backgroundColor = '#538d4e';
                                cell.style.color = 'white';
                                break;
                            case 'present': // Yellow
                                cell.style.backgroundColor = '#b59f3b';
                                cell.style.color = 'white';
                                break;
                            case 'absent': // Grey
                                cell.style.backgroundColor = '#3a3a3c';
                                cell.style.color = 'white';
                                break;
                            default:
                                // Default styling for non-ghost letters
                                if (!shouldShowGhost) {
                                    cell.style.backgroundColor = '#ffffff';
                                    cell.style.color = '#000000';
                                }
                        }
                    }

                    wordContainer.appendChild(cell);
                    userInputIndex++;
                }

                // Add gap after each word except the last
                if (wordIndex < this.authorWordStructure.length - 1) {
                    const gapCell = document.createElement('div');
                    gapCell.className = 'author-gap';
                    gapCell.style.width = '30px';
                    gapCell.style.height = '50px';
                    gapCell.style.display = 'flex';
                    gapCell.style.alignItems = 'center';
                    gapCell.style.justifyContent = 'center';
                    // Add visual indicator for word separation
                    gapCell.innerHTML = '<div style="width: 2px; height: 20px; background: #ddd;"></div>';
                    wordContainer.appendChild(gapCell);
                }

                this.elements.letterCells.appendChild(wordContainer);
            });
        } else {
            // For regular words, create normal input boxes
            for (let i = 0; i < targetLength; i++) {
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                
                // Check if user has typed a letter here
                const userLetter = this.userInput[i] || '';
                
                // Check if this position should show a ghost letter (revealed but not typed)
                const targetWord = this.activeWord.originalWordOnly || this.activeWord.original;
                const targetLetter = targetWord[i];
                const revealedLetters = this.getRevealedLetters();
                
                // Also check if this letter was correctly guessed in this word
                const correctLetters = this.getCorrectLettersForWord(this.activeWord);
                const hasCorrectLetter = correctLetters && correctLetters.some(cl => cl.position === i);
                
                const shouldShowGhost = !userLetter && targetLetter && (revealedLetters.has(targetLetter.toLowerCase()) || hasCorrectLetter);
                
                if (shouldShowGhost) {
                    // Show ghost letter
                    cell.textContent = targetLetter.toLowerCase();
                    cell.style.color = '#ccc';
                    cell.style.fontStyle = 'italic';
                    cell.classList.add('ghost-letter');
                } else {
                    // Show user input or empty
                    cell.textContent = userLetter.toLowerCase();
                    cell.style.color = '#000000';
                    cell.style.fontStyle = 'normal';
                    cell.classList.remove('ghost-letter');
                }

                // Apply Wordle-like feedback colors if available
                if (this.letterFeedback && this.letterFeedback[i]) {
                    const feedback = this.letterFeedback[i];
                    switch (feedback.status) {
                        case 'correct': // Green
                            cell.style.backgroundColor = '#538d4e';
                            cell.style.color = 'white';
                            break;
                        case 'present': // Yellow
                            cell.style.backgroundColor = '#b59f3b';
                            cell.style.color = 'white';
                            break;
                        case 'absent': // Grey
                            cell.style.backgroundColor = '#3a3a3c';
                            cell.style.color = 'white';
                            break;
                        default:
                            // Default styling for non-ghost letters
                            if (!shouldShowGhost) {
                                cell.style.backgroundColor = '#ffffff';
                                cell.style.color = '#000000';
                            }
                    }
                }

                this.elements.letterCells.appendChild(cell);
            }
        }

        this.elements.availableLetters.innerHTML = '';

        // Collect all letters from the entire puzzle (both solved and unsolved words)
        const allLetterCounts = {};

        // Add letters from all regular words (solved and unsolved)
        this.currentQuote.scrambledWords.forEach(word => {
            word.scrambled.split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                allLetterCounts[lowerLetter] = (allLetterCounts[lowerLetter] || 0) + 1;
            });
        });

        // Add letters from author if it exists
        if (this.currentQuote.scrambledAuthor) {
            // For author, we need to remove spaces and add all letters
            this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                allLetterCounts[lowerLetter] = (allLetterCounts[lowerLetter] || 0) + 1;
            });
        }

        // Initialize global letter pool if not already done
        if (!this.globalLetterPool) {
            this.globalLetterPool = { ...allLetterCounts };
        }

        // Create buttons for unique letters with counts, maintaining consistent order
        // Sort letters alphabetically to prevent "rescrambling" effect
        Object.keys(allLetterCounts).sort().forEach(letter => {
            const btn = document.createElement('div');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.dataset.letter = letter;

            // Use the actual available count from global pool
            const availableCount = this.globalLetterPool[letter] || 0;

            // Add count indicator similar to achievement notifications
            if (availableCount > 1) {
                const countIndicator = document.createElement('div');
                countIndicator.className = 'notification-dot';
                countIndicator.textContent = availableCount;
                countIndicator.style.position = 'absolute';
                countIndicator.style.top = '-8px';
                countIndicator.style.right = '-8px';
                countIndicator.style.background = '#000000';
                countIndicator.style.color = 'white';
                countIndicator.style.borderRadius = '50%';
                countIndicator.style.width = '20px';
                countIndicator.style.height = '20px';
                countIndicator.style.display = 'flex';
                countIndicator.style.alignItems = 'center';
                countIndicator.style.justifyContent = 'center';
                countIndicator.style.fontSize = '12px';
                countIndicator.style.fontWeight = 'bold';
                btn.style.position = 'relative';
                btn.appendChild(countIndicator);
            } else if (availableCount === 0) {
                // If no letters available, grey out the button
                btn.style.opacity = '1';
                btn.style.backgroundColor = '#e0e0e0';
                btn.style.color = '#999';
                btn.style.pointerEvents = 'none';
                btn.style.cursor = 'not-allowed';
            }

            // Allow player to use any letter on any word (don't disable letters)
            // Enhanced mobile touch handling for all letters
            this.addMobileTouchHandling(btn, () => {
                this.handleGlobalLetterClick(letter);
            });

            this.elements.availableLetters.appendChild(btn);
        });

        // Update definition button state
        if (this.elements.definitionBtn) {
            if (this.activeWord && !this.activeWord.isAuthor) {
                // Enable definition button for regular words
                this.elements.definitionBtn.disabled = false;
                this.elements.definitionBtn.style.opacity = '1';
            } else {
                // Disable definition button for author or when no word is active
                this.elements.definitionBtn.disabled = true;
                this.elements.definitionBtn.style.opacity = '0.5';
            }
        }
    }

    // Add mobile-specific touch handling
    addMobileTouchHandling(element, callback) {
        let touchStartTime = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        let isTouchMoved = false;

        // Handle both click and touch events for better mobile responsiveness
        const handleInteraction = (event) => {
            // Prevent default behavior to avoid double-triggering
            event.preventDefault();
            event.stopPropagation();

            // Add visual feedback
            element.style.transform = 'scale(0.95)';
            element.style.background = '#d0d0d0';

            // Execute callback after a short delay for better visual feedback
            setTimeout(() => {
                callback();
                // Reset visual state
                element.style.transform = '';
                element.style.background = '';
            }, 50);
        };

        // Touch event handling for mobile
        element.addEventListener('touchstart', (event) => {
            touchStartTime = Date.now();
            touchStartY = event.touches[0].clientY;
            touchStartX = event.touches[0].clientX;
            isTouchMoved = false;

            // Prevent zoom on double tap
            event.preventDefault();
        }, { passive: false });

        element.addEventListener('touchmove', (event) => {
            const touchY = event.touches[0].clientY;
            const touchX = event.touches[0].clientX;
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);

            // If touch moved significantly, mark as moved
            if (deltaY > 10 || deltaX > 10) {
                isTouchMoved = true;
            }
        });

        element.addEventListener('touchend', (event) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            // Only trigger if touch was short and didn't move much
            if (touchDuration < 300 && !isTouchMoved) {
                handleInteraction(event);
            }
        });

        // Mouse click handling for desktop
        element.addEventListener('click', (event) => {
            // Only handle mouse clicks if not on a touch device
            if (!('ontouchstart' in window)) {
                handleInteraction(event);
            }
        });

        // Prevent context menu on long press
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    handleLetterClick(letter, index) {
        if (this.isUnscrambling) return;

        // Check if word is complete (either correct or incorrect)
        const targetLength = this.activeWord.isAuthor ?
            this.activeWord.original.replace(/\s/g, '').length :
            (this.activeWord.originalWordOnly ? this.activeWord.originalWordOnly.length : this.activeWord.original.length);

        const isWordComplete = (this.wordValidationState === 'incorrect' || this.wordValidationState === 'correct') &&
            this.userInput.length === targetLength;

        // If word is complete (correct or incorrect), play error sound and do nothing
        if (isWordComplete) {
            this.playErrorSound();
            return;
        }

        // Notify game start on first interaction (if not already started)
        this.notifyGameStartIfNeeded();

        // Check if we have this letter available in our global pool
        const lowerLetter = letter.toLowerCase();
        if (!this.globalLetterPool || !this.globalLetterPool[lowerLetter] || this.globalLetterPool[lowerLetter] <= 0) {
            // No letter available, play error sound
            this.playErrorSound();
            return;
        }

        // Add letter to input - we no longer check if it's in availableLetters
        this.userInput += letter;

        // Remove the letter from the global pool
        this.globalLetterPool[lowerLetter] = (this.globalLetterPool[lowerLetter] || 0) - 1;

        // For Wordle-like feedback, we need to track correctness of each position
        if (!this.letterFeedback) {
            this.letterFeedback = [];
        }

        // Add placeholder feedback for this letter position
        this.letterFeedback.push({
            letter: letter.toLowerCase(),
            status: 'pending' // Will be updated when we validate
        });

        this.playTypingSound(true);
        this.renderInputArea();

        // Save current state after each letter click
        this.saveCurrentPuzzleState();

        // For authors, check against length without spaces
        // For regular words, use word-only length (without punctuation)
        const targetLengthAfter = this.activeWord.isAuthor ?
            this.activeWord.original.replace(/\s/g, '').length :
            (this.activeWord.originalWordOnly ? this.activeWord.originalWordOnly.length : this.activeWord.original.length);

        if (this.userInput.length === targetLengthAfter) {
            // Validate the entire word using Wordle logic
            this.validateWordleStyle();
        }
    }

    getCorrectLettersForWord(scrambledWord) {
        // Return the correctly guessed letters for a given word
        if (!this.wordCorrectLetters || !scrambledWord.original) {
            return [];
        }
        return this.wordCorrectLetters[scrambledWord.original] || [];
    }

    validateWordleStyle() {
        // Get the target word (lowercase, without spaces for authors)
        const targetWord = this.activeWord.isAuthor ?
            this.activeWord.original.toLowerCase().replace(/\s/g, '') :
            (this.activeWord.originalWordOnly ? this.activeWord.originalWordOnly.toLowerCase() : this.activeWord.original.toLowerCase());

        const inputWord = this.userInput.toLowerCase();

        // Reset feedback array
        this.letterFeedback = [];

        // Create a copy of target word as an array for tracking used letters
        const targetLetters = targetWord.split('');
        const usedTargetIndices = new Array(targetLetters.length).fill(false);

        // Track correctly guessed letters for this word
        const correctLetters = [];

        // First pass: Mark correct positions (green)
        for (let i = 0; i < inputWord.length; i++) {
            if (i < targetWord.length && inputWord[i] === targetWord[i]) {
                this.letterFeedback.push({
                    letter: inputWord[i],
                    status: 'correct' // Green - correct letter in correct position
                });
                usedTargetIndices[i] = true;
                // Store correct letter for display in quote
                correctLetters.push({
                    letter: inputWord[i],
                    position: i
                });
            } else {
                this.letterFeedback.push({
                    letter: inputWord[i],
                    status: 'pending' // Will be updated in second pass
                });
            }
        }

        // Second pass: Mark present but wrong position (yellow) or not present (grey)
        for (let i = 0; i < inputWord.length; i++) {
            // Skip already marked correct letters
            if (this.letterFeedback[i].status === 'correct') continue;

            const letter = inputWord[i];
            let found = false;

            // Look for this letter in target word (that hasn't been used yet)
            for (let j = 0; j < targetLetters.length; j++) {
                if (!usedTargetIndices[j] && targetLetters[j] === letter) {
                    this.letterFeedback[i].status = 'present'; // Yellow - letter in word but wrong position
                    usedTargetIndices[j] = true;
                    found = true;
                    break;
                }
            }

            // If not found, mark as absent (grey)
            if (!found) {
                this.letterFeedback[i].status = 'absent'; // Grey - letter not in word
            }
        }

        // Store correct letters for this word
        if (this.activeWord.original) {
            if (!this.wordCorrectLetters) {
                this.wordCorrectLetters = {};
            }

            if (this.activeWord.isAuthor) {
                // For author, store with a special key
                this.wordCorrectLetters['author'] = correctLetters;
            } else {
                // For regular words, store with the word as key
                this.wordCorrectLetters[this.activeWord.original] = correctLetters;
            }
        }

        // Check if the word is correct
        const isCorrect = this.letterFeedback.every(feedback => feedback.status === 'correct');

        // Update the display with the feedback colors
        this.renderInputArea();
        // Also update the quote display to show correct letters
        this.renderQuote();

        if (isCorrect) {
            // Word is correct, complete it
            this.wordValidationState = 'correct';
            setTimeout(() => {
                if (this.activeWord.isAuthor) {
                    this.authorSolved = true;
                    this.updateAuthorDisplay();
                    this.playAuthorCompleteSound();
                } else {
                    this.solvedWords.add(this.activeWord.original);
                    this.updateWordDisplay(this.activeWord);
                    this.playWordCompleteSound();


                    // Update score in Arkadium
                    if (this.arkadium) {
                        const currentScore = this.calculateCurrentScore();
                        this.arkadium.notifyScoreChange(currentScore);
                    }
                }

                // Save state after word/author completion
                this.saveCurrentPuzzleState();

                setTimeout(() => {
                    this.activateNextWordSmoothly(false);
                }, 1200);
            }, 500); // Short delay to show the colors before completing
        } else {
            // Word is incorrect, show feedback briefly
            // Player can manually reset if needed using the reset button
            this.wordValidationState = 'incorrect';
            setTimeout(() => {
                // No automatic reset - player can review feedback and decide to reset manually
            }, 1500); // Show feedback for 1.5 seconds
        }
    }

    handleGlobalLetterClick(letter) {
        // Allow any letter to be input, not just letters from the current word
        // We'll track correctness separately for Wordle-like feedback
        console.log(`🖱️ Global letter click: ${letter}`);
        this.handleLetterClick(letter, -1); // -1 indicates it's an extra letter
    }

    updateWordDisplay(wordData) {
        const wordElements = document.querySelectorAll('.quote-word');
        const targetWordEl = Array.from(wordElements).find(el =>
            el.dataset.wordIndex == wordData.index
        );

        if (targetWordEl) {
            const words = this.currentQuote.text.split(' ');
            // Use the word-only part for proper capitalization, excluding punctuation
            const wordOnly = wordData.originalWordOnly || wordData.original;
            const properWord = this.getProperCapitalization(wordOnly, wordData.index, words);

            this.animateWordCompletion(targetWordEl, properWord);
        }
    }

    updateAuthorDisplay() {
        this.animateAuthorCompletion(this.elements.quoteAuthor, `- ${this.currentQuote.author}`);
    }

    animateWordCompletion(wordElement, newText) {
        wordElement.classList.add('small-celebration');

        setTimeout(() => {
            wordElement.textContent = newText;
            wordElement.className = 'quote-word word-reveal';
            wordElement.removeAttribute('data-word-index');

            setTimeout(() => {
                wordElement.classList.remove('word-reveal');
            }, 400);
        }, 400);

        setTimeout(() => {
            wordElement.classList.remove('small-celebration');
        }, 800);
    }

    animateAuthorCompletion(authorElement, newText) {
        authorElement.classList.add('small-celebration');

        setTimeout(() => {
            authorElement.textContent = newText;
            authorElement.className = 'author word-reveal';

            setTimeout(() => {
                authorElement.classList.remove('word-reveal');
            }, 400);
        }, 400);

        setTimeout(() => {
            authorElement.classList.remove('small-celebration');
        }, 800);
    }

    async activateNextWordSmoothly(playSound = true) {
        // Reset current input before switching to new word
        // When called after a correct word, don't return letters to pool
        this.resetInput(false, playSound);

        document.querySelectorAll('.quote-word.active, .author.active').forEach(el => {
            el.classList.remove('active');
        });

        this.activeWord = null;
        this.userInput = '';
        this.availableLetters = [];
        this.usedLetters = [];
        this.renderInputArea();

        if (this.solvedWords.size === this.currentQuote.scrambledWords.length && this.authorSolved) {
            this.gameComplete = true;

            // Calculate final score and notify Arkadium of completion
            const finalScore = this.calculateCurrentScore();
            const timeElapsed = Math.floor((new Date() - this.startTime) / 1000);

            // Notify Arkadium of puzzle completion (level completion)
            if (this.arkadium) {
                await this.arkadium.handlePuzzleCompleted(
                    1, // Puzzle number (daily puzzle = level 1)
                    finalScore,
                    timeElapsed,
                    this.hintsUsedThisPuzzle
                );

                // Notify game end
                await this.arkadium.notifyGameEnd(finalScore, {
                    timeElapsed: timeElapsed,
                    hintsUsed: this.hintsUsedThisPuzzle,
                    wordsCompleted: this.solvedWords.size,
                    quoteAuthor: this.currentQuote.author
                });
            }

            // Record the puzzle completion FIRST, then update stats
            await this.recordPuzzleCompletion();
            await this.updateCongratsStats();



            this.elements.congrats.classList.add('show');
            this.elements.inputArea.classList.remove('show');

            // Initialize the countdown display
            this.createOrUpdateCountdown();

            // Add puzzle-complete class to newspaper container if it exists
            const newspaperContainer = document.querySelector('.newspaper-container');
            if (newspaperContainer) {
                newspaperContainer.classList.add('puzzle-complete');
            }

            // Set up congrats buttons after showing the section
            setTimeout(() => {
                this.setupCongratsButtons();
            }, 100);

            // Also set up event delegation as backup
            this.setupCongratsEventDelegation();

            this.playQuoteCompleteSound();

            const quoteContainer = document.querySelector('.quote-container');
            quoteContainer.classList.add('puzzle-completed', 'quote-complete');
            setTimeout(() => {
                quoteContainer.classList.remove('puzzle-completed');
            }, 1000);

            return;
        }

        if (!this.authorSolved && this.solvedWords.size === this.currentQuote.scrambledWords.length) {
            setTimeout(() => {
                this.activateAuthorSmoothly(false);
            }, 300);
        } else {
            for (const word of this.currentQuote.scrambledWords) {
                if (!this.solvedWords.has(word.original)) {
                    setTimeout(() => {
                        this.activateWordSmoothly(word, false);
                    }, 300);
                    return;
                }
            }
        }
    }

    activateWordSmoothly(wordData, resetInput = true) {
        if (this.solvedWords.has(wordData.original)) return;

        // Reset current input before switching to new word
        if (resetInput) {
            this.resetInput();
        }

        this.activeWord = {
            ...wordData,
            originalWordOnly: wordData.originalWordOnly || wordData.original
        };
        this.userInput = '';
        this.letterFeedback = []; // Initialize letter feedback for new word
        // Only use the scrambled word part, exclude punctuation from available letters
        this.availableLetters = wordData.scrambled.split('');
        this.usedLetters = [];

        // Initialize wordCorrectLetters if it doesn't exist
        if (!this.wordCorrectLetters) {
            this.wordCorrectLetters = {};
        }

        this.renderInputArea();

        const wordElements = document.querySelectorAll('.quote-word.scrambled');
        const targetWordEl = Array.from(wordElements).find(el =>
            el.dataset.wordIndex == wordData.index
        );

        document.querySelectorAll('.quote-word.active, .author.active').forEach(el => {
            el.classList.remove('active');
        });

        if (targetWordEl) {
            targetWordEl.classList.add('active');
        }

        // Check unscramble cooldown when new word is activated
        this.checkUnscrambleCooldown();
    }

    activateAuthorSmoothly(resetInput = true) {
        if (this.authorSolved) return;

        // Reset current input before switching to new word
        if (resetInput) {
            this.resetInput();
        }

        this.activeWord = {
            original: this.currentQuote.author.toLowerCase(),
            scrambled: this.currentQuote.scrambledAuthor,
            isAuthor: true
        };

        this.userInput = '';
        this.letterFeedback = []; // Initialize letter feedback for new word

        // For authors, keep all letters together without spaces and track word structure
        this.availableLetters = this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('');
        this.authorWordStructure = this.currentQuote.author.split(' ').map(word => word.length);
        this.usedLetters = [];

        this.renderInputArea();

        document.querySelectorAll('.quote-word.active, .author.active').forEach(el => {
            el.classList.remove('active');
        });

        const authorEl = document.querySelector('.author.scrambled');
        if (authorEl) {
            authorEl.classList.add('active');
        }

        // Check unscramble cooldown when author is activated
        this.checkUnscrambleCooldown();
    }

    handleKeyDown(event) {
        if (!this.activeWord || this.isUnscrambling) return;

        // Check if word is complete (either correct or incorrect)
        const targetLength = this.activeWord.isAuthor ?
            this.activeWord.original.replace(/\s/g, '').length :
            (this.activeWord.originalWordOnly ? this.activeWord.originalWordOnly.length : this.activeWord.original.length);

        const isWordComplete = (this.wordValidationState === 'incorrect' || this.wordValidationState === 'correct') &&
            this.userInput.length === targetLength;

        if (event.key === 'Backspace') {
            // Allow backspace even when word is complete
            this.handleBackspace();
            return;
        }

        if (event.key.length !== 1) return;

        // If word is complete (correct or incorrect), play error sound and do nothing
        if (isWordComplete) {
            this.playErrorSound();
            return;
        }

        // Allow any letter to be input, not just letters from the current word
        // Pass -1 as index to indicate it's an extra letter
        this.handleLetterClick(event.key, -1);
    }

    handleBackspace() {
        console.log('⌨️ Backspace triggered');
        if (!this.activeWord || this.userInput.length === 0 || this.isUnscrambling) {
            console.log('❌ Backspace blocked - no active word, no input, or unscrambling');
            return;
        }

        console.log('✅ Backspace allowed, playing sound');
        this.playBackspaceSound();

        // Return the last letter to the global pool
        if (this.userInput.length > 0) {
            const lastLetter = this.userInput[this.userInput.length - 1];
            const lowerLetter = lastLetter.toLowerCase();

            // Add the letter back to the global pool
            if (this.globalLetterPool) {
                this.globalLetterPool[lowerLetter] = (this.globalLetterPool[lowerLetter] || 0) + 1;
            }
        }

        this.userInput = this.userInput.length > 0 ? this.userInput.slice(0, -1) : '';
        this.usedLetters = this.usedLetters.length > 0 ? this.usedLetters.slice(0, -1) : [];
        // Also remove the last feedback entry
        if (this.letterFeedback && this.letterFeedback.length > 0) {
            this.letterFeedback.pop();
        }
        this.renderInputArea();

        // Save current state after backspace
        this.saveCurrentPuzzleState();
    }

    resetInput(returnLettersToPool = true, playSound = true) {
        if (this.isUnscrambling) return;

        // Only play sound and return letters if there are actually letters in the input
        if (this.userInput && this.userInput.length > 0) {
            if (playSound) {
                this.playResetSound();
            }

            // Return all letters in the current input back to the global pool
            if (returnLettersToPool && this.globalLetterPool) {
                for (let i = 0; i < this.userInput.length; i++) {
                    const letter = this.userInput[i];
                    const lowerLetter = letter.toLowerCase();
                    this.globalLetterPool[lowerLetter] = (this.globalLetterPool[lowerLetter] || 0) + 1;
                }
            }
        }

        this.userInput = '';
        this.usedLetters = [];
        this.letterFeedback = []; // Reset letter feedback
        this.wordValidationState = 'pending'; // Reset validation state
        this.renderInputArea();

        // Save current state after reset
        this.saveCurrentPuzzleState();
    }

    startUnscrambleCooldown() {
        this.unscrambleLastUsed = Date.now();
        this.elements.unscrambleBtn.disabled = true;
        this.elements.unscrambleBtn.style.opacity = '0.5';

        // Show timer
        if (this.elements.unscrambleTimer) {
            this.elements.unscrambleTimer.classList.add('show');
        }

        // Clear any existing interval
        if (this.unscrambleCooldownInterval) {
            clearInterval(this.unscrambleCooldownInterval);
        }

        // Start the cooldown progress
        this.unscrambleCooldownInterval = setInterval(() => {
            const elapsed = Date.now() - this.unscrambleLastUsed;
            const progress = Math.min(elapsed / this.unscrambleCooldown, 1);

            if (progress >= 1) {
                // Cooldown complete
                this.elements.unscrambleBtn.disabled = false;
                this.elements.unscrambleBtn.style.opacity = '1';
                if (this.elements.unscrambleTimer) {
                    this.elements.unscrambleTimer.classList.remove('show');
                    this.elements.unscrambleTimer.textContent = '';
                }
                clearInterval(this.unscrambleCooldownInterval);
                this.unscrambleCooldownInterval = null;
            } else {
                // Update visual progress and timer
                this.elements.unscrambleBtn.style.opacity = 0.5 + (progress * 0.5);

                // Update timer display
                if (this.elements.unscrambleTimer) {
                    const remainingTime = Math.ceil((this.unscrambleCooldown - elapsed) / 1000);
                    this.elements.unscrambleTimer.textContent = `${remainingTime}s`;
                }
            }
        }, 100); // Update every 100ms for smooth progress
    }

    checkUnscrambleCooldown() {
        const timeSinceLastUse = Date.now() - this.unscrambleLastUsed;
        const progress = Math.min(timeSinceLastUse / this.unscrambleCooldown, 1);

        if (progress >= 1) {
            // Cooldown complete
            if (this.elements.unscrambleBtn) {
                this.elements.unscrambleBtn.disabled = false;
                this.elements.unscrambleBtn.style.opacity = '1';
            }
            if (this.elements.unscrambleTimer) {
                this.elements.unscrambleTimer.classList.remove('show');
                this.elements.unscrambleTimer.textContent = '';
            }
            if (this.unscrambleCooldownInterval) {
                clearInterval(this.unscrambleCooldownInterval);
                this.unscrambleCooldownInterval = null;
            }
        } else {
            // Still in cooldown
            this.elements.unscrambleBtn.disabled = true;
            this.elements.unscrambleBtn.style.opacity = 0.5 + (progress * 0.5);

            // Show and update timer
            if (this.elements.unscrambleTimer) {
                this.elements.unscrambleTimer.classList.add('show');
                const remainingTime = Math.ceil((this.unscrambleCooldown - timeSinceLastUse) / 1000);
                this.elements.unscrambleTimer.textContent = `${remainingTime}s`;
            }

            // Restart the interval if it's not running
            if (!this.unscrambleCooldownInterval) {
                this.unscrambleCooldownInterval = setInterval(() => {
                    this.checkUnscrambleCooldown();
                }, 100);
            }
        }
    }



    async revealLetterHint() {
        // Always show the letter selection modal, but handle ink drops inside
        console.log('🔤 Showing letter selection modal...');
        this.showLetterSelectionModal();
    }

    revealLetterInAllWords(letterToReveal) {
        console.log(`Revealing letter: ${letterToReveal}`);

        // Add to revealed letters
        this.addRevealedLetter(letterToReveal.toLowerCase());

        // Update display to show the revealed letter
        this.renderQuote();
    }

    getRevealedLetters() {
        // Return a set of currently revealed letters
        if (!this.revealedLetters) {
            this.revealedLetters = new Set();
        }
        return this.revealedLetters;
    }

    addRevealedLetter(letter) {
        // Add a letter to the revealed letters set
        if (!this.revealedLetters) {
            this.revealedLetters = new Set();
        }
        this.revealedLetters.add(letter);
    }

    showLetterSelectionModal() {
        console.log('🔤 showLetterSelectionModal called');
        // Get all unique letters from the quote and author
        const availableLetters = this.getAvailableLettersForReveal();
        
        console.log('🔤 Available letters for reveal:', availableLetters);
        if (availableLetters.length === 0) {
            console.log('No letters available to reveal');
            return;
        }

        // Get letter counts for display
        const letterCounts = this.getLetterCountsForReveal();
        
        // Create modal HTML
        const hasInkDrops = this.inkDrops > 0;
        const modalHTML = `
            <div class="modal" id="letterSelectionModal">
                <div class="modal-content letter-selection-modal">
                    <div class="modal-header">
                        <h2>Choose a Letter to Reveal</h2>
                        <button class="close-modal" onclick="window.game.closeLetterSelectionModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Select which letter you want to reveal in all words:</p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            <i class="fas fa-tint"></i> This will cost 1 ink drop 
                            <span style="color: ${hasInkDrops ? '#28a745' : '#dc3545'}; font-weight: bold;">
                                (You have ${this.inkDrops})
                            </span>
                        </p>
                        <div id="inkDropWarning" style="display: none;"></div>
                        <div class="letter-selection-grid">
                            ${availableLetters.map(letter => {
                                const count = letterCounts[letter] || 0;
                                return `
                                    <button class="letter-selection-btn ${!hasInkDrops ? 'disabled' : ''}" onclick="window.game.selectLetterToReveal('${letter}')" style="position: relative; ${!hasInkDrops ? 'opacity: 0.6; cursor: not-allowed;' : ''}">
                                        ${letter}
                                        ${count > 1 ? `<div class="letter-count-indicator">${count}</div>` : ''}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <div class="modal-footer">
                            <button class="control-btn" onclick="window.game.closeLetterSelectionModal()" style="background: #f5f5f5; color: #222; border: 2px solid #ddd;">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('letterSelectionModal');
        this.showModal(modal);
    }

    getAvailableLettersForReveal() {
        // Get letters only from scrambled words and author (same as typing section)
        const allLetters = new Set();
        
        // Add letters from all regular words (solved and unsolved)
        this.currentQuote.scrambledWords.forEach(word => {
            word.scrambled.split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                if (lowerLetter >= 'a' && lowerLetter <= 'z') {
                    allLetters.add(lowerLetter);
                }
            });
        });

        // Add letters from author if it exists
        if (this.currentQuote.scrambledAuthor) {
            // For author, we need to remove spaces and add all letters
            this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                if (lowerLetter >= 'a' && lowerLetter <= 'z') {
                    allLetters.add(lowerLetter);
                }
            });
        }
        
        // Filter out already revealed letters
        const revealedLetters = this.getRevealedLetters();
        const availableLetters = [...allLetters].filter(letter => !revealedLetters.has(letter));
        
        return availableLetters.sort();
    }

    getLetterCountsForReveal() {
        // Use the same logic as the typing section - count letters from scrambled words and author
        const letterCounts = {};

        // Add letters from all regular words (solved and unsolved)
        this.currentQuote.scrambledWords.forEach(word => {
            word.scrambled.split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                letterCounts[lowerLetter] = (letterCounts[lowerLetter] || 0) + 1;
            });
        });

        // Add letters from author if it exists
        if (this.currentQuote.scrambledAuthor) {
            // For author, we need to remove spaces and add all letters
            this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                letterCounts[lowerLetter] = (letterCounts[lowerLetter] || 0) + 1;
            });
        }
        
        return letterCounts;
    }

    async selectLetterToReveal(letter) {
        // Check if player has ink drops first
        if (this.inkDrops <= 0) {
            this.showInkDropWarning();
            return;
        }
        
        // Close modal first
        this.closeLetterSelectionModal();
        
        // Spend ink drop for the hint
        const success = await this.spendInkDrop();
        if (!success) {
            console.error('Failed to spend ink drop for reveal letter hint');
            return;
        }

        // Track successful reveal letter
        this.arkadium.trackEvent('reveal_letter_completed', {
            timestamp: Date.now(),
            letter: letter
        });

        // Track hint usage for achievements
        this.hintsUsedThisPuzzle++;
        
        // Reveal the letter in all words
        this.revealLetterInAllWords(letter);
        
        // Play sound effect
        this.playSound('waterDrop', 0.6);
    }

    showInkDropWarning() {
        // Show warning message in the modal
        const warningArea = document.getElementById('inkDropWarning');
        if (warningArea) {
            warningArea.innerHTML = `
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin: 10px 0; color: #856404;">
                    <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
                    You need at least 1 ink drop to reveal a letter. You'll earn more drops as you play!
                </div>
            `;
            warningArea.style.display = 'block';
            
            // Hide warning after 4 seconds
            setTimeout(() => {
                if (warningArea) {
                    warningArea.style.display = 'none';
                }
            }, 4000);
        }
    }

    closeLetterSelectionModal() {
        const modal = document.getElementById('letterSelectionModal');
        if (modal) {
            this.hideModal(modal);
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    async unscrambleCurrentWord() {
        if (!this.activeWord || this.isUnscrambling) return;

        // Check cooldown
        const timeSinceLastUse = Date.now() - this.unscrambleLastUsed;
        if (timeSinceLastUse < this.unscrambleCooldown) {
            return; // Still in cooldown
        }

        // Show rewarded ad before unscrambling
        try {
            console.log('🎬 Showing rewarded ad for unscramble...');

            // Track unscramble attempt
            this.arkadium.trackEvent('unscramble_attempted', {
                word: this.activeWord.original,
                isAuthor: this.activeWord.isAuthor
            });

            await this.arkadium.showRewardedAd();
            console.log('✅ Rewarded ad completed, proceeding with unscramble');

            // Track successful unscramble
            this.arkadium.trackEvent('unscramble_completed', {
                word: this.activeWord.original,
                isAuthor: this.activeWord.isAuthor
            });

        } catch (error) {
            console.log('❌ Rewarded ad failed or was cancelled:', error);
            // In development mode or if ad fails, still allow unscramble
            if (!this.arkadium.isDevelopmentMode()) {
                console.log('🎮 Ad failed, but allowing unscramble in development mode');
            }

            // Track unscramble without ad
            this.arkadium.trackEvent('unscramble_no_ad', {
                word: this.activeWord.original,
                isAuthor: this.activeWord.isAuthor,
                error: error.message
            });
        }

        this.isUnscrambling = true;
        this.elements.resetBtn.disabled = true;
        this.elements.backspaceBtn.disabled = true;
        this.elements.unscrambleBtn.disabled = true;

        // Start the cooldown
        this.startUnscrambleCooldown();

        // Track hint usage for achievements
        this.hintsUsedThisPuzzle++;

        const targetWord = this.activeWord.isAuthor ?
            this.activeWord.original.replace(/\s/g, '') :
            this.activeWord.original;
        const scrambledLetters = this.activeWord.isAuthor ?
            this.activeWord.scrambled.replace(/\s/g, '').split('') :
            this.activeWord.scrambled.split('');

        this.userInput = '';
        this.usedLetters = [];

        let letterIndex = 0;
        let attempts = 0;
        const maxAttempts = targetWord.length * 2; // Safety limit

        const addNextLetter = () => {
            if (letterIndex >= targetWord.length) {
                // Word is complete, check if it's correct
                const inputWord = this.userInput.toLowerCase();
                const targetWordLower = this.activeWord.isAuthor ?
                    this.activeWord.original.toLowerCase().replace(/\s/g, '') :
                    this.activeWord.original.toLowerCase();

                if (inputWord === targetWordLower) {
                    setTimeout(() => {
                        if (this.activeWord.isAuthor) {
                            this.authorSolved = true;
                            this.updateAuthorDisplay();
                            this.playAuthorCompleteSound();
                        } else {
                            this.solvedWords.add(this.activeWord.original);
                            this.updateWordDisplay(this.activeWord);
                            this.playWordCompleteSound();

                            // Update score in Arkadium
                            if (this.arkadium) {
                                const currentScore = this.calculateCurrentScore();
                                this.arkadium.notifyScoreChange(currentScore);
                            }
                        }

                        setTimeout(() => {
                            this.isUnscrambling = false;
                            this.elements.resetBtn.disabled = false;
                            this.elements.backspaceBtn.disabled = false;
                            // Don't re-enable unscramble button here - let cooldown handle it
                            this.activateNextWordSmoothly(false);
                        }, 1200);
                    }, 300);
                } else {
                    // Word is wrong, reset and try again
                    this.userInput = '';
                    this.usedLetters = [];
                    letterIndex = 0;
                    attempts++;

                    if (attempts < maxAttempts) {
                        setTimeout(addNextLetter, 200);
                    } else {
                        // Give up and reset
                        this.isUnscrambling = false;
                        this.elements.resetBtn.disabled = false;
                        this.elements.backspaceBtn.disabled = false;
                        // Don't re-enable unscramble button here - let cooldown handle it
                        this.resetInput();
                    }
                }
                return;
            }

            attempts++;
            if (attempts > maxAttempts) {
                // Safety timeout - give up
                this.isUnscrambling = false;
                this.elements.resetBtn.disabled = false;
                this.elements.backspaceBtn.disabled = false;
                // Don't re-enable unscramble button here - let cooldown handle it
                this.resetInput();
                return;
            }

            const targetLetter = targetWord[letterIndex];
            const scrambledIndex = scrambledLetters.findIndex((letter, index) =>
                letter.toLowerCase() === targetLetter.toLowerCase() && !this.usedLetters.includes(index)
            );

            if (scrambledIndex !== -1) {
                this.userInput += scrambledLetters[scrambledIndex];
                this.usedLetters = [...this.usedLetters, scrambledIndex];

                // Deduct the letter from the global pool
                const letter = scrambledLetters[scrambledIndex];
                const lowerLetter = letter.toLowerCase();
                if (this.globalLetterPool && this.globalLetterPool[lowerLetter]) {
                    this.globalLetterPool[lowerLetter] = Math.max(0, this.globalLetterPool[lowerLetter] - 1);
                }

                this.playTypingSound(true);
                this.renderInputArea();

                letterIndex++;
                setTimeout(addNextLetter, 200);
            } else {
                // Letter not found, try to find any available letter
                const availableIndex = scrambledLetters.findIndex((letter, index) =>
                    !this.usedLetters.includes(index)
                );

                if (availableIndex !== -1) {
                    this.userInput += scrambledLetters[availableIndex];
                    this.usedLetters = [...this.usedLetters, availableIndex];

                    // Deduct the letter from the global pool
                    const letter = scrambledLetters[availableIndex];
                    const lowerLetter = letter.toLowerCase();
                    if (this.globalLetterPool && this.globalLetterPool[lowerLetter]) {
                        this.globalLetterPool[lowerLetter] = Math.max(0, this.globalLetterPool[lowerLetter] - 1);
                    }

                    this.playTypingSound(true);
                    this.renderInputArea();

                    letterIndex++;
                    setTimeout(addNextLetter, 200);
                } else {
                    // No more letters available, reset and try again
                    this.userInput = '';
                    this.usedLetters = [];
                    letterIndex = 0;
                    setTimeout(addNextLetter, 200);
                }
            }
        };

        addNextLetter();
    }

    async renderCalendar() {
        const today = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        this.elements.calendarMonthYear.textContent =
            `${monthNames[this.currentCalendarMonth]} ${this.currentCalendarYear}`;

        // Hide any existing calendar message
        this.hideCalendarMessage();

        const firstDay = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const lastDay = new Date(this.currentCalendarYear, this.currentCalendarMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = '';

        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="calendar-date"></div>';
        }

        const userData = await this.loadUserData();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentCalendarYear, this.currentCalendarMonth, day);
            const dateStr = this.formatDate(date);
            const isToday = dateStr === this.formatDate(today);
            const isPast = date < today;
            const isFuture = date > today;

            let classes = 'calendar-date';
            if (isToday) classes += ' today';
            else if (isPast) classes += ' past';
            else if (isFuture) classes += ' future';

            if (userData.puzzles && userData.puzzles[dateStr] && userData.puzzles[dateStr].solved) {
                classes += ' solved';
            }

            // Check if date has been played (but not necessarily completed)
            if (userData.playedDates && userData.playedDates.includes(dateStr)) {
                classes += ' played';
            }

            // Debug logging for today's date
            if (isToday) {
                console.log(`Today's date (${dateStr}) classes: ${classes}`);
            }

            const quote = this.quotes.find(q => q.date === dateStr);
            if (quote) {
                const isCompleted = userData.puzzles && userData.puzzles[dateStr] && userData.puzzles[dateStr].solved;
                let title = `Play ${dateStr} puzzle`;
                if (isPast && !isCompleted) {
                    // Check if already played
                    if (userData.playedDates && userData.playedDates.includes(dateStr)) {
                        title = `${dateStr} puzzle (already played - free to view)`;
                    } else {
                        title = `${dateStr} puzzle (requires ink drops)`;
                    }
                } else if (isPast && isCompleted) {
                    title = `${dateStr} puzzle (completed - free to view)`;
                }
                html += `<div class="${classes}" data-date="${dateStr}" style="cursor: pointer;" title="${title}">${day}</div>`;
            } else {
                html += `<div class="${classes}" style="opacity: 0.3;" title="No puzzle available">${day}</div>`;
            }
        }

        this.elements.calendarDates.innerHTML = html;

        document.querySelectorAll('.calendar-date[data-date]').forEach(el => {
            el.addEventListener('click', async () => {
                const dateStr = el.dataset.date;
                const clickedDate = new Date(dateStr);
                const today = new Date();
                const todayStr = this.formatDate(today);

                // Prevent clicking on future dates
                if (clickedDate > today) {
                    return; // Do nothing for future dates
                }

                // Load fresh user data for accurate puzzle status
                const freshUserData = await this.loadUserData();

                // Check if this is a past challenge and if it's completed
                const isPastChallenge = dateStr !== todayStr;
                const puzzleData = freshUserData.puzzles[dateStr];
                const isCompleted = puzzleData && puzzleData.solved;

                // Check if this challenge has been played before
                const hasBeenPlayed = freshUserData.playedDates && freshUserData.playedDates.includes(dateStr);
                
                // If it's a past uncompleted challenge that hasn't been played and user has no drops, show message
                if (isPastChallenge && !isCompleted && !hasBeenPlayed && this.inkDrops <= 0) {
                    this.showCalendarMessage();
                    return;
                }

                // Hide congrats section and calendar message when selecting any date from calendar
                this.elements.congrats.classList.remove('show');
                document.querySelector('.newspaper-container').classList.remove('puzzle-complete');
                this.hideCalendarMessage();

                // If clicking on today's date, load today's puzzle properly
                if (dateStr === todayStr) {
                    // Reset Arkadium game state for new puzzle
                    if (this.arkadium) {
                        this.arkadium.resetGameState();
                    }

                    this.currentQuote = this.findTodayQuote();
                    this.solvedWords = new Set();
                    this.authorSolved = false;
                    this.activeWord = null;
                    this.userInput = '';
                    this.availableLetters = [];
                    this.usedLetters = [];
                    this.letterFeedback = []; // Clear letter feedback for new quote
                    this.revealedLetters = new Set(); // Clear revealed letters for new puzzle
                    this.wordCorrectLetters = {}; // Clear word correct letters for new puzzle
                    this.wordValidationState = 'pending'; // Reset validation state for new puzzle
                    this.gameComplete = false;
                    this.startTime = new Date();

                    // Hide completed challenge buttons for today's puzzle
                    this.hideCompletedChallengeButtons();

                    // Check if today's puzzle is completed and show congrats if so
                    await this.checkQuoteCompletionStatus();

                    this.renderQuote();
                    this.updateDateDisplay();
                    this.renderInputArea();
                } else {
                    // Load past challenge (without congrats/stats)
                    await this.loadChallengeForDate(dateStr);
                }

                this.hideModal(this.elements.calendarModal);
            });
        });

        this.updateCalendarNavigation();
    }

    updateCalendarNavigation() {
        const today = new Date();
        const quoteDates = this.quotes.map(q => new Date(q.date));
        const earliestDate = new Date(Math.min(...quoteDates));
        const latestDate = new Date(Math.max(...quoteDates));

        const currentViewDate = new Date(this.currentCalendarYear, this.currentCalendarMonth, 1);
        const earliestViewDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
        this.elements.prevMonth.disabled = currentViewDate <= earliestViewDate;

        const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.elements.nextMonth.disabled = currentViewDate >= currentMonthDate;
    }

    showCompletedChallengeButtons(dateStr) {
        // Create or update the button bar for completed challenges
        let buttonBar = document.getElementById('completedChallengeButtons');
        if (!buttonBar) {
            buttonBar = document.createElement('div');
            buttonBar.id = 'completedChallengeButtons';
            buttonBar.className = 'completed-challenge-buttons';

            // Insert after the quote container
            const quoteContainer = document.querySelector('.quote-container');
            quoteContainer.parentNode.insertBefore(buttonBar, quoteContainer.nextSibling);
        }

        buttonBar.innerHTML = `
            <div class="button-group">
                <button class="btn" id="pastChallengesFromCompleted">
                    <i class="fas fa-calendar-alt"></i> Past Challenges
                </button>
                <button class="btn" id="shareQuoteBtn">
                    <i class="fas fa-share"></i> Share Quote
                </button>
                <div class="simple-countdown">
                    New Quote in <span id="completedCountdown">00:00:00</span>
                </div>
            </div>
        `;

        buttonBar.style.display = 'block';

        // Add event listeners
        document.getElementById('pastChallengesFromCompleted').addEventListener('click', async () => {
            this.showModal(this.elements.calendarModal);
            await this.renderCalendar();
        });

        document.getElementById('shareQuoteBtn').addEventListener('click', () => {
            this.shareQuote(dateStr);
        });

        // Start the countdown for completed puzzles
        this.createOrUpdateCountdown();
    }

    hideCompletedChallengeButtons() {
        const buttonBar = document.getElementById('completedChallengeButtons');
        if (buttonBar) {
            buttonBar.style.display = 'none';
        }

        // Stop the countdown when hiding completed challenge buttons
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    shareQuote(dateStr) {
        console.log('📤 shareQuote called with dateStr:', dateStr);

        const quote = this.currentQuote;
        if (!quote) {
            console.error('❌ No current quote available for sharing');
            return;
        }

        console.log('📝 Sharing puzzle for date:', dateStr);

        const shareUrl = `${window.location.origin}${window.location.pathname}?challenge=${dateStr}`;

        // Create a teaser message without revealing the quote or author
        const teaserMessages = [
            `🧩 Can you unscramble today's inspirational quote?\n\nTest your word puzzle skills with this daily quote challenge!`,
            `🎯 Think you're good with words? Try this quote puzzle!\n\nUnscramble the wisdom - can you solve it?`,
            `💭 A famous quote awaits your puzzle-solving skills!\n\nCan you unscramble the scrambled words?`,
            `🔤 Word puzzle challenge: Unscramble the inspirational quote!\n\nPut your vocabulary to the test!`,
            `✨ Hidden wisdom in scrambled words...\n\nCan you reveal the inspirational quote?`
        ];

        // Use date to pick a consistent message for the same day
        const messageIndex = new Date(dateStr).getDate() % teaserMessages.length;
        const shareText = teaserMessages[messageIndex];

        console.log('🔗 Share URL:', shareUrl);
        console.log('📄 Share text:', shareText);

        // Try native sharing first (mobile devices)
        if (navigator.share) {
            console.log('📱 Using native sharing');
            navigator.share({
                title: 'Daily Quote Puzzle Challenge',
                text: shareText,
                url: shareUrl
            }).catch(err => {
                console.log('❌ Native sharing failed, falling back to clipboard:', err);
                this.fallbackShare(shareText, shareUrl);
            });
        } else {
            console.log('💻 Using fallback sharing (no native share API)');
            // Fallback for desktop browsers
            this.fallbackShare(shareText, shareUrl);
        }
    }

    fallbackShare(shareText, shareUrl) {
        console.log('📋 fallbackShare called');
        const fullShareText = `${shareText}\n${shareUrl}`;

        // Try to copy to clipboard
        if (navigator.clipboard) {
            console.log('📋 Attempting to copy to clipboard');
            navigator.clipboard.writeText(fullShareText).then(() => {
                console.log('✅ Successfully copied to clipboard');
                this.showShareSuccess('Link copied to clipboard!');
            }).catch((error) => {
                console.log('❌ Clipboard copy failed, showing dialog:', error);
                this.showShareDialog(fullShareText);
            });
        } else {
            console.log('❌ No clipboard API, showing dialog');
            this.showShareDialog(fullShareText);
        }
    }

    showShareSuccess(message) {
        console.log('✅ Showing share success:', message);

        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'share-success';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease-in;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }, 2000);
    }

    showShareDialog(shareText) {
        // Create a modal with the share text for manual copying
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="share-modal-content" style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="margin-bottom: 20px;">Share This Puzzle Challenge</h3>
                <textarea readonly style="
                    width: 100%;
                    height: 120px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: none;
                    margin-bottom: 20px;
                ">${shareText}</textarea>
                <div>
                    <button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                    <button class="btn" style="margin-left: 10px;" onclick="
                        this.parentElement.previousElementSibling.select();
                        document.execCommand('copy');
                        this.textContent = 'Copied!';
                        setTimeout(() => this.textContent = 'Copy Text', 1000);
                    ">
                        Copy Text
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    initializeGlobalLetterPool() {
        if (!this.currentQuote) return;

        const allLetterCounts = {};

        // Add letters from all regular words (solved and unsolved)
        this.currentQuote.scrambledWords.forEach(word => {
            word.scrambled.split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                allLetterCounts[lowerLetter] = (allLetterCounts[lowerLetter] || 0) + 1;
            });
        });

        // Add letters from author if it exists
        if (this.currentQuote.scrambledAuthor) {
            // For author, we need to remove spaces and add all letters
            this.currentQuote.scrambledAuthor.replace(/\s/g, '').split('').forEach(letter => {
                const lowerLetter = letter.toLowerCase();
                allLetterCounts[lowerLetter] = (allLetterCounts[lowerLetter] || 0) + 1;
            });
        }

        // Initialize global letter pool
        this.globalLetterPool = allLetterCounts;
    }

    async loadChallengeForDate(dateStr, skipInkDropCheck = false) {
        // Check if this is a past challenge (not today) and requires ink drops
        const today = new Date();
        const todayStr = this.formatDate(today);
        const isPastChallenge = dateStr !== todayStr && !skipInkDropCheck;

        // Check if the challenge is already completed
        const userData = await this.loadUserData();
        const puzzleData = userData.puzzles[dateStr];
        const isCompleted = puzzleData && puzzleData.solved;

        // Check if the challenge has been played before
        const hasBeenPlayed = userData.playedDates && userData.playedDates.includes(dateStr);
        
        console.log(`🔍 Challenge check for ${dateStr}:`, {
            isPastChallenge,
            isCompleted,
            hasBeenPlayed,
            playedDates: userData.playedDates,
            inkDrops: this.inkDrops
        });

        if (isPastChallenge && !isCompleted) {
            // Only require ink drops for uncompleted past challenges that haven't been played
            if (!hasBeenPlayed) {
                console.log(`💧 Past challenge ${dateStr} hasn't been played before, checking ink drops...`);
                if (this.inkDrops <= 0) {
                    // Show refill modal
                    const shouldRefill = await this.showInkDropsRefillModal();
                    if (!shouldRefill) {
                        return; // User cancelled, don't load challenge
                    }
                    // If user watched ad, ink drops were refilled, continue
                }

                // Spend an ink drop for uncompleted past challenge that hasn't been played
                const success = await this.spendInkDrop();
                if (!success) {
                    console.error('Failed to spend ink drop for past challenge');
                    return;
                }
            } else {
                console.log(`✅ Past challenge ${dateStr} has been played before, no ink drops needed`);
            }
        }

        // Track that this challenge has been played (if it's a past challenge)
        if (isPastChallenge && !hasBeenPlayed) {
            if (!userData.playedDates) {
                userData.playedDates = [];
            }
            userData.playedDates.push(dateStr);
            console.log(`📝 Marking ${dateStr} as played. Updated playedDates:`, userData.playedDates);
            await this.saveUserData(userData);
        }

        const quote = this.quotes.find(q => q.date === dateStr);
        if (quote) {
            // Reset Arkadium game state when loading any puzzle
            if (this.arkadium) {
                this.arkadium.resetGameState();
            }

            this.currentQuote = this.processQuoteForGame(quote);
            this.letterFeedback = []; // Clear letter feedback for new quote
            this.revealedLetters = new Set(); // Clear revealed letters for new quote
            this.wordCorrectLetters = {}; // Clear word correct letters for new quote
            this.wordValidationState = 'pending'; // Reset validation state for new quote

            // Reset the global letter pool for the new quote
            this.initializeGlobalLetterPool();

            // Check if this quote is already completed
            const userData = await this.loadUserData();
            const puzzleData = userData.puzzles[dateStr];

            if (puzzleData && puzzleData.solved) {
                // Quote is already completed, show just the quote without stats or congrats
                this.gameComplete = true;
                this.solvedWords = new Set(puzzleData.solvedWords || []);
                this.authorSolved = puzzleData.authorSolved || false;
                this.gameTime = puzzleData.time || 0;
                this.startTime = new Date(dateStr);
                this.endTime = new Date(dateStr); // Use original completion time

                this.renderQuote();
                this.updateDateDisplay();

                // Hide input area and congrats for completed past challenges
                this.elements.inputArea.classList.remove('show');
                this.elements.congrats.classList.remove('show');
                document.querySelector('.newspaper-container').classList.remove('puzzle-complete');

                const quoteContainer = document.querySelector('.quote-container');
                quoteContainer.classList.add('quote-complete');

                // Show action buttons for completed challenges
                this.showCompletedChallengeButtons(dateStr);

                // Disable all interactive elements for completed challenges
                this.disableInteractiveElements();
            } else {
                // Check for saved state for this specific puzzle
                const savedState = await this.loadCurrentPuzzleState();
                const shouldRestoreState = savedState && savedState.date === dateStr;

                if (shouldRestoreState) {
                    // Restore saved state
                    console.log('🔄 Restoring saved state for puzzle:', dateStr);
                    this.solvedWords = new Set(savedState.solvedWords || []);
                    this.authorSolved = savedState.authorSolved || false;
                    this.gameComplete = savedState.gameComplete || false;
                    this.userInput = savedState.userInput || '';
                    this.usedLetters = savedState.usedLetters || [];
                    this.letterFeedback = []; // Clear letter feedback when restoring state
                    this.hintsUsedThisPuzzle = savedState.hintsUsed || 0;

                    // Restore unscramble cooldown state if it was saved
                    if (savedState.unscrambleLastUsed) {
                        this.unscrambleLastUsed = savedState.unscrambleLastUsed;
                    }

                    // Find the active word if it was saved
                    if (savedState.activeWord) {
                        this.activeWord = this.currentQuote.scrambledWords.find(
                            sw => sw.original === savedState.activeWord
                        ) || this.currentQuote.scrambledWords.find(
                            sw => !this.solvedWords.has(sw.original)
                        );
                    } else {
                        this.activeWord = null;
                    }

                    this.startTime = new Date();

                    this.elements.congrats.classList.remove('show');
                    document.querySelector('.newspaper-container').classList.remove('puzzle-complete');
                    this.hideCompletedChallengeButtons();
                    this.renderQuote();
                    this.updateDateDisplay();
                    this.renderInputArea();

                    // Enable interactive elements
                    this.enableInteractiveElements();

                    // Check unscramble cooldown status after enabling elements
                    this.checkUnscrambleCooldown();

                    // Auto-activate first unsolved word if no active word
                    if (!this.activeWord && this.currentQuote.scrambledWords.length > 0) {
                        const firstUnsolved = this.currentQuote.scrambledWords.find(
                            sw => !this.solvedWords.has(sw.original)
                        );
                        if (firstUnsolved) {
                            setTimeout(() => {
                                this.handleWordClick(firstUnsolved, false, false);
                            }, 300);
                        }
                    }
                } else {
                    // Quote is not completed and no saved state, start fresh
                    this.solvedWords = new Set();
                    this.authorSolved = false;
                    this.activeWord = null;
                    this.userInput = '';
                    this.availableLetters = [];
                    this.usedLetters = [];
                    this.letterFeedback = []; // Clear letter feedback for new quote
                    this.hintsUsedThisPuzzle = 0;
                    this.gameComplete = false;
                    this.startTime = new Date();

                    this.elements.congrats.classList.remove('show');
                    document.querySelector('.newspaper-container').classList.remove('puzzle-complete');
                    this.hideCompletedChallengeButtons();
                    this.renderQuote();
                    this.updateDateDisplay();
                    this.renderInputArea();

                    // Enable interactive elements for new challenges
                    this.enableInteractiveElements();

                    // Check unscramble cooldown status after enabling elements
                    this.checkUnscrambleCooldown();

                    if (this.currentQuote.scrambledWords.length > 0) {
                        setTimeout(() => {
                            this.handleWordClick(this.currentQuote.scrambledWords[0], false, false);
                        }, 300);
                    }
                }
            }
        }
    }

    disableInteractiveElements() {
        // Disable letter buttons
        const letterButtons = document.querySelectorAll('.letter-btn');
        letterButtons.forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.6';
        });

        // Disable control buttons
        if (this.elements.resetBtn) this.elements.resetBtn.disabled = true;
        if (this.elements.backspaceBtn) this.elements.backspaceBtn.disabled = true;
        if (this.elements.unscrambleBtn) this.elements.unscrambleBtn.disabled = true;

        // Disable word clicking
        const wordElements = document.querySelectorAll('.quote-word.scrambled, .author.scrambled');
        wordElements.forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.cursor = 'default';
        });
    }

    enableInteractiveElements() {
        // Enable letter buttons
        const letterButtons = document.querySelectorAll('.letter-btn');
        letterButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        });

        // Enable control buttons
        if (this.elements.resetBtn) this.elements.resetBtn.disabled = false;
        if (this.elements.backspaceBtn) this.elements.backspaceBtn.disabled = false;

        // Only enable unscramble button if not in cooldown
        if (this.elements.unscrambleBtn) {
            const timeSinceLastUse = Date.now() - this.unscrambleLastUsed;
            if (timeSinceLastUse >= this.unscrambleCooldown) {
                this.elements.unscrambleBtn.disabled = false;
                this.elements.unscrambleBtn.style.opacity = '1';
            }
            // If still in cooldown, leave it disabled and let checkUnscrambleCooldown handle it
        }

        // Enable word clicking
        const wordElements = document.querySelectorAll('.quote-word.scrambled, .author.scrambled');
        wordElements.forEach(el => {
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
        });
    }

    // Hamburger Menu Methods
    openMenu() {
        if (this.elements.slideMenu && this.elements.menuOverlay && this.elements.hamburgerMenu) {
            this.elements.slideMenu.classList.add('active');
            this.elements.menuOverlay.classList.add('active');
            this.elements.hamburgerMenu.querySelector('.hamburger-icon').classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeMenu() {
        if (this.elements.slideMenu && this.elements.menuOverlay && this.elements.hamburgerMenu) {
            this.elements.slideMenu.classList.remove('active');
            this.elements.menuOverlay.classList.remove('active');
            this.elements.hamburgerMenu.querySelector('.hamburger-icon').classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    toggleMenu() {
        if (this.elements.slideMenu && this.elements.slideMenu.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    setupEventListeners() {
        // Debug: Check if elements exist
        console.log('Setting up event listeners...');
        console.log('Elements found:', {
            resetBtn: !!this.elements.resetBtn,
            backspaceBtn: !!this.elements.backspaceBtn,
            unscrambleBtn: !!this.elements.unscrambleBtn,
            hamburgerMenu: !!this.elements.hamburgerMenu,
            slideMenu: !!this.elements.slideMenu,
            menuOverlay: !!this.elements.menuOverlay,
            helpIcon: !!this.elements.helpIcon,
            calendarIcon: !!this.elements.calendarIcon,
            statsIcon: !!this.elements.statsIcon,
            settingsIcon: !!this.elements.settingsIcon
        });

        // Hamburger Menu Controls with mobile touch handling
        if (this.elements.hamburgerMenu) {
            this.addMobileTouchHandling(this.elements.hamburgerMenu, () => {
                this.toggleMenu();
            });
        }

        if (this.elements.closeMenu) {
            this.addMobileTouchHandling(this.elements.closeMenu, () => {
                this.closeMenu();
            });
        }

        if (this.elements.menuOverlay) {
            this.elements.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Menu Navigation Links with mobile touch handling
        if (this.elements.menuStatsLink) {
            this.addMobileTouchHandling(this.elements.menuStatsLink, async () => {
                this.closeMenu();
                await this.updateStatsDisplay();
                this.showModal(this.elements.statsModal);
            });
        }

        if (this.elements.menuCalendarLink) {
            this.addMobileTouchHandling(this.elements.menuCalendarLink, async () => {
                this.closeMenu();
                this.showModal(this.elements.calendarModal);
                await this.renderCalendar();
            });
        }

        if (this.elements.menuHelpLink) {
            this.addMobileTouchHandling(this.elements.menuHelpLink, () => {
                this.closeMenu();
                this.showModal(this.elements.helpModal);
            });
        }

        if (this.elements.menuTestPersistenceLink) {
            this.addMobileTouchHandling(this.elements.menuTestPersistenceLink, async () => {
                this.closeMenu();
                await this.testPersistence();
            });
        }

        // Music selection disabled
        if (this.elements.menuChangeSongLink) {
            // this.addMobileTouchHandling(this.elements.menuChangeSongLink, () => {
            //     this.closeMenu();
            //     this.showMusicSelection();
            //     this.playButtonClickSound();
            // });
        }

        // Menu Settings Toggles
        if (this.elements.menuSoundEffectsToggle) {
            this.elements.menuSoundEffectsToggle.addEventListener('change', (e) => {
                this.soundEffectsEnabled = e.target.checked;
                // Sync with old toggle if it exists
                if (this.elements.soundEffectsToggle) {
                    this.elements.soundEffectsToggle.checked = e.target.checked;
                }
                this.saveSettings();
            });
        }

        if (this.elements.menuBackgroundMusicToggle) {
            this.elements.menuBackgroundMusicToggle.addEventListener('change', (e) => {
                this.backgroundMusicEnabled = e.target.checked;
                // Sync with old toggle if it exists
                if (this.elements.backgroundMusicToggle) {
                    this.elements.backgroundMusicToggle.checked = e.target.checked;
                }
                this.toggleBackgroundMusic();
                this.saveSettings();
            });
        }

        // Game controls with mobile touch handling
        if (this.elements.resetBtn) {
            this.addMobileTouchHandling(this.elements.resetBtn, () => this.resetInput());
        }
        if (this.elements.backspaceBtn) {
            this.addMobileTouchHandling(this.elements.backspaceBtn, () => this.handleBackspace());
        }
        if (this.elements.unscrambleBtn) {
            this.addMobileTouchHandling(this.elements.unscrambleBtn, async () => {
                try {
                    await this.unscrambleCurrentWord();
                } catch (error) {
                    console.error('Error in unscramble:', error);
                }
            });
        }
        if (this.elements.revealLetterBtn) {
            this.addMobileTouchHandling(this.elements.revealLetterBtn, async () => {
                try {
                    await this.revealLetterHint();
                } catch (error) {
                    console.error('Error in reveal letter:', error);
                }
            });
        }
        if (this.elements.definitionBtn) {
            this.addMobileTouchHandling(this.elements.definitionBtn, () => {
                this.showDefinition();
            });
        }
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Close menu on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.slideMenu && this.elements.slideMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Calendar functionality
        if (this.elements.calendarIcon) {
            this.elements.calendarIcon.addEventListener('click', async () => {
                this.showModal(this.elements.calendarModal);
                await this.renderCalendar();
            });
        }

        if (this.elements.closeCalendar) {
            this.addMobileTouchHandling(this.elements.closeCalendar, () => {
                this.hideModal(this.elements.calendarModal);
            });
        }

        if (this.elements.prevMonth) {
            this.addMobileTouchHandling(this.elements.prevMonth, async () => {
                this.currentCalendarMonth--;
                if (this.currentCalendarMonth < 0) {
                    this.currentCalendarMonth = 11;
                    this.currentCalendarYear--;
                }
                await this.renderCalendar();
            });
        }

        if (this.elements.nextMonth) {
            this.addMobileTouchHandling(this.elements.nextMonth, async () => {
                this.currentCalendarMonth++;
                if (this.currentCalendarMonth > 11) {
                    this.currentCalendarMonth = 0;
                    this.currentCalendarYear++;
                }
                await this.renderCalendar();
            });
        }

        // Help functionality with mobile touch handling
        if (this.elements.helpIcon) {
            this.addMobileTouchHandling(this.elements.helpIcon, () => {
                this.showModal(this.elements.helpModal);
            });
        }

        if (this.elements.closeWelcome) {
            this.addMobileTouchHandling(this.elements.closeWelcome, () => {
                this.hideModal(this.elements.welcomeModal);
            });
        }

        if (this.elements.closeHelp) {
            this.addMobileTouchHandling(this.elements.closeHelp, () => {
                this.hideModal(this.elements.helpModal);
            });
        }

        // Stats functionality with mobile touch handling
        if (this.elements.statsIcon) {
            this.addMobileTouchHandling(this.elements.statsIcon, async () => {
                await this.updateStatsDisplay();
                this.showModal(this.elements.statsModal);
            });
        }

        if (this.elements.closeStats) {
            this.addMobileTouchHandling(this.elements.closeStats, () => {
                this.hideModal(this.elements.statsModal);
            });
        }

        if (this.elements.closeDefinition) {
            this.addMobileTouchHandling(this.elements.closeDefinition, () => {
                this.hideModal(this.elements.definitionModal);
            });
        }

        // Achievements functionality with mobile touch handling
        if (this.elements.menuAchievementsLink) {
            this.addMobileTouchHandling(this.elements.menuAchievementsLink, () => {
                this.closeMenu();
                this.showAchievements();
            });
        }

        if (document.getElementById('closeAchievements')) {
            this.addMobileTouchHandling(document.getElementById('closeAchievements'), () => {
                this.hideModal(document.getElementById('achievementsModal'));
            });
        }



        if (this.elements.closeSettings) {
            this.addMobileTouchHandling(this.elements.closeSettings, () => {
                this.hideModal(this.elements.settingsModal);
            });
        }

        // Music selection functionality disabled
        // console.log('🎵 Change song button found:', !!this.elements.changeSongBtn);
        // if (this.elements.changeSongBtn) {
        //     this.addMobileTouchHandling(this.elements.changeSongBtn, () => {
        //         console.log('🎵 Change song clicked!');
        //         this.showMusicSelection();
        //     });
        // }

        // if (this.elements.closeMusicSelection) {
        //     this.addMobileTouchHandling(this.elements.closeMusicSelection, () => {
        //         this.closeMusicSelection();
        //     });
        // }

        // Settings toggle listeners
        if (this.elements.soundEffectsToggle) {
            this.elements.soundEffectsToggle.addEventListener('change', (e) => {
                this.soundEffectsEnabled = e.target.checked;
                this.saveSettings();
            });
        }

        if (this.elements.backgroundMusicToggle) {
            this.elements.backgroundMusicToggle.addEventListener('change', (e) => {
                this.backgroundMusicEnabled = e.target.checked;
                this.toggleBackgroundMusic();
                this.saveSettings();
            });
        }

        // Ink drops click handler
        if (this.elements.inkDropsContainer) {
            this.addMobileTouchHandling(this.elements.inkDropsContainer, async () => {
                if (this.inkDrops === 0) {
                    await this.showInkDropsRefillModal();
                } else {
                    // Show info about ink drops
                    this.showInkDropsInfo();
                }
            });
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (this.elements.calendarModal && e.target === this.elements.calendarModal) {
                this.hideModal(this.elements.calendarModal);
            }
            if (this.elements.welcomeModal && e.target === this.elements.welcomeModal) {
                this.hideModal(this.elements.welcomeModal);
            }
            if (this.elements.helpModal && e.target === this.elements.helpModal) {
                this.hideModal(this.elements.helpModal);
            }
            if (this.elements.statsModal && e.target === this.elements.statsModal) {
                this.hideModal(this.elements.statsModal);
            }
            if (this.elements.settingsModal && e.target === this.elements.settingsModal) {
                this.hideModal(this.elements.settingsModal);
            }
            const achievementsModal = document.getElementById('achievementsModal');
            if (achievementsModal && e.target === achievementsModal) {
                this.hideModal(achievementsModal);
            }
            const pastChallengesModal = document.getElementById('pastChallengesModal');
            if (pastChallengesModal && e.target === pastChallengesModal) {
                this.closePastChallengesModal();
            }
        });

        // Achievement footer click handlers
        document.addEventListener('click', (e) => {
            const achievementIcon = e.target.closest('.achievement-icon-item');
            if (achievementIcon) {
                this.showAchievements();
            }
        });

        // Ink drops click handler
        if (this.elements.inkDropsContainer) {
            this.elements.inkDropsContainer.addEventListener('click', async (e) => {
                // Check if click was on refill button
                if (e.target.closest('.ink-drops-refill')) {
                    // Trigger ad watching for refill
                    await this.simulateAdWatch();
                } else if (e.target.closest('.ink-drops-display')) {
                    if (this.inkDrops === 0) {
                        // This shouldn't happen since display is hidden when empty, but just in case
                        await this.simulateAdWatch();
                    } else {
                        // Show info modal when drops are available
                        this.showInkDropsInfo();
                    }
                }
            });
        }

        // Set up congrats buttons (will be called when congrats is shown)
        this.setupCongratsButtons();
    }

    setupCongratsButtons() {
        console.log('🔧 Setting up congrats buttons...');

        // Use a more direct approach - wait for elements to be available
        setTimeout(() => {
            // Past challenges button
            const pastChallengesBtn = document.getElementById('pastChallengesBtn');
            console.log('🔍 Past challenges button found:', !!pastChallengesBtn);
            console.log('🔍 Button visible:', pastChallengesBtn ? window.getComputedStyle(pastChallengesBtn).display !== 'none' : false);

            if (pastChallengesBtn) {
                // Simple click event without mobile touch handling first
                pastChallengesBtn.onclick = async (e) => {
                    console.log('📅 Past challenges button clicked!');
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        this.showModal(this.elements.calendarModal);
                        await this.renderCalendar();
                    } catch (error) {
                        console.error('Error opening calendar:', error);
                    }
                };

                // Also add addEventListener as backup
                pastChallengesBtn.addEventListener('click', async (e) => {
                    console.log('📅 Past challenges button clicked (addEventListener)!');
                }, { once: false });

                // Add hover events to test if button is receiving events
                pastChallengesBtn.addEventListener('mouseenter', () => {
                    console.log('🖱️ Mouse entered past challenges button');
                });

                pastChallengesBtn.addEventListener('mouseleave', () => {
                    console.log('🖱️ Mouse left past challenges button');
                });
            }

            // Share button
            const shareFromCongratsBtn = document.getElementById('shareFromCongratsBtn');
            console.log('🔍 Share button found:', !!shareFromCongratsBtn);
            console.log('🔍 Button visible:', shareFromCongratsBtn ? window.getComputedStyle(shareFromCongratsBtn).display !== 'none' : false);

            if (shareFromCongratsBtn) {
                // Simple click event without mobile touch handling first
                shareFromCongratsBtn.onclick = (e) => {
                    console.log('📤 Share button clicked!');
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        const today = new Date();
                        const todayStr = this.formatDate(today);
                        this.shareQuote(todayStr);
                    } catch (error) {
                        console.error('Error sharing quote:', error);
                    }
                };

                // Also add addEventListener as backup
                shareFromCongratsBtn.addEventListener('click', (e) => {
                    console.log('📤 Share button clicked (addEventListener)!');
                }, { once: false });

                // Add hover events to test if button is receiving events
                shareFromCongratsBtn.addEventListener('mouseenter', () => {
                    console.log('🖱️ Mouse entered share button');
                });

                shareFromCongratsBtn.addEventListener('mouseleave', () => {
                    console.log('🖱️ Mouse left share button');
                });
            }
        }, 200); // Increased delay to ensure DOM is ready
    }

    setupCongratsEventDelegation() {
        // Set up event delegation on the congrats container
        const congratsContainer = document.getElementById('congrats');
        if (congratsContainer) {
            congratsContainer.addEventListener('click', async (e) => {
                console.log('🎯 Click detected in congrats container:', e.target.id);

                if (e.target.id === 'pastChallengesBtn' || e.target.closest('#pastChallengesBtn')) {
                    console.log('📅 Past challenges clicked via delegation!');
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        this.showModal(this.elements.calendarModal);
                        await this.renderCalendar();
                    } catch (error) {
                        console.error('Error opening calendar via delegation:', error);
                    }
                }

                if (e.target.id === 'shareFromCongratsBtn' || e.target.closest('#shareFromCongratsBtn')) {
                    console.log('📤 Share clicked via delegation!');
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                        const today = new Date();
                        const todayStr = this.formatDate(today);
                        this.shareQuote(todayStr);
                    } catch (error) {
                        console.error('Error sharing via delegation:', error);
                    }
                }
            });
        }
    }

    async checkForSharedChallenge() {
        const urlParams = new URLSearchParams(window.location.search);
        const challengeDate = urlParams.get('challenge');

        if (challengeDate) {
            // Load the shared challenge
            const quote = this.quotes.find(q => q.date === challengeDate);
            if (quote) {
                console.log(`Loading shared challenge for ${challengeDate}`);
                await this.loadChallengeForDate(challengeDate);

                // Clear the URL parameter to avoid reloading on refresh
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
                return true; // Indicates a shared challenge was loaded
            }
        }
        return false; // No shared challenge
    }

    async checkQuoteCompletionStatus() {
        const today = new Date();
        const todayStr = this.formatDate(today);
        let userData = await this.loadUserData();

        // Ensure userData has the expected structure
        if (!userData || typeof userData !== 'object') {
            console.warn('⚠️ Invalid user data, creating default structure...');
            userData = {
                puzzles: {},
                stats: { totalSolved: 0, currentStreak: 0, maxStreak: 0, totalTime: 0, lastPlayed: null },
                achievements: {},
                inkDrops: { count: 0, lastRefresh: null }
            };
        }

        // Ensure puzzles object exists
        if (!userData.puzzles || typeof userData.puzzles !== 'object') {
            console.warn('⚠️ Puzzles object missing, initializing...');
            userData.puzzles = {};
        }

        const puzzleData = userData.puzzles[todayStr];

        if (puzzleData) {
            // Today's puzzle is already completed, treat it like any other completed challenge
            this.gameComplete = true;
            this.solvedWords = new Set(puzzleData.solvedWords || []);
            this.authorSolved = puzzleData.authorSolved || false;
            this.gameTime = puzzleData.time || 0;
            this.startTime = new Date(todayStr);
            this.endTime = new Date(todayStr); // Use original completion time

            // Hide input area and congrats for completed challenges (same as past challenges)
            this.elements.inputArea.classList.remove('show');
            this.elements.congrats.classList.remove('show');
            document.querySelector('.newspaper-container').classList.remove('puzzle-complete');

            const quoteContainer = document.querySelector('.quote-container');
            quoteContainer.classList.add('quote-complete');

            // Show action buttons for completed challenges (same as past challenges)
            this.showCompletedChallengeButtons(todayStr);

            // Disable interactive elements for completed challenges
            this.disableInteractiveElements();
        }
    }

    async isQuoteCompleted() {
        const today = new Date();
        const todayStr = this.formatDate(today);
        const userData = await this.loadUserData();
        return userData.puzzles[todayStr] !== undefined;
    }

    // replayChallenge method removed - no longer needed since completed challenges are view-only

    async showPastChallenges() {
        const userData = await this.loadUserData();
        const completedPuzzles = Object.entries(userData.puzzles)
            .filter(([date, puzzle]) => puzzle.solved)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

        let challengesHtml = '<div class="past-challenges-container">';
        challengesHtml += '<h3>Past Challenges</h3>';
        challengesHtml += '<div class="challenges-list">';

        if (completedPuzzles.length === 0) {
            challengesHtml += '<p>No completed challenges yet. Start solving today\'s puzzle!</p>';
        } else {
            completedPuzzles.forEach(([date, puzzle]) => {
                const puzzleDate = new Date(date);
                const formattedDate = puzzleDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });

                challengesHtml += `
                    <div class="challenge-item" data-date="${date}">
                        <div class="challenge-date">${formattedDate}</div>
                        <div class="challenge-time">${puzzle.time}s</div>
                        <div class="challenge-status">Completed</div>
                    </div>
                `;
            });
        }

        challengesHtml += '</div></div>';

        // Create or update modal for past challenges
        let modal = document.getElementById('pastChallengesModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'pastChallengesModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Past Challenges</h2>
                        <span class="close" onclick="game.closePastChallengesModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${challengesHtml}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.querySelector('.modal-body').innerHTML = challengesHtml;
        }

        this.showModal(modal);
    }

    closePastChallengesModal() {
        const modal = document.getElementById('pastChallengesModal');
        if (modal) {
            this.hideModal(modal);
        }
    }

    // Wait for Arkadium SDK to be fully initialized
    async waitForSDKInitialization() {
        if (!this.arkadium) {
            console.log('🎮 No Arkadium integration available');
            return;
        }

        // Wait up to 5 seconds for SDK to initialize
        const maxWaitTime = 5000;
        const checkInterval = 100;
        let waitedTime = 0;

        while (!this.arkadium.isInitialized && waitedTime < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waitedTime += checkInterval;
        }

        if (this.arkadium.isInitialized) {
            console.log('🎮 Arkadium SDK initialization complete');
        } else {
            console.warn('⚠️ Arkadium SDK initialization timed out, proceeding anyway');
        }
    }

    // Set up Arkadium pause/resume event listeners
    setupArkadiumEventListeners() {
        // Note: Pause/resume events are registered with Arkadium but no action needed
        // for turn-based games like Daily Quote Puzzle (no automatic progression)

        // Listen for authentication status changes
        window.addEventListener('arkadium-auth-status-changed', (event) => {
            console.log('🔐 Authentication status changed:', event.detail.isAuthorized);
            this.handleAuthStatusChange(event.detail.isAuthorized);
        });

        // Listen for auth form open/close events
        window.addEventListener('arkadium-auth-form-changed', (event) => {
            console.log('🔐 Auth form status changed:', event.detail.isOpened);
            this.handleAuthFormChange(event.detail.isOpened);
        });
    }

    // Note: Pause/resume functionality removed as it's not needed for turn-based games
    // The Daily Quote Puzzle has no automatic progression that requires pausing

    // Notify game start on first user interaction
    notifyGameStartIfNeeded() {
        if (this.arkadium && !this.arkadium.gameStarted && !this.gameComplete) {
            this.arkadium.notifyGameStart();
        }
    }

    // Calculate current score based on game progress
    calculateCurrentScore() {
        const wordsCompleted = this.solvedWords.size;
        const authorBonus = this.authorSolved ? 100 : 0;
        const timeBonus = this.gameComplete ? Math.max(0, 300 - Math.floor(this.gameTime)) : 0;
        const hintPenalty = this.hintsUsedThisPuzzle * 10;

        return Math.max(0, (wordsCompleted * 50) + authorBonus + timeBonus - hintPenalty);
    }

    // Handle authentication sync when user logs in/out
    async handleAuthenticationSync() {
        if (!this.arkadium || !this.arkadium.isInitialized) {
            return;
        }

        try {
            const isAuthenticated = await this.arkadium.checkAuthentication();

            if (isAuthenticated) {
                console.log('🔐 User is authenticated, checking for data sync');

                // Try to load remote data and merge with local if needed
                const remoteData = await this.arkadium.loadUserProgress();
                const localData = JSON.parse(localStorage.getItem('quotePuzzleUserData') || '{}');

                if (remoteData && Object.keys(localData).length > 0) {
                    // Both exist, need to merge (prefer remote for conflicts, but keep local additions)
                    console.log('🔄 Merging local and remote data');
                    const mergedData = this.mergeUserData(localData, remoteData);
                    await this.arkadium.saveUserProgress(mergedData);
                } else if (!remoteData && Object.keys(localData).length > 0) {
                    // Only local data exists, sync to remote
                    console.log('🔄 Syncing local data to remote');
                    await this.arkadium.saveUserProgress(localData);
                } else if (remoteData && Object.keys(localData).length === 0) {
                    // Only remote data exists, sync to local
                    console.log('🔄 Syncing remote data to local');
                    localStorage.setItem('quotePuzzleUserData', JSON.stringify(remoteData));
                }
            }
        } catch (error) {
            console.error('❌ Error handling authentication sync:', error);
        }
    }

    // Merge user data from different sources (prefer remote, but keep local additions)
    mergeUserData(localData, remoteData) {
        const merged = { ...remoteData };

        // Merge puzzles (keep the most recent completion for each date)
        if (localData.puzzles) {
            merged.puzzles = merged.puzzles || {};
            for (const [date, puzzle] of Object.entries(localData.puzzles)) {
                if (!merged.puzzles[date] ||
                    (puzzle.completedAt && (!merged.puzzles[date].completedAt ||
                        new Date(puzzle.completedAt) > new Date(merged.puzzles[date].completedAt)))) {
                    merged.puzzles[date] = puzzle;
                }
            }
        }

        // Merge achievements (keep the best progress)
        if (localData.achievements) {
            merged.achievements = merged.achievements || {};
            for (const [id, achievement] of Object.entries(localData.achievements)) {
                if (!merged.achievements[id] ||
                    (achievement.unlockedAt && !merged.achievements[id].unlockedAt)) {
                    merged.achievements[id] = achievement;
                }
            }
        }

        // Merge statistics (keep the best values)
        if (localData.stats) {
            merged.stats = merged.stats || {};
            merged.stats.totalSolved = Math.max(merged.stats.totalSolved || 0, localData.stats.totalSolved || 0);
            merged.stats.maxStreak = Math.max(merged.stats.maxStreak || 0, localData.stats.maxStreak || 0);
            merged.stats.totalTime = (merged.stats.totalTime || 0) + (localData.stats.totalTime || 0);

            // Use the most recent lastPlayed
            if (localData.stats.lastPlayed &&
                (!merged.stats.lastPlayed || new Date(localData.stats.lastPlayed) > new Date(merged.stats.lastPlayed))) {
                merged.stats.lastPlayed = localData.stats.lastPlayed;
            }
        }

        // Merge ink drops (keep the higher count)
        if (localData.inkDrops) {
            merged.inkDrops = merged.inkDrops || {};
            merged.inkDrops.count = Math.max(merged.inkDrops.count || 0, localData.inkDrops.count || 0);

            // Use the most recent refresh date
            if (localData.inkDrops.lastRefresh &&
                (!merged.inkDrops.lastRefresh || new Date(localData.inkDrops.lastRefresh) > new Date(merged.inkDrops.lastRefresh))) {
                merged.inkDrops.lastRefresh = localData.inkDrops.lastRefresh;
            }
        }

        console.log('✅ Data merged successfully');
        return merged;
    }

    // Handle authentication status changes
    async handleAuthStatusChange(isAuthorized) {
        try {
            if (isAuthorized) {
                console.log('🔐 User logged in, updating UI and syncing data');

                // Get user profile and update UI
                const authInfo = await this.arkadium.getAuthInfo();
                this.updateUIForAuthenticatedUser(authInfo);

                // Sync data
                await this.handleAuthenticationSync();

                // Show welcome message
                this.showAuthMessage(`Welcome back, ${authInfo.username || 'Player'}!`, 'success');
            } else {
                console.log('🔐 User logged out, updating UI');
                this.updateUIForUnauthenticatedUser();
                this.showAuthMessage('You have been logged out', 'info');
            }
        } catch (error) {
            console.error('❌ Error handling auth status change:', error);
        }
    }

    // Handle auth form open/close
    handleAuthFormChange(isOpened) {
        try {
            if (isOpened) {
                console.log('🔐 Auth form opened');
                // Optionally pause game or show loading state
                document.body.classList.add('auth-form-open');
            } else {
                console.log('🔐 Auth form closed');
                // Resume game
                document.body.classList.remove('auth-form-open');
            }
        } catch (error) {
            console.error('❌ Error handling auth form change:', error);
        }
    }

    // Update UI for authenticated user
    updateUIForAuthenticatedUser(authInfo) {
        try {
            // Update user display in header or menu
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.innerHTML = `
                    <div class="user-info">
                        <span class="username">${authInfo.username || 'Player'}</span>
                        ${authInfo.isSubscriber ? '<span class="subscriber-badge">⭐</span>' : ''}
                        ${authInfo.avatar ? `<img src="${authInfo.avatar}" class="user-avatar" alt="Avatar">` : ''}
                    </div>
                `;
                userDisplay.style.display = 'block';
            }

            // Show cloud sync indicator
            this.showCloudSyncStatus(true);

            // Update any subscriber-only features
            if (authInfo.isSubscriber) {
                this.enableSubscriberFeatures();
            }
        } catch (error) {
            console.error('❌ Error updating UI for authenticated user:', error);
        }
    }

    // Update UI for unauthenticated user
    updateUIForUnauthenticatedUser() {
        try {
            // Hide user display
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay) {
                userDisplay.style.display = 'none';
            }

            // Show local storage indicator
            this.showCloudSyncStatus(false);

            // Disable subscriber features
            this.disableSubscriberFeatures();
        } catch (error) {
            console.error('❌ Error updating UI for unauthenticated user:', error);
        }
    }

    // Show cloud sync status
    showCloudSyncStatus(isCloudSynced) {
        try {
            let syncIndicator = document.getElementById('cloudSyncIndicator');
            if (!syncIndicator) {
                // Create sync indicator if it doesn't exist
                syncIndicator = document.createElement('div');
                syncIndicator.id = 'cloudSyncIndicator';
                syncIndicator.className = 'sync-indicator';

                // Add to header or appropriate location
                const header = document.querySelector('.header-icons');
                if (header) {
                    header.appendChild(syncIndicator);
                }
            }

            if (isCloudSynced) {
                syncIndicator.innerHTML = '<i class="fas fa-cloud"></i>';
                syncIndicator.title = 'Progress synced to cloud';
                syncIndicator.className = 'sync-indicator cloud-synced';
            } else {
                syncIndicator.innerHTML = '<i class="fas fa-hdd"></i>';
                syncIndicator.title = 'Progress saved locally';
                syncIndicator.className = 'sync-indicator local-only';
            }
        } catch (error) {
            console.error('❌ Error showing cloud sync status:', error);
        }
    }

    // Show authentication message
    showAuthMessage(message, type = 'info') {
        try {
            // Create or update auth message element
            let authMessage = document.getElementById('authMessage');
            if (!authMessage) {
                authMessage = document.createElement('div');
                authMessage.id = 'authMessage';
                authMessage.className = 'auth-message';
                document.body.appendChild(authMessage);
            }

            authMessage.textContent = message;
            authMessage.className = `auth-message ${type} show`;

            // Auto-hide after 3 seconds
            setTimeout(() => {
                authMessage.classList.remove('show');
            }, 3000);
        } catch (error) {
            console.error('❌ Error showing auth message:', error);
        }
    }

    // Enable subscriber features
    enableSubscriberFeatures() {
        try {
            // Add subscriber class to body for CSS styling
            document.body.classList.add('user-subscriber');

            // Enable any subscriber-only features
            console.log('⭐ Subscriber features enabled');
        } catch (error) {
            console.error('❌ Error enabling subscriber features:', error);
        }
    }

    // Disable subscriber features
    disableSubscriberFeatures() {
        try {
            // Remove subscriber class
            document.body.classList.remove('user-subscriber');

            console.log('👤 Standard user features active');
        } catch (error) {
            console.error('❌ Error disabling subscriber features:', error);
        }
    }

    // Trigger login flow
    async triggerLogin() {
        try {
            if (!this.arkadium || !this.arkadium.isInitialized) {
                console.log('🔐 Arkadium not available, cannot trigger login');
                return false;
            }

            console.log('🔐 Triggering login flow...');
            const result = await this.arkadium.handleUserLogin();

            if (result.success) {
                if (result.alreadyAuthorized) {
                    this.showAuthMessage('You are already logged in!', 'info');
                } else if (result.authFormOpened) {
                    this.showAuthMessage('Please complete login in the popup', 'info');
                }
                return true;
            } else {
                this.showAuthMessage('Login failed. Please try again.', 'error');
                return false;
            }
        } catch (error) {
            console.error('❌ Error triggering login:', error);
            this.showAuthMessage('Login error. Please try again.', 'error');
            return false;
        }
    }

    // Get current user info
    async getCurrentUserInfo() {
        if (!this.arkadium || !this.arkadium.isInitialized) {
            return null;
        }

        try {
            return await this.arkadium.getAuthInfo();
        } catch (error) {
            console.error('❌ Error getting current user info:', error);
            return null;
        }
    }

    async testPersistence() {
        console.log('🧪 Testing Arkadium persistence...');

        // Test data
        const testData = {
            testKey: 'testValue',
            timestamp: new Date().toISOString(),
            gameData: {
                testScore: 100,
                testLevel: 5
            }
        };

        try {
            // Test authentication
            console.log('🔐 Testing authentication...');
            const isAuthenticated = await this.arkadium.checkAuthentication();
            console.log('✅ Authentication result:', isAuthenticated);

            // Test specialized persistence methods
            console.log('💾 Testing user progress save...');
            const progressSaveResult = await this.arkadium.saveUserProgress(testData);
            console.log('✅ Progress save result:', progressSaveResult);

            console.log('📂 Testing user progress load...');
            const progressLoadResult = await this.arkadium.loadUserProgress();
            console.log('✅ Progress load result:', progressLoadResult);

            // Test game state persistence
            console.log('💾 Testing game state save...');
            const gameStateSaveResult = await this.arkadium.saveGameState({ test: 'gameState' });
            console.log('✅ Game state save result:', gameStateSaveResult);

            console.log('📂 Testing game state load...');
            const gameStateLoadResult = await this.arkadium.loadGameState();
            console.log('✅ Game state load result:', gameStateLoadResult);

            // Test achievements persistence
            console.log('🏆 Testing achievements save...');
            const achievementsSaveResult = await this.arkadium.saveAchievements({ test: 'achievements' });
            console.log('✅ Achievements save result:', achievementsSaveResult);

            console.log('🏆 Testing achievements load...');
            const achievementsLoadResult = await this.arkadium.loadAchievements();
            console.log('✅ Achievements load result:', achievementsLoadResult);

            // Test sync functionality
            if (isAuthenticated) {
                console.log('🔄 Testing data sync...');
                const syncResult = await this.arkadium.syncAllDataToRemote();
                console.log('✅ Sync result:', syncResult);
            }

            // Test cookie functionality
            console.log('🍪 Testing cookie retrieval...');
            const cookieResult = await this.arkadium.getCookie('test_cookie');
            console.log('✅ Cookie result:', cookieResult);

            // Show results in alert
            const message = `Persistence Test Results:
            
Remote Save: ${saveResult ? '✅ Success' : '❌ Failed'}
Remote Load: ${loadedData ? '✅ Success' : '❌ Failed'}
Local Save: ${localSaveResult ? '✅ Success' : '❌ Failed'}
Local Load: ${localLoadedData ? '✅ Success' : '❌ Failed'}

Check console for detailed logs.`;

            alert(message);

        } catch (error) {
            console.error('❌ Persistence test failed:', error);
            alert('Persistence test failed. Check console for details.');
        }
    }

    // Music selection methods - disabled
    showMusicSelection() {
        // Music selection disabled
        console.log('🎵 Music selection is disabled');
        return;
        // this.renderMusicTracks();
        // this.elements.musicSelectionModal.style.display = 'flex';
    }

    closeMusicSelection() {
        // Music selection disabled
        return;
        // this.elements.musicSelectionModal.style.display = 'none';
    }

    renderMusicTracks() {
        // Music selection disabled
        console.log('🎵 Music tracks rendering is disabled');
        return;
    }

    async handleMusicTrackClick(card) {
        // Music selection disabled
        console.log('🎵 Music track selection is disabled');
        return;
    }

    async unlockMusicTrack(trackKey) {
        // Music selection disabled
        console.log('🎵 Music track unlocking is disabled');
        return;
    }

    selectMusicTrack(trackKey) {
        // Music selection disabled
        console.log('🎵 Music track selection is disabled');
        return;
    }

    saveMusicTracks() {
        // Music selection disabled
        console.log('🎵 Music tracks saving is disabled');
        return;
    }

    loadMusicTracks() {
        // Music selection disabled
        console.log('🎵 Music tracks loading is disabled');
        return;
    }

    // Get week start (Monday)
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    }

    // Calculate time until next day (midnight)
    getTimeUntilNextDay() {
        const now = new Date();
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0); // Set to midnight of next day
        const diff = nextMidnight - now; // Difference in milliseconds

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds, totalMilliseconds: diff };
    }

    // Create and update the countdown display
    createOrUpdateCountdown() {
        // Get the countdown elements
        const congratsCountdownElement = document.getElementById('congratsCountdown');
        const completedCountdownElement = document.getElementById('completedCountdown');

        // No need to show/hide anything since we only have the simple countdown now

        // Update every second
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => {
            const time = this.getTimeUntilNextDay();
            if (time.totalMilliseconds <= 0) {
                // If we've reached the next day, stop the countdown
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                return;
            }

            // Update the countdown displays
            const formattedTime = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;

            if (congratsCountdownElement) {
                congratsCountdownElement.textContent = formattedTime;
            }

            if (completedCountdownElement) {
                completedCountdownElement.textContent = formattedTime;
            }
        }, 1000);
    }

    // Format the countdown time as HH:MM:SS or MM:SS if less than an hour
    formatCountdownTime(time) {
        const { hours, minutes, seconds } = time;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Check if this is the first time the player has visited
    async checkFirstTimeVisit() {
        try {
            const userData = await this.loadUserData();

            // Check if user has any completed puzzles or if this is their first visit
            const hasCompletedPuzzles = userData && userData.puzzles &&
                Object.values(userData.puzzles).some(puzzle => puzzle.solved);

            if (!hasCompletedPuzzles) {
                // This is the first time, show welcome modal
                setTimeout(() => {
                    if (this.elements.welcomeModal) {
                        this.showModal(this.elements.welcomeModal);
                    }
                }, 1000); // Show after 1 second to let the game load
            }
        } catch (error) {
            console.error('Error checking first time visit:', error);
        }
    }

    // Update achievements when game loads
    async updateAchievementsOnLoad() {
        try {
            const userData = await this.loadUserData();

            // Ensure achievements manager is properly initialized with loaded data
            if (this.achievementsManager) {
                console.log('🏆 Re-initializing achievements manager with loaded data');
                console.log('🏆 Loaded achievements data:', userData.achievements);
                this.achievementsManager.initializeFromUserData(userData);

                // Log achievements manager state after initialization
                console.log('🏆 Achievements manager state after init:', this.achievementsManager.userAchievements);
            }

            // Validate achievement states and check for unclaimed rewards
            console.log('🔍 Validating achievement states...');

            // Run automatic recovery if needed
            const unclaimedBefore = this.achievementsManager.getUnclaimedRewards().length;
            if (userData.puzzles && Object.keys(userData.puzzles).length > 0) {
                this.achievementsManager.recalculateAllProgress(userData);
            }

            const unclaimedRewards = this.achievementsManager.getUnclaimedRewards();
            if (unclaimedRewards.length > 0) {
                console.log(`🎁 Found ${unclaimedRewards.length} unclaimed achievement rewards:`, unclaimedRewards);

                // Show notification if we found new unclaimed rewards
                if (unclaimedRewards.length > unclaimedBefore) {
                    console.log(`🔔 ${unclaimedRewards.length - unclaimedBefore} achievement rewards are ready to collect!`);
                }
            }

            // Only update achievements if we have puzzle data to work with
            // Don't run achievement checks on initial load as this might reset progress
            if (this.currentQuote && userData.puzzles && Object.keys(userData.puzzles).length > 0) {
                console.log('🏆 Running achievement checks on load...');
                await this.updateAchievements(userData);
                await this.saveUserData(userData);
            } else {
                console.log('🏆 Skipping achievement checks on initial load (no puzzle data)');
                // Still save if we fixed any states during validation
                if (unclaimedRewards.length > 0) {
                    console.log('💾 Saving user data after achievement state validation');
                    await this.saveUserData(userData);
                }
            }

            this.updateAchievementFooter();
        } catch (error) {
            console.error('Error updating achievements on load:', error);
        }
    }

    // Debug method to test achievement persistence flow
    async debugAchievementFlow() {
        console.log('🔍 === DEBUGGING ACHIEVEMENT FLOW ===');

        // 1. Check current achievements manager state
        console.log('🏆 Current achievements manager state:');
        console.log('  User achievements:', this.achievementsManager.userAchievements);
        console.log('  Total achievements:', Object.keys(this.achievementsManager.achievements).length);

        // 2. Load user data and check achievements
        const userData = await this.loadUserData();
        console.log('📂 Loaded user data achievements:', userData.achievements);

        // 3. Manually trigger an achievement
        console.log('🏆 Manually triggering first puzzle achievement...');
        const reward = this.achievementsManager.checkBeginningAchievements(1);
        console.log('🎁 Achievement reward:', reward);

        // 4. Check achievements manager state after trigger
        console.log('🏆 Achievements manager after trigger:');
        console.log('  User achievements:', this.achievementsManager.userAchievements);

        // 5. Save user data
        console.log('💾 Saving user data...');
        await this.saveUserData(userData);

        // 6. Reload and check persistence
        console.log('📂 Reloading user data...');
        const reloadedData = await this.loadUserData();
        console.log('📂 Reloaded achievements:', reloadedData.achievements);

        // 7. Test Arkadium persistence directly
        if (this.arkadium) {
            console.log('🔍 Testing Arkadium persistence directly...');
            const arkadiumResult = await this.arkadium.debugAchievementsPersistence();
            console.log('🔍 Arkadium test result:', arkadiumResult);
        }

        console.log('🔍 === END ACHIEVEMENT FLOW DEBUG ===');
    }

    // Helper functions for modal animations
    showModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            // Force reflow to ensure display change is applied
            modal.offsetHeight;
            modal.classList.add('show');
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Match the CSS transition duration
        }
    }

    // Hide loading screen when game is ready
    hideLoadingScreen() {
        console.log('🎯 hideLoadingScreen() called');
        const loadingScreen = document.getElementById('loadingScreen');
        const body = document.body;
        
        if (loadingScreen && body) {
            console.log('✅ Loading screen elements found, hiding...');
            // Add fade-out class to trigger CSS transition
            loadingScreen.classList.add('fade-out');
            
            // Remove loading class from body to show main content
            body.classList.remove('loading');
            
            // Remove loading screen from DOM after animation completes
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                    console.log('✅ Loading screen removed from DOM');
                }
            }, 500); // Match the CSS transition duration
        } else {
            console.warn('⚠️ Loading screen elements not found:', { loadingScreen: !!loadingScreen, body: !!body });
        }
    }

    // Update achievement counter in modal header
    updateAchievementCounter() {
        try {
            const counterElement = document.getElementById('achievementCounter');
            if (!counterElement) return;

            const allAchievements = this.achievementsManager.achievements;
            const userAchievements = this.achievementsManager.userAchievements;

            const totalAchievements = Object.keys(allAchievements).length;
            const completedAchievements = Object.keys(userAchievements).filter(id =>
                userAchievements[id] && userAchievements[id].completed
            ).length;

            counterElement.textContent = `${completedAchievements}/${totalAchievements}`;

            console.log(`🏆 Achievement counter updated: ${completedAchievements}/${totalAchievements}`);
        } catch (error) {
            console.error('Error updating achievement counter:', error);
        }
    }

    showDefinition() {
        if (!this.activeWord) {
            // Show a message that no word is selected
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2>No Word Selected</h2>
                        <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
                    </div>
                    <div style="padding: 20px; text-align: center;">
                        <p>Please select a word first to see its definition.</p>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            return;
        }

        // Show the definition modal
        this.showModal(this.elements.definitionModal);
        
        // Show loading state
        this.elements.definitionText.innerHTML = `
            <div class="definition-loading">
                <i class="fas fa-spinner fa-spin"></i> Looking up definition...
            </div>
        `;

        // Fetch definition - clean the word of punctuation
        const cleanWord = this.cleanWordForDefinition(this.activeWord.original);
        console.log(`🧹 Original word: "${this.activeWord.original}", Cleaned word: "${cleanWord}"`);
        this.fetchDefinition(cleanWord);
    }

    // Helper function to clean word for definition lookup (remove punctuation)
    cleanWordForDefinition(word) {
        if (!word) return '';
        
        // Remove all punctuation and extra whitespace
        return word.replace(/[^\w\s]/g, '').trim().toLowerCase();
    }

    // Generate all word forms that should be filtered from definitions
    generateWordsToFilter(originalWord, baseWord) {
        const wordsToFilter = new Set();
        
        // Collect all base words to work with
        const baseWords = [];
        if (originalWord) baseWords.push(originalWord.toLowerCase());
        if (baseWord && baseWord !== originalWord?.toLowerCase()) baseWords.push(baseWord.toLowerCase());
        
        // For each base word, generate all possible variations
        baseWords.forEach(word => {
            if (!word) return;
            
            // Add the word itself
            wordsToFilter.add(word);
            
            // Standard inflections
            wordsToFilter.add(word + 's');
            wordsToFilter.add(word + 'es');
            wordsToFilter.add(word + 'ed');
            wordsToFilter.add(word + 'ing');
            wordsToFilter.add(word + 'er');
            wordsToFilter.add(word + 'est');
            wordsToFilter.add(word + 'ly');
            wordsToFilter.add(word + 'ness');
            wordsToFilter.add(word + 'ment');
            wordsToFilter.add(word + 'able');
            wordsToFilter.add(word + 'ible');
            
            // Handle words ending in 'e'
            if (word.endsWith('e')) {
                const stem = word.slice(0, -1);
                wordsToFilter.add(stem + 'ing');
                wordsToFilter.add(stem + 'ed');
                wordsToFilter.add(stem + 'er');
                wordsToFilter.add(stem + 'est');
                wordsToFilter.add(stem + 'able');
            }
            
            // Handle words ending in 'y'
            if (word.endsWith('y') && word.length > 2) {
                const stem = word.slice(0, -1);
                wordsToFilter.add(stem + 'ies');
                wordsToFilter.add(stem + 'ied');
                wordsToFilter.add(stem + 'ier');
                wordsToFilter.add(stem + 'iest');
                wordsToFilter.add(stem + 'ily');
                wordsToFilter.add(stem + 'iness');
            }
            
            // Handle doubled consonants (run -> running, get -> getting)
            if (word.length > 2) {
                const lastChar = word.slice(-1);
                if (/[bcdfghjklmnpqrstvwxyz]/.test(lastChar) && !/[aeiou]/.test(word.slice(-2, -1))) {
                    wordsToFilter.add(word + lastChar + 'ing');
                    wordsToFilter.add(word + lastChar + 'ed');
                    wordsToFilter.add(word + lastChar + 'er');
                    wordsToFilter.add(word + lastChar + 'est');
                }
            }
            
            // Special case for "fail" -> "failure"
            if (word === 'fail') {
                wordsToFilter.add('failure');
                wordsToFilter.add('failures');
            }
            
            // Handle -tion, -sion endings
            if (word.endsWith('t') || word.endsWith('te')) {
                const stem = word.endsWith('te') ? word.slice(0, -2) : word.slice(0, -1);
                wordsToFilter.add(stem + 'tion');
                wordsToFilter.add(stem + 'tions');
            }
        });
        
        // Also add common irregular forms manually for specific words
        const irregularForms = {
            'fail': ['failure', 'failures', 'failed', 'failing', 'fails'],
            'run': ['ran', 'running', 'runs'],
            'go': ['went', 'going', 'goes', 'gone'],
            'get': ['got', 'gotten', 'getting', 'gets'],
            'make': ['made', 'making', 'makes'],
            'take': ['took', 'taken', 'taking', 'takes'],
            'come': ['came', 'coming', 'comes'],
            'see': ['saw', 'seen', 'seeing', 'sees'],
            'know': ['knew', 'known', 'knowing', 'knows'],
            'think': ['thought', 'thinking', 'thinks'],
            'feel': ['felt', 'feeling', 'feels']
        };
        
        baseWords.forEach(word => {
            if (irregularForms[word]) {
                irregularForms[word].forEach(form => wordsToFilter.add(form));
            }
        });
        
        const result = Array.from(wordsToFilter).filter(word => word && word.length > 1);
        console.log(`🎯 Generated ${result.length} word variations to filter:`, result);
        return result;
    }

    // Check if a definition contains any of the target words
    definitionContainsTargetWord(text, wordsToFilter) {
        if (!text || !wordsToFilter) return false;
        
        const lowerText = text.toLowerCase();
        
        const containsWord = wordsToFilter.some(word => {
            // Use word boundaries to avoid partial matches
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
            const matches = regex.test(lowerText);
            if (matches) {
                console.log(`🚫 Found "${word}" in text: "${text}"`);
            }
            return matches;
        });
        
        return containsWord;
    }

    // Helper function to clean definition text by removing the target word
    cleanDefinitionText(text, targetWord) {
        if (!text || !targetWord) return text;
        
        // Create variations of the word to remove
        const wordVariations = [
            targetWord.toLowerCase(),
            targetWord.charAt(0).toUpperCase() + targetWord.slice(1).toLowerCase(),
            targetWord.toUpperCase(),
            targetWord.toLowerCase() + 's', // plural
            targetWord.toLowerCase() + 'ed', // past tense
            targetWord.toLowerCase() + 'ing', // present participle
        ];
        
        let cleanedText = text;
        
        // Replace word variations with [word]
        wordVariations.forEach(variation => {
            const regex = new RegExp(`\\b${variation}\\b`, 'gi');
            cleanedText = cleanedText.replace(regex, '[word]');
        });
        
        return cleanedText;
    }

    async fetchDefinition(word) {
        console.log(`🎯 Starting definition fetch for word: "${word}"`);
        try {
            // Try primary API first
            let data = await this.tryDictionaryAPI(word);
            
            // If primary fails, try fallback approaches
            if (!data) {
                console.log(`🔄 Primary API failed, trying fallback for "${word}"`);
                data = await this.tryFallbackDefinition(word);
            }
            
            if (data) {
                console.log(`✅ Definition found, displaying for "${word}"`);
                this.displayDefinition(data, word);
            } else {
                console.log(`❌ No definition found anywhere for "${word}"`);
                throw new Error('No definition found');
            }
        } catch (error) {
            console.error('❌ Error fetching definition:', error);
            this.elements.definitionText.innerHTML = `
                <div class="definition-error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Sorry, we couldn't find a definition for this word. 
                    <br><br>
                    <div style="font-size: 12px; color: #888;">
                        This might be a proper noun, specialized term, or variant spelling.
                        Try checking if it's part of a compound word or has a different form.
                    </div>
                </div>
            `;
        }
    }

    async tryDictionaryAPI(word) {
        try {
            console.log(`🔍 Trying primary API for word: "${word}"`);
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
            console.log(`📡 API response status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`📊 API data received:`, data);
                if (data && data.length > 0) {
                    console.log(`✅ Primary API success for "${word}"`);
                    return data;
                }
            } else {
                console.log(`❌ API response not ok: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.log('❌ Primary API failed:', error);
        }
        console.log(`❌ Primary API returned null for "${word}"`);
        return null;
    }

    async tryFallbackDefinition(word) {
        // Generate comprehensive word variations
        const variations = this.generateWordVariations(word.toLowerCase());
        console.log(`🔄 Trying fallback variations for "${word}":`, variations);

        for (const variation of variations) {
            if (variation !== word.toLowerCase() && variation.length > 2) {
                try {
                    console.log(`🔍 Trying variation: "${variation}"`);
                    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${variation}`);
                    console.log(`📡 Variation "${variation}" response status: ${response.status}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.length > 0) {
                            console.log(`✅ Fallback success with variation "${variation}"`);
                            // Add a note that this is a variation
                            data[0].isVariation = true;
                            data[0].originalWord = word;
                            data[0].baseWord = variation;
                            return data;
                        }
                    }
                } catch (error) {
                    console.log(`❌ Error with variation "${variation}":`, error);
                    continue;
                }
            }
        }
        console.log(`❌ All fallback variations failed for "${word}"`);
        return null;
    }

    generateWordVariations(word) {
        const variations = new Set();
        
        // Add the original word
        variations.add(word);
        
        // Simple suffix removal
        const suffixes = ['s', 'es', 'ed', 'ing', 'ly', 'er', 'est', 'tion', 'sion', 'ness', 'ment', 'able', 'ible'];
        suffixes.forEach(suffix => {
            if (word.endsWith(suffix)) {
                variations.add(word.slice(0, -suffix.length));
            }
        });
        
        // Handle doubled consonants (running -> run, getting -> get)
        if (word.endsWith('ing') && word.length > 6) {
            const base = word.slice(0, -3); // Remove 'ing'
            const lastTwo = base.slice(-2);
            if (lastTwo[0] === lastTwo[1] && /[bcdfghjklmnpqrstvwxyz]/.test(lastTwo[0])) {
                variations.add(base.slice(0, -1)); // Remove doubled consonant
            }
        }
        
        if (word.endsWith('ed') && word.length > 5) {
            const base = word.slice(0, -2); // Remove 'ed'
            const lastTwo = base.slice(-2);
            if (lastTwo[0] === lastTwo[1] && /[bcdfghjklmnpqrstvwxyz]/.test(lastTwo[0])) {
                variations.add(base.slice(0, -1)); // Remove doubled consonant
            }
        }
        
        // Handle 'y' to 'i' changes (trying -> try, flying -> fly)
        if (word.endsWith('ying')) {
            variations.add(word.slice(0, -4) + 'y');
        }
        if (word.endsWith('ied')) {
            variations.add(word.slice(0, -3) + 'y');
        }
        if (word.endsWith('ies')) {
            variations.add(word.slice(0, -3) + 'y');
        }
        
        // Handle 'e' dropping (failing -> fail, coming -> come)
        if (word.endsWith('ing')) {
            const base = word.slice(0, -3);
            variations.add(base);
            variations.add(base + 'e'); // Try adding 'e' back
        }
        
        if (word.endsWith('ed')) {
            const base = word.slice(0, -2);
            variations.add(base);
            variations.add(base + 'e'); // Try adding 'e' back
        }
        
        // Handle irregular plurals and past tenses
        const irregularMappings = {
            'children': 'child',
            'feet': 'foot',
            'teeth': 'tooth',
            'mice': 'mouse',
            'men': 'man',
            'women': 'woman',
            'went': 'go',
            'came': 'come',
            'saw': 'see',
            'did': 'do',
            'had': 'have',
            'was': 'be',
            'were': 'be',
            'said': 'say',
            'got': 'get',
            'made': 'make',
            'took': 'take',
            'gave': 'give',
            'found': 'find',
            'thought': 'think',
            'knew': 'know',
            'felt': 'feel',
            'left': 'leave',
            'kept': 'keep',
            'told': 'tell',
            'brought': 'bring',
            'bought': 'buy',
            'caught': 'catch',
            'taught': 'teach',
            'fought': 'fight',
            'sought': 'seek'
        };
        
        if (irregularMappings[word]) {
            variations.add(irregularMappings[word]);
        }
        
        // Convert Set back to Array and filter out empty/short words
        return Array.from(variations).filter(v => v && v.length > 2);
    }

    displayDefinition(data, originalWord) {
        const entry = data[0];
        let definitionHtml = '';

        // Add variation note if applicable
        if (entry.isVariation) {
            definitionHtml += `
                <div style="background: #f0f8ff; padding: 8px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #666;">
                    <i class="fas fa-info-circle"></i> 
                    Showing definition for "${entry.baseWord}" (base form of "${entry.originalWord}")
                </div>
            `;
        }

        // Generate word variations to filter out
        const wordsToFilter = this.generateWordsToFilter(originalWord, entry.baseWord);
        console.log(`🚫 Words to filter from definitions:`, wordsToFilter);
        
        // Test if "failed" is in the filter list
        const testWords = ['fail', 'failed', 'failing', 'failure'];
        testWords.forEach(testWord => {
            const isInFilter = wordsToFilter.includes(testWord);
            console.log(`   "${testWord}" in filter list: ${isInFilter}`);
        });

        // Add meanings
        if (entry.meanings && entry.meanings.length > 0) {
            let hasValidDefinitions = false;
            
            entry.meanings.forEach((meaning, index) => {
                if (index < 3) { // Limit to first 3 meanings to keep it concise
                    const validDefinitions = [];
                    
                    if (meaning.definitions && meaning.definitions.length > 0) {
                        meaning.definitions.slice(0, 4).forEach((def, defIndex) => {
                            console.log(`🔍 Checking definition ${defIndex + 1}: "${def.definition}"`);
                            
                            // Check if definition contains the target word or its variations
                            const defContainsWord = this.definitionContainsTargetWord(def.definition, wordsToFilter);
                            const exampleContainsWord = def.example ? this.definitionContainsTargetWord(def.example, wordsToFilter) : false;
                            
                            console.log(`   Definition contains target word: ${defContainsWord}`);
                            if (def.example) {
                                console.log(`   Example: "${def.example}"`);
                                console.log(`   Example contains target word: ${exampleContainsWord}`);
                            }
                            
                            if (!defContainsWord) {
                                // Clean the definition text to remove any remaining word references
                                const cleanedDefinition = this.cleanDefinitionText(def.definition, originalWord);
                                const cleanedExample = def.example && !exampleContainsWord 
                                    ? this.cleanDefinitionText(def.example, originalWord) 
                                    : null;
                                
                                console.log(`   ✅ Adding valid definition: "${cleanedDefinition}"`);
                                validDefinitions.push({
                                    definition: cleanedDefinition,
                                    example: cleanedExample
                                });
                            } else {
                                console.log(`   ❌ Skipping definition containing target word`);
                            }
                        });
                    }
                    
                    // Only show this meaning if it has valid definitions
                    if (validDefinitions.length > 0) {
                        hasValidDefinitions = true;
                        definitionHtml += `
                            <div style="margin-bottom: 15px;">
                                <div style="font-weight: bold; color: #007bff; margin-bottom: 5px;">
                                    ${meaning.partOfSpeech}
                                </div>
                        `;
                        
                        // Show up to 2 valid definitions
                        validDefinitions.slice(0, 2).forEach((def) => {
                            definitionHtml += `
                                <div style="margin-bottom: 8px;">
                                    <div>${def.definition}</div>
                                    ${def.example ? `<div style="font-style: italic; color: #666; margin-top: 4px;">"${def.example}"</div>` : ''}
                                </div>
                            `;
                        });
                        
                        definitionHtml += '</div>';
                    }
                }
            });
            
            // If no valid definitions found, show a message
            if (!hasValidDefinitions) {
                definitionHtml += `
                    <div style="color: #666; font-style: italic;">
                        Available definitions contain the target word. Try solving more of the puzzle for context clues!
                    </div>
                `;
            }
        }

        this.elements.definitionText.innerHTML = definitionHtml;
    }

    // Update the minimalist achievement footer
    updateAchievementFooter() {
        try {
            const achievementIcons = document.querySelectorAll('.achievement-icon-item');

            achievementIcons.forEach(iconElement => {
                const achievementId = iconElement.dataset.achievement;
                const progress = this.achievementsManager.getAchievementProgress(achievementId);

                if (progress && progress.completed) {
                    iconElement.classList.add('completed');
                } else {
                    iconElement.classList.remove('completed');
                }

                // Update tooltip with progress information
                if (progress) {
                    const achievement = this.achievementsManager.achievements[achievementId];
                    if (achievement) {
                        let tooltipText = `${achievement.name}: ${achievement.description}`;
                        if (progress.completed) {
                            tooltipText += ` ✅ Complete`;
                        } else {
                            tooltipText += ` (${progress.current}/${progress.target})`;
                        }
                        iconElement.setAttribute('title', tooltipText);
                    }
                }
            });
        } catch (error) {
            console.error('Error updating achievement footer:', error);
        }
    }

    // Ink Drops Currency System
    async loadInkDrops() {
        // Prevent duplicate loading
        if (this.inkDropsLoaded) {
            console.log('🔄 Ink drops already loaded, skipping duplicate call');
            return;
        }

        try {
            const userData = await this.loadUserData();
            const today = new Date().toDateString();

            // Initialize ink drops data if not exists (first time user)
            if (!userData.inkDrops) {
                console.log(`🆕 First time user - welcome! Giving ${this.firstTimeInkDrops} ink drops to get started`);
                userData.inkDrops = {
                    count: this.firstTimeInkDrops,
                    lastRefresh: today,
                    isFirstTime: true
                };
                await this.saveUserData(userData);

                // Show welcome message for first time users
                this.showFirstTimeInkDropsWelcome();
            }
            // Check if it's a new day and give daily login bonus
            else if (userData.inkDrops.lastRefresh !== today) {
                console.log(`🔄 New day detected! Last login: ${userData.inkDrops.lastRefresh}, Today: ${today}`);
                const oldCount = userData.inkDrops.count;
                userData.inkDrops.count = Math.min(userData.inkDrops.count + this.dailyInkDrops, this.maxInkDrops);
                userData.inkDrops.lastRefresh = today;
                await this.saveUserData(userData);
                console.log(`🎁 Daily login bonus! ${oldCount} + ${this.dailyInkDrops} = ${userData.inkDrops.count} ink drops`);

                // Show daily login bonus message
                this.showDailyLoginBonus(this.dailyInkDrops);
            } else {
                console.log(`✅ Same day, no bonus needed. Current count: ${userData.inkDrops.count}`);
            }

            this.inkDrops = userData.inkDrops.count;
            this.updateInkDropsDisplay();
            this.inkDropsLoaded = true; // Mark as loaded

        } catch (error) {
            console.error('Error loading ink drops:', error);
            // On error, start with 0 drops (new default)
            this.inkDrops = 0;
            this.updateInkDropsDisplay();
            this.inkDropsLoaded = true; // Mark as loaded even on error
        }
    }

    showFirstTimeInkDropsWelcome() {
        // Show a friendly welcome message for first time users
        setTimeout(() => {
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🎉 Welcome to Quotle!</h2>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 64px; margin-bottom: 15px;">💧</div>
                        <h3 style="color: #333333; margin-bottom: 15px;">You've received ${this.firstTimeInkDrops} ink drops!</h3>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
                            <h4 style="margin-top: 0; color: #495057;">How Ink Drops Work:</h4>
                            <ul style="margin: 10px 0; padding-left: 20px; color: #666;">
                                <li><strong>Today's puzzle:</strong> Always free to play</li>
                                <li><strong>Past puzzles:</strong> Cost 1 ink drop each</li>
                                <li><strong>Daily bonus:</strong> Get ${this.dailyInkDrops} drops every day you return</li>
                                <li><strong>Watch ads:</strong> Get more drops anytime</li>
                            </ul>
                        </div>
                        
                        <button class="btn" onclick="this.closest('.modal').remove();" style="background: #28a745; color: white; border: none; padding: 12px 24px;">
                            <i class="fas fa-play"></i> Start Playing!
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Auto-close after 10 seconds
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 10000);
        }, 1500); // Delay to let the game load first
    }

    showDailyLoginBonus(bonusAmount) {
        // Show a brief notification for daily login bonus using the same format as other notifications
        setTimeout(() => {
            const notificationElement = document.createElement('div');
            notificationElement.className = 'achievement-notification daily-login-bonus';

            notificationElement.innerHTML = `
                <h4>✓ Daily Login Bonus!</h4>
                <p>+${bonusAmount} ink drops</p>
            `;

            // Calculate position based on existing notifications
            const existingNotifications = document.querySelectorAll('.achievement-notification');
            const topOffset = 20 + (existingNotifications.length * 120); // 20px from top, 120px spacing between notifications

            notificationElement.style.top = `${topOffset}px`;

            // Add to page
            document.body.appendChild(notificationElement);

            // Show notification
            setTimeout(() => {
                notificationElement.classList.add('show');
            }, 100);

            // Hide and remove after 4 seconds
            setTimeout(() => {
                notificationElement.classList.remove('show');
                setTimeout(() => {
                    if (notificationElement.parentNode) {
                        notificationElement.remove();
                    }
                }, 300);
            }, 4000);
        }, 1000); // Delay to let the game load first
    }

    async saveInkDrops() {
        try {
            console.log(`💾 saveInkDrops called with count: ${this.inkDrops}`);
            const userData = await this.loadUserData();
            if (!userData.inkDrops) {
                userData.inkDrops = {};
            }
            userData.inkDrops.count = this.inkDrops;
            userData.inkDrops.lastRefresh = new Date().toDateString();
            await this.saveUserData(userData);
            console.log(`💾 Ink drops saved to userData: ${userData.inkDrops.count}`);
        } catch (error) {
            console.error('Error saving ink drops:', error);
        }
    }

    updateInkDropsDisplay() {
        if (this.elements.inkDropsCount) {
            // Update visual state based on ink drops count
            const container = this.elements.inkDropsContainer;
            const display = container.querySelector('.ink-drops-display');
            const refillButton = container.querySelector('.ink-drops-refill');

            display.classList.remove('low', 'empty');

            if (this.inkDrops === 0) {
                // Hide normal display and show refill button when at 0 drops
                display.style.display = 'none';
                if (refillButton) {
                    refillButton.style.display = 'flex';
                    refillButton.title = 'Watch an ad to get 3 ink drops!';
                }
            } else {
                // Show normal display and hide refill button
                display.style.display = 'flex';
                if (refillButton) {
                    refillButton.style.display = 'none';
                }

                // Show normal count
                this.elements.inkDropsCount.textContent = this.inkDrops;
                this.elements.inkDropsCount.style.fontSize = '';
                this.elements.inkDropsCount.style.fontWeight = 'bold';

                if (this.inkDrops <= 1) {
                    display.classList.add('low');
                    display.title = `${this.inkDrops} ink drop${this.inkDrops === 1 ? '' : 's'} remaining`;
                } else {
                    display.title = `${this.inkDrops} ink drops - Used for past challenges`;
                }
            }
        }
    }

    async spendInkDrop() {
        console.log('spendInkDrop called, current ink drops:', this.inkDrops);
        if (this.inkDrops > 0) {
            console.log('Spending ink drop, showing animation');

            // Play water drop sound effect
            this.playSound('waterDrop', 0.6);

            // Show -1 animation
            this.showInkDropCountAnimation();

            this.inkDrops--;
            this.updateInkDropsDisplay();
            await this.saveInkDrops();
            console.log('Ink drop spent, new count:', this.inkDrops);
            return true;
        }
        console.log('No ink drops to spend');
        return false;
    }

    showInkDropCountAnimation() {
        const countElement = this.elements.inkDropsContainer.querySelector('.ink-drops-count');
        if (!countElement) return;

        // Get the position of the count element
        const rect = countElement.getBoundingClientRect();

        // Create a simple -1 text
        const notification = document.createElement('div');
        notification.textContent = '-1';
        notification.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            color: #222;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
        `;

        document.body.appendChild(notification);

        // Simple animation: move up and fade out
        let opacity = 1;
        let top = rect.top;

        const animate = () => {
            opacity -= 0.02;
            top -= 1;

            notification.style.opacity = opacity;
            notification.style.top = top + 'px';

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(notification);
            }
        };

        requestAnimationFrame(animate);
    }



    async refillInkDrops(amount = 3) {
        this.inkDrops = Math.min(this.inkDrops + amount, this.maxInkDrops);
        this.updateInkDropsDisplay();
        await this.saveInkDrops();
        console.log(`💧 Refilled ${amount} ink drops!`);
    }

    // Debug method to give ink drops for testing
    async giveInkDropsForTesting(amount = 10) {
        console.log(`🧪 Debug: Giving ${amount} ink drops for testing`);
        await this.refillInkDrops(amount);
        
        // Show a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
        `;
        notification.textContent = `Debug: +${amount} ink drops added`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    showCalendarMessage() {
        const messageElement = document.getElementById('calendarMessage');
        if (messageElement) {
            messageElement.style.display = 'block';

            // Auto-hide after 3 seconds
            setTimeout(() => {
                this.hideCalendarMessage();
            }, 3000);
        }
    }

    hideCalendarMessage() {
        const messageElement = document.getElementById('calendarMessage');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }

    showInkDropsInfo() {
        // Create an info modal about ink drops
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>💧 Ink Drops</h2>
                    <button class="close-modal" onclick="this.closest('.modal').remove();">&times;</button>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 48px; margin-bottom: 10px;">💧</div>
                        <p style="font-size: 18px; margin: 0; color: #666;">You have ${this.inkDrops} ink drops</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #555;">
                            <strong>✅ Completed challenges:</strong> Always free to view<br>
                            <strong>💧 Uncompleted past puzzles:</strong> Cost 1 ink drop each<br>
                            <strong>🔄 Daily refresh:</strong> Get ${this.dailyInkDrops} drops every day
                        </p>
                    </div>
                    
                    ${this.inkDrops < this.maxInkDrops ? `
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <button class="btn" onclick="this.closest('.modal').remove(); game.showInkDropsRefillModal();" style="background: #6c757d; color: white; border: none;">
                                <i class="fas fa-play"></i> Get More Drops
                            </button>
                            <button class="btn" onclick="this.closest('.modal').remove();" style="background: #6c757d; color: white; border: none;">
                                Close
                            </button>
                        </div>
                    ` : `
                        <button class="btn" onclick="this.closest('.modal').remove();" style="background: #28a745; color: white; border: none;">
                            <i class="fas fa-check"></i> You're All Set!
                        </button>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 8000);
    }

    showInkDropsLegend() {
        // Create a small legend modal explaining the ink drops system
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>💧 Ink Drops Needed</h2>
                    <button class="close-modal" onclick="this.closest('.modal').remove();">&times;</button>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 48px; margin-bottom: 10px;">🔒</div>
                        <p style="font-size: 16px; margin: 0; color: #666;">This past challenge needs ink drops to play</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #555;">
                            <strong>✅ Good news:</strong> You can always view completed challenges for free!<br>
                            <strong>💧 Ink drops:</strong> Only needed for uncompleted past puzzles
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn" onclick="this.closest('.modal').remove(); game.showInkDropsRefillModal();" style="background: #6c757d; color: white; border: none;">
                            <i class="fas fa-play"></i> Get Ink Drops
                        </button>
                        <button class="btn" onclick="this.closest('.modal').remove();" style="background: #6c757d; color: white; border: none;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 5000);
    }

    async showInkDropsRefillModal() {
        // Create a friendly modal for ink drops refill
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎯 Almost There!</h2>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 48px; margin-bottom: 10px;">💧</div>
                        <p style="font-size: 18px; margin: 0; color: #666;">You're out of ink drops</p>
                    </div>
                    
                    <p style="margin-bottom: 15px; font-size: 16px;">
                        Uncompleted past challenges need ink drops to unlock, but don't worry!
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                        <p style="margin: 0; font-size: 14px; color: #555;">
                            <strong>💡 Quick Refill:</strong> Watch a short ad to get 3 ink drops instantly!
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn" id="watchAdBtn" style="background: #6c757d; color: white; border: none; min-width: 140px;">
                            <i class="fas fa-play"></i> Watch Ad (+3 💧)
                        </button>
                        <button class="btn" id="cancelRefillBtn" style="background: #6c757d; color: white; border: none;">
                            Maybe Later
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #6c757d;">
                        <p style="margin: 0; font-size: 13px; color: #495057;">
                            💡 <strong>Pro Tip:</strong> Completed challenges are always free to view!
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        return new Promise((resolve) => {
            const watchAdBtn = modal.querySelector('#watchAdBtn');
            const cancelBtn = modal.querySelector('#cancelRefillBtn');

            const cleanup = () => {
                document.body.removeChild(modal);
            };

            watchAdBtn.addEventListener('click', async () => {
                cleanup();
                // Simulate ad watching (in real implementation, this would trigger an actual ad)
                await this.simulateAdWatch();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });
        });
    }

    async simulateAdWatch() {
        // Use real Arkadium rewarded ads for ink drops refill
        try {
            console.log('🎬 Showing rewarded ad for ink drops refill...');

            // Track ink drops ad attempt
            this.arkadium.trackEvent('ink_drops_ad_attempted', {
                currentDrops: this.inkDrops,
                timestamp: Date.now()
            });

            // Show the actual rewarded ad
            await this.arkadium.showRewardedAd();

            console.log('✅ Rewarded ad completed, refilling ink drops');

            // Track successful ink drops ad completion
            this.arkadium.trackEvent('ink_drops_ad_completed', {
                currentDrops: this.inkDrops,
                rewardAmount: 3,
                timestamp: Date.now()
            });

            // Refill ink drops after successful ad
            this.refillInkDrops(3);
            this.showInkDropsRefillSuccess();

        } catch (error) {
            console.log('❌ Rewarded ad failed or was cancelled:', error);

            // Track ink drops ad failure
            this.arkadium.trackEvent('ink_drops_ad_failed', {
                currentDrops: this.inkDrops,
                error: error.message,
                timestamp: Date.now()
            });

            // In development mode, still allow ink drops refill
            if (this.arkadium.isDevelopmentMode()) {
                console.log('🎮 Ad failed, but allowing ink drops refill in development mode');
                this.refillInkDrops(3);
                this.showInkDropsRefillSuccess();
            } else {
                // Show error message to user
                this.showInkDropsAdError();
            }
        }
    }

    showInkDropsRefillSuccess() {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification ink-drops-refill show';
        notification.innerHTML = `
            <h4>💧 Ink Drops Refilled!</h4>
            <p>You received 3 ink drops</p>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showInkDropsAdError() {
        // Show error notification when ad fails
        const notification = document.createElement('div');
        notification.className = 'achievement-notification show';
        notification.style.background = '#dc3545';
        notification.innerHTML = `
            <h4>❌ Ad Unavailable</h4>
            <p>Unable to show ad. Please try again later.</p>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showInkDropsInfo() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>💧 Ink Drops</h2>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div class="ink-drops-display" style="display: inline-flex; margin-bottom: 15px; position: relative;">
                            <span class="ink-drop-icon">💧</span>
                            <span class="ink-drops-count">${this.inkDrops}</span>
                        </div>
                        <p style="margin: 0;"><strong>Current Ink Drops</strong></p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0;">How Ink Drops Work:</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>Daily Refresh:</strong> You get ${this.dailyInkDrops} ink drops each day</li>
                            <li><strong>Past Challenges:</strong> Playing past puzzles costs 1 ink drop</li>
                            <li><strong>Today's Puzzle:</strong> Always free to play</li>
                            <li><strong>Refill:</strong> Watch ads to get 3 more drops (max ${this.maxInkDrops})</li>
                        </ul>
                    </div>
                    
                    ${this.inkDrops === 0 ? `
                        <div style="text-align: center;">
                            <button class="btn" onclick="this.closest('.modal').remove(); game.showInkDropsRefillModal();">
                                <i class="fas fa-play"></i> Watch Ad for 3 Drops
                            </button>
                        </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn" onclick="this.closest('.modal').remove();">Got it!</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // replayPastChallenge method removed - no longer needed since completed challenges are view-only
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new DailyQuotePuzzle();
    
    // Fallback: Hide loading screen after 10 seconds if it's still showing
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
            console.warn('⚠️ Loading screen timeout - forcing hide');
            if (window.game && window.game.hideLoadingScreen) {
                window.game.hideLoadingScreen();
            } else {
                // Manual fallback
                loadingScreen.classList.add('fade-out');
                document.body.classList.remove('loading');
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 500);
            }
        }
    }, 10000); // 10 second timeout
});

// Global debug functions for Arkadium Sandbox testing
window.debugArkadium = function () {
    if (window.game && window.game.arkadium) {
        window.game.arkadium.debugGameStatus();
    } else {
        console.log('❌ Game or Arkadium integration not available');
    }
};

window.testArkadiumAds = function () {
    if (window.game && window.game.arkadium) {
        window.game.arkadium.testAds();
    } else {
        console.log('❌ Game or Arkadium integration not available');
    }
};

window.testRewardedAd = function () {
    if (window.game && window.game.arkadium) {
        window.game.arkadium.showRewardedAd().then(result => {
            console.log('✅ Rewarded ad test result:', result);
        }).catch(error => {
            console.log('❌ Rewarded ad test failed:', error);
        });
    } else {
        console.log('❌ Game or Arkadium integration not available');
    }
}; w
indow.clearGameData = function () {
    if (window.game && window.game.arkadium) {
        // Clear all stored data
        localStorage.clear();
        console.log('🗑️ All local storage cleared');

        // Try to clear Arkadium persistence data
        window.game.arkadium.clearAllData().then(() => {
            console.log('🗑️ Arkadium data cleared');
            console.log('🔄 Please refresh the page to restart with clean data');
        }).catch(error => {
            console.log('❌ Error clearing Arkadium data:', error);
            console.log('🔄 Please refresh the page to restart with clean data');
        });
    } else {
        localStorage.clear();
        console.log('🗑️ Local storage cleared. Please refresh the page.');
    }
};

// Debug method to give ink drops for testing
window.giveInkDrops = function(amount = 10) {
    if (window.game && window.game.giveInkDropsForTesting) {
        window.game.giveInkDropsForTesting(amount);
    } else {
        console.error('❌ Game not available');
    }
};

window.initializeWithDefaults = function () {
    console.log('🔧 Initializing game with default data...');
    const defaultData = {
        puzzles: {},
        stats: {
            totalSolved: 0,
            currentStreak: 0,
            maxStreak: 0,
            totalTime: 0,
            lastPlayed: null
        },
        achievements: {},
        inkDrops: { count: 0, lastRefresh: null }
    };

    localStorage.setItem('quotePuzzleUserData', JSON.stringify(defaultData));
    console.log('✅ Default data initialized');
    console.log('🔄 Please refresh the page');
}; w
indow.debugPersistence = async function () {
    console.log('🔍 Testing Arkadium persistence...');

    if (window.game && window.game.arkadium) {
        try {
            // Test loading user progress
            const userData = await window.game.arkadium.loadUserProgress();
            console.log('📂 Raw user data from Arkadium:', userData);
            console.log('📂 Type:', typeof userData);
            console.log('📂 Constructor:', userData ? userData.constructor.name : 'null');

            // Test the game's loadUserData method
            const gameUserData = await window.game.loadUserData();
            console.log('🎮 Game user data:', gameUserData);
            console.log('🎮 Has puzzles?', !!gameUserData.puzzles);
            console.log('🎮 Puzzles type:', typeof gameUserData.puzzles);

        } catch (error) {
            console.error('❌ Error testing persistence:', error);
        }
    } else {
        console.log('❌ Game or Arkadium integration not available');
    }
}; wi
ndow.debugAchievements = function () {
    console.log('🏆 Debugging Achievements System...');

    if (window.game && window.game.achievementsManager) {
        const manager = window.game.achievementsManager;

        console.log('📊 All Achievements:', manager.achievements);
        console.log('👤 User Achievements:', manager.userAchievements);

        // Check each achievement's progress
        Object.keys(manager.achievements).forEach(id => {
            const achievement = manager.achievements[id];
            const progress = manager.getAchievementProgress(id);
            const userAchievement = manager.userAchievements[id];

            console.log(`🎯 ${achievement.name} (${id}):`, {
                progress: progress,
                userAchievement: userAchievement,
                completed: progress ? progress.completed : false,
                hasPendingReward: userAchievement && userAchievement.pendingInkDrops && !userAchievement.rewardCollected
            });
        });

        // Check achievements by category
        const byCategory = manager.getAchievementsByCategory();
        console.log('📂 Achievements by Category:', byCategory);

    } else {
        console.log('❌ Game or achievements manager not available');
    }
};

window.debugAchievementFlow = async function () {
    if (window.game) {
        return await window.game.debugAchievementFlow();
    } else {
        console.error('❌ Game not available');
    }
};

window.testArkadiumAchievements = async function () {
    if (window.game && window.game.arkadium) {
        return await window.game.arkadium.debugAchievementsPersistence();
    } else {
        console.error('❌ Game or Arkadium integration not available');
    }
};

window.fixAchievements = async function () {
    if (window.game && window.game.achievementsManager) {
        console.log('🔧 Running achievement recovery...');

        // Load current user data
        const userData = await window.game.loadUserData();

        // Force validation and fix states
        window.game.achievementsManager.validateAndFixAchievementStates();

        // Recalculate progress if needed
        window.game.achievementsManager.recalculateAllProgress(userData);

        // Check for unclaimed rewards
        const unclaimedRewards = window.game.achievementsManager.getUnclaimedRewards();
        console.log(`🎁 Found ${unclaimedRewards.length} unclaimed rewards:`, unclaimedRewards);

        // Save the fixed data
        await window.game.saveUserData(userData);

        // Update displays
        window.game.updateAchievementCounter();
        window.game.updateAchievementFooter();

        console.log('✅ Achievement recovery complete');
        return {
            unclaimedRewards: unclaimedRewards.length,
            totalUnclaimedInkDrops: window.game.achievementsManager.getTotalUnclaimedInkDrops()
        };
    } else {
        console.error('❌ Game or achievements manager not available');
    }
};
estSandboxPersistence = async function () {
    console.log('🧪 Testing Sandbox Persistence...');

    if (window.game && window.game.arkadium) {
        try {
            // Test saving some data
            const testData = {
                puzzles: { 'test-date': { solved: true, time: 120 } },
                stats: { totalSolved: 1, currentStreak: 1, maxStreak: 1, totalTime: 120, lastPlayed: Date.now() },
                achievements: { 'first_puzzle': { completed: true, current: 1, completedDate: Date.now() } },
                inkDrops: { count: 8, lastRefresh: Date.now() }
            };

            console.log('💾 Saving test data to Arkadium persistence...');
            await window.game.arkadium.saveUserProgress(testData);
            console.log('✅ Test data saved successfully');

            // Test loading the data back
            console.log('📂 Loading data from Arkadium persistence...');
            const loadedData = await window.game.arkadium.loadUserProgress();
            console.log('📂 Loaded data:', loadedData);

            // Compare the data
            if (loadedData && loadedData.puzzles && loadedData.puzzles['test-date']) {
                console.log('✅ Persistence test PASSED - data saved and loaded correctly');
            } else {
                console.log('❌ Persistence test FAILED - data not saved/loaded correctly');
            }

        } catch (error) {
            console.error('❌ Persistence test ERROR:', error);
        }
    } else {
        console.log('❌ Game or Arkadium integration not available');
    }
}; wi
ndow.testAchievementPersistence = async function () {
    console.log('🧪 Testing Achievement Persistence in Sandbox...');

    if (window.game && window.game.achievementsManager) {
        try {
            // Get current achievements state
            console.log('📊 Current achievements state:');
            const currentAchievements = window.game.achievementsManager.getUserAchievementsData();
            console.log('Current achievements:', currentAchievements);

            // Load user data to see what's persisted
            console.log('📂 Loading user data to check persistence:');
            const userData = await window.game.loadUserData();
            console.log('Loaded user data:', userData);
            console.log('Loaded achievements:', userData.achievements);

            // Compare achievements manager vs persisted data
            const managerAchievements = Object.keys(currentAchievements).length;
            const persistedAchievements = userData.achievements ? Object.keys(userData.achievements).length : 0;

            console.log(`📊 Achievements comparison:
- Manager has: ${managerAchievements} achievements
- Persisted has: ${persistedAchievements} achievements`);

            if (managerAchievements !== persistedAchievements) {
                console.log('❌ MISMATCH: Achievements not properly persisted!');

                // Try to force save
                console.log('🔄 Attempting to force save achievements...');
                await window.game.updateAchievements(userData);
                await window.game.saveUserData(userData);
                console.log('✅ Force save completed');
            } else {
                console.log('✅ Achievements properly persisted');
            }

        } catch (error) {
            console.error('❌ Achievement persistence test ERROR:', error);
        }
    } else {
        console.log('❌ Game or achievements manager not available');
    }
};