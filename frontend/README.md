# Cultural Heritage Platform

A modern web application for preserving and sharing cultural heritage.

Projektet handlar om att bevara och dela kulturarv. På webbplatsen kan användare utforska en samling av kulturella föremål och läsa detaljerad information om varje objekt. Användarna kan också bidra med eget material och kommentera på föremålen för att diskutera dem. Målet är att digitalt dokumentera, visa upp och bevara kulturarv så att det blir tillgängligt för en större publik.

## Scale

The platform is designed to handle large datasets efficiently:

- Database contains over 2 million cultural items
- Components are optimized for pagination and virtual scrolling
- Search is implemented with efficient indexing to handle large result sets

## Key Features

- Browse cultural heritage items by region, time period, or tags
- Detailed view for individual cultural items with comprehensive metadata
- User accounts with favorites/bookmarking functionality
- Advanced search capabilities across the entire collection
- Mobile-responsive design for access on all devices

## API Configuration

The frontend automatically tries multiple API endpoint formats to find the working backend URL.
If you need to manually configure the API endpoint, you can set the `VITE_API_BASE_URL` environment variable.

Examples:
- Local development: `VITE_API_BASE_URL=http://localhost:8000`
- Production: `VITE_API_BASE_URL=https://api.cultural-heritage.example.com`

If no base URL is provided, the application will make relative requests and try several common API path patterns.