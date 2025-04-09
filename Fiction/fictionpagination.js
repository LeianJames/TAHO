// Variables to track pagination state
let currentPage = 1;
let itemsPerPage = 10; // Default items per page

// DOM elements
const bookResultsContainer = document.getElementById('bookResults');
const paginationContainer = document.getElementById('paginationControls');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const totalResultsElement = document.getElementById('totalResults');

// Update total results count
totalResultsElement.textContent = books.length;

// Initialize with default settings
document.addEventListener('DOMContentLoaded', function() {
  // Set the default selected option for items per page
  itemsPerPageSelect.value = itemsPerPage;
  
  // Initial render
  renderBooks();
  renderPagination();
  
  // Add event listener for items per page change
  itemsPerPageSelect.addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1; // Reset to first page when changing items per page
    renderBooks();
    renderPagination();
  });
});

// Function to display books based on current page and items per page
function renderBooks() {
  // Clear current results
  bookResultsContainer.innerHTML = '';
  
  // Calculate start and end indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, books.length);
  
  // Generate HTML for each book in the current page
  for (let i = startIndex; i < endIndex; i++) {
    const book = books[i];
    const bookElement = document.createElement('div');
    bookElement.className = 'result-item';
    
    bookElement.innerHTML = `
      <div class="result-number">${i + 1}</div>
      <div class="result-details">
        <h3 class="result-title">${book.title}</h3>
        <p class="result-author">${book.author}</p>
        ${book.publication ? `<p class="result-publication">${book.publication}</p>` : ''}
        <p class="result-description">${book.description}</p>
        <div class="result-actions">
          <button class="check-availability">Check availability</button>
          <span class="library-location">${book.location}</span>
        </div>
      </div>
    `;
    
    bookResultsContainer.appendChild(bookElement);
  }
}

// Function to render pagination controls
function renderPagination() {
  // Clear current pagination
  paginationContainer.innerHTML = '';
  
  // Calculate total pages
  const totalPages = Math.ceil(books.length / itemsPerPage);
  
  // Add previous button if not on first page
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '← Previous';
    prevButton.addEventListener('click', function() {
      currentPage--;
      renderBooks();
      renderPagination();
    });
    paginationContainer.appendChild(prevButton);
  }
  
  // Add page number buttons
  // For simplicity, show max 5 page numbers
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerHTML = i;
    
    if (i === currentPage) {
      pageButton.className = 'active';
    }
    
    pageButton.addEventListener('click', function() {
      currentPage = i;
      renderBooks();
      renderPagination();
    });
    
    paginationContainer.appendChild(pageButton);
  }
  
  // Add next button if not on last page
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next →';
    nextButton.addEventListener('click', function() {
      currentPage++;
      renderBooks();
      renderPagination();
    });
    paginationContainer.appendChild(nextButton);
  }
  
  // Add a simple text showing current range of items
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, books.length);
  
  const rangeInfo = document.createElement('span');
  rangeInfo.className = 'page-info';
  rangeInfo.innerHTML = `Showing ${startItem}-${endItem} of ${books.length}`;
  paginationContainer.appendChild(rangeInfo);
}

// Function to navigate to a specific page
function goToPage(pageNumber) {
  currentPage = pageNumber;
  renderBooks();
  renderPagination();
}