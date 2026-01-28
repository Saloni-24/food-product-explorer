
# Food Product Explorer

[🌐 Live Demo](https://food-product-explorer-ten.vercel.app)  

Food Product Explorer is a web application that allows users to search, filter, and explore food products using the OpenFoodFacts API.



###  Features
- Browse food products fetched from OpenFoodFacts
- Search products by name with real-time results
- Search products using barcode
- Filter products by category
- Sort products by:
  - Name (A–Z, Z–A)
  - Nutrition grade (Best → Worst, Worst → Best)
- View detailed product information including:
  - Product image
  - Ingredients list
  - Nutritional values
  - Labels, brands, and categories
- Load more pagination for better performance
- Shopping cart with quantity management
- Fully responsive design (mobile, tablet, desktop)

##  Technology Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: React Context API
- **API**: OpenFoodFacts REST API
- **Image Optimization**: Next.js Image component

##  Project Structure

```
assignment/
├── app/
│   ├── cart/              # Shopping cart page
│   ├── product/[code]/    # Product detail page (dynamic route)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/
│   ├── CategoryFilter.tsx # Category filter dropdown
│   ├── Header.tsx         # Navigation header
│   ├── LoadMoreButton.tsx # Pagination button
│   ├── ProductCard.tsx    # Product card component
│   ├── ProductGrid.tsx    # Product grid layout
│   ├── SearchBar.tsx      # Search input component
│   └── SortDropdown.tsx   # Sort options dropdown
├── context/
│   └── CartContext.tsx    # Shopping cart state management
├── lib/
│   └── api.ts             # OpenFoodFacts API service functions
├── types/
│   └── product.ts         # TypeScript type definitions
└── README.md
```
## How the App Works

- All API calls are handled in a single service file (`lib/api.ts`)
- Next.js API routes act as a server-side proxy to avoid CORS issues
- Cart state is managed using React Context and persisted in `localStorage`
- Components are modular, reusable, and follow React best practices
- Tailwind CSS handles layout, styling, and responsiveness
- Basic error handling and fallback UI are implemented for missing data
- Search, category filter, and sorting work independently without clearing each other
- Product detail page shows comprehensive information, including ingredients, nutrition, labels, and brands
- Pagination and “Load More” buttons allow smooth browsing


##  Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assignment
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

##  API Endpoints Used

The application uses the following OpenFoodFacts API endpoints:

- **Search by name**: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true`
- **Get by barcode**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
- **Filter by category**: `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_0={category}&json=true`
- **Popular products**: `https://world.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&json=true`
- **Categories list**: `https://world.openfoodfacts.org/categories.json`



##  Performance Optimizations

- Next.js Image component for optimized image loading
- API response caching with revalidation
- Lazy loading and pagination to reduce initial load time
- Efficient state management to minimize re-renders


##  Responsive Design

The application is fully responsive and tested on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)


## Time Taken

**Total Development Time: Approximately 3-4 days**




---

