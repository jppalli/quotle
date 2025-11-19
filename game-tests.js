// Automated test suite for the word scramble game
// Include this script in your HTML or run in console

class GameTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.isRunning = false;
    }

    // Add test methods
    addTest(name, testFunction, description = '') {
        this.tests.push({
            name,
            testFunction,
            description,
            status: 'pending'
        });
    }

    async runAllTests() {
        if (this.isRunning) {
            console.log('Tests already running...');
            return;
        }

        this.isRunning = true;
        this.results = [];
        
        console.log('🧪 Starting Game Test Suite...');
        console.log(`Running ${this.tests.length} tests...\n`);

        for (const test of this.tests) {
            await this.runSingleTest(test);
            await this.delay(500); // Small delay between tests
        }

        this.isRunning = false;
        this.printSummary();
    }

    async runSingleTest(test) {
        console.log(`🔍 Running: ${test.name}`);
        
        try {
            const startTime = Date.now();
            const result = await test.testFunction();
            const duration = Date.now() - startTime;
            
            const testResult = {
                name: test.name,
                status: result.success ? 'passed' : 'failed',
                message: result.message || '',
                duration,
                details: result.details || {}
            };
            
            this.results.push(testResult);
            
            if (result.success) {
                console.log(`✅ ${test.name} - PASSED (${duration}ms)`);
            } else {
                console.log(`❌ ${test.name} - FAILED: ${result.message} (${duration}ms)`);
                if (result.details) {
                    console.log('   Details:', result.details);
                }
            }
            
        } catch (error) {
            console.log(`💥 ${test.name} - ERROR: ${error.message}`);
            this.results.push({
                name: test.name,
                status: 'error',
                message: error.message,
                duration: 0,
                details: { stack: error.stack }
            });
        }
    }

    printSummary() {
        const passed = this.results.filter(r => r.status === 'passed').length;
        const failed = this.results.filter(r => r.status === 'failed').length;
        const errors = this.results.filter(r => r.status === 'error').length;
        
        console.log('\n📊 Test Summary:');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`💥 Errors: ${errors}`);
        console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
        
        if (failed > 0 || errors > 0) {
            console.log('\n🔍 Failed Tests:');
            this.results.filter(r => r.status !== 'passed').forEach(result => {
                console.log(`   ${result.name}: ${result.message}`);
            });
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper method to check if game is ready
    isGameReady() {
        return window.game && window.game.currentQuote && window.game.currentQuote.scrambledWords;
    }

    // Helper to find an unsolved word
    findUnsolvedWord() {
        if (!this.isGameReady()) return null;
        return window.game.currentQuote.scrambledWords.find(word => 
            !window.game.solvedWords.has(word.original)
        );
    }

    // Helper to simulate clicking a letter
    async clickLetter(letter) {
        const letterBtn = document.querySelector(`[data-letter="${letter}"]`);
        if (!letterBtn) {
            throw new Error(`Letter button '${letter}' not found`);
        }
        letterBtn.click();
        await this.delay(50);
    }

    // Helper to click on a word
    async clickWord(wordIndex = 0) {
        const wordElements = document.querySelectorAll('[data-word-index]');
        if (wordElements[wordIndex]) {
            wordElements[wordIndex].click();
            await this.delay(100);
        } else {
            throw new Error(`Word element at index ${wordIndex} not found`);
        }
    }
}

// Create test suite instance
const testSuite = new GameTestSuite();

// Test 1: Game Initialization
testSuite.addTest('Game Initialization', async () => {
    if (!window.game) {
        return { success: false, message: 'Game object not found' };
    }
    
    if (!window.game.currentQuote) {
        return { success: false, message: 'No current quote loaded' };
    }
    
    if (!window.game.currentQuote.scrambledWords || window.game.currentQuote.scrambledWords.length === 0) {
        return { success: false, message: 'No scrambled words found' };
    }
    
    return { 
        success: true, 
        message: `Game initialized with ${window.game.currentQuote.scrambledWords.length} words`,
        details: {
            wordsCount: window.game.currentQuote.scrambledWords.length,
            hasAuthor: !!window.game.currentQuote.author
        }
    };
});

// Test 2: Word Selection
testSuite.addTest('Word Selection', async () => {
    if (!testSuite.isGameReady()) {
        return { success: false, message: 'Game not ready' };
    }
    
    const initialActiveWord = window.game.activeWord;
    await testSuite.clickWord(0);
    const newActiveWord = window.game.activeWord;
    
    if (!newActiveWord) {
        return { success: false, message: 'No word became active after clicking' };
    }
    
    return { 
        success: true, 
        message: 'Word selection working correctly',
        details: {
            selectedWord: newActiveWord.original,
            scrambledWord: newActiveWord.scrambled
        }
    };
});

// Test 3: Letter Input
testSuite.addTest('Letter Input', async () => {
    if (!testSuite.isGameReady() || !window.game.activeWord) {
        return { success: false, message: 'No active word for testing' };
    }
    
    const initialInput = window.game.userInput || '';
    const testLetter = 'a';
    
    // Find if the letter is available
    const letterBtn = document.querySelector(`[data-letter="${testLetter}"]`);
    if (!letterBtn) {
        return { success: false, message: `Test letter '${testLetter}' not available` };
    }
    
    await testSuite.clickLetter(testLetter);
    const newInput = window.game.userInput || '';
    
    if (newInput !== initialInput + testLetter) {
        return { 
            success: false, 
            message: 'Letter input not working correctly',
            details: {
                expected: initialInput + testLetter,
                actual: newInput,
                initialInput,
                testLetter
            }
        };
    }
    
    return { 
        success: true, 
        message: 'Letter input working correctly',
        details: { inputAfterLetter: newInput }
    };
});

