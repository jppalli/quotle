// Scramble Utilities for Daily Quote Puzzle
// Functions to dynamically scramble words and authors

/**
 * Scrambles a word by shuffling its letters
 * @param {string} word - The word to scramble
 * @returns {string} - The scrambled word
 */
function scrambleWord(word) {
    if (!word || word.length <= 1) return word;
    
    const letters = word.split('');
    
    // Fisher-Yates shuffle algorithm
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    const scrambled = letters.join('');
    
    // If the scrambled word is the same as original, try again
    if (scrambled === word && word.length > 2) {
        return scrambleWord(word);
    }
    
    return scrambled;
}

/**
 * Scrambles an author name by shuffling letters within each word
 * @param {string} author - The author name to scramble
 * @returns {string} - The scrambled author name
 */
function scrambleAuthor(author) {
    if (!author) return author;
    
    const words = author.split(' ');
    const scrambledWords = words.map(word => scrambleWord(word));
    
    return scrambledWords.join(' ');
}

/**
 * Processes a quote to add scrambled words and author based on wordIndices
 * @param {Object} quote - The quote object with text, author, wordIndices, and date
 * @returns {Object} - The quote object with scrambledWords and scrambledAuthor added
 */
function processQuoteForGame(quote) {
    if (!quote || !quote.text || !quote.author) {
        console.error('Invalid quote object:', quote);
        return quote;
    }
    
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
                    // Separate the word from its punctuation using a more robust regex
                    // This pattern captures the word part and any trailing punctuation separately
                    const wordMatch = originalWordWithPunctuation.match(/^([a-zA-Z]+(?:'[a-zA-Z]+)*)([^a-zA-Z]*)$/);
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
                        // If the regex doesn't match, it might be a word with no punctuation or special characters
                        // In this case, we'll treat the entire string as the word part
                        const cleanWord = originalWordWithPunctuation.replace(/[^a-zA-Z']/g, '');
                        const punctuation = originalWordWithPunctuation.replace(/[a-zA-Z']/g, '');
                        
                        if (cleanWord) {
                            const scrambledWordOnly = scrambleWord(cleanWord);
                            scrambledWords.push({
                                original: originalWordWithPunctuation,
                                originalWordOnly: cleanWord,
                                scrambled: scrambledWordOnly,
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

/**
 * Processes the entire quotes calendar to add scrambled data
 * @param {Array} quotesCalendar - The array of quote objects
 * @returns {Array} - The processed quotes with scrambled data
 */
function processQuotesCalendar(quotesCalendar) {
    if (!Array.isArray(quotesCalendar)) {
        console.error('Invalid quotes calendar:', quotesCalendar);
        return quotesCalendar;
    }
    
    return quotesCalendar.map(quote => processQuoteForGame(quote));
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrambleWord,
        scrambleAuthor,
        processQuoteForGame,
        processQuotesCalendar
    };
} 