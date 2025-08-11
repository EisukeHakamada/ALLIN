import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Lightbulb, Target, BarChart3, CheckCircle } from 'lucide-react';

interface NewBusinessWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (businessData: BusinessData) => void;
  isLoading?: boolean;
}

interface BusinessData {
  idea: string;
  leanCanvas: {
    problemStatement: string;
    solution: string;
    uniqueValueProposition: string;
    targetCustomers: string;
    revenueStreams: string;
  };
  kpis: Array<{
    name: string;
    target: number;
    unit: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  projectName: string;
  initialTasks: string[];
}

const MOCK_KPI_SUGGESTIONS = [
  { name: 'カスタマーインタビュー実施数', target: 10, unit: '件', priority: 'high' as const },
  { name: 'プロトタイプ作成数', target: 3, unit: '個', priority: 'high' as const },
  { name: 'ユーザーテスト実施数', target: 20, unit: '件', priority: 'medium' as const },
  { name: 'MVP利用ユーザー数', target: 100, unit: '人', priority: 'medium' as const },
  { name: '競合分析レポート数', target: 5, unit: '件', priority: 'low' as const },
];

const MOCK_LEAN_CANVAS = {
  problemStatement: "既存のプロジェクト管理ツールでは、タスクの進捗管理と戦略的な意思決定が分離されており、チームの生産性向上に限界がある。",
  solution: "AIアシスタントと統合されたプロジェクト管理プラットフォームにより、データに基づいた意思決定と自動化されたワークフローを提供する。",
  uniqueValueProposition: "人間の創造性とAIの分析力を組み合わせた、次世代のビジネスオペレーティングシステム",
  targetCustomers: "スタートアップ創業者、新規事業責任者、複数クライアントを持つコンサルタント",
  revenueStreams: "SaaSサブスクリプション（月額利用料）、エンタープライズライセンス、AIコンサルティングサービス"
};

const MOCK_INITIAL_TASKS = [
  "市場調査とユーザーインタビューの計画作成",
  "競合分析レポートの作成",
  "プロトタイプの要件定義",
  "ユーザーペルソナの作成",
  "価値提案の検証方法の設計"
];

export const NewBusinessWizard: React.FC<NewBusinessWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessIdea, setBusinessIdea] = useState('');
  const [leanCanvas, setLeanCanvas] = useState(MOCK_LEAN_CANVAS);
  const [selectedKPIs, setSelectedKPIs] = useState<typeof MOCK_KPI_SUGGESTIONS>([]);
  const [projectName, setProjectName] = useState('');

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
      // ステップ2に進む際の処理（AIがリーンキャンバスを生成する想定）
      if (currentStep === 1 && businessIdea) {
        // AIが事業アイデアからプロジェクト名を生成
        setProjectName(`${businessIdea.slice(0, 20)}${businessIdea.length > 20 ? '...' : ''} プロジェクト`);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKPIToggle = (kpi: typeof MOCK_KPI_SUGGESTIONS[0]) => {
    setSelectedKPIs(prev => {
      const exists = prev.find(item => item.name === kpi.name);
      if (exists) {
        return prev.filter(item => item.name !== kpi.name);
      } else {
        return [...prev, kpi];
      }
    });
  };

  const handleComplete = () => {
    const businessData: BusinessData = {
      idea: businessIdea,
      leanCanvas,
      kpis: selectedKPIs,
      projectName,
      initialTasks: MOCK_INITIAL_TASKS,
    };
    onComplete(businessData);
    // モーダルは親コンポーネント側で閉じる（API呼び出し完了後）
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return businessIdea.trim().length > 10;
      case 2:
        return true; // リーンキャンバスは編集可能だが必須ではない
      case 3:
        return selectedKPIs.length > 0;
      case 4:
        return projectName.trim().length > 0;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">新規事業を立案する</h2>
              <p className="text-sm text-gray-500">ステップ {currentStep} / {totalSteps}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* プログレスバー */}
        <div className="px-6 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="p-6">
          {/* ステップ1: アイデアの入力 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">事業アイデアを教えてください</h3>
                <p className="text-gray-600">
                  どのような課題を解決したいか、どんなサービスを作りたいかを自由に記述してください。
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  事業アイデア
                </label>
                <textarea
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="例: AIを活用したプロジェクト管理ツールで、チームの生産性を劇的に向上させるサービスを作りたい。既存ツールでは戦略的な意思決定とタスク管理が分離されているため、統合的なアプローチで解決したい。"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500">
                  {businessIdea.length} / 最低10文字以上入力してください
                </p>
              </div>
            </div>
          )}

          {/* ステップ2: リーンキャンバスの確認・編集 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">戦略フレームワークの確認</h3>
                <p className="text-gray-600">
                  AIがあなたのアイデアから生成したリーンキャンバスです。必要に応じて編集してください。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      解決する課題
                    </label>
                    <textarea
                      value={leanCanvas.problemStatement}
                      onChange={(e) => setLeanCanvas({...leanCanvas, problemStatement: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ソリューション
                    </label>
                    <textarea
                      value={leanCanvas.solution}
                      onChange={(e) => setLeanCanvas({...leanCanvas, solution: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      独自の価値提案
                    </label>
                    <textarea
                      value={leanCanvas.uniqueValueProposition}
                      onChange={(e) => setLeanCanvas({...leanCanvas, uniqueValueProposition: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ターゲット顧客
                    </label>
                    <textarea
                      value={leanCanvas.targetCustomers}
                      onChange={(e) => setLeanCanvas({...leanCanvas, targetCustomers: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      収益モデル
                    </label>
                    <textarea
                      value={leanCanvas.revenueStreams}
                      onChange={(e) => setLeanCanvas({...leanCanvas, revenueStreams: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ステップ3: KPIの設定 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">追跡するKPIを選択</h3>
                <p className="text-gray-600">
                  事業フェーズに応じてAIが推奨するKPIです。重要と思われるものを選択してください。
                </p>
              </div>

              <div className="space-y-3">
                {MOCK_KPI_SUGGESTIONS.map((kpi) => {
                  const isSelected = selectedKPIs.some(item => item.name === kpi.name);
                  return (
                    <div
                      key={kpi.name}
                      onClick={() => handleKPIToggle(kpi)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                              <p className="text-sm text-gray-600">
                                目標: {kpi.target} {kpi.unit}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            kpi.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : kpi.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {kpi.priority === 'high' ? '高' : kpi.priority === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedKPIs.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">選択されたKPI ({selectedKPIs.length}個)</h4>
                  <div className="space-y-1">
                    {selectedKPIs.map((kpi) => (
                      <p key={kpi.name} className="text-sm text-blue-700">
                        • {kpi.name}: {kpi.target} {kpi.unit}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ステップ4: 最終確認 */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">プロジェクトの最終確認</h3>
                <p className="text-gray-600">
                  以下の内容でプロジェクトを作成します。プロジェクト名は変更可能です。
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    プロジェクト名
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">設定されるKPI ({selectedKPIs.length}個)</h4>
                  <div className="space-y-2">
                    {selectedKPIs.map((kpi) => (
                      <div key={kpi.name} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{kpi.name}</span>
                        <span className="font-medium">{kpi.target} {kpi.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">作成される初期タスク ({MOCK_INITIAL_TASKS.length}個)</h4>
                  <div className="space-y-1">
                    {MOCK_INITIAL_TASKS.map((task, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        • {task}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>戻る</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-colors ${
                  isStepValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>次へ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!isStepValid() || isLoading}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-colors ${
                  isStepValid() && !isLoading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>作成中...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>プロジェクトを作成</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};