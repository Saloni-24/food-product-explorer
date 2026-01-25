# Food Product Explorer

A modern web application that allows users to search, filter, and explore food products using the OpenFoodFacts API. Built with Next.js, React, TypeScript, and TailwindCSS.

## 🚀 Features

### Core Features
- **Product Browsing**: Display a list of food products fetched from OpenFoodFacts API
- **Search by Name**: Search for products by product name with real-time filtering
- **Barcode Search**: Search for specific products using their barcode
- **Category Filtering**: Filter products by category with a dropdown selector
- **Sorting Options**: Sort products by:
  - Product name (A-Z, Z-A)
  - Nutrition grade (Best to Worst, Worst to Best)
- **Product Details**: Comprehensive product detail page showing:
  - Product image
  - Full ingredients list
  - Nutritional values (energy, fat, carbs, proteins, fiber, sugars, salt)
  - Labels (vegan, gluten-free, etc.)
  - Categories and brands
- **Pagination**: Load more functionality for smooth product browsing
- **Shopping Cart**: Add products to cart with quantity management
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop

## 🛠️ Technology Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: React Context API
- **API**: OpenFoodFacts REST API
- **Image Optimization**: Next.js Image component

## 📋 Project Structure

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

## 🎯 Methodology

### 1. Project Setup
- Initialized Next.js project with TypeScript and TailwindCSS
- Configured Next.js Image component for external images from OpenFoodFacts
- Set up project structure with clear separation of concerns

### 2. API Integration
- Created a centralized API service layer (`lib/api.ts`) for all OpenFoodFacts API calls
- Implemented functions for:
  - Searching products by name
  - Fetching products by barcode
  - Filtering products by category
  - Fetching popular products
  - Getting available categories
- Added error handling and fallback values for all API calls
- Implemented caching with Next.js revalidation for better performance

### 3. State Management
- Used React Context API for global state management (cart functionality)
- Implemented localStorage persistence for cart data
- Created custom hooks (`useCart`) for easy access to cart functionality

### 4. Component Architecture
- Built reusable, modular components following React best practices
- Separated concerns: UI components, business logic, and data fetching
- Used TypeScript for type safety throughout the application

### 5. User Interface
- Designed a clean, modern UI with TailwindCSS
- Implemented responsive design using Tailwind's responsive utilities
- Added loading states and error handling for better UX
- Created intuitive navigation and user flows

### 6. Features Implementation

#### Homepage
- Displays popular products by default
- Two search bars: one for name search, one for barcode search
- Category filter dropdown populated from API
- Sort dropdown for various sorting options
- Product grid with responsive layout
- Load more button for pagination

#### Product Detail Page
- Dynamic route based on product barcode
- Comprehensive product information display
- Add to cart functionality
- Responsive image display with fallback

#### Shopping Cart
- View all cart items
- Update quantities
- Remove items
- Clear entire cart
- Persistent storage using localStorage

## 🚀 Getting Started

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

## 📡 API Endpoints Used

The application uses the following OpenFoodFacts API endpoints:

- **Search by name**: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true`
- **Get by barcode**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
- **Filter by category**: `https://world.openfoodfacts.org/cgi/search.pl?tagtype_0=categories&tag_0={category}&json=true`
- **Popular products**: `https://world.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&json=true`
- **Categories list**: `https://world.openfoodfacts.org/categories.json`

## 🎨 Design Decisions

1. **Next.js App Router**: Used for better performance, server components, and modern React features
2. **TypeScript**: Ensures type safety and better developer experience
3. **TailwindCSS**: Rapid UI development with utility-first approach
4. **Context API**: Simple state management solution without external dependencies
5. **Component-based Architecture**: Reusable, maintainable code structure
6. **Responsive Design**: Mobile-first approach for better user experience across devices

## ⚡ Performance Optimizations

- Next.js Image component for optimized image loading
- API response caching with revalidation
- Lazy loading and pagination to reduce initial load time
- Efficient state management to minimize re-renders

## 🐛 Error Handling

- Graceful error handling for API failures
- Fallback UI for missing product images
- User-friendly error messages
- Loading states for better UX during API calls

## 📱 Responsive Design

The application is fully responsive and tested on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🔮 Future Enhancements

Potential improvements for future versions:
- User authentication and saved favorites
- Product comparison feature
- Advanced filtering (nutritional values, allergens)
- Product reviews and ratings
- Export product data to PDF/CSV
- Dark mode support
- Internationalization (i18n)

## ⏱️ Time Taken

**Total Development Time: Approximately 6-7 hours**

Breakdown:
- Project setup and configuration: 30 minutes
- API integration and service layer: 1.5 hours
- Component development: 2 hours
- State management and cart functionality: 1 hour
- Product detail page: 1 hour
- Styling and responsive design: 1 hour
- Testing and bug fixes: 1 hour
- Documentation: 30 minutes

## 📝 Notes

- The OpenFoodFacts API is maintained by a French non-profit organization. If the server is not responding, please wait before trying again.
- Some products may have incomplete data (missing images, ingredients, etc.). The application handles these cases gracefully.
- Product prices are not available through the OpenFoodFacts API, so the cart functionality focuses on product management rather than pricing.

## 📄 License

This project is created for evaluation purposes only.

## 👨‍💻 Author

Created as part of an assignment to demonstrate skills in React, Next.js, TypeScript, and API integration.

---

**Note**: This assignment is designed purely for evaluation purposes. Any part of this submission will not be used in actual products.
