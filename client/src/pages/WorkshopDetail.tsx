import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';

interface Material {
  id: number;
  title: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  createdAt: string;
}

interface Workshop {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  materials: Material[];
}

interface Progress {
  lastPage: number;
  completed: boolean;
  updatedAt: string;
}

export default function WorkshopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchWorkshopDetail();
      fetchProgress();
    }
  }, [id]);

  const fetchWorkshopDetail = async () => {
    try {
      const response = await api.get(`/workshops/${id}`);
      setWorkshop(response.data.workshop);
    } catch (err: any) {
      setError(err.response?.data?.error || 'ワークショップの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/workshops/${id}/progress`);
      setProgress(response.data.progress);
    } catch (err) {
      // Progress not found is OK
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">読み込み中...</div>
      </Layout>
    );
  }

  if (error || !workshop) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'ワークショップが見つかりません'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/workshops')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← 一覧に戻る
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {workshop.title}
          </h1>
          <p className="text-gray-600 mb-4">
            {workshop.description || '説明なし'}
          </p>

          {progress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">あなたの進行状況</h3>
              <div className="flex items-center space-x-4 text-sm text-blue-800">
                <span>最後に見たページ: {progress.lastPage}</span>
                <span>
                  {progress.completed ? (
                    <span className="text-green-600">✓ 完了</span>
                  ) : (
                    <span className="text-yellow-600">進行中</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">資料一覧</h2>
          
          {workshop.materials.length === 0 ? (
            <p className="text-gray-500">資料がまだアップロードされていません</p>
          ) : (
            <div className="space-y-4">
              {workshop.materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/workshops/${id}/materials/${material.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {material.title}
                      </h3>
                      <div className="text-sm text-gray-500 space-x-4">
                        <span>📄 {material.originalName}</span>
                        <span>{formatFileSize(material.fileSize)}</span>
                        <span>{material.pageCount} ページ</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      開く
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
