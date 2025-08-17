// Default quotes 
let defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Wisdom" }
];

// Load quotes from storage
let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Populate Categories
function populateCategories() {
  // Clear old options
  categoryFilter.innerHTML = "";

  // Add "All" option
  let allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  // Extract unique categories
  let categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  let savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }
}

//Show Random Quote
function showRandomQuote() {
  let selectedCategory = categoryFilter.value;

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes in this category.</p>`;
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
}

// Filter Quotes
function filterQuotes() {
  let selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory); // Save preference
  showRandomQuote();
}

// Add Quote 
function addQuote(text, category) {
  if (!text || !category) return;

  quotes.push({ text, category });

  // Save to storage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update dropdown 
  populateCategories();
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

// Initialize
populateCategories();
showRandomQuote();
