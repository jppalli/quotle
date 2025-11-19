// Script to restore quotes with duplicate wordIndices
const fs = require('fs');

// Read the current quotes_calendar.js file
const quotesData = fs.readFileSync('./quotes_calendar.js', 'utf8');

// Write a temporary file that exports the data
fs.writeFileSync('./temp-quotes.js', `
${quotesData}
module.exports = quotesCalendar;
`);

// Now require the temporary file
const quotes = require('./temp-quotes.js');

console.log(`Processing ${quotes.length} quotes...\n`);

// Restore the duplicates for specific quotes
// Based on our earlier findings

// Quote 1: Date: 2025-01-17, Author: Norman Vincent Peale
// Text: "Change your thoughts and you change your world."
// Should have wordIndices: [0, 2, 0, 7] instead of [0, 2, 7]
const quote1Index = quotes.findIndex(q => q.date === "2025-01-17");
if (quote1Index !== -1) {
    quotes[quote1Index].wordIndices = [0, 2, 0, 7];
    console.log(`Restored duplicate for quote at index ${quote1Index} (Date: ${quotes[quote1Index].date})`);
}

// Quote 2: Date: 2025-02-19, Author: Norman Vincent Peale
// Text: "Change your thoughts and you change your world."
// Should have wordIndices: [0, 2, 0, 7] instead of [0, 2, 7]
const quote2Index = quotes.findIndex(q => q.date === "2025-02-19");
if (quote2Index !== -1) {
    quotes[quote2Index].wordIndices = [0, 2, 0, 7];
    console.log(`Restored duplicate for quote at index ${quote2Index} (Date: ${quotes[quote2Index].date})`);
}

// Quote 3: Date: 2025-03-26, Author: Norman Vincent Peale
// Text: "Change your thoughts and you change your world."
// Should have wordIndices: [0, 2, 0, 7] instead of [0, 2, 7]
const quote3Index = quotes.findIndex(q => q.date === "2025-03-26");
if (quote3Index !== -1) {
    quotes[quote3Index].wordIndices = [0, 2, 0, 7];
    console.log(`Restored duplicate for quote at index ${quote3Index} (Date: ${quotes[quote3Index].date})`);
}

// Quote 4: Date: 2025-05-18, Author: Norman Vincent Peale
// Text: "Change your thoughts and you change your world."
// Should have wordIndices: [0, 2, 0, 7] instead of [0, 2, 7]
const quote4Index = quotes.findIndex(q => q.date === "2025-05-18");
if (quote4Index !== -1) {
    quotes[quote4Index].wordIndices = [0, 2, 0, 7];
    console.log(`Restored duplicate for quote at index ${quote4Index} (Date: ${quotes[quote4Index].date})`);
}

// Quote 5: Date: 2025-06-04, Author: Theodore Roosevelt
// Text: "Do what you can, with what you have, where you are."
// Should have wordIndices: [1, 1, 8, 10] instead of [1, 8, 10]
const quote5Index = quotes.findIndex(q => q.date === "2025-06-04");
if (quote5Index !== -1) {
    quotes[quote5Index].wordIndices = [1, 1, 8, 10];
    console.log(`Restored duplicate for quote at index ${quote5Index} (Date: ${quotes[quote5Index].date})`);
}

// Quote 6: Date: 2025-06-07, Author: Theodore Roosevelt
// Text: "To handle yourself, use your head; to handle others, use your heart."
// Should have wordIndices: [1, 2, 1, 11] instead of [1, 2, 11]
const quote6Index = quotes.findIndex(q => q.date === "2025-06-07");
if (quote6Index !== -1) {
    quotes[quote6Index].wordIndices = [1, 2, 1, 11];
    console.log(`Restored duplicate for quote at index ${quote6Index} (Date: ${quotes[quote6Index].date})`);
}

// Quote 7: Date: 2025-06-18, Author: Norman Vincent Peale
// Text: "Change your thoughts and you change your world."
// Should have wordIndices: [0, 2, 0, 7] instead of [0, 2, 7]
const quote7Index = quotes.findIndex(q => q.date === "2025-06-18");
if (quote7Index !== -1) {
    quotes[quote7Index].wordIndices = [0, 2, 0, 7];
    console.log(`Restored duplicate for quote at index ${quote7Index} (Date: ${quotes[quote7Index].date})`);
}

// Quote 8: Date: 2025-07-07, Author: Henry Ford
// Text: "Whether you think you can or you think you can't, you're right."
// Should have wordIndices: [0, 2, 2, 10] instead of [0, 2, 10]
const quote8Index = quotes.findIndex(q => q.date === "2025-07-07");
if (quote8Index !== -1) {
    quotes[quote8Index].wordIndices = [0, 2, 2, 10];
    console.log(`Restored duplicate for quote at index ${quote8Index} (Date: ${quotes[quote8Index].date})`);
}

// Quote 9: Date: 2025-07-27, Author: Ralph Waldo Emerson
// Text: "Do not go where the path may lead, go where there is no path and leave a trail."
// Should have wordIndices: [3, 5, 3, 17] instead of [3, 5, 17]
const quote9Index = quotes.findIndex(q => q.date === "2025-07-27");
if (quote9Index !== -1) {
    quotes[quote9Index].wordIndices = [3, 5, 3, 17];
    console.log(`Restored duplicate for quote at index ${quote9Index} (Date: ${quotes[quote9Index].date})`);
}

// Quote 10: Date: 2025-08-14, Author: Mark Zuckerberg
// Text: "The greatest risk is not taking any risk at all."
// Should have wordIndices: [1, 2, 5, 2] instead of [1, 2, 5]
const quote10Index = quotes.findIndex(q => q.date === "2025-08-14");
if (quote10Index !== -1) {
    quotes[quote10Index].wordIndices = [1, 2, 5, 2];
    console.log(`Restored duplicate for quote at index ${quote10Index} (Date: ${quotes[quote10Index].date})`);
}

// Quote 11: Date: 2025-08-19, Author: Winston Churchill
// Text: "Success is walking from failure to failure with no loss of enthusiasm."
// Should have wordIndices: [0, 4, 4, 11] instead of [0, 4, 11]
const quote11Index = quotes.findIndex(q => q.date === "2025-08-19");
if (quote11Index !== -1) {
    quotes[quote11Index].wordIndices = [0, 4, 4, 11];
    console.log(`Restored duplicate for quote at index ${quote11Index} (Date: ${quotes[quote11Index].date})`);
}

console.log(`\nRestored duplicates for 11 quotes.\n`);

// Now we need to write the restored data back to quotes_calendar.js
// We'll reconstruct the file content
let restoredFileContent = `// Each quote includes the original text, author, word indices for scrambling, and date\n\nconst quotesCalendar = [\n`;

quotes.forEach((quote, index) => {
    restoredFileContent += `    {\n`;
    restoredFileContent += `        "text": "${quote.text}",\n`;
    restoredFileContent += `        "author": "${quote.author}",\n`;
    restoredFileContent += `        "wordIndices": [${quote.wordIndices.join(', ')}],\n`;
    restoredFileContent += `        "date": "${quote.date}"\n`;
    restoredFileContent += `    }`;
    
    // Add comma if not the last item
    if (index < quotes.length - 1) {
        restoredFileContent += `,`;
    }
    
    restoredFileContent += `\n`;
});

restoredFileContent += `];\n`;

// Write the restored content back to the file
fs.writeFileSync('./quotes_calendar.js', restoredFileContent);

// Clean up temporary file
fs.unlinkSync('./temp-quotes.js');

console.log(`Successfully restored quotes_calendar.js with duplicate wordIndices.`);