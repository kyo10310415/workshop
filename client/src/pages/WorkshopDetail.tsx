import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';

type MaterialType = 'PDF' | 'GOOGLE_DOCS' | 'GOOGLE_SHEETS';

interface Material {
  id: number;
  title: string;
  type?: MaterialType;  // Make optional for backward compatibility
  originalName?: string;
  fileSize?: number;
  pageCount: number;
  url?: string;
  createdAt: string;
}

interface MaterialProgress {
  materialId: number | null;
  lastPage: number;
  completed: boolean;
}

interface Workshop {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  materials: Material[];
  progresses: MaterialProgress[];
}

export default function WorkshopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchWorkshopDetail();
    }
  }, [id]);

  const fetchWorkshopDetail = async () => {
    try {
      const response = await api.get(`/workshops/${id}`);
      console.log('Workshop data:', response.data.workshop);
      console.log('Materials:', response.data.workshop?.materials);
      console.log('Progresses:', response.data.workshop?.progresses);
      setWorkshop(response.data.workshop);
    } catch (err: any) {
      setError(err.response?.data?.error || 'eラーニングの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getMaterialProgress = (materialId: number) => {
    if (!workshop?.progresses) return undefined;
    
    // Try to find progress by materialId (new schema)
    const progressWithMaterial = workshop.progresses.find(p => p.materialId === materialId);
    if (progressWithMaterial) return progressWithMaterial;
    
    // Fallback: if there's only one progress without materialId, use it (old schema)
    const progressWithoutMaterial = workshop.progresses.find(p => p.materialId === null || p.materialId === undefined);
    if (progressWithoutMaterial && workshop.materials.length > 0) {
      return progressWithoutMaterial;
    }
    
    return undefined;
  };

  const getOverallProgress = () => {
    if (!workshop || !workshop.materials || workshop.materials.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = workshop.materials.length;
    
    // Check if we have any progresses
    const hasProgresses = workshop.progresses && workshop.progresses.length > 0;
    if (!hasProgresses) {
      return { completed: 0, total, percentage: 0 };
    }
    
    // Count completed materials by checking each material's progress
    let completed = 0;
    workshop.materials.forEach(material => {
      const progress = getMaterialProgress(material.id);
      if (progress?.completed) {
        completed++;
      }
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getMaterialIcon = (type?: MaterialType) => {
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

  const getMaterialTypeLabel = (type?: MaterialType) => {
    switch (type) {
      case 'PDF':
        return 'PDF';
      case 'GOOGLE_DOCS':
        return 'Google ドキュメント';
      case 'GOOGLE_SHEETS':
        return 'Google スプレッドシート';
      default:
        return 'PDF';
    }
  };

  const handleMaterialClick = (material: Material) => {
    const materialType = material.type || 'PDF';
    if (materialType === 'PDF') {
      navigate(`/workshops/${id}/materials/${material.id}`);
    } else {
      // Navigate to external material viewer page
      navigate(`/workshops/${id}/external-materials/${material.id}`);
    }
  };

  const getDownloadUrl = (material: Material, format: string) => {
    if (!material.url) return null;
    
    // Google Docs/Sheets のURLからドキュメントIDを抽出
    const docMatch = material.url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!docMatch) return null;
    
    const docId = docMatch[1];
    
    if (material.type === 'GOOGLE_DOCS') {
      const formatMap: { [key: string]: string } = {
        'pdf': 'pdf',
        'docx': 'docx',
        'txt': 'txt'
      };
      return `https://docs.google.com/document/d/${docId}/export?format=${formatMap[format]}`;
    } else if (material.type === 'GOOGLE_SHEETS') {
      const formatMap: { [key: string]: string } = {
        'pdf': 'pdf',
        'xlsx': 'xlsx',
        'csv': 'csv'
      };
      return `https://docs.google.com/spreadsheets/d/${docId}/export?format=${formatMap[format]}`;
    }
    
    return null;
  };

  const handleDownload = (e: React.MouseEvent, material: Material, format: string) => {
    e.stopPropagation(); // カードのクリックイベントを防ぐ
    
    const downloadUrl = getDownloadUrl(material, format);
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

  if (error || !workshop) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'eラーニングが見つかりません'}
        </div>
      </Layout>
    );
  }

  const overallProgress = getOverallProgress();

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
          <p className="text-gray-600 mb-6">
            {workshop.description || '説明なし'}
          </p>

          {/* Overall Progress */}
          {workshop.materials.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5">
              <h3 className="font-semibold text-purple-900 mb-3">全体の進捗状況</h3>
              <ProgressBar
                current={overallProgress.completed}
                total={overallProgress.total}
                completed={overallProgress.completed === overallProgress.total}
                showLabel={true}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">資料一覧</h2>
          
          {workshop.materials.length === 0 ? (
            <p className="text-gray-500">資料がまだアップロードされていません</p>
          ) : (
            <div className="space-y-4">
              {workshop.materials.map((material) => {
                const progress = getMaterialProgress(material.id);
                return (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getMaterialIcon(material.type)}</span>
                          <h3 className="font-semibold text-gray-800">
                            {material.title}
                          </h3>
                          {progress?.completed && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              ✓ 完了
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 space-x-4 ml-8">
                          <span>{getMaterialTypeLabel(material.type)}</span>
                          {material.type === 'PDF' && (
                            <>
                              <span>{material.originalName}</span>
                              <span>{formatFileSize(material.fileSize)}</span>
                              <span>{material.pageCount} ページ</span>
                            </>
                          )}
                        </div>
                        
                        {/* ダウンロードボタン（Google Docs/Sheets のみ） */}
                        {(material.type === 'GOOGLE_DOCS' || material.type === 'GOOGLE_SHEETS') && (
                          <div className="ml-8 mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-gray-600 flex items-center gap-1 mr-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              ダウンロード:
                            </span>
                            {material.type === 'GOOGLE_DOCS' && (
                              <>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'pdf')}
                                  className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-xs font-medium"
                                >
                                  PDF
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'docx')}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 text-xs font-medium"
                                >
                                  Word
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'txt')}
                                  className="px-2 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100 text-xs font-medium"
                                >
                                  TXT
                                </button>
                              </>
                            )}
                            {material.type === 'GOOGLE_SHEETS' && (
                              <>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'pdf')}
                                  className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-xs font-medium"
                                >
                                  PDF
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'xlsx')}
                                  className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 text-xs font-medium"
                                >
                                  Excel
                                </button>
                                <button
                                  onClick={(e) => handleDownload(e, material, 'csv')}
                                  className="px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 text-xs font-medium"
                                >
                                  CSV
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => handleMaterialClick(material)}
                      >
                        {material.type === 'PDF' ? '開く' : '外部リンクを開く'}
                        {material.type !== 'PDF' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Material Progress Bar (PDF only) */}
                    {material.type === 'PDF' && progress && material.pageCount > 0 && (
                      <div className="ml-8 mt-3">
                        <ProgressBar
                          current={progress.lastPage}
                          total={material.pageCount}
                          completed={progress.completed}
                          showLabel={true}
                          height="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
