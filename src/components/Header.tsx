
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBlockchain } from '../contexts/BlockchainContext';
import { User, LogOut, Database } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, signOut } = useBlockchain();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quantum Chain
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                About
              </Link>
              <Link to="/explorer" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Explorer
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/data-manager" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Data Manager
                  </Link>
                  <Link to="/submit" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Submit Data
                  </Link>
                  <Link to="/verify" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Verify Data
                  </Link>
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Admin
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
