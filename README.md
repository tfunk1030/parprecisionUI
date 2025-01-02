# ParPrecision UI

A modern golf shot calculator and visualization tool built with Next.js and TypeScript.

## Features

- Shot distance calculation with temperature adjustments
- Club selection and parameter configuration
- Real-time trajectory visualization
- Performance monitoring and analytics
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parprecision.git
cd parprecision/parprecisionUI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Running Tests

Run the test suite:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

## Project Structure

See `IMPLEMENTATION.md` for detailed information about the project structure and implementation details.

## Development

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- TailwindCSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
