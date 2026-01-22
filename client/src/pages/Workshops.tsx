import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

interface Workshop {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await api.get('/workshops');
      setWorkshops(response.data.workshops || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'ワークショップの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">読み込み中...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">ワークショップ一覧</h1>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/workshops')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              管理画面へ
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {workshops.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            ワークショップがまだありません
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/workshops/${workshop.id}`)}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {workshop.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {workshop.description || '説明なし'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {workshop.isPublic ? (
                        <span className="text-green-600">● 公開中</span>
                      ) : (
                        <span className="text-gray-400">● 非公開</span>
                      )}
                    </span>
                    <span>{new Date(workshop.createdAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
