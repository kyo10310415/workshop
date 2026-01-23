import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';

interface Material {
  id: number;
  title: string;
  filename: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  createdAt: string;
}

export default function MaterialManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchMaterials();
    }
  }, [id]);

  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/workshops/${id}`);
      setMaterials(response.data.workshop?.materials || []);
    } catch (err: any) {
      setError(err.response?.data?.error || '資料の取得に失敗しました');
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    setUploading(true);
    setError('');

    try {
      await api.post(`/admin/workshops/${id}/materials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      formElement.reset();
      fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.error || 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId: number, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) {
      return;
    }
    try {
      await api.delete(`/admin/materials/${materialId}`);
      fetchMaterials();
    } catch (err: any) {
      alert(err.response?.data?.error || '削除に失敗しました');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/workshops')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← ワークショップ管理に戻る
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">PDF資料管理</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* アップロードフォーム */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">PDFアップロード</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDFファイル *
              </label>
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                PDFファイルのみアップロード可能です
              </p>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? 'アップロード中...' : 'アップロード'}
            </button>
          </form>
        </div>

        {/* 資料一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">アップロード済み資料</h2>
          
          {materials.length === 0 ? (
            <p className="text-gray-500">資料がまだありません</p>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {material.title}
                    </h3>
                    <div className="text-sm text-gray-500 space-x-4">
                      <span>📄 {material.originalName}</span>
                      <span>{formatFileSize(material.fileSize)}</span>
                      <span>{material.pageCount} ページ</span>
                      <span>
                        {new Date(material.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(material.id, material.title)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
