// Achievements Manager for Daily Quote Puzzle
class AchievementsManager {
    constructor() {
        this.achievements = {
            // First Steps - Complete your very first puzzle
            firstSteps: {
                id: 'firstSteps',
                name: 'First Steps',
                description: 'Complete your very first daily puzzle',
                icon: '👣',
                category: 'Beginnings',
                requirement: 1,
                inkDropsReward: 1
            },
            
            // Quote Enthusiast - Complete 5 puzzles
            quoteEnthusiast: {
                id: 'quoteEnthusiast',
                name: 'Quote Enthusiast',
                description: 'Complete 5 daily puzzles',
                icon: '💭',
                category: 'Beginnings',
                requirement: 5,
                inkDropsReward: 1
            },
            
            // Early Bird - First puzzle of the day
            earlyBird: {
                id: 'earlyBird',
                name: 'Early Bird',
                description: 'Complete your first puzzle before 9 AM',
                icon: '🌅',
                category: 'Daily Habits',
                requirement: 1,
                inkDropsReward: 1
            },
            
            // Night Owl - Late night puzzle solving
            nightOwl: {
                id: 'nightOwl',
                name: 'Night Owl',
                description: 'Complete a puzzle after 10 PM',
                icon: '🦉',
                category: 'Daily Habits',
                requirement: 1,
                inkDropsReward: 1
            },
            
            // Weekend Warrior - Weekend completion
            weekendWarrior: {
                id: 'weekendWarrior',
                name: 'Weekend Warrior',
                description: 'Complete puzzles on both Saturday and Sunday',
                icon: '🏃',
                category: 'Weekly Goals',
                requirement: 1,
                inkDropsReward: 2
            },
            
            // Quote Collector - Complete 10 different quotes
            quoteCollector: {
                id: 'quoteCollector',
                name: 'Quote Collector',
                description: 'Complete 10 different daily puzzles',
                icon: '📚',
                category: 'Milestones',
                requirement: 10,
                inkDropsReward: 2
            },
            
            // Wisdom Seeker - Complete 50 different quotes
            wisdomSeeker: {
                id: 'wisdomSeeker',
                name: 'Wisdom Seeker',
                description: 'Complete 50 different daily puzzles',
                icon: '🧠',
                category: 'Milestones',
                requirement: 50,
                inkDropsReward: 10
            },
            
            // Sage Master - Complete 100 different quotes
            sageMaster: {
                id: 'sageMaster',
                name: 'Sage Master',
                description: 'Complete 100 different daily puzzles',
                icon: '👑',
                category: 'Milestones',
                requirement: 100,
                inkDropsReward: 20
            },
            
            // Speed Demon - Complete a puzzle in under 30 seconds
            speedDemon: {
                id: 'speedDemon',
                name: 'Speed Demon',
                description: 'Complete a puzzle in under 30 seconds',
                icon: '⚡',
                category: 'Speed Challenges',
                requirement: 1,
                inkDropsReward: 1
            },
            
            // Lightning Fast - Complete a puzzle in under 15 seconds
            lightningFast: {
                id: 'lightningFast',
                name: 'Lightning Fast',
                description: 'Complete a puzzle in under 15 seconds',
                icon: '🌩️',
                category: 'Speed Challenges',
                requirement: 1,
                inkDropsReward: 2
            },
            
            // Patient Solver - Take over 5 minutes on a puzzle
            patientSolver: {
                id: 'patientSolver',
                name: 'Patient Solver',
                description: 'Spend over 5 minutes solving a single puzzle',
                icon: '⏰',
                category: 'Persistence',
                requirement: 1,
                inkDropsReward: 1
            },
            
            // Dedicated Learner - Complete 7 puzzles in a row
            dedicatedLearner: {
                id: 'dedicatedLearner',
                name: 'Dedicated Learner',
                description: 'Complete 7 puzzles in consecutive days',
                icon: '📖',
                category: 'Consistency',
                requirement: 7,
                inkDropsReward: 2
            },
            
            // Marathon Runner - Complete 30 puzzles in a row
            marathonRunner: {
                id: 'marathonRunner',
                name: 'Marathon Runner',
                description: 'Complete 30 puzzles in consecutive days',
                icon: '🏃‍♂️',
                category: 'Consistency',
                requirement: 30,
                inkDropsReward: 10
            },
            
            // Iron Will - Complete 100 puzzles in a row
            ironWill: {
                id: 'ironWill',
                name: 'Iron Will',
                description: 'Complete 100 puzzles in consecutive days',
                icon: '💪',
                category: 'Consistency',
                requirement: 100,
                inkDropsReward: 25
            },
            
            // Word Smith - Complete 500 words total
            wordSmith: {
                id: 'wordSmith',
                name: 'Word Smith',
                description: 'Successfully complete 500 words',
                icon: '🔤',
                category: 'Word Mastery',
                requirement: 500,
                inkDropsReward: 25
            },
            
            // Lexicon Legend - Complete 1000 words total
            lexiconLegend: {
                id: 'lexiconLegend',
                name: 'Lexicon Legend',
                description: 'Successfully complete 1000 words',
                icon: '📖',
                category: 'Word Mastery',
                requirement: 1000,
                inkDropsReward: 50
            },
            
            // Perfect Week - Complete all 7 days in a week
            perfectWeek: {
                id: 'perfectWeek',
                name: 'Perfect Week',
                description: 'Complete all 7 puzzles in a single week',
                icon: '📅',
                category: 'Weekly Goals',
                requirement: 7,
                inkDropsReward: 2
            },
            
            // Monthly Master - Complete all days in a month
            monthlyMaster: {
                id: 'monthlyMaster',
                name: 'Monthly Master',
                description: 'Complete all puzzles in the current month',
                icon: '🗓️',
                category: 'Monthly Goals',
                requirement: 31, // Maximum days in a month
                inkDropsReward: 10
            }
        };
        
        this.userAchievements = {};
        this.achievementNotifications = [];
    }
    
