import { render, screen } from '@testing-library/react';
import Navbar from '../components/layout/Navbar';

// Mock the Next.js router and pathname
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock Language Context
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'English',
    setLanguage: jest.fn(),
    t: (key: string) => {
      const keys: any = {
        home: 'Home',
        services: 'Services',
        complaints: 'My Complaints',
        resources: 'Resources',
        skipToMain: 'Skip to Main Content',
        highContrast: 'High Contrast',
      };
      return keys[key] || key;
    },
    isGlobalChatOpen: false,
    setIsGlobalChatOpen: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('renders the Smart Bharat logo', () => {
    render(<Navbar />);
    expect(screen.getByText('Smart Bharat')).toBeInTheDocument();
  });

  it('renders the skip to main content link for accessibility', () => {
    render(<Navbar />);
    const skipLink = screen.getByText('Skip to Main Content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders primary navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('My Complaints')).toBeInTheDocument();
  });
});
