// Default quotes 
let defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Wisdom" }
];

// Load from localStorage 
let quotes = JSON.parse(localStorage.getItem("quotes")) || defaultQuotes;

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Populate categories 
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

// Show a random quote
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

// Filter quotes 
function filterQuotes() {
  let selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory); // persist filter
  showRandomQuote();
}

// Add new quote 
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Push into quotes array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Save updated quotes to storage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Refresh category 
  populateCategories();

  // Reset form
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added!");
}

// create Add Quote Form
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  // Quote input
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  // Category input
  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  // Add button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append all elements
  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addBtn);

  // Insert form into body
  document.body.appendChild(formDiv);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);

//Initialize on load
populateCategories();
createAddQuoteForm(); 
showRandomQuote();