    // Initialize achievements from user data
    initializeFromUserData(userData) {
        console.log('🏆 AchievementsManager.initializeFromUserData called with:', userData);
        console.log('🏆 userData.achievements:', userData.achievements);
        
        if (userData.achievements) {
            console.log('🏆 Using existing achievements data');
            this.userAchievements = userData.achievements;
        } else {
            console.log('🏆 No achievements data found, initializing empty');
            // Initialize default achievement progress
            this.userAchievements = {};
        }
        
        console.log('🏆 User achievements before ensuring all exist:', this.userAchievements);
        
        // Ensure all achievements exist
        Object.keys(this.achievements).forEach(achievementId => {
            if (!this.userAchievements[achievementId]) {
                console.log(`🏆 Creating default entry for achievement: ${achievementId}`);
                this.userAchievements[achievementId] = { 
                    current: 0, 
                    completed: false,
                    completedDate: null,
                    rewardCollected: false,
                    pendingInkDrops: 0
                };
            } else {
                console.log(`🏆 Achievement ${achievementId} already exists:`, this.userAchievements[achievementId]);
                // Initialize new properties for existing achievements
                if (this.userAchievements[achievementId].rewardCollected === undefined) {
                    this.userAchievements[achievementId].rewardCollected = false;
                }
                if (this.userAchievements[achievementId].pendingInkDrops === undefined) {
                    this.userAchievements[achievementId].pendingInkDrops = 0;
                }
            }
        });
        
        console.log('🏆 Final user achievements after initialization:', this.userAchievements);
        
        // Validate and fix achievement states
        this.validateAndFixAchievementStates();
    }
    
