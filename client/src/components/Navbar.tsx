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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/workshops')}
              className="flex items-center space-x-2"
            >
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="font-semibold text-gray-800 text-sm">ワークショップ管理</span>
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => navigate('/workshops')}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              >
                ワークショップ
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate('/admin/workshops')}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    管理
                  </button>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    ユーザー管理
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">
              {user.name}
            </span>
            {isAdmin && (
              <span className="text-xs text-indigo-600 font-semibold px-2 py-1 bg-indigo-50 rounded">
                管理者
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-gray-600 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
