const fs = require('fs');
const path = require('path');

const API_URL = 'https://zenquotes.io/api/random';

async function fetchQuote() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch quote');
  const data = await response.json();
  // ZenQuotes returns array, convert to our format
  return {
    content: data[0].q,
    author: data[0].a
  };
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getQuoteCount() {
  const quotesDir = path.join(__dirname, '..', 'quotes');
  return fs.readdirSync(quotesDir).filter(f => f.endsWith('.json')).length;
}

function updateReadme(quote, today, count) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const content = `# Daily Quote

## Today's Quote

> "${quote.content}"
>
> — ${quote.author}

---

Updated: ${today} | Total quotes collected: ${count}
`;
  fs.writeFileSync(readmePath, content);
}

async function main() {
  try {
    const quote = await fetchQuote();
    const today = getToday();

    // Save quote to JSON
    const quotePath = path.join(__dirname, '..', 'quotes', `${today}.json`);
    fs.writeFileSync(quotePath, JSON.stringify(quote, null, 2));

    // Update README
    const count = getQuoteCount();
    updateReadme(quote, today, count);

    console.log(`Quote saved: "${quote.content}" — ${quote.author}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