    // Validate and fix inconsistent achievement states
    validateAndFixAchievementStates() {
        console.log('🔍 Validating achievement states...');
        let fixedCount = 0;
        
        Object.keys(this.userAchievements).forEach(achievementId => {
            const userAchievement = this.userAchievements[achievementId];
            const achievementDef = this.achievements[achievementId];
            
            if (!userAchievement || !achievementDef) return;
            
            // Fix 1: If achievement is completed but rewardCollected is undefined/null, set it to false
            if (userAchievement.completed && userAchievement.rewardCollected === undefined) {
                console.log(`🔧 Fixing rewardCollected state for ${achievementId}`);
                userAchievement.rewardCollected = false;
                userAchievement.pendingInkDrops = achievementDef.inkDropsReward || 0;
                fixedCount++;
            }
            
            // Fix 2: If achievement shows as completed but current < target, recalculate
            if (userAchievement.completed && userAchievement.current < achievementDef.target) {
                console.log(`🔧 Fixing progress mismatch for ${achievementId}: current=${userAchievement.current}, target=${achievementDef.target}`);
                userAchievement.current = achievementDef.target;
                fixedCount++;
            }
            
            // Fix 3: If achievement has reached target but not marked completed, fix it
            if (!userAchievement.completed && userAchievement.current >= achievementDef.target) {
                console.log(`🔧 Marking ${achievementId} as completed (current=${userAchievement.current}, target=${achievementDef.target})`);
                userAchievement.completed = true;
                userAchievement.completedDate = new Date().toISOString();
                userAchievement.rewardCollected = false;
                userAchievement.pendingInkDrops = achievementDef.inkDropsReward || 0;
                fixedCount++;
            }
            
            // Fix 4: Ensure pendingInkDrops is set correctly for uncollected rewards
            if (userAchievement.completed && !userAchievement.rewardCollected) {
                const expectedReward = achievementDef.inkDropsReward || 0;
                if (userAchievement.pendingInkDrops !== expectedReward) {
                    console.log(`🔧 Fixing pendingInkDrops for ${achievementId}: ${userAchievement.pendingInkDrops} -> ${expectedReward}`);
                    userAchievement.pendingInkDrops = expectedReward;
                    fixedCount++;
                }
            }
            
            // Fix 5: Clear pendingInkDrops if reward was already collected
            if (userAchievement.completed && userAchievement.rewardCollected && userAchievement.pendingInkDrops > 0) {
                console.log(`🔧 Clearing pendingInkDrops for already collected ${achievementId}`);
                userAchievement.pendingInkDrops = 0;
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            console.log(`✅ Fixed ${fixedCount} achievement state issues`);
        } else {
            console.log('✅ All achievement states are valid');
        }
    }
    
    // Check early bird achievement
    checkEarlyBird() {
        const now = new Date();
        const hour = now.getHours();
        const earlyBirdAchievement = this.userAchievements.earlyBird;
        
        if (hour < 9) {
            earlyBirdAchievement.current = 1;
            if (!earlyBirdAchievement.completed) {
                return this.unlockAchievement('earlyBird');
            }
        }
        return 0;
    }
    
    // Check night owl achievement
    checkNightOwl() {
        const now = new Date();
        const hour = now.getHours();
        const nightOwlAchievement = this.userAchievements.nightOwl;
        
        if (hour >= 22) {
            nightOwlAchievement.current = 1;
            if (!nightOwlAchievement.completed) {
                return this.unlockAchievement('nightOwl');
            }
        }
        return 0;
    }
    
    // Check weekend warrior achievement
    checkWeekendWarrior(userData) {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            // Get the current week's Saturday and Sunday
            const currentWeekStart = new Date(today);
            currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
            
            const saturday = new Date(currentWeekStart);
            saturday.setDate(currentWeekStart.getDate() + 6);
            
            const sunday = new Date(currentWeekStart);
            
            const saturdayStr = this.formatDate(saturday);
            const sundayStr = this.formatDate(sunday);
            
            // Check if both Saturday and Sunday are completed
            const saturdayCompleted = userData.puzzles[saturdayStr]?.solved || false;
            const sundayCompleted = userData.puzzles[sundayStr]?.solved || false;
            
            const achievement = this.userAchievements.weekendWarrior;
            achievement.current = (saturdayCompleted && sundayCompleted) ? 1 : 0;
            
            if (achievement.current >= 1 && !achievement.completed) {
                return this.unlockAchievement('weekendWarrior');
            }
        }
        return 0;
    }
    
    // Helper method to format date (same as in game-modern.js)
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Check quote collector achievements
    checkQuoteCollector(totalCompleted) {
        const achievements = ['quoteCollector', 'wisdomSeeker', 'sageMaster'];
        const requirements = [10, 50, 100];
        let totalReward = 0;
        
        achievements.forEach((achievementId, index) => {
            const userAchievement = this.userAchievements[achievementId];
            userAchievement.current = totalCompleted;
            
            if (totalCompleted >= requirements[index] && !userAchievement.completed) {
                totalReward += this.unlockAchievement(achievementId);
            }
        });
        
        return totalReward;
    }
    
    // Check speed achievements
    checkSpeedAchievements(solveTime) {
        let totalReward = 0;
        
        // Update Lightning Fast progress (best time under 15 seconds)
        const lightningFastAchievement = this.userAchievements.lightningFast;
        if (solveTime <= 15) {
            lightningFastAchievement.current = 1;
            if (!lightningFastAchievement.completed) {
                totalReward += this.unlockAchievement('lightningFast');
            }
        }
        
        // Update Speed Demon progress (best time under 30 seconds)
        const speedDemonAchievement = this.userAchievements.speedDemon;
        if (solveTime <= 30) {
            speedDemonAchievement.current = 1;
            if (!speedDemonAchievement.completed) {
                totalReward += this.unlockAchievement('speedDemon');
            }
        }
        
        return totalReward;
    }
    
    // Check patient solver achievement
    checkPatientSolver(solveTime) {
        const patientSolverAchievement = this.userAchievements.patientSolver;
        if (solveTime >= 300) { // 5 minutes = 300 seconds
            patientSolverAchievement.current = 1;
            if (!patientSolverAchievement.completed) {
                return this.unlockAchievement('patientSolver');
            }
        }
        return 0;
    }
    
    // Check consistency achievements
    checkConsistencyAchievements(currentStreak) {
        const achievements = ['dedicatedLearner', 'marathonRunner', 'ironWill'];
        const requirements = [7, 30, 100];
        let totalReward = 0;
        
        console.log(`🏃 Checking consistency achievements with streak: ${currentStreak}`);
        
        achievements.forEach((achievementId, index) => {
            const userAchievement = this.userAchievements[achievementId];
            userAchievement.current = currentStreak;
            
            console.log(`🏃 ${achievementId}: ${currentStreak}/${requirements[index]} (completed: ${userAchievement.completed})`);
            
            if (currentStreak >= requirements[index] && !userAchievement.completed) {
                totalReward += this.unlockAchievement(achievementId);
            }
        });
        
        return totalReward;
    }
    
    // Check word mastery achievements
    checkWordMastery(totalWordsUnscrambled) {
        const achievements = ['wordSmith', 'lexiconLegend'];
        const requirements = [500, 1000];
        let totalReward = 0;
        
        achievements.forEach((achievementId, index) => {
            const userAchievement = this.userAchievements[achievementId];
            userAchievement.current = totalWordsUnscrambled;
            
            if (totalWordsUnscrambled >= requirements[index] && !userAchievement.completed) {
                totalReward += this.unlockAchievement(achievementId);
            }
        });
        
        return totalReward;
    }
    
    // Check perfect week achievement
    checkPerfectWeek(weekCompletions) {
        const userAchievement = this.userAchievements.perfectWeek;
        userAchievement.current = weekCompletions;
        
        if (weekCompletions >= 7 && !userAchievement.completed) {
            return this.unlockAchievement('perfectWeek');
        }
        return 0;
    }
    
    // Check monthly master achievement
    checkMonthlyMaster(monthCompletions) {
        const userAchievement = this.userAchievements.monthlyMaster;
        
        // Calculate current month's total days and completed days
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        // Get the number of days in the current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Count completed puzzles for the current month
        let completedThisMonth = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = this.formatDate(new Date(currentYear, currentMonth, day));
            if (monthCompletions && monthCompletions[dateStr] && monthCompletions[dateStr].solved) {
                completedThisMonth++;
            }
        }
        
        userAchievement.current = completedThisMonth;
        
        console.log(`🗓️ Monthly Master: ${completedThisMonth}/${daysInMonth} days completed this month`);
        
        if (completedThisMonth >= daysInMonth && !userAchievement.completed) {
            return this.unlockAchievement('monthlyMaster');
        }
        return 0;
    }
    
