// Initial Quotes Array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Wisdom" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.createElement("select");

// Set up category select
categorySelect.id = "categorySelect";
let defaultOption = document.createElement("option");
defaultOption.value = "all";
defaultOption.textContent = "All";
categorySelect.appendChild(defaultOption);
document.body.appendChild(categorySelect);

// Show Random Quote
function showRandomQuote() {
  let selectedCategory = categorySelect.value;

  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found in this category.</p>`;
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  let quote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
}

// Add New Quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add to array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Update category list dynamically 
  if (![...categorySelect.options].some(opt => opt.value === newQuoteCategory)) {
    let option = document.createElement("option");
    option.value = newQuoteCategory;
    option.textContent = newQuoteCategory;
    categorySelect.appendChild(option);
  }

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added!");
}

// Dynamically Create Add Quote Form
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  // Input for quote text
  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  // Input for category
  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  // Add button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append inputs and button to form
  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addBtn);

  document.body.appendChild(formDiv);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize categories in dropdown
function initCategories() {
  let categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Initialize
initCategories();
createAddQuoteForm(); 
