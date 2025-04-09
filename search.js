// search.js - Search functionality for library catalog

// Default search category
let currentSearchCategory = "Catalog";

// Function to search the database
function searchDatabase(category, query) {
  if (!query || query.trim() === "") {
    return [];
  }
  
  // Convert query to lowercase for case-insensitive search
  const searchTerm = query.toLowerCase();
  
  // Get data source based on category
  const dataSource = database[category] || [];
  
  // Search in book titles
  return dataSource.filter(book => 
    book.title.toLowerCase().includes(searchTerm)
  );
}

// Function to display search results
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
    return;
  }
  
  // Create list for results
  const resultsList = document.createElement('ul');
  resultsList.className = 'results-list';
  
  results.forEach(book => {
    const listItem = document.createElement('li');
    listItem.className = 'result-item';
    
    // Create book info HTML
    const bookInfo = `
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <div class="book-details">
          <p class="book-author">By: ${book.author}</p>
          <p class="book-description">${book.description}</p>
          <p class="book-location">${book.location}</p>
          <span class="book-category">${book.category}</span>
        </div>
      </div>
    `;
    
    listItem.innerHTML = bookInfo;
    resultsList.appendChild(listItem);
  });
  
  resultsContainer.appendChild(resultsList);
  resultsContainer.style.display = 'block';
}

// Function to display autocomplete suggestions
function displaySuggestions(query) {
  const suggestionsContainer = document.getElementById('autocomplete-suggestions');
  
  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';
  
  // Hide suggestions if query is empty
  if (!query || query.trim() === "") {
    suggestionsContainer.style.display = 'none';
    return;
  }
  
  // Get matching titles
  const allTitles = getAllTitles();
  const matchingTitles = allTitles.filter(title => 
    title.toLowerCase().includes(query.toLowerCase())
  );
  
  // Display up to 5 suggestions
  const suggestionsToShow = matchingTitles.slice(0, 5);
  
  if (suggestionsToShow.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }
  
  // Create suggestions list
  const suggestionsList = document.createElement('ul');
  suggestionsList.className = 'suggestions-list';
  
  suggestionsToShow.forEach(title => {
    const listItem = document.createElement('li');
    listItem.className = 'suggestion-item';
    listItem.textContent = title;
    
    // Add click event to use suggestion
    listItem.addEventListener('click', () => {
      document.getElementById('search-input').value = title;
      suggestionsContainer.style.display = 'none';
      
      // Perform search with this title
      const results = searchDatabase(currentSearchCategory, title);
      displayResults(results);
    });
    
    suggestionsList.appendChild(listItem);
  });
  
  suggestionsContainer.appendChild(suggestionsList);
  suggestionsContainer.style.display = 'block';
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get search elements
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
  const dropdownButton = document.getElementById('searchDropdown');
  
  // Change search category when dropdown item is clicked
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      currentSearchCategory = e.target.textContent;
      dropdownButton.textContent = currentSearchCategory + ' ▼';
      
      // Clear search
      searchInput.value = '';
      document.getElementById('autocomplete-suggestions').style.display = 'none';
      document.getElementById('search-results').style.display = 'none';
    });
  });
  
  // Show suggestions as user types
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    displaySuggestions(query);
  });
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-container') && 
        !e.target.closest('#autocomplete-suggestions')) {
      document.getElementById('autocomplete-suggestions').style.display = 'none';
    }
  });
  
  // Search when button is clicked
  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    document.getElementById('autocomplete-suggestions').style.display = 'none';
    
    const results = searchDatabase(currentSearchCategory, query);
    displayResults(results);
  });
  
  // Search when Enter key is pressed
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      document.getElementById('autocomplete-suggestions').style.display = 'none';
      
      const results = searchDatabase(currentSearchCategory, query);
      displayResults(results);
    }
  });
});