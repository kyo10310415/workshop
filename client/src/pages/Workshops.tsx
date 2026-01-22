import { useEffect, useState } from 'react';
import { getWorkshops, logout, Workshop } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      const response = await getWorkshops();
      setWorkshops(response.data.workshops);
    } catch (error) {
      console.error('Failed to load workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>ワークショップ一覧</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </div>

      {workshops.length === 0 ? (
        <p>ワークショップがありません。管理者がワークショップを作成してください。</p>
      ) : (
        <div>
          {workshops.map((workshop) => (
            <div 
              key={workshop.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '15px',
                borderRadius: '5px'
              }}
            >
              <h3>{workshop.title}</h3>
              <p>{workshop.description}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                資料数: {workshop.materials?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>API情報</h3>
        <p><strong>バックエンドAPI:</strong> http://localhost:5000/api</p>
        <p><strong>システムは以下の機能をサポートしています：</strong></p>
        <ul>
          <li>ワークショップ管理（CRUD）</li>
          <li>PDF資料のアップロード・配信</li>
          <li>ユーザー進行度の管理</li>
          <li>ユーザー管理（管理者のみ）</li>
        </ul>
      </div>
    </div>
  );
}
