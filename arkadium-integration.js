// Arkadium SDK Integration for Daily Quote Puzzle
//
// IMPORTANT ARKADIUM RECOMMENDATIONS:
// 1. Always call onTestReady() when game is ready - this removes the loading overlay
// 2. Use debugMode(true) for development/testing, disable for production
// 3. Test on Arkadium Sandbox or dev/test/staging Arena for full SDK functionality
// 4. SDK behavior differs between development and Arena environments
//
// Usage:
// - Call arkadium.enableDebugMode() for development
// - Call arkadium.notifyGameReady() when game is fully loaded
//
class ArkadiumIntegration {
    constructor(gameInstance = null) {
        this.sdk = null;
        this.isInitialized = false;
        this.rewardedAdAvailable = false;
        this.onRewardedAdComplete = null;
        this.onRewardedAdFailed = null;
        this.onRewardedAdClosed = null;

        // Reference to the game instance for music control
        this.game = gameInstance;

        // Game state tracking for lifecycle events
        this.gameStarted = false;
        this.currentLevel = 0;
        this.currentScore = 0;
        this.gameEnded = false;

        // Initialize SDK
        this.init();
    }

    async init() {
        try {
            // Check if Arkadium SDK is available
            if (typeof window.ArkadiumGameSDK === 'undefined') {
                console.warn('Arkadium SDK not found. Running in development mode.');
                this.isInitialized = true;
                return;
            }

            // Initialize the SDK using the correct method
            this.sdk = await window.ArkadiumGameSDK.getInstance();
            console.log('🎮 Arkadium SDK initialized successfully');
            this.isInitialized = true;

            // Enable debug mode for development (disable for production)
            // Uncomment the line below for development/testing
            // this.sdk.debugMode(true);

            // Set up rewarded ads
            this.setupRewardedAds();

            // Register pause/resume callbacks for Arena control
            this.registerLifecycleCallbacks();

            // Set up authentication listeners
            this.setupAuthenticationListeners();

            // Note: onTestReady() should be called when the game is fully loaded and ready
            // This will be called from the main game initialization, not here

        } catch (error) {
            console.error('❌ Error initializing Arkadium SDK:', error);
            console.log('🎮 Falling back to development mode');
            this.isInitialized = true; // Allow game to continue without ads
        }
    }

    setupRewardedAds() {
        if (!this.sdk) return;

        try {
            // Check if rewarded ads are available
            console.log('🎬 Checking rewarded ad availability...');
            this.rewardedAdAvailable = true;

            // Set up ad event listeners if available
            if (this.sdk.ads && this.sdk.ads.events) {
                this.sdk.ads.events.on('rewardAdLoaded', () => {
                    console.log('🎬 Rewarded ad loaded and ready to show');
                });

                this.sdk.ads.events.on('rewardAdFailedToLoad', (error) => {
                    console.error('❌ Rewarded ad failed to load:', error);
                });

                this.sdk.ads.events.on('rewardAdOpened', () => {
                    console.log('🎬 Rewarded ad opened');
                    // Mute background music when ad opens (backup to main method)
                    this.muteGameMusic();
                });

                this.sdk.ads.events.on('rewardAdClosed', () => {
                    console.log('🎬 Rewarded ad closed');
                    // Restore background music when ad closes (backup to main method)
                    this.unmuteGameMusic();
                });

                this.sdk.ads.events.on('rewardAdCompleted', (reward) => {
                    console.log('🎁 Rewarded ad completed with reward:', reward);
                });
            }
        } catch (error) {
            console.error('❌ Error setting up rewarded ads:', error);
        }
    }

