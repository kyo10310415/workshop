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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white border-2 border-gray-800 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <span className="font-bold text-gray-800 text-lg">ワークショップ管理</span>
            </div>
            {/* Empty space for balance */}
            <div></div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user.email}
            </span>
            {isAdmin && (
              <span className="text-xs text-purple-600 font-semibold px-3 py-1 bg-purple-50 rounded">
                ⭐ 管理者
              </span>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/workshops')}
                className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-all"
              >
                ⚙️ 管理
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-all"
            >
              🚪 ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