    // Check beginning achievements
    checkBeginningAchievements(totalCompleted) {
        let totalReward = 0;
        
        // Update First Steps progress
        const firstStepsAchievement = this.userAchievements.firstSteps;
        firstStepsAchievement.current = totalCompleted;
        
        if (totalCompleted === 1 && !firstStepsAchievement.completed) {
            totalReward += this.unlockAchievement('firstSteps');
        }
        
        // Update Quote Enthusiast progress
        const quoteEnthusiastAchievement = this.userAchievements.quoteEnthusiast;
        quoteEnthusiastAchievement.current = totalCompleted;
        
        if (totalCompleted >= 5 && !quoteEnthusiastAchievement.completed) {
            totalReward += this.unlockAchievement('quoteEnthusiast');
        }
        
        return totalReward;
    }
    
    // Unlock an achievement
    unlockAchievement(achievementId) {
        const userAchievement = this.userAchievements[achievementId];
        if (!userAchievement.completed) {
            userAchievement.completed = true;
            userAchievement.completedDate = Date.now();
            
            const achievement = this.achievements[achievementId];
            const inkDropsReward = achievement.inkDropsReward || 0;
            
            // Mark reward as pending collection
            userAchievement.rewardCollected = false;
            userAchievement.pendingInkDrops = inkDropsReward;
            
            // Add notification without ink drops reward (will be collected later)
            this.achievementNotifications.push({
                id: achievementId,
                achievementId: achievementId,
                name: achievement.name,
                timestamp: Date.now()
            });
            
            console.log(`🏆 Achievement Unlocked: ${achievement.name}! +${inkDropsReward} ink drops (pending collection)`);
            
            // Return the ink drops reward
            return inkDropsReward;
        }
        return 0;
    }
    
