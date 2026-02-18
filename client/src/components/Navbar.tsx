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
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base">eラーニング管理システム</span>
            </div>

          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-white">
              {user.email}
            </span>
            {isAdmin && (
              <span className="text-xs text-yellow-300 font-semibold">
                ⭐ 管理者
              </span>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/admin/workshops')}
                  className="text-xs font-medium text-white hover:text-gray-200 transition-all"
                >
                  ⚙️ eラーニング管理
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-xs font-medium text-white hover:text-gray-200 transition-all"
                >
                  👥 ユーザー管理
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-white hover:text-gray-200 transition-all"
            >
              🚪 ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
