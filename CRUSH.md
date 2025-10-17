# Showcase Repository - Development Guidelines

## Build/Lint/Test Commands

### Common Commands (adjust based on actual tech stack)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run typecheck` - Run type checking
- `npm test` - Run all tests
- `npm test -- --testNamePattern="specific-test"` - Run single test

## Code Style Guidelines

### General Principles
- **ALWAYS follow Clean Code principles**: Code should be readable, simple, and explicit
- **STRICTLY adhere to SOLID principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **NEVER violate DRY principle**: Avoid code duplication, extract common logic into reusable functions/modules
- **Best practices are inviolable**: No shortcuts, no exceptions to established patterns
- Use modern ES6+ syntax with proper type annotations
- Follow existing file naming conventions (kebab-case for files, PascalCase for components)
- Keep components small and focused on single responsibility
- Use meaningful variable and function names

### Import Organization
- Third-party imports first
- Internal imports second
- Relative imports last
- Use absolute imports where possible with path aliases

### Error Handling
- Always handle async operations with try/catch or proper error boundaries
- Use consistent error response formats
- Log errors appropriately without exposing sensitive data

### Code Structure
- Group related functionality in modules/features
- Use index files for clean imports
- Maintain consistent folder structure (components, hooks, utils, types, etc.)

### Performance
- Optimize images and assets
- Use React.memo/useMemo/useCallback where appropriate
- Implement lazy loading for large components

## Testing
- Write unit tests for utility functions
- Test components with user interactions in mind
- Maintain good test coverage (>80%)
- Use descriptive test names that explain the behavior