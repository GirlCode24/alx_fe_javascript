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

  const newQuote = { 
    text: newQuoteText, 
    category: newQuoteCategory, 
    id: Date.now() // unique id
  };

  // Push into quotes array
  quotes.push(newQuote);

  // Save updated quotes to storage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Sync with server
  sendQuoteToServer(newQuote);

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
// Export / Import event listeners
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);


// Export quotes to JSON file
function exportQuotes() {
  const data = JSON.stringify(quotes, null, 2); // Pretty-print JSON
  const blob = new Blob([data], { type: "application/json" }); // <== Blob + application/json
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid file format.");
        return;
      }

      // Merge and save
      quotes.push(...importedQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };

  reader.readAsText(file);
}

// --- Simulated Server Sync --- //

async function fetchQuotesFromServer() {
  try {
    // Simulate fetching data from a server
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();

    // Transform the server response into quote-like objects
    const serverQuotes = serverData.map(item => ({
      text: item.title,
      author: `ServerUser ${item.userId}`,
      category: "Server",
      id: item.id
    }));

    console.log("Fetched from server:", serverQuotes);

    // Compare with local quotes
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Conflict resolution: server takes precedence
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

    // Save back into local storage
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    quotes = mergedQuotes; // update global variable

    // Re-render categories & quote
    populateCategories();
    showRandomQuote();

    notifyUser("Quotes synced with server!");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Function to send a new quote to the server (simulation)
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(quote) 
    });

    const data = await response.json();
    console.log("Quote successfully sent to server:", data);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}

// Merge + conflict resolution logic
function mergeQuotes(localQuotes, serverQuotes) {
  const localMap = new Map(localQuotes.map(q => [q.id, q]));
  serverQuotes.forEach(serverQuote => {
    // If conflict, overwrite with server version
    localMap.set(serverQuote.id, serverQuote);
  });
  return Array.from(localMap.values());
}

// notification system
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = "notification";
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

// auto-sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);


//Initialize on load
populateCategories();
createAddQuoteForm(); 
showRandomQuote();
