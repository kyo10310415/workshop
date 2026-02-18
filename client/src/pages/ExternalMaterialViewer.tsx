import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';

export default function ExternalMaterialViewer() {
  const { workshopId, materialId } = useParams<{ workshopId: string; materialId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [material, setMaterial] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [externalWindowOpened, setExternalWindowOpened] = useState(false);

  useEffect(() => {
    if (workshopId && materialId) {
      loadMaterial();
      loadProgress();
    }
  }, [workshopId, materialId]);

  const loadMaterial = async () => {
    try {
      const response = await api.get(`/workshops/${workshopId}`);
      const materials = response.data.workshop?.materials || [];
      const mat = materials.find((m: any) => m.id === parseInt(materialId!));
      
      if (!mat) {
        setError('資料が見つかりません');
        return;
      }
      
      if (!mat.url) {
        setError('URLが設定されていません');
        return;
      }
      
      setMaterial(mat);
    } catch (err: any) {
      setError('資料の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await api.get(`/materials/${materialId}/completion`);
      setCompleted(response.data.completion?.completed || false);
    } catch (err: any) {
      console.error('Failed to load completion status:', err);
    }
  };

  const handleOpenExternal = () => {
    if (material?.url) {
      window.open(material.url, '_blank');
      setExternalWindowOpened(true);
    }
  };

  const handleToggleCompleted = async () => {
    try {
      console.log('=== Toggle Completed Debug ===');
      console.log('MaterialId:', materialId);
      console.log('Current completed:', completed);
      console.log('New completed:', !completed);

      const response = await api.put(`/materials/${materialId}/completion`, {
        completed: !completed
      });

      console.log('API Response:', response.data);
      setCompleted(!completed);
    } catch (err: any) {
      console.error('Toggle completed error:', err);
      console.error('Error response:', err.response?.data);
      alert(`完了状態の更新に失敗しました\n\nエラー詳細: ${err.response?.data?.details || err.response?.data?.error || err.message}`);
    }
  };

  const getMaterialIcon = (type?: string) => {
    switch (type) {
      case 'GOOGLE_DOCS':
        return '📝';
      case 'GOOGLE_SHEETS':
        return '📊';
      default:
        return '🔗';
    }
  };

  const getMaterialTypeLabel = (type?: string) => {
    switch (type) {
      case 'GOOGLE_DOCS':
        return 'Google ドキュメント';
      case 'GOOGLE_SHEETS':
        return 'Google スプレッドシート';
      default:
        return '外部リンク';
    }
  };

  const getDownloadUrl = (url: string, format: string) => {
    // Google Docs/Sheets のURLからドキュメントIDを抽出
    const docMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!docMatch) return null;
    
    const docId = docMatch[1];
    
    if (material.type === 'GOOGLE_DOCS') {
      // Google Docs のダウンロード形式
      const formatMap: { [key: string]: string } = {
        'pdf': 'pdf',
        'docx': 'docx',
        'txt': 'txt'
      };
      return `https://docs.google.com/document/d/${docId}/export?format=${formatMap[format]}`;
    } else if (material.type === 'GOOGLE_SHEETS') {
      // Google Sheets のダウンロード形式
      const formatMap: { [key: string]: string } = {
        'pdf': 'pdf',
        'xlsx': 'xlsx',
        'csv': 'csv'
      };
      return `https://docs.google.com/spreadsheets/d/${docId}/export?format=${formatMap[format]}`;
    }
    
    return null;
  };

  const handleDownload = (format: string) => {
    if (!material?.url) return;
    
    const downloadUrl = getDownloadUrl(material.url, format);
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      alert('ダウンロードURLの生成に失敗しました');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">読み込み中...</div>
      </Layout>
    );
  }

  if (error || !material) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(`/workshops/${workshopId}`)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← eラーニングに戻る
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || '資料が見つかりません'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/workshops/${workshopId}`)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← eラーニングに戻る
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">{getMaterialIcon(material.type)}</span>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {material.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {getMaterialTypeLabel(material.type)}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleOpenExternal}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3 text-lg font-semibold transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              外部リンクを開く
            </button>

            {/* ダウンロードボタン */}
            {(material.type === 'GOOGLE_DOCS' || material.type === 'GOOGLE_SHEETS') && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="font-semibold text-gray-700">ダウンロード</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {material.type === 'GOOGLE_DOCS' && (
                    <>
                      <button
                        onClick={() => handleDownload('pdf')}
                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-sm font-medium"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleDownload('docx')}
                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 text-sm font-medium"
                      >
                        📝 Word (DOCX)
                      </button>
                      <button
                        onClick={() => handleDownload('txt')}
                        className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100 text-sm font-medium"
                      >
                        📋 テキスト (TXT)
                      </button>
                    </>
                  )}
                  {material.type === 'GOOGLE_SHEETS' && (
                    <>
                      <button
                        onClick={() => handleDownload('pdf')}
                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-sm font-medium"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleDownload('xlsx')}
                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 text-sm font-medium"
                      >
                        📊 Excel (XLSX)
                      </button>
                      <button
                        onClick={() => handleDownload('csv')}
                        className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 text-sm font-medium"
                      >
                        📈 CSV
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {externalWindowOpened && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-center">
                <p className="text-sm">
                  ✓ 外部リンクを開きました。<br />
                  内容を確認したら下のボタンで完了マークを付けてください。
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-700">完了状態</span>
                {completed ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    ✓ 完了
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
                    未完了
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleCompleted}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  completed
                    ? 'bg-gray-400 text-white hover:bg-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {completed ? '未完了にする' : '完了にする'}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>ヒント：</strong> 外部リンクを開いて内容を確認した後、
              「完了にする」ボタンをクリックすると、進捗が記録されます。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
