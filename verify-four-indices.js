// Script to verify all quotes have 4 unique wordIndices
const fs = require('fs');

// Read the quotes_calendar.js file
const quotesData = fs.readFileSync('./quotes_calendar.js', 'utf8');

// Write a temporary file that exports the data
fs.writeFileSync('./temp-quotes.js', `
${quotesData}
module.exports = quotesCalendar;
`);

// Now require the temporary file
const quotes = require('./temp-quotes.js');

console.log(`Checking ${quotes.length} quotes for 4 unique wordIndices...\n`);

let inconsistentQuotes = [];

// Check each quote
quotes.forEach((quote, index) => {
    const { wordIndices, date, text } = quote;
    
    // Check if there are exactly 4 indices
    if (wordIndices.length !== 4) {
        inconsistentQuotes.push({
            index,
            date,
            text,
            issue: `Has ${wordIndices.length} indices instead of 4`
        });
        return;
    }
    
    // Check for duplicate indices
    const uniqueIndices = [...new Set(wordIndices)];
    if (uniqueIndices.length !== wordIndices.length) {
        inconsistentQuotes.push({
            index,
            date,
            text,
            issue: `Has duplicate indices: [${wordIndices.join(', ')}]`
        });
        return;
    }
});

// Report findings
if (inconsistentQuotes.length > 0) {
    console.log(`Found ${inconsistentQuotes.length} quotes with issues:\n`);
    
    inconsistentQuotes.forEach((quote, i) => {
        console.log(`${i + 1}. Date: ${quote.date}`);
        console.log(`   Text: "${quote.text}"`);
        console.log(`   Issue: ${quote.issue}`);
        console.log();
    });
} else {
    console.log("All quotes have exactly 4 unique wordIndices!");
}

// Clean up temporary file
fs.unlinkSync('./temp-quotes.js');

console.log(`\nVerification complete.`);