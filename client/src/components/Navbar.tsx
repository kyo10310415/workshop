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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">ワークショップ管理</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/workshops')}
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                ワークショップ
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => navigate('/admin/workshops')}
                    className="hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    管理
                  </button>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    ユーザー管理
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user.name} ({isAdmin ? '管理者' : 'ユーザー'})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