    async showRewardedAd() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, allowing unscramble without ad');
            return Promise.resolve(true);
        }

        // Check if rewarded ads are available before attempting to show
        if (!this.isRewardedAdAvailable()) {
            console.log('🎬 Rewarded ads not available, skipping ad');
            return Promise.resolve(false);
        }

        // Store original music state and mute background music before ad
        const wasMusicPlaying = this.muteGameMusic();

        try {
            console.log('🎬 Loading rewarded ad...');

            // Track ad attempt
            this.trackEvent('rewarded_ad_attempt', {
                timestamp: Date.now(),
                context: 'unscramble_hint'
            });

            // Use the correct SDK method according to documentation
            const response = await this.sdk.ads.showRewardAd();

            console.log('✅ Rewarded ad completed successfully');
            console.log('🎁 Reward value:', response.value);

            // Track successful ad completion
            this.trackEvent('rewarded_ad_completed', {
                timestamp: Date.now(),
                rewardValue: response.value,
                context: 'unscramble_hint'
            });

            if (response.value) {
                return true;
            } else {
                throw new Error('Ad was not completed successfully');
            }
        } catch (error) {
            console.error('❌ Rewarded ad failed:', error);

            // Track ad failure
            this.trackEvent('rewarded_ad_failed', {
                timestamp: Date.now(),
                error: error.message,
                context: 'unscramble_hint'
            });

            // In development mode or if ad fails, still allow unscramble
            if (this.isDevelopmentMode()) {
                console.log('🎮 Ad failed, but allowing unscramble in development mode');
                return true;
            }

            throw error;
        } finally {
            // Always restore music state after ad (whether successful or failed)
            if (wasMusicPlaying) {
                this.unmuteGameMusic();
            }
        }
    }

    // Check if rewarded ads are available with additional validation
    isRewardedAdAvailable() {
        // Additional checks for ad availability
        const isAvailable = this.sdk && this.isInitialized && this.rewardedAdAvailable;

        // Check if ads module is properly initialized
        if (isAvailable && this.sdk.ads && typeof this.sdk.ads.isRewardAdAvailable === 'function') {
            try {
                return this.sdk.ads.isRewardAdAvailable();
            } catch (error) {
                console.warn('⚠️ Could not check ad availability, assuming available:', error);
                return isAvailable;
            }
        }

        return isAvailable;
    }

    // Preload rewarded ad for better user experience
    async preloadRewardedAd() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot preload rewarded ad');
            return false;
        }

        try {
            console.log('🎬 Preloading rewarded ad...');
            if (this.sdk.ads && typeof this.sdk.ads.preloadRewardAd === 'function') {
                await this.sdk.ads.preloadRewardAd();
                console.log('✅ Rewarded ad preloaded successfully');
                return true;
            } else {
                console.log('⚠️ Preload function not available in SDK');
                return false;
            }
        } catch (error) {
            console.error('❌ Error preloading rewarded ad:', error);
            return false;
        }
    }

    // Check if rewarded ads are available
    isRewardedAdAvailable() {
        return this.sdk && this.isInitialized && this.rewardedAdAvailable;
    }

    // Development mode check
    isDevelopmentMode() {
        return typeof window.ArkadiumGameSDK === 'undefined';
    }

    // Helper methods for music control during ads
    muteGameMusic() {
        if (this.game && this.game.backgroundMusicEnabled) {
            console.log('🔇 Muting background music for rewarded ad');
            this.game.pauseBackgroundMusic();
            return true; // Music was playing and is now muted
        } else if (this.game) {
            console.log('🔇 Background music already disabled or not playing');
        } else {
            console.log('🔇 No game instance available for music control');
        }
        return false; // Music was not playing
    }

    unmuteGameMusic() {
        if (this.game && this.game.backgroundMusicEnabled) {
            console.log('🔊 Restoring background music after rewarded ad');
            // Small delay to ensure ad audio has stopped
            setTimeout(() => {
                this.game.playBackgroundMusic();
            }, 500);
        } else if (this.game) {
            console.log('🔊 Background music is disabled, not restoring');
        } else {
            console.log('🔊 No game instance available for music control');
        }
    }

    // Call this when the game is fully loaded and ready to be shown
    // This removes the Game Loading overlay on the Arena
    notifyGameReady() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onTestReady notification');
            return;
        }

        try {
            console.log('🎮 Notifying Arena that game is ready to be shown');
            this.sdk.lifecycle.onTestReady();
        } catch (error) {
            console.error('❌ Error calling onTestReady:', error);
        }
    }

    // Enable debug mode for development/testing
    enableDebugMode() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot enable debug mode');
            return;
        }

        try {
            console.log('🔧 Enabling Arkadium SDK debug mode');
            this.sdk.debugMode(true);
        } catch (error) {
            console.error('❌ Error enabling debug mode:', error);
        }
    }

    // Get SDK status for debugging
    getSDKStatus() {
        return {
            isInitialized: this.isInitialized,
            hasSdk: !!this.sdk,
            isDevelopmentMode: this.isDevelopmentMode(),
            rewardedAdAvailable: this.rewardedAdAvailable,
            gameStarted: this.gameStarted,
            currentLevel: this.currentLevel,
            currentScore: this.currentScore,
            gameEnded: this.gameEnded
        };
    }

    // Check if user is authenticated for remote storage
    async checkAuthentication() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot check authentication');
            return false;
        }

        try {
            // Use the proper auth API method
            const isAuthenticated = await this.isUserAuthorized();
            console.log(`🔐 User authentication status: ${isAuthenticated}`);
            return isAuthenticated;
        } catch (error) {
            console.error('❌ Error checking authentication:', error);
            return false;
        }
    }

    // Get cookie from Arena
    async getCookie(cookieName) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`🍪 Cookie get (dev mode): ${cookieName}`);
            return null;
        }

        try {
            console.log(`🍪 Getting cookie: ${cookieName}`);
            const cookie = await this.sdk.persistence.getCookie(cookieName);
            console.log(`✅ Cookie retrieved: ${cookieName}`, cookie);
            return cookie;
        } catch (error) {
            console.error(`❌ Error getting cookie: ${cookieName}`, error);
            return null;
        }
    }

    // ========================================
    // AUTHENTICATION METHODS
    // ========================================

    // Check if user is authorized/authenticated
    async isUserAuthorized() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🔐 SDK not available, assuming not authorized (dev mode)');
            return false;
        }

        try {
            console.log('🔐 Checking user authorization status...');
            const isAuthorized = await this.sdk.auth.isUserAuthorized();
            console.log(`✅ User authorization status: ${isAuthorized}`);
            return isAuthorized;
        } catch (error) {
            console.error('❌ Error checking user authorization:', error);
            return false;
        }
    }

    // Get user profile information
    async getUserProfile() {
        if (!this.sdk || !this.isInitialized) {
            console.log('👤 SDK not available, returning mock profile (dev mode)');
            return {
                uid: 'dev-user-123',
                username: 'Developer',
                avatar: null,
                isUserSubscriber: false
            };
        }

        try {
            console.log('👤 Retrieving user profile...');
            const profile = await this.sdk.auth.getUserProfile();

            if (profile) {
                console.log('✅ User profile retrieved:', {
                    uid: profile.uid,
                    username: profile.username,
                    isSubscriber: profile.isUserSubscriber
                });
                return profile;
            } else {
                console.log('ℹ️ No user profile available (user not authenticated)');
                return null;
            }
        } catch (error) {
            console.error('❌ Error retrieving user profile:', error);
            return null;
        }
    }

    // Open authentication form
    async openAuthForm() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🔐 SDK not available, cannot open auth form (dev mode)');
            return false;
        }

        try {
            console.log('🔐 Opening authentication form...');
            await this.sdk.auth.openAuthForm();
            console.log('✅ Authentication form opened');
            return true;
        } catch (error) {
            console.error('❌ Error opening authentication form:', error);
            return false;
        }
    }

    // Subscribe to authentication status changes
    setupAuthStatusListener(callback) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🔐 SDK not available, cannot setup auth status listener (dev mode)');
            return;
        }

        try {
            console.log('🔐 Setting up authentication status listener...');
            this.sdk.auth.onAuthStatusChange((isAuthorized) => {
                console.log(`🔐 Auth status changed: ${isAuthorized}`);
                if (callback && typeof callback === 'function') {
                    callback(isAuthorized);
                }
            });
            console.log('✅ Authentication status listener setup complete');
        } catch (error) {
            console.error('❌ Error setting up auth status listener:', error);
        }
    }

    // Subscribe to authentication form open/close events
    setupAuthFormListener(callback) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🔐 SDK not available, cannot setup auth form listener (dev mode)');
            return;
        }

        try {
            console.log('🔐 Setting up authentication form listener...');
            this.sdk.auth.onOpenAuthForm((isOpened) => {
                console.log(`🔐 Auth form ${isOpened ? 'opened' : 'closed'}`);
                if (callback && typeof callback === 'function') {
                    callback(isOpened);
                }
            });
            console.log('✅ Authentication form listener setup complete');
        } catch (error) {
            console.error('❌ Error setting up auth form listener:', error);
        }
    }

    // Get detailed authentication information
    async getAuthInfo() {
        const isAuthorized = await this.isUserAuthorized();
        const profile = isAuthorized ? await this.getUserProfile() : null;

        return {
            isAuthorized,
            profile,
            hasProfile: !!profile,
            username: profile?.username || null,
            uid: profile?.uid || null,
            isSubscriber: profile?.isUserSubscriber || false,
            avatar: profile?.avatar || null,
            avatarFrame: profile?.avatarFrame || null,
            avatarBackground: profile?.avatarBackground || null,
            // AARP Arena specific fields
            aarpMembershipStatus: profile?.aarpMembershipStatus || null,
            coins: profile?.coins || null,
            level: profile?.level || null
        };
    }

    // Handle user login (convenience method)
    async handleUserLogin() {
        try {
            console.log('🔐 Handling user login...');

            // Check if already authorized
            const isAuthorized = await this.isUserAuthorized();
            if (isAuthorized) {
                console.log('✅ User is already authorized');
                const profile = await this.getUserProfile();
                return { success: true, alreadyAuthorized: true, profile };
            }

            // Open auth form
            const authFormOpened = await this.openAuthForm();
            if (authFormOpened) {
                console.log('🔐 Authentication form opened, waiting for user action...');
                return { success: true, authFormOpened: true };
            } else {
                console.log('❌ Failed to open authentication form');
                return { success: false, error: 'Failed to open auth form' };
            }
        } catch (error) {
            console.error('❌ Error handling user login:', error);
            return { success: false, error: error.message };
        }
    }

    // Handle user logout (if supported)
    async handleUserLogout() {
        try {
            console.log('🔐 Handling user logout...');

            // Note: Arkadium SDK might not have explicit logout
            // This would typically be handled by the parent Arena site
            console.log('ℹ️ Logout is typically handled by the parent Arena site');

            return { success: true, message: 'Logout handled by parent site' };
        } catch (error) {
            console.error('❌ Error handling user logout:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user has premium/subscriber status
    async hasSubscriberStatus() {
        const profile = await this.getUserProfile();
        return profile?.isUserSubscriber || false;
    }

    // Get user's display name (username or fallback)
    async getUserDisplayName() {
        const profile = await this.getUserProfile();
        return profile?.username || 'Guest Player';
    }

    // Get user's unique identifier
    async getUserId() {
        const profile = await this.getUserProfile();
        return profile?.uid || null;
    }

    // Check if user has avatar
    async getUserAvatar() {
        const profile = await this.getUserProfile();
        return {
            avatar: profile?.avatar || null,
            avatarFrame: profile?.avatarFrame || null,
            avatarBackground: profile?.avatarBackground || null
        };
    }

    // Get AARP-specific user data (if on AARP Arena)
    async getAARPUserData() {
        const profile = await this.getUserProfile();
        return {
            membershipStatus: profile?.aarpMembershipStatus || null,
            coins: profile?.coins || null,
            level: profile?.level || null
        };
    }

    // Set up authentication event listeners
    setupAuthenticationListeners() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🔐 SDK not available, cannot setup auth listeners (dev mode)');
            return;
        }

        try {
            // Listen for authentication status changes
            this.setupAuthStatusListener((isAuthorized) => {
                console.log(`🔐 Authentication status changed: ${isAuthorized}`);

                // Dispatch custom event for the game to handle
                window.dispatchEvent(new CustomEvent('arkadium-auth-status-changed', {
                    detail: { isAuthorized }
                }));

                // If user just logged in, sync data
                if (isAuthorized) {
                    this.handleUserAuthenticated();
                } else {
                    this.handleUserUnauthenticated();
                }
            });

            // Listen for auth form open/close events
            this.setupAuthFormListener((isOpened) => {
                console.log(`🔐 Auth form ${isOpened ? 'opened' : 'closed'}`);

                // Dispatch custom event for the game to handle
                window.dispatchEvent(new CustomEvent('arkadium-auth-form-changed', {
                    detail: { isOpened }
                }));
            });

            console.log('✅ Authentication listeners setup complete');
        } catch (error) {
            console.error('❌ Error setting up authentication listeners:', error);
        }
    }

    // Handle user authentication event
    async handleUserAuthenticated() {
        try {
            console.log('🔐 User authenticated, handling login...');

            // Get user profile
            const profile = await this.getUserProfile();
            console.log('👤 User profile:', profile);

            // Sync local data to remote storage
            console.log('🔄 Syncing data after authentication...');
            await this.syncAllDataToRemote();

            // Track authentication event
            this.trackEvent('user_authenticated', {
                uid: profile?.uid,
                username: profile?.username,
                isSubscriber: profile?.isUserSubscriber,
                timestamp: Date.now()
            });

            console.log('✅ User authentication handled successfully');
        } catch (error) {
            console.error('❌ Error handling user authentication:', error);
        }
    }

    // Handle user unauthentication event
    async handleUserUnauthenticated() {
        try {
            console.log('🔐 User unauthenticated, handling logout...');

            // Track unauthentication event
            this.trackEvent('user_unauthenticated', {
                timestamp: Date.now()
            });

            console.log('✅ User unauthentication handled successfully');
        } catch (error) {
            console.error('❌ Error handling user unauthentication:', error);
        }
    }

    // ========================================
    // LIFECYCLE EVENTS
    // ========================================

    // Register pause/resume callbacks for Arena control
    registerLifecycleCallbacks() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot register lifecycle callbacks');
            return;
        }

        try {
            // Register game pause callback
            this.sdk.lifecycle.registerEventCallback(
                this.sdk.lifecycle.LifecycleEvent.GAME_PAUSE,
                () => {
                    console.log('⏸️ Arena requested game pause');
                    this.handleGamePause();
                }
            );

            // Register game resume callback
            this.sdk.lifecycle.registerEventCallback(
                this.sdk.lifecycle.LifecycleEvent.GAME_RESUME,
                () => {
                    console.log('▶️ Arena requested game resume');
                    this.handleGameResume();
                }
            );

            console.log('✅ Lifecycle callbacks registered successfully');
        } catch (error) {
            console.error('❌ Error registering lifecycle callbacks:', error);
        }
    }

    // Handle game pause (no-op for turn-based games)
    handleGamePause() {
        try {
            // For turn-based games like Daily Quote Puzzle, no pause action needed
            // The game has no automatic progression that needs to be paused
            console.log('🎮 Game pause requested (no action needed for turn-based game)');
        } catch (error) {
            console.error('❌ Error handling game pause:', error);
        }
    }

    // Handle game resume (no-op for turn-based games)
    handleGameResume() {
        try {
            // For turn-based games like Daily Quote Puzzle, no resume action needed
            // The game has no automatic progression that needs to be resumed
            console.log('🎮 Game resume requested (no action needed for turn-based game)');
        } catch (error) {
            console.error('❌ Error handling game resume:', error);
        }
    }

    // Notify that game has started
    async notifyGameStart() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onGameStart notification');
            return;
        }

        if (this.gameStarted) {
            console.log('⚠️ Game already started, skipping duplicate onGameStart');
            return;
        }

        try {
            console.log('🎮 Notifying Arena that game has started');
            await this.sdk.lifecycle.onGameStart();
            this.gameStarted = true;

            // Track game start
            this.trackEvent('game_started', {
                timestamp: Date.now(),
                sessionId: this.getSessionId()
            });
        } catch (error) {
            console.error('❌ Error calling onGameStart:', error);
        }
    }

    // Update and notify score change
    async notifyScoreChange(newScore) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onChangeScore notification');
            return;
        }

        try {
            console.log(`🎯 Notifying Arena of score change: ${this.currentScore} → ${newScore}`);
            await this.sdk.lifecycle.onChangeScore(newScore);

            const previousScore = this.currentScore;
            this.currentScore = newScore;

            // Track score change
            this.trackEvent('score_changed', {
                previousScore: previousScore,
                newScore: newScore,
                scoreDelta: newScore - previousScore,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Error calling onChangeScore:', error);
        }
    }

    // Notify level start
    async notifyLevelStart(levelNumber) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onLevelStart notification');
            return;
        }

        try {
            console.log(`🎯 Notifying Arena that level ${levelNumber} has started`);
            await this.sdk.lifecycle.onLevelStart(levelNumber);
            this.currentLevel = levelNumber;

            // Track level start
            this.trackEvent('level_started', {
                levelNumber: levelNumber,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Error calling onLevelStart:', error);
        }
    }

    // Notify level end
    async notifyLevelEnd(levelNumber, levelData = {}) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onLevelEnd notification');
            return;
        }

        try {
            console.log(`🎯 Notifying Arena that level ${levelNumber} has ended`);
            await this.sdk.lifecycle.onLevelEnd(levelNumber);

            // Track level end
            this.trackEvent('level_ended', {
                levelNumber: levelNumber,
                ...levelData,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Error calling onLevelEnd:', error);
        }
    }

    // Notify game end
    async notifyGameEnd(finalScore = null, gameData = {}) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, skipping onGameEnd notification');
            return;
        }

        if (this.gameEnded) {
            console.log('⚠️ Game already ended, skipping duplicate onGameEnd');
            return;
        }

        try {
            // Update final score if provided
            if (finalScore !== null && finalScore !== this.currentScore) {
                await this.notifyScoreChange(finalScore);
            }

            console.log('🎮 Notifying Arena that game has ended');
            await this.sdk.lifecycle.onGameEnd();
            this.gameEnded = true;

            // Track game end
            this.trackEvent('game_ended', {
                finalScore: this.currentScore,
                levelsCompleted: this.currentLevel,
                ...gameData,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Error calling onGameEnd:', error);
        }
    }

    // Reset game state for new game
    resetGameState() {
        console.log('🔄 Resetting game state for new game');
        this.gameStarted = false;
        this.currentLevel = 0;
        this.currentScore = 0;
        this.gameEnded = false;
        this.resetSession(); // Reset analytics session
    }

    // Convenience method to handle complete puzzle (level) completion
    async handlePuzzleCompleted(puzzleNumber, score, timeElapsed, hintsUsed = 0) {
        try {
            // Start level if not already started
            if (this.currentLevel !== puzzleNumber) {
                await this.notifyLevelStart(puzzleNumber);
            }

            // Update score
            await this.notifyScoreChange(score);

            // End level with completion data
            await this.notifyLevelEnd(puzzleNumber, {
                completed: true,
                timeElapsed: timeElapsed,
                hintsUsed: hintsUsed,
                score: score
            });

            console.log(`✅ Puzzle ${puzzleNumber} completed - Score: ${score}, Time: ${timeElapsed}s`);
        } catch (error) {
            console.error('❌ Error handling puzzle completion:', error);
        }
    }

    // ========================================
    // BANNER ADS METHODS - REMOVED
    // ========================================
    // Banner ads have been completely removed from this implementation
    // Only rewarded ads and interstitial ads are supported

    // Debug method to test achievements persistence
    async debugAchievementsPersistence() {
        console.log('🔍 === DEBUGGING ACHIEVEMENTS PERSISTENCE ===');

        // Check authentication status
        const isAuth = await this.checkAuthentication();
        console.log('🔐 User authenticated:', isAuth);

        // Test saving a simple achievement
        const testAchievements = {
            testAchievement: {
                current: 5,
                completed: true,
                completedDate: new Date().toISOString(),
                rewardCollected: false,
                pendingInkDrops: 10
            }
        };

        console.log('💾 Saving test achievements:', testAchievements);
        const saveResult = await this.saveAchievements(testAchievements);
        console.log('✅ Save result:', saveResult);

        // Wait a moment then try to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('📂 Loading achievements...');
        const loadResult = await this.loadAchievements();
        console.log('📂 Load result:', loadResult);

        // Compare what we saved vs what we loaded
        console.log('🔍 Data comparison:');
        console.log('  Saved:', JSON.stringify(testAchievements));
        console.log('  Loaded:', JSON.stringify(loadResult));
        console.log('  Match:', JSON.stringify(testAchievements) === JSON.stringify(loadResult));

        console.log('🔍 === END ACHIEVEMENTS PERSISTENCE DEBUG ===');
        return { saved: testAchievements, loaded: loadResult, match: JSON.stringify(testAchievements) === JSON.stringify(loadResult) };
    }

    // Placeholder method to prevent initialization errors
    async initializeBannerAds() {
        console.log('🚫 Banner ads disabled - skipping initialization');
        return [];
    }

    // ========================================
    // INTERSTITIAL ADS METHODS
    // ========================================

    // Show interstitial ad (between levels, after game completion, etc.)
    async showInterstitialAd(duration = 30) {
        // Interstitial ads disabled
        console.log('🎬 Interstitial ads are disabled');
        return false;

        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot show interstitial ad');
            return false;
        }

        try {
            console.log(`🎬 Showing interstitial ad (${duration}s duration)...`);

            // Track interstitial ad attempt
            this.trackEvent('interstitial_ad_attempted', {
                duration: duration,
                timestamp: Date.now()
            });

            // Show interstitial ad with custom duration
            await this.sdk.ads.showInterstitialAd({ duration: duration });

            console.log('✅ Interstitial ad completed successfully');

            // Track successful interstitial ad completion
            this.trackEvent('interstitial_ad_completed', {
                duration: duration,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            console.error('❌ Interstitial ad failed:', error);

            // Track interstitial ad failure
            this.trackEvent('interstitial_ad_failed', {
                duration: duration,
                error: error.message,
                timestamp: Date.now()
            });

            return false;
        }
    }

    // Show interstitial ad at natural pause points
    async showInterstitialAdAtPause(context = 'general') {
        // Interstitial ads disabled
        console.log(`� Interstitial nads are disabled (context: ${context})`);
        return false;

        try {
            console.log(`🎬 Showing interstitial ad at pause: ${context}`);

            const success = await this.showInterstitialAd();

            if (success) {
                // Track context-specific interstitial
                this.trackEvent('interstitial_ad_context', {
                    context: context,
                    timestamp: Date.now()
                });
            }

            return success;
        } catch (error) {
            console.error(`❌ Error showing interstitial ad at pause (${context}):`, error);
            return false;
        }
    }

    // Show banner ads dynamically (disabled)
    async showBannerAdsWhenReady() {
        console.log('🚫 Banner ads disabled - skipping showBannerAdsWhenReady');
        return [];
    }

    // Check if ads are available
    isAdsAvailable() {
        return this.sdk && this.isInitialized && this.sdk.ads;
    }

    // Get ads status for debugging
    getAdsStatus() {
        return {
            isInitialized: this.isInitialized,
            hasSdk: !!this.sdk,
            hasAdsModule: !!(this.sdk && this.sdk.ads),
            rewardedAdAvailable: this.rewardedAdAvailable,
            isDevelopmentMode: this.isDevelopmentMode()
        };
    }

    // Test ads functionality (for debugging)
    async testAds() {
        console.log('🧪 Testing Arkadium Ads Integration...');

        const status = this.getAdsStatus();
        console.log('📊 Ads Status:', status);

        // Test rewarded ads
        console.log('🎬 Testing rewarded ads...');
        try {
            const rewardedResult = await this.showRewardedAd();
            console.log('✅ Rewarded ad test result:', rewardedResult);
        } catch (error) {
            console.log('❌ Rewarded ad test failed:', error.message);
        }

        // Banner ads removed - skipping banner ad tests
        console.log('🖼️ Banner ads disabled in this version');

        // Test interstitial ads - DISABLED
        console.log('📺 Interstitial ads are disabled');
        console.log('✅ Interstitial ad test skipped (disabled)');

        console.log('🧪 Ads testing complete!');
    }

    // Debug method to test game initialization
    debugGameStatus() {
        console.log('🔍 Game Debug Status:');
        console.log('📊 SDK Status:', this.getSDKStatus());
        console.log('🎬 Ads Status:', this.getAdsStatus());
        console.log('🔐 Auth Available:', !!(this.sdk && this.sdk.auth));
        console.log('💾 Persistence Available:', !!(this.sdk && this.sdk.persistence));
        console.log('🎮 Lifecycle Available:', !!(this.sdk && this.sdk.lifecycle));

        // Test basic functionality
        if (this.sdk) {
            console.log('✅ Arkadium SDK is loaded and available');
            console.log('🌐 Running in Arena environment');
        } else {
            console.log('⚠️ Arkadium SDK not available - running in development mode');
        }
    }

    // Get user wallet information
    async getUserWallet() {
        if (!this.sdk || !this.isInitialized) {
            return { gems: 0 };
        }

        try {
            return await this.sdk.wallet.getGems();
        } catch (error) {
            console.error('❌ Error getting wallet:', error);
            return { gems: 0 };
        }
    }

    // Consume gems from user wallet
    async consumeGems(amount) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating gem consumption');
            return true;
        }

        try {
            return await this.sdk.wallet.consumeGems(amount);
        } catch (error) {
            console.error('❌ Error consuming gems:', error);
            return false;
        }
    }

    // Show banner ad
    showBannerAd(adId, dimensions = null) {
        console.log('🚫 Banner ads disabled - skipping showBannerAd');
        return false;
    }

    // Show interstitial ad - DISABLED
    async showInterstitialAd(duration = 30) {
        // Interstitial ads disabled
        console.log('� Int erstitial ads are disabled');
        return false;
    }

    // Track analytics events
    trackEvent(eventName, data = {}) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📊 Analytics event (dev mode): ${eventName}`, data);
            return;
        }

        try {
            this.sdk.analytics.trackEvent(eventName, data);
        } catch (error) {
            console.error('❌ Error tracking event:', error);
        }
    }

    // Enhanced analytics tracking methods
    trackEvent(eventName, data = {}) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📊 Analytics event (dev mode): ${eventName}`, data);
            return;
        }

        try {
            // Validate event name
            if (!eventName || typeof eventName !== 'string') {
                console.warn('⚠️ Invalid event name for tracking:', eventName);
                return;
            }

            // Add timestamp to all events
            const eventData = {
                ...data,
                timestamp: Date.now(),
                sessionId: this.getSessionId()
            };

            console.log(`📊 Tracking event: ${eventName}`, eventData);

            // Check if analytics module exists and has the correct method
            if (this.sdk.analytics && typeof this.sdk.analytics.trackEvent === 'function') {
                this.sdk.analytics.trackEvent(eventName, eventData);
            } else if (this.sdk.analytics && typeof this.sdk.analytics.track === 'function') {
                // Try alternative method name
                this.sdk.analytics.track(eventName, eventData);
            } else if (this.sdk.analytics && typeof this.sdk.analytics.logEvent === 'function') {
                // Try another alternative method name
                this.sdk.analytics.logEvent(eventName, eventData);
            } else {
                console.warn('⚠️ Analytics module not available or trackEvent method not found');
                console.log('📊 Available analytics methods:', this.sdk.analytics ? Object.keys(this.sdk.analytics) : 'No analytics module');
            }
        } catch (error) {
            console.error('❌ Error tracking event:', error);
        }
    }

    // Track user properties
    trackUserProperties(properties) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📊 User properties (dev mode):`, properties);
            return;
        }

        try {
            console.log(`📊 Tracking user properties:`, properties);
            this.sdk.analytics.setUserProperties(properties);
        } catch (error) {
            console.error('❌ Error tracking user properties:', error);
        }
    }

    // Track screen views
    trackScreenView(screenName, additionalData = {}) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📊 Screen view (dev mode): ${screenName}`, additionalData);
            return;
        }

        try {
            const screenData = {
                screenName: screenName,
                ...additionalData,
                timestamp: Date.now()
            };

            console.log(`📊 Tracking screen view: ${screenName}`, screenData);
            this.sdk.analytics.trackScreenView(screenName, screenData);
        } catch (error) {
            console.error('❌ Error tracking screen view:', error);
        }
    }

    // Track game events
    trackGameEvent(eventType, eventData = {}) {
        const eventName = `game_${eventType}`;
        this.trackEvent(eventName, eventData);
    }

    // Track puzzle events
    trackPuzzleEvent(eventType, puzzleData = {}) {
        const eventName = `puzzle_${eventType}`;
        this.trackEvent(eventName, puzzleData);
    }

    // Track achievement events
    trackAchievementEvent(achievementId, achievementData = {}) {
        const eventName = `achievement_${achievementId}`;
        this.trackEvent(eventName, achievementData);
    }

    // Track monetization events
    trackMonetizationEvent(eventType, monetizationData = {}) {
        const eventName = `monetization_${eventType}`;
        this.trackEvent(eventName, monetizationData);
    }

    // Session management for analytics
    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.sessionId;
    }

    // Reset session (for new game sessions)
    resetSession() {
        this.sessionId = null;
        console.log('🔄 Analytics session reset');
    }

    // Batch event tracking
    trackEvents(eventBatch) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📊 Batch events (dev mode):`, eventBatch);
            return;
        }

        try {
            console.log(`📊 Tracking batch events:`, eventBatch);
            eventBatch.forEach(event => {
                this.trackEvent(event.name, event.data);
            });
        } catch (error) {
            console.error('❌ Error tracking batch events:', error);
        }
    }

    // Remote persistence methods
    async saveRemoteData(key, data) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`💾 Remote save (dev mode): ${key}`, data);
            return true;
        }

        try {
            console.log(`💾 Saving remote data: ${key}`);

            // Ensure data is serializable and under 32KB limit
            const serializedData = JSON.stringify(data);
            if (serializedData.length > 32768) {
                console.warn(`⚠️ Data size (${serializedData.length} bytes) exceeds 32KB limit for key: ${key}`);
                // Optionally compress or split the data here
            }

            await this.sdk.persistence.setRemoteStorageItem(key, data);
            console.log(`✅ Remote data saved: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error saving remote data: ${key}`, error);
            // If user is not authenticated, fall back to local storage
            if (error.message && error.message.includes('authenticated')) {
                console.log(`🔄 User not authenticated, falling back to local storage for: ${key}`);
                return await this.saveLocalData(key, data);
            }
            return false;
        }
    }

    async loadRemoteData(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📂 Remote load (dev mode): ${key}`);
            return null;
        }

        try {
            console.log(`📂 Loading remote data: ${key}`);
            const data = await this.sdk.persistence.getRemoteStorageItem(key);
            console.log(`✅ Remote data loaded: ${key}`, data);
            return data;
        } catch (error) {
            console.error(`❌ Error loading remote data: ${key}`, error);
            // If user is not authenticated, fall back to local storage
            if (error.message && error.message.includes('authenticated')) {
                console.log(`🔄 User not authenticated, falling back to local storage for: ${key}`);
                return await this.loadLocalData(key);
            }
            return null;
        }
    }

    async removeRemoteData(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`🗑️ Remote remove (dev mode): ${key}`);
            return true;
        }

        try {
            console.log(`🗑️ Removing remote data: ${key}`);
            await this.sdk.persistence.removeRemoteStorageItem(key);
            console.log(`✅ Remote data removed: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error removing remote data: ${key}`, error);
            // If user is not authenticated, fall back to local storage
            if (error.message && error.message.includes('authenticated')) {
                console.log(`🔄 User not authenticated, falling back to local storage for: ${key}`);
                return await this.removeLocalData(key);
            }
            return false;
        }
    }

    // Local persistence methods
    async saveLocalData(key, data) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`💾 Local save (dev mode): ${key}`, data);
            // Fallback to localStorage in development mode
            try {
                localStorage.setItem(`arkadium_${key}`, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`❌ Error saving to localStorage: ${key}`, error);
                return false;
            }
        }

        try {
            console.log(`💾 Saving local data: ${key}`);
            await this.sdk.persistence.setLocalStorageItem(key, data);
            console.log(`✅ Local data saved: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error saving local data: ${key}`, error);
            return false;
        }
    }

    async loadLocalData(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`📂 Local load (dev mode): ${key}`);
            // Fallback to localStorage in development mode
            try {
                const data = localStorage.getItem(`arkadium_${key}`);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`❌ Error loading from localStorage: ${key}`, error);
                return null;
            }
        }

        try {
            console.log(`📂 Loading local data: ${key}`);
            const data = await this.sdk.persistence.getLocalStorageItem(key);
            console.log(`✅ Local data loaded: ${key}`, data);

            // Handle case where SDK returns invalid data
            if (typeof data === 'string') {
                // Check if it's the '[object Object]' string issue
                if (data === '[object Object]' || data.includes('[object Object]')) {
                    console.warn(`⚠️ SDK returned '[object Object]' string, returning null`);
                    return null;
                }

                // Try to parse as JSON
                try {
                    return JSON.parse(data);
                } catch (parseError) {
                    console.error(`❌ Error parsing data for ${key}:`, parseError);
                    return null;
                }
            }

            // If data is null or undefined, return null
            if (data === null || data === undefined) {
                console.log(`📂 No data found for key: ${key}`);
                return null;
            }

            // If data is already an object, return it
            if (typeof data === 'object') {
                return data;
            }

            // For any other data type, log and return null
            console.warn(`⚠️ Unexpected data type for ${key}:`, typeof data, data);
            return null;
        } catch (error) {
            console.error(`❌ Error loading local data: ${key}`, error);
            return null;
        }
    }

    async removeLocalData(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log(`🗑️ Local remove (dev mode): ${key}`);
            // Fallback to localStorage in development mode
            try {
                localStorage.removeItem(`arkadium_${key}`);
                return true;
            } catch (error) {
                console.error(`❌ Error removing from localStorage: ${key}`, error);
                return false;
            }
        }

        try {
            console.log(`🗑️ Removing local data: ${key}`);
            await this.sdk.persistence.removeLocalStorageItem(key);
            console.log(`✅ Local data removed: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error removing local data: ${key}`, error);
            return false;
        }
    }

    // Enhanced storage methods with batch operations and validation
    async saveMultipleRemoteData(dataMap) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating multiple remote save (dev mode)');
            return true;
        }

        try {
            console.log(`💾 Saving multiple remote data items: ${Object.keys(dataMap).join(', ')}`);
            const results = {};

            for (const [key, data] of Object.entries(dataMap)) {
                try {
                    await this.sdk.persistence.remote.set(key, data);
                    results[key] = { success: true };
                } catch (error) {
                    console.error(`❌ Error saving remote data for key ${key}:`, error);
                    results[key] = { success: false, error: error.message };
                }
            }

            console.log(`✅ Multiple remote data save completed`);
            return results;
        } catch (error) {
            console.error('❌ Error in multiple remote save operation:', error);
            return false;
        }
    }

    async loadMultipleRemoteData(keys) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating multiple remote load (dev mode)');
            const result = {};
            keys.forEach(key => result[key] = null);
            return result;
        }

        try {
            console.log(`📂 Loading multiple remote data items: ${keys.join(', ')}`);
            const results = {};

            for (const key of keys) {
                try {
                    const data = await this.sdk.persistence.remote.get(key);
                    results[key] = data;
                } catch (error) {
                    console.error(`❌ Error loading remote data for key ${key}:`, error);
                    results[key] = null;
                }
            }

            console.log(`✅ Multiple remote data load completed`);
            return results;
        } catch (error) {
            console.error('❌ Error in multiple remote load operation:', error);
            return null;
        }
    }

    async saveMultipleLocalData(dataMap) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating multiple local save (dev mode)');
            return true;
        }

        try {
            console.log(`💾 Saving multiple local data items: ${Object.keys(dataMap).join(', ')}`);
            const results = {};

            for (const [key, data] of Object.entries(dataMap)) {
                try {
                    await this.sdk.persistence.local.set(key, data);
                    results[key] = { success: true };
                } catch (error) {
                    console.error(`❌ Error saving local data for key ${key}:`, error);
                    results[key] = { success: false, error: error.message };
                }
            }

            console.log(`✅ Multiple local data save completed`);
            return results;
        } catch (error) {
            console.error('❌ Error in multiple local save operation:', error);
            return false;
        }
    }

    async loadMultipleLocalData(keys) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating multiple local load (dev mode)');
            const result = {};
            keys.forEach(key => result[key] = null);
            return result;
        }

        try {
            console.log(`📂 Loading multiple local data items: ${keys.join(', ')}`);
            const results = {};

            for (const key of keys) {
                try {
                    const data = await this.sdk.persistence.local.get(key);
                    results[key] = data;
                } catch (error) {
                    console.error(`❌ Error loading local data for key ${key}:`, error);
                    results[key] = null;
                }
            }

            console.log(`✅ Multiple local data load completed`);
            return results;
        } catch (error) {
            console.error('❌ Error in multiple local load operation:', error);
            return null;
        }
    }

    // ========================================
    // SPECIALIZED PERSISTENCE METHODS
    // ========================================

    // Save user progress (puzzles completed, statistics, etc.)
    async saveUserProgress(progressData) {
        const key = 'user_progress';
        console.log('💾 Saving user progress data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();

        if (isAuthenticated) {
            const success = await this.saveRemoteData(key, progressData);
            if (success) {
                // Also save locally as backup
                await this.saveLocalData(key, progressData);
                return true;
            }
        }

        // Fallback to local storage
        return await this.saveLocalData(key, progressData);
    }

    // Load user progress
    async loadUserProgress() {
        const key = 'user_progress';
        console.log('📂 Loading user progress data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();
        console.log('🔐 User authenticated:', isAuthenticated);

        if (isAuthenticated) {
            console.log('📡 Attempting to load from remote storage...');
            const remoteData = await this.loadRemoteData(key);
            if (remoteData) {
                console.log('✅ Remote data loaded, syncing to local backup');
                // Sync to local as backup
                await this.saveLocalData(key, remoteData);
                return remoteData;
            } else {
                console.log('⚠️ No remote data found');
            }
        }

        // Fallback to local storage
        console.log('📂 Loading from local storage...');
        const localData = await this.loadLocalData(key);

        // If we have local data but user is authenticated, sync it to remote
        if (localData && isAuthenticated) {
            console.log('🔄 Syncing local data to remote storage...');
            await this.saveRemoteData(key, localData);
        }

        return localData;
    }

    // Save achievements data
    async saveAchievements(achievementsData) {
        const key = 'achievements';
        console.log('🏆 Saving achievements data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();

        if (isAuthenticated) {
            const success = await this.saveRemoteData(key, achievementsData);
            if (success) {
                // Also save locally as backup
                await this.saveLocalData(key, achievementsData);
                return true;
            }
        }

        // Fallback to local storage
        return await this.saveLocalData(key, achievementsData);
    }

    // Load achievements data
    async loadAchievements() {
        const key = 'achievements';
        console.log('🏆 Loading achievements data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();

        if (isAuthenticated) {
            const remoteData = await this.loadRemoteData(key);
            if (remoteData) {
                // Sync to local as backup
                await this.saveLocalData(key, remoteData);
                return remoteData;
            }
        }

        // Fallback to local storage
        return await this.loadLocalData(key);
    }

    // Save game statistics
    async saveStatistics(statisticsData) {
        const key = 'statistics';
        console.log('📊 Saving statistics data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();

        if (isAuthenticated) {
            const success = await this.saveRemoteData(key, statisticsData);
            if (success) {
                // Also save locally as backup
                await this.saveLocalData(key, statisticsData);
                return true;
            }
        }

        // Fallback to local storage
        return await this.saveLocalData(key, statisticsData);
    }

    // Load game statistics
    async loadStatistics() {
        const key = 'statistics';
        console.log('📊 Loading statistics data');

        // Try remote first (if authenticated), fallback to local
        const isAuthenticated = await this.checkAuthentication();

        if (isAuthenticated) {
            const remoteData = await this.loadRemoteData(key);
            if (remoteData) {
                // Sync to local as backup
                await this.saveLocalData(key, remoteData);
                return remoteData;
            }
        }

        // Fallback to local storage
        return await this.loadLocalData(key);
    }

    // Save current game state (for resuming mid-puzzle)
    async saveGameState(gameStateData) {
        const key = 'current_game_state';
        console.log('💾 Saving current game state');

        // Game state is typically saved locally for quick access
        // But also save remotely if authenticated for cross-device sync
        const localSuccess = await this.saveLocalData(key, gameStateData);

        const isAuthenticated = await this.checkAuthentication();
        if (isAuthenticated) {
            await this.saveRemoteData(key, gameStateData);
        }

        return localSuccess;
    }

    // Load current game state
    async loadGameState() {
        const key = 'current_game_state';
        console.log('📂 Loading current game state');

        // Try local first for speed, then remote if not found
        let gameState = await this.loadLocalData(key);

        if (!gameState) {
            const isAuthenticated = await this.checkAuthentication();
            if (isAuthenticated) {
                gameState = await this.loadRemoteData(key);
                if (gameState) {
                    // Sync to local for next time
                    await this.saveLocalData(key, gameState);
                }
            }
        }

        return gameState;
    }

    // Clear current game state (when puzzle is completed)
    async clearGameState() {
        const key = 'current_game_state';
        console.log('🗑️ Clearing current game state');

        const localSuccess = await this.removeLocalData(key);

        const isAuthenticated = await this.checkAuthentication();
        if (isAuthenticated) {
            await this.removeRemoteData(key);
        }

        return localSuccess;
    }

    // Sync all data from local to remote (useful after authentication)
    async syncAllDataToRemote() {
        console.log('🔄 Syncing all data from local to remote storage');

        const isAuthenticated = await this.checkAuthentication();
        if (!isAuthenticated) {
            console.log('⚠️ User not authenticated, cannot sync to remote');
            return false;
        }

        const keys = ['user_progress', 'achievements', 'statistics', 'current_game_state'];
        let syncResults = {};

        for (const key of keys) {
            try {
                const localData = await this.loadLocalData(key);
                if (localData) {
                    const success = await this.saveRemoteData(key, localData);
                    syncResults[key] = success;
                    console.log(`${success ? '✅' : '❌'} Sync ${key}: ${success}`);
                } else {
                    syncResults[key] = 'no_data';
                    console.log(`ℹ️ No local data found for ${key}`);
                }
            } catch (error) {
                console.error(`❌ Error syncing ${key}:`, error);
                syncResults[key] = false;
            }
        }

        console.log('🔄 Sync completed:', syncResults);
        return syncResults;
    }

    // Sync all data from remote to local (useful for new device)
    async syncAllDataFromRemote() {
        console.log('🔄 Syncing all data from remote to local storage');

        const isAuthenticated = await this.checkAuthentication();
        if (!isAuthenticated) {
            console.log('⚠️ User not authenticated, cannot sync from remote');
            return false;
        }

        const keys = ['user_progress', 'achievements', 'statistics', 'current_game_state'];
        let syncResults = {};

        for (const key of keys) {
            try {
                const remoteData = await this.loadRemoteData(key);
                if (remoteData) {
                    const success = await this.saveLocalData(key, remoteData);
                    syncResults[key] = success;
                    console.log(`${success ? '✅' : '❌'} Sync ${key}: ${success}`);
                } else {
                    syncResults[key] = 'no_data';
                    console.log(`ℹ️ No remote data found for ${key}`);
                }
            } catch (error) {
                console.error(`❌ Error syncing ${key}:`, error);
                syncResults[key] = false;
            }
        }

        console.log('🔄 Sync completed:', syncResults);
        return syncResults;
    }

    // Data synchronization methods
    async syncLocalToRemote(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot sync local to remote (dev mode)');
            return true;
        }

        try {
            console.log(`🔄 Syncing local data to remote for key: ${key}`);
            const localData = await this.loadLocalData(key);
            if (localData !== null) {
                await this.saveRemoteData(key, localData);
                console.log(`✅ Synced local data to remote for key: ${key}`);
                return true;
            } else {
                console.log(`⚠️ No local data found for key: ${key}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Error syncing local to remote for key ${key}:`, error);
            return false;
        }
    }

    async syncRemoteToLocal(key) {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot sync remote to local (dev mode)');
            return true;
        }

        try {
            console.log(`🔄 Syncing remote data to local for key: ${key}`);
            const remoteData = await this.loadRemoteData(key);
            if (remoteData !== null) {
                await this.saveLocalData(key, remoteData);
                console.log(`✅ Synced remote data to local for key: ${key}`);
                return true;
            } else {
                console.log(`⚠️ No remote data found for key: ${key}`);
                return false;
            }
        } catch (error) {
            console.error(`❌ Error syncing remote to local for key ${key}:`, error);
            return false;
        }
    }

    // User login methods
    async login() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating login');
            return { success: true, user: { id: 'dev-user', name: 'Developer' } };
        }

        try {
            console.log('🔐 Initiating user login...');
            const user = await this.sdk.user.login();
            console.log('✅ User logged in successfully:', user);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Error during login:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, simulating logout');
            return { success: true };
        }

        try {
            console.log('🔐 Initiating user logout...');
            await this.sdk.user.logout();
            console.log('✅ User logged out successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Error during logout:', error);
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, returning dev user');
            return { id: 'dev-user', name: 'Developer', isGuest: true };
        }

        try {
            console.log('👤 Getting current user information...');
            const user = await this.sdk.user.getCurrentUser();
            console.log('✅ Retrieved user information:', user);
            return user;
        } catch (error) {
            console.error('❌ Error getting user information:', error);
            return null;
        }
    }

    async isLoggedIn() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, checking dev login status');
            return true; // In development mode, assume logged in
        }

        try {
            console.log('🔐 Checking login status...');
            const loggedIn = await this.sdk.user.isLoggedIn();
            console.log('✅ Login status:', loggedIn);
            return loggedIn;
        } catch (error) {
            console.error('❌ Error checking login status:', error);
            return false;
        }
    }

    // Session management
    async refreshSession() {
        if (!this.sdk || !this.isInitialized) {
            console.log('🎮 SDK not available, cannot refresh session');
            return { success: true };
        }

        try {
            console.log('🔄 Refreshing user session...');
            await this.sdk.user.refreshSession();
            console.log('✅ Session refreshed successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Error refreshing session:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other files
window.ArkadiumIntegration = ArkadiumIntegration;