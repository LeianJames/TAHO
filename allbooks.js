// allbooks.js - Contains all book collections

// Academic books collection
const academicBooks = [
    {
      id: 1,
      title: "Regeneration",
      author: "Pat Barker,",
      description: "Book - 251 pages;",
      location: "Nova Schola Main Library",
      category: "Academics"
    },
    {
      id: 2,
      title: "ADVERBS: A Novel",
      author: "Daniel, Handler, author.",
      description: "Book - 272 pages;",
      location: "Nova Schola Main Library",
      category: "Academics"
    },
    {
      id: 3,
      title: "The Fountainhead",
      author: "AYN Rand.",
      description: "Book - 696 pages;",
      location: "Nova Schola Main Library",
      category: "Academics"
    }
  ];
  
  // Financial books collection
  const financialBooks = [
    {
      id: 1,
      title: "Smart Couples Finish Rich",
      author: "Bach David, author.",
      description: "Book - 305 pages;",
      location: "Nova Schola Main Library",
      category: "Financial"
    },
    {
      id: 2,
      title: "The Rules of Wealth",
      author: "Templar, Richard, author.",
      description: "Book - 230 pages;",
      location: "Nova Schola Main Library",
      category: "Financial"
    },
    {
      id: 3,
      title: "Don't Worry, Make Money",
      author: "Carlson, Richard, author.",
      description: "Book - 223 pages;",
      location: "Nova Schola Main Library",
      category: "Financial"
    }
  ];
  
  // Religious books collection
  const religiousBooks = [
    {
      id: 1,
      title: "Daily Gospel",
      author: "No author.",
      description: "No pages;",
      location: "Nova Schola Main Library", 
      category: "Religion"
    },
    {
      id: 2,
      title: "Handbook of Prayers",
      author: "Charles Belmonte, James Socias, author.",
      description: "Book - 376 pages;",
      location: "Nova Schola Main Library",
      category: "Religion"
    },
    {
      id: 3,
      title: "Moments",
      author: "Fr. Jenry M. Orbos.",
      description: "Book - 101 pages;",
      location: "Nova Schola Main Library",
      category: "Religion"
    }
  ];
  
  // Technology books collection
  const technologyBooks = [
    {
      id: 1,
      title: "The Age of AI",
      author: "Henry Kissinger, Eric Schmidt",
      description: "Book - 272 pages;",
      location: "Nova Schola Main Library",
      category: "Technology"
    },
    {
      id: 2,
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "Book - 464 pages;",
      location: "Nova Schola Main Library",
      category: "Technology"
    }
  ];
  
  // Fiction books collection
  const fictionBooks = [
    {
      id: 1,
      title: "James and the Giant Peach",
      author: "Roald Dahl, author.",
      description: "Book - 230 pages;",
      location: "Nova Schola Main Library",
      category: "Fiction"
    },
    {
      id: 2,
      title: "A Painted House",
      author: "Grisham John,",
      description: "Book - 456 pages;",
      location: "Nova Schola Main Library",
      category: "Fiction"
    }
  ];
  
  // Create a database object with all book collections
  const database = {
    "Catalog": [
      ...academicBooks, 
      ...financialBooks, 
      ...religiousBooks, 
      ...technologyBooks, 
      ...fictionBooks
    ],
    "Articles": [], // You can add article data here
    "Website": []  // You can add website data here
  };
  
  // Function to get all book titles for autocomplete
  function getAllTitles() {
    const titles = [];
    
    // Collect titles from all categories
    Object.keys(database).forEach(category => {
      database[category].forEach(book => {
        titles.push(book.title);
      });
    });
    
    // Return unique titles (no duplicates)
    return [...new Set(titles)];
  }