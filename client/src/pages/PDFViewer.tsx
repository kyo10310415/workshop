import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import api from '../api';
import Layout from '../components/Layout';

// PDF.js worker の設定（unpkg CDNを使用）
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const { workshopId, materialId } = useParams<{ workshopId: string; materialId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
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
      const materials = workshopResponse.data.workshop?.materials || [];
      const mat = materials.find((m: any) => m.id === parseInt(materialId!));
      
      if (!mat) {
        setError(`資料ID ${materialId} が見つかりません`);
        setLoading(false);
        return;
      }
      
      setMaterial(mat);

      // PDFをBlob形式で取得
      const response = await api.get(`/materials/${materialId}`, {
        responseType: 'blob'
      });
      
      // BlobをArrayBufferに変換してPDF.jsに渡す
      const blob = response.data;
      const arrayBuffer = await blob.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setLoading(false);
    } catch (err: any) {
      console.error('PDF loading error:', err);
      setError(`PDFの読み込みに失敗しました: ${err.response?.status || err.message}`);
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const response = await api.get(`/workshops/${workshopId}/progress`, {
        params: { materialId }
      });
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
        materialId: parseInt(materialId!),
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
        materialId: parseInt(materialId!),
        completed: newCompleted
      });
      setProgress({ ...progress, completed: newCompleted });
    } catch (err: any) {
      alert(err.response?.data?.error || '完了状態の更新に失敗しました');
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || !textLayerRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Canvas レンダリング
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      // テキストレイヤーのクリア
      const textLayer = textLayerRef.current;
      textLayer.innerHTML = '';
      textLayer.style.width = `${viewport.width}px`;
      textLayer.style.height = `${viewport.height}px`;

      // テキストコンテンツを取得
      const textContent = await page.getTextContent();
      
      // テキストレイヤーをレンダリング（簡易版）
      const textItems = textContent.items;
      textItems.forEach((item: any) => {
        const tx = pdfjsLib.Util.transform(
          viewport.transform,
          item.transform
        );
        
        const span = document.createElement('span');
        span.textContent = item.str;
        span.style.position = 'absolute';
        span.style.left = `${tx[4]}px`;
        span.style.top = `${tx[5]}px`;
        span.style.fontSize = `${Math.sqrt(tx[0] * tx[0] + tx[3] * tx[3])}px`;
        span.style.fontFamily = 'sans-serif';
        span.style.whiteSpace = 'pre';
        span.style.transform = `scaleX(${tx[0] / Math.sqrt(tx[0] * tx[0] + tx[3] * tx[3])})`;
        span.style.transformOrigin = 'left bottom';
        span.style.color = 'transparent';
        span.style.pointerEvents = 'auto';
        
        textLayer.appendChild(span);
      });
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
          <div className="flex items-center justify-between flex-wrap gap-4">
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

            <div className="flex items-center space-x-4">
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
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>テキストを選択してコピーできます</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Canvas with Text Layer */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-center overflow-auto">
          <div className="max-w-full" ref={containerRef}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <canvas 
                ref={canvasRef} 
                className="border border-gray-300" 
                style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              />
              <div 
                ref={textLayerRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  opacity: 1,
                  lineHeight: 1,
                  pointerEvents: 'auto',
                  userSelect: 'text',
                  cursor: 'text',
                  mixBlendMode: 'multiply'
                }}
                className="text-layer"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
