import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import api from '../api';
import Layout from '../components/Layout';

// PDF.js worker の設定
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewer() {
  const { workshopId, materialId } = useParams<{ workshopId: string; materialId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [material, setMaterial] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (workshopId && materialId) {
      loadPDF();
      loadProgress();
    }
  }, [workshopId, materialId]);

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage);
      saveProgress(currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

  const loadPDF = async () => {
    try {
      // 資料情報を取得
      const workshopResponse = await api.get(`/workshops/${workshopId}`);
      const mat = workshopResponse.data.workshop?.materials?.find(
        (m: any) => m.id === parseInt(materialId!)
      );
      setMaterial(mat);

      // PDFを取得
      const pdfUrl = `/api/materials/${materialId}`;
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setLoading(false);
    } catch (err: any) {
      console.error('PDF loading error:', err);
      setError('PDFの読み込みに失敗しました');
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await api.get(`/workshops/${workshopId}/progress`);
      setProgress(response.data.progress);
      if (response.data.progress?.lastPage) {
        setCurrentPage(response.data.progress.lastPage);
      }
    } catch (err) {
      // Progress not found is OK
    }
  };

  const saveProgress = async (page: number) => {
    try {
      await api.put(`/workshops/${workshopId}/progress`, {
        lastPage: page
      });
    } catch (err) {
      console.error('Progress save error:', err);
    }
  };

  const toggleCompleted = async () => {
    try {
      const newCompleted = !progress?.completed;
      await api.put(`/workshops/${workshopId}/progress`, {
        completed: newCompleted
      });
      setProgress({ ...progress, completed: newCompleted });
    } catch (err: any) {
      alert(err.response?.data?.error || '完了状態の更新に失敗しました');
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Page render error:', err);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(Math.min(scale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(Math.max(scale - 0.25, 0.5));
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">PDFを読み込み中...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/workshops/${workshopId}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← 戻る
            </button>
            <h2 className="text-xl font-bold">{material?.title}</h2>
            <button
              onClick={toggleCompleted}
              className={`px-4 py-2 rounded ${
                progress?.completed
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {progress?.completed ? '✓ 完了' : '未完了'}
            </button>
          </div>
        </div>

        {/* コントロールバー */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage <= 1}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-700"
              >
                ← 前へ
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-700"
              >
                次へ →
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={zoomOut}
                className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="px-4 py-2 bg-gray-100 rounded">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* PDF Canvas */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-center overflow-auto">
          <canvas ref={canvasRef} className="border border-gray-300" />
        </div>
      </div>
    </Layout>
  );
}
