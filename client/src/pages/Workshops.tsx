import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';

interface Material {
  id: number;
  title: string;
  pageCount: number;
  type: 'PDF' | 'GOOGLE_DOCS' | 'GOOGLE_SHEETS';
}

interface Progress {
  materialId: number | null;
  lastPage: number;
  completed: boolean;
}

interface Workshop {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  materials: Material[];
  progresses: Progress[];
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await api.get('/workshops');
      setWorkshops(response.data.workshops || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'eラーニングの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallProgress = (workshop: Workshop) => {
    if (!workshop.materials || workshop.materials.length === 0) {
      return { completed: 0, total: 0, percentage: 0, allCompleted: false };
    }

    const totalMaterials = workshop.materials.length;
    
    // Check if we have any progresses
    const hasProgresses = workshop.progresses && workshop.progresses.length > 0;
    if (!hasProgresses) {
      return { completed: 0, total: totalMaterials, percentage: 0, allCompleted: false };
    }
    
    // Count completed materials by checking each material
    let completedMaterials = 0;
    workshop.materials.forEach(material => {
      // Try to find progress by materialId (new schema)
      const progressWithMaterial = workshop.progresses.find(p => p.materialId === material.id);
      if (progressWithMaterial?.completed) {
        completedMaterials++;
      } else if (!progressWithMaterial) {
        // Fallback: check if there's a progress without materialId (old schema)
        const progressWithoutMaterial = workshop.progresses.find(p => !p.materialId);
        if (progressWithoutMaterial?.completed) {
          completedMaterials++;
        }
      }
    });
    
    const percentage = Math.round((completedMaterials / totalMaterials) * 100);
    const allCompleted = completedMaterials === totalMaterials;

    return { completed: completedMaterials, total: totalMaterials, percentage, allCompleted };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">eラーニング一覧</h1>
          </div>
          <p className="text-sm text-gray-600">各eラーニングにアクセスするには、下のボタンをクリックしてください。</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {workshops.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-base text-gray-700 font-semibold mb-1">eラーニングがまだありません</p>
            <p className="text-sm text-gray-500">管理者が新しいeラーニングを公開するまでお待ちください</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((workshop) => {
              const progress = calculateOverallProgress(workshop);
              return (
                <button
                  key={workshop.id}
                  onClick={() => navigate(`/workshops/${workshop.id}`)}
                  className="group bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-200 text-left relative overflow-hidden"
                >
                  <div className="relative z-10">
                    {/* Icon and Badge Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        {workshop.isPublic && (
                          <span className="px-2 py-0.5 bg-white text-purple-700 rounded-full text-xs font-semibold">
                            グループ以上
                          </span>
                        )}
                        {progress.allCompleted && (
                          <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-semibold">
                            ✓ 完了
                          </span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base font-bold text-white mb-2">
                      {workshop.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white text-opacity-90 text-sm line-clamp-2 mb-3">
                      {workshop.description || '説明なし'}
                    </p>

                    {/* Progress Bar */}
                    {progress.total > 0 && (
                      <div className="mt-3 bg-white bg-opacity-20 rounded-lg p-2">
                        <div className="flex justify-between text-xs text-white mb-1">
                          <span>進捗状況</span>
                          <span className="font-semibold">{progress.completed} / {progress.total} 資料</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-2 overflow-hidden mb-1">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress.allCompleted ? 'bg-green-400' : 'bg-blue-400'
                            }`}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-white text-center">
                          {progress.allCompleted ? '✓ 完了' : `未完了 (${progress.percentage}%)`}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
