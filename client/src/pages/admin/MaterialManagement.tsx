import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';

type MaterialType = 'PDF' | 'GOOGLE_DOCS' | 'GOOGLE_SHEETS';

interface Material {
  id: number;
  title: string;
  type: MaterialType;
  filename?: string;
  originalName?: string;
  fileSize?: number;
  pageCount: number;
  url?: string;
  createdAt: string;
}

export default function MaterialManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [urlFormData, setUrlFormData] = useState({
    title: '',
    url: '',
    type: 'GOOGLE_DOCS' as 'GOOGLE_DOCS' | 'GOOGLE_SHEETS'
  });

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

  const handlePdfUpload = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setShowPdfForm(false);
      fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.error || 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      await api.post(`/admin/workshops/${id}/materials/url`, urlFormData);
      setUrlFormData({ title: '', url: '', type: 'GOOGLE_DOCS' });
      setShowUrlForm(false);
      fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.error || 'URL資料の作成に失敗しました');
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getMaterialIcon = (type: MaterialType) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'GOOGLE_DOCS':
        return '📝';
      case 'GOOGLE_SHEETS':
        return '📊';
      default:
        return '📄';
    }
  };

  const getMaterialTypeLabel = (type: MaterialType) => {
    switch (type) {
      case 'PDF':
        return 'PDF';
      case 'GOOGLE_DOCS':
        return 'Google ドキュメント';
      case 'GOOGLE_SHEETS':
        return 'Google スプレッドシート';
      default:
        return type;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 space-y-2">
          <button
            onClick={() => navigate('/workshops')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップページに戻る
          </button>
          <button
            onClick={() => navigate('/admin/workshops')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            eラーニング管理に戻る
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">資料管理</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 資料追加ボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => {
              setShowPdfForm(!showPdfForm);
              setShowUrlForm(false);
            }}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            PDF アップロード
          </button>
          <button
            onClick={() => {
              setShowUrlForm(!showUrlForm);
              setShowPdfForm(false);
            }}
            className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Google Docs / Sheets URL 追加
          </button>
        </div>

        {/* PDFアップロードフォーム */}
        {showPdfForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">PDFアップロード</h2>
            <form onSubmit={handlePdfUpload} className="space-y-4">
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
                  PDFファイルのみアップロード可能です（最大50MB）
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {uploading ? 'アップロード中...' : 'アップロード'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* URL資料追加フォーム */}
        {showUrlForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Google Docs / Sheets URL 追加</h2>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル *
                </label>
                <input
                  type="text"
                  value={urlFormData.title}
                  onChange={(e) => setUrlFormData({ ...urlFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder="例：プロジェクト計画書"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={urlFormData.url}
                  onChange={(e) => setUrlFormData({ ...urlFormData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder="https://docs.google.com/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Google ドキュメントまたはスプレッドシートの共有リンクを貼り付けてください
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  種類 *
                </label>
                <select
                  value={urlFormData.type}
                  onChange={(e) => setUrlFormData({ ...urlFormData, type: e.target.value as 'GOOGLE_DOCS' | 'GOOGLE_SHEETS' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="GOOGLE_DOCS">Google ドキュメント</option>
                  <option value="GOOGLE_SHEETS">Google スプレッドシート</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? '作成中...' : '作成'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlForm(false);
                    setUrlFormData({ title: '', url: '', type: 'GOOGLE_DOCS' });
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 資料一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">登録済み資料</h2>
          
          {materials.length === 0 ? (
            <p className="text-gray-500">資料がまだありません</p>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{getMaterialIcon(material.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {material.title}
                      </h3>
                      <div className="text-sm text-gray-500 space-x-4">
                        <span className="font-medium">{getMaterialTypeLabel(material.type)}</span>
                        {material.type === 'PDF' && (
                          <>
                            <span>{material.originalName}</span>
                            <span>{formatFileSize(material.fileSize)}</span>
                            <span>{material.pageCount} ページ</span>
                          </>
                        )}
                        {material.url && (
                          <a 
                            href={material.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            URLを開く
                          </a>
                        )}
                        <span>
                          {new Date(material.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
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