    // Get achievement progress
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        const userAchievement = this.userAchievements[achievementId];
        
        if (!achievement || !userAchievement) return null;
        
        return {
            current: Math.min(userAchievement.current, achievement.requirement),
            target: achievement.requirement,
            progress: Math.min(userAchievement.current / achievement.requirement, 1),
            completed: userAchievement.completed,
            completedDate: userAchievement.completedDate
        };
    }
    
    // Get all achievements with progress
    getAllAchievementsProgress() {
        const result = {};
        
        Object.keys(this.achievements).forEach(achievementId => {
            result[achievementId] = {
                ...this.achievements[achievementId],
                progress: this.getAchievementProgress(achievementId)
            };
        });
        
        return result;
    }
    
    // Get achievements by category
    getAchievementsByCategory() {
        const categories = {};
        
        Object.values(this.achievements).forEach(achievement => {
            if (!categories[achievement.category]) {
                categories[achievement.category] = [];
            }
            categories[achievement.category].push({
                ...achievement,
                progress: this.getAchievementProgress(achievement.id)
            });
        });
        
        return categories;
    }
    
    // Get recent notifications
    getRecentNotifications(limit = 5) {
        return this.achievementNotifications
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    
    // Clear old notifications
    clearOldNotifications() {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        this.achievementNotifications = this.achievementNotifications.filter(
            notification => notification.timestamp > oneWeekAgo
        );
    }
    
    // Get achievements that have uncollected rewards
    getUnclaimedRewards() {
        const unclaimed = [];
        Object.keys(this.userAchievements).forEach(achievementId => {
            const userAchievement = this.userAchievements[achievementId];
            if (userAchievement.completed && !userAchievement.rewardCollected && userAchievement.pendingInkDrops > 0) {
                unclaimed.push({
                    id: achievementId,
                    achievement: this.achievements[achievementId],
                    userProgress: userAchievement
                });
            }
        });
        return unclaimed;
    }
    
    // Get total unclaimed ink drops
    getTotalUnclaimedInkDrops() {
        return this.getUnclaimedRewards().reduce((total, reward) => total + reward.userProgress.pendingInkDrops, 0);
    }
    
    // Force recalculate all achievement progress (recovery method)
    recalculateAllProgress(userData) {
        console.log('🔄 Recalculating all achievement progress...');
        
        if (!userData || !userData.puzzles) {
            console.warn('⚠️ Cannot recalculate without valid user data');
            return;
        }
        
        // Reset all progress but keep completion dates and reward collection status
        Object.keys(this.userAchievements).forEach(achievementId => {
            const userAchievement = this.userAchievements[achievementId];
            // Only reset if not completed, or if completed but progress seems wrong
            if (!userAchievement.completed) {
                userAchievement.current = 0;
            }
        });
        
        // Recalculate based on user data
        const totalCompleted = Object.values(userData.puzzles).filter(p => p.solved).length;
        
        // Recalculate beginning achievements
        this.checkBeginningAchievements(totalCompleted);
        
        // Recalculate quote collector achievements  
        this.checkQuoteCollector(totalCompleted);
        
        // Recalculate consistency achievements
        if (userData.stats && userData.stats.currentStreak) {
            this.checkConsistencyAchievements(userData.stats.currentStreak);
        }
        
        // Calculate total words completed
        let totalWordsCompleted = 0;
        Object.values(userData.puzzles).forEach(puzzle => {
            if (puzzle.solved && puzzle.wordsCompleted) {
                totalWordsCompleted += puzzle.wordsCompleted;
            }
        });
        this.checkWordMastery(totalWordsCompleted);
        
        console.log('✅ Achievement progress recalculation complete');
    }

    // Get user achievements data for saving
    getUserAchievementsData() {
        console.log('🏆 getUserAchievementsData called, returning:', this.userAchievements);
        return this.userAchievements;
    }

    // Manual method to fix achievement reward collection issues
    fixRewardCollectionIssues() {
        console.log('🔧 Manually fixing reward collection issues...');
        this.validateAndFixAchievementStates();
        console.log('✅ Reward collection issues fixed');
    }
}
