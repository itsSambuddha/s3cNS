
import { render, screen } from '@testing-library/react';
import { SecretariatMembersShowcase } from '@/components/secretariat/SecretariatMembersShowcase';
import { secretariatMembers } from '@/lib/secretariat/data';

jest.mock('@/lib/secretariat/data', () => ({
  secretariatMembers: [
    {
      office: 'President',
      members: [
        { name: 'John Doe', post: 'President', image: '/path/to/image1.jpg' },
      ],
    },
    {
      office: 'Vice President',
      members: [
        { name: 'Jane Smith', post: 'Vice President', image: '/path/to/image2.jpg' },
      ],
    },
  ],
}));

describe('SecretariatMembersShowcase', () => {
  it('renders the component with the correct data', () => {
    render(<SecretariatMembersShowcase />);

    // Check for the main title
    expect(screen.getByText('Meet the Secretariat')).toBeInTheDocument();

    // Check for the office titles
    expect(screen.getByText('President')).toBeInTheDocument();
    expect(screen.getByText('Vice President')).toBeInTheDocument();

    // Check for the members' names
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    // Check for the members' posts
    expect(screen.getByText('President')).toBeInTheDocument();
    expect(screen.getByText('Vice President')).toBeInTheDocument();

    // Check for the images
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/path/to/image1.jpg');
    expect(images[1]).toHaveAttribute('src', '/path/to/image2.jpg');
  });
});