// Test 4: Solve Word Issue (The main bug you reported)
testSuite.addTest('Solve Word Issue', async () => {
    if (!testSuite.isGameReady()) {
        return { success: false, message: 'Game not ready' };
    }
    
    const unsolvedWord = testSuite.findUnsolvedWord();
    if (!unsolvedWord) {
        return { success: false, message: 'No unsolved words available for testing' };
    }
    
    // Click on the word to activate it
    const wordElements = document.querySelectorAll('[data-word-index]');
    const targetElement = Array.from(wordElements).find(el => 
        el.textContent.includes('*')
    );
    
    if (!targetElement) {
        return { success: false, message: 'Could not find unsolved word element' };
    }
    
    targetElement.click();
    await testSuite.delay(100);
    
    if (!window.game.activeWord || window.game.activeWord.original !== unsolvedWord.original) {
        return { success: false, message: 'Word did not become active properly' };
    }
    
    // Clear any existing input
    window.game.userInput = '';
    
    // Type the correct word letter by letter
    const correctWord = unsolvedWord.original.toLowerCase();
    const inputHistory = [];
    
    for (let i = 0; i < correctWord.length; i++) {
        const letter = correctWord[i];
        const beforeInput = window.game.userInput;
        
        try {
            await testSuite.clickLetter(letter);
        } catch (error) {
            return { 
                success: false, 
                message: `Could not click letter '${letter}': ${error.message}`,
                details: { inputHistory, currentIndex: i }
            };
        }
        
        const afterInput = window.game.userInput;
        inputHistory.push({
            index: i,
            letter,
            beforeInput,
            afterInput,
            expectedLength: i + 1,
            actualLength: afterInput.length
        });
        
        // Check if input was unexpectedly cleared or modified
        if (afterInput.length < i + 1) {
            return { 
                success: false, 
                message: `Input was cleared/shortened unexpectedly at letter ${i + 1} ('${letter}')`,
                details: { 
                    inputHistory,
                    expectedInput: correctWord.substring(0, i + 1),
                    actualInput: afterInput,
                    wordBeingTested: correctWord
                }
            };
        }
        
        if (!afterInput.endsWith(letter)) {
            return { 
                success: false, 
                message: `Letter '${letter}' was not added correctly`,
                details: { 
                    inputHistory,
                    expectedInput: correctWord.substring(0, i + 1),
                    actualInput: afterInput
                }
            };
        }
    }
    
    // Check final state
    const finalInput = window.game.userInput;
    const isWordSolved = window.game.solvedWords.has(unsolvedWord.original);
    
    if (finalInput !== correctWord) {
        return { 
            success: false, 
            message: 'Final input does not match expected word',
            details: { 
                expected: correctWord,
                actual: finalInput,
                inputHistory,
                wordSolved: isWordSolved
            }
        };
    }
    
    return { 
        success: true, 
        message: 'Solve word functionality working correctly',
        details: { 
            testedWord: correctWord,
            finalInput,
            wordSolved: isWordSolved,
            inputHistory
        }
    };
});

// Test 5: Reveal Letter Functionality
testSuite.addTest('Reveal Letter', async () => {
    if (!testSuite.isGameReady()) {
        return { success: false, message: 'Game not ready' };
    }
    
    const revealBtn = document.getElementById('revealLetterBtn');
    if (!revealBtn) {
        return { success: false, message: 'Reveal letter button not found' };
    }
    
    const initialRevealed = window.game.revealedLetters ? window.game.revealedLetters.size : 0;
    
    // Click reveal button
    revealBtn.click();
    await testSuite.delay(500);
    
    const modal = document.getElementById('letterSelectionModal');
    if (!modal || modal.style.display === 'none') {
        return { success: false, message: 'Reveal letter modal did not open' };
    }
    
    // Close modal
    const closeBtn = document.getElementById('closeLetterSelection');
    if (closeBtn) {
        closeBtn.click();
    }
    
    return { 
        success: true, 
        message: 'Reveal letter modal functionality working',
        details: { initialRevealedCount: initialRevealed }
    };
});

// Test 6: Definition Functionality
testSuite.addTest('Definition', async () => {
    if (!testSuite.isGameReady() || !window.game.activeWord) {
        return { success: false, message: 'No active word for definition test' };
    }
    
    const definitionBtn = document.getElementById('definitionBtn');
    if (!definitionBtn) {
        return { success: false, message: 'Definition button not found' };
    }
    
    // Click definition button
    definitionBtn.click();
    await testSuite.delay(1000);
    
    const modal = document.getElementById('definitionModal');
    if (!modal || modal.style.display === 'none') {
        return { success: false, message: 'Definition modal did not open' };
    }
    
    // Close modal
    const closeBtn = document.getElementById('closeDefinition');
    if (closeBtn) {
        closeBtn.click();
    }
    
    return { 
        success: true, 
        message: 'Definition functionality working',
        details: { testedWord: window.game.activeWord.original }
    };
});

// Export for global use
window.gameTestSuite = testSuite;
window.runGameTests = () => testSuite.runAllTests();

console.log(`
🧪 Game Test Suite Loaded!

Available commands:
- runGameTests()  : Run all automated tests
- gameTestSuite   : Access the test suite object

The test suite will help identify the "solve word deletes itself" issue and other bugs.
`);

// Auto-run tests if game is already loaded
if (window.game && window.game.currentQuote) {
    console.log('Game detected - you can run tests immediately with: runGameTests()');
}