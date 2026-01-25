import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/workshops')}
              className="flex items-center space-x-3"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="font-bold text-white text-lg">WannaV Dashboard</span>
            </button>
            {/* Navigation buttons removed for cleaner look */}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white font-medium">
              {user.email}
            </span>
            {isAdmin && (
              <span className="text-xs text-white font-bold px-3 py-1.5 bg-white bg-opacity-20 rounded-full">
                管理者
              </span>
            )}
            <button
              onClick={() => navigate('/admin/workshops')}
              className="text-sm font-medium text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all"
            >
              ⚙️ 管理
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all"
            >
              🚪 ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
