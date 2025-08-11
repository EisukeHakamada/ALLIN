import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, BarChart3, Target, Users, Loader2, CheckCircle2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateBusinessProject, useUpdateProjectStrategy } from '../lib/api/hooks';

interface StrategyHubProps {
  mode?: 'create' | 'view';
  initialData?: {
    projectId?: string;
    title?: string;
    description?: string;
    leanCanvasData?: any;
    kpiData?: any[];
  };
}

export const StrategyHub: React.FC<StrategyHubProps> = ({ 
  mode = 'create', 
  initialData 
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createBusinessProject = useCreateBusinessProject();
  const updateProjectStrategy = useUpdateProjectStrategy();
  
  const [activeFramework, setActiveFramework] = useState(
    mode === 'view' ? 'lean-canvas' : 'idea-input'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyGenerated, setStrategyGenerated] = useState(mode === 'view');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  
  // アイデア入力データ
  const [ideaData, setIdeaData] = useState({
    businessIdea: '',
    targetCustomer: '',
    budget: '',
    timeline: '',
    kgi: ''
  });

  // AI生成されたリーンキャンバスデータ
  const [leanCanvasData, setLeanCanvasData] = useState({
    problemStatement: '',
    solution: '',
    uniqueValueProposition: '',
    unfairAdvantage: '',
    customerSegments: '',
    keyMetrics: '',
    channels: '',
    costStructure: '',
    revenueStreams: ''
  });

  // AI生成されたKPIデータ
  const [kpiData, setKpiData] = useState<Array<{
    id: string;
    name: string;
    target: string;
    description: string;
    selected: boolean;
  }>>([]);

  // 初期データが提供された場合の初期化
  useEffect(() => {
    if (mode === 'view' && initialData) {
      if (initialData.leanCanvasData) {
        setLeanCanvasData(initialData.leanCanvasData);
      }
      if (initialData.kpiData) {
        setKpiData(initialData.kpiData);
      }
    }
  }, [mode, initialData]);

  // 利用可能なフレームワーク一覧
  const frameworks = mode === 'create' ? [
    {
      id: 'idea-input',
      name: 'アイデア入力',
      description: '事業コンセプトを整理',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'lean-canvas',
      name: 'リーンキャンバス',
      description: '事業モデルを1枚で整理',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'kpi-settings',
      name: 'KPI設定',
      description: '重要指標を選択・調整',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-green-500'
    }
  ] : [
    {
      id: 'lean-canvas',
      name: 'リーンキャンバス',
      description: '事業モデルを1枚で整理',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'kpi-settings',
      name: 'KPI設定',
      description: '重要指標を選択・調整',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-green-500'
    }
  ];

  // AIによる戦略生成（モック）
  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    
    // 3秒のローディング（実際のAI処理をシミュレート）
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // モックデータでリーンキャンバスを生成
    setLeanCanvasData({
      problemStatement: `${ideaData.targetCustomer}は、忙しい日常の中で健康管理が難しく、栄養バランスの取れた食事を継続できない問題を抱えている。`,
      solution: `${ideaData.businessIdea}により、簡単で継続可能な栄養管理を提供し、忙しい人でも健康的な生活を維持できるようにする。`,
      uniqueValueProposition: 'AIが個人の生活パターンを学習し、無理のない栄養管理プランを自動提案する',
      unfairAdvantage: '管理栄養士との提携による科学的根拠に基づいた栄養指導',
      customerSegments: ideaData.targetCustomer,
      keyMetrics: 'アクティブユーザー数、継続率、栄養目標達成率',
      channels: 'アプリストア、SNS広告、企業福利厚生プログラム',
      costStructure: 'アプリ開発費、サーバー費用、管理栄養士人件費、マーケティング費用',
      revenueStreams: '月額サブスクリプション、プレミアム機能、企業向けライセンス'
    });

    // モックデータでKPIを生成
    setKpiData([
      {
        id: '1',
        name: 'ユーザーインタビュー実施数',
        target: '50人',
        description: 'ターゲット顧客のニーズを深く理解するため',
        selected: true
      },
      {
        id: '2',
        name: 'MVP登録ユーザー数',
        target: '1,000人',
        description: '初期プロダクトの市場受容性を測定',
        selected: true
      },
      {
        id: '3',
        name: '月間継続率',
        target: '70%',
        description: 'サービスの価値と継続性を測定',
        selected: true
      },
      {
        id: '4',
        name: '有料転換率',
        target: '15%',
        description: '収益化の可能性を測定',
        selected: false
      },
      {
        id: '5',
        name: '顧客満足度',
        target: '85%以上',
        description: 'サービス品質の維持・向上',
        selected: false
      }
    ]);

    setIsGenerating(false);
    setStrategyGenerated(true);
    setActiveFramework('lean-canvas');
  };

  // プロジェクト作成処理
  const handleCreateProject = async () => {
    setIsCreatingProject(true);
    
    try {
      // 選択されたKPIのみを抽出
      const selectedKPIs = kpiData.filter(kpi => kpi.selected);
      
      // プロジェクトデータを構築（戦略データを含める）
      const projectData = {
        title: `${ideaData.businessIdea}プロジェクト`,
        description: `ターゲット: ${ideaData.targetCustomer}\nKGI: ${ideaData.kgi}`,
        status: 'active' as const,
        business_phase: 'PSF' as const,
        priority: 'high' as const,
        due_date: ideaData.timeline ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : null,
        lean_canvas: leanCanvasData, // ★ リーンキャンバスデータを含める
        kpis: selectedKPIs // ★ 選択されたKPIを含める
      };

      // プロジェクト作成API呼び出し
      console.log('プロジェクト作成データ:', projectData); // デバッグ用ログ
      await createBusinessProject.mutateAsync(projectData);
      
      // キャッシュを無効化してプロジェクト一覧を更新
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // プロジェクト一覧ページに遷移
      navigate('/projects');
      
    } catch (error) {
      console.error('プロジェクト作成エラー:', error);
      alert('プロジェクトの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsCreatingProject(false);
    }
  };

  // 変更保存処理（表示・編集モード用）
  const handleSaveChanges = async () => {
    if (!initialData?.projectId) {
      alert('プロジェクトIDが見つかりません');
      return;
    }

    setIsSavingChanges(true);
    
    try {
      // 選択されたKPIのみを抽出
      const selectedKPIs = kpiData.filter(kpi => kpi.selected);
      
      // 戦略データを構築
      const strategyData = {
        lean_canvas: leanCanvasData,
        kpis: selectedKPIs
      };

      console.log('戦略更新データ:', strategyData); // デバッグ用ログ
      
      // 戦略更新API呼び出し
      await updateProjectStrategy.mutateAsync({
        projectId: initialData.projectId,
        strategyData
      });
      
      alert('戦略の変更を保存しました！');
      
    } catch (error) {
      console.error('戦略更新エラー:', error);
      alert('戦略の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSavingChanges(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左サイドバー：フレームワーク一覧 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          {mode === 'create' && (
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>プロジェクト一覧に戻る</span>
            </button>
          )}
          
          <h1 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? '戦略ハブ' : '事業戦略'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'create' ? '事業戦略を体系的に構築' : '戦略の確認・編集'}
          </p>
        </div>

        {/* フレームワーク一覧 */}
        <div className="flex-1 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            フレームワーク
          </h2>
          
          <div className="space-y-2">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setActiveFramework(framework.id)}
                disabled={!strategyGenerated && framework.id !== 'idea-input'}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  activeFramework === framework.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50'
                } ${!strategyGenerated && framework.id !== 'idea-input' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${framework.color} text-white`}>
                    {framework.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {framework.name}
                      {strategyGenerated && framework.id !== 'idea-input' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {framework.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 各フレームワークを確認・編集して、最適な戦略を構築しましょう
            </p>
          </div>
        </div>
      </div>

      {/* 右メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* コンテンツヘッダー */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                frameworks.find(f => f.id === activeFramework)?.color || 'bg-blue-500'
              } text-white`}>
                {frameworks.find(f => f.id === activeFramework)?.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {frameworks.find(f => f.id === activeFramework)?.name}
                </h2>
                <p className="text-gray-600">
                  {frameworks.find(f => f.id === activeFramework)?.description}
                </p>
              </div>
            </div>

            {/* プロジェクト開始ボタン */}
            {strategyGenerated && mode === 'create' && (
              <button
                onClick={handleCreateProject}
                disabled={isCreatingProject}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {isCreatingProject ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>作成中...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>この戦略でプロジェクトを開始する</span>
                  </>
                )}
              </button>
            )}

            {/* 変更保存ボタン（表示・編集モード用） */}
            {mode === 'view' && (
              <button
                onClick={handleSaveChanges}
                disabled={isSavingChanges}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {isSavingChanges ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>保存中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>変更を保存する</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 p-6">
          {/* アイデア入力フォーム（作成モードのみ） */}
          {activeFramework === 'idea-input' && mode === 'create' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                事業アイデア入力
              </h3>
              <p className="text-gray-600 mb-8">
                あなたの事業アイデアを教えてください。AIが戦略フレームワークとKPI目標を自動生成します。
              </p>
              
              <form className="space-y-6">
                {/* 事業アイデア */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    事業アイデア <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={ideaData.businessIdea}
                    onChange={(e) => setIdeaData({...ideaData, businessIdea: e.target.value})}
                    placeholder="どのような事業を立ち上げたいですか？（例：忙しいビジネスパーソン向けの栄養管理アプリ）"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* ターゲット顧客 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ターゲット顧客 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ideaData.targetCustomer}
                    onChange={(e) => setIdeaData({...ideaData, targetCustomer: e.target.value})}
                    placeholder="誰に向けたサービスですか？（例：20-30代の忙しい会社員）"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 予算 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    初期予算
                  </label>
                  <input
                    type="text"
                    value={ideaData.budget}
                    onChange={(e) => setIdeaData({...ideaData, budget: e.target.value})}
                    placeholder="初期投資可能額（例：500万円）"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* タイムライン */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標達成期間
                  </label>
                  <input
                    type="text"
                    value={ideaData.timeline}
                    onChange={(e) => setIdeaData({...ideaData, timeline: e.target.value})}
                    placeholder="いつまでに実現したいですか？（例：1年以内）"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* KGI（最終目標） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KGI（最終目標） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ideaData.kgi}
                    onChange={(e) => setIdeaData({...ideaData, kgi: e.target.value})}
                    placeholder="最終的に達成したい目標（例：月商1000万円、ユーザー1万人など）"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 送信ボタン */}
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={handleGenerateStrategy}
                    disabled={!ideaData.businessIdea || !ideaData.targetCustomer || !ideaData.kgi || isGenerating}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>AI戦略生成中...</span>
                      </>
                    ) : (
                      <>
                        <span>AIに戦略を生成してもらう 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* リーンキャンバス */}
          {activeFramework === 'lean-canvas' && strategyGenerated && (
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                リーンキャンバス（AI生成）
              </h3>
              <p className="text-gray-600 mb-6">
                AIが生成した事業モデルです。内容を確認・編集してください。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">課題</label>
                  <textarea
                    value={leanCanvasData.problemStatement}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, problemStatement: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ソリューション</label>
                  <textarea
                    value={leanCanvasData.solution}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, solution: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">独自の価値提案</label>
                  <textarea
                    value={leanCanvasData.uniqueValueProposition}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, uniqueValueProposition: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">圧倒的優位性</label>
                  <textarea
                    value={leanCanvasData.unfairAdvantage}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, unfairAdvantage: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">顧客セグメント</label>
                  <textarea
                    value={leanCanvasData.customerSegments}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, customerSegments: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">重要指標</label>
                  <textarea
                    value={leanCanvasData.keyMetrics}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, keyMetrics: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">チャネル</label>
                  <textarea
                    value={leanCanvasData.channels}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, channels: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">コスト構造</label>
                  <textarea
                    value={leanCanvasData.costStructure}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, costStructure: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">収益の流れ</label>
                  <textarea
                    value={leanCanvasData.revenueStreams}
                    onChange={(e) => setLeanCanvasData({...leanCanvasData, revenueStreams: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* KPI設定 */}
          {activeFramework === 'kpi-settings' && strategyGenerated && (
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                KPI設定（AI提案）
              </h3>
              <p className="text-gray-600 mb-6">
                AIが提案したKPIから、重要なものを選択してください。数値は編集可能です。
              </p>
              
              <div className="space-y-4">
                {kpiData.map((kpi) => (
                  <div key={kpi.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={kpi.selected}
                      onChange={(e) => {
                        setKpiData(kpiData.map(k => 
                          k.id === kpi.id ? {...k, selected: e.target.checked} : k
                        ));
                      }}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={kpi.name}
                        onChange={(e) => {
                          setKpiData(kpiData.map(k => 
                            k.id === kpi.id ? {...k, name: e.target.value} : k
                          ));
                        }}
                        className="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0"
                      />
                      <p className="text-sm text-gray-600">{kpi.description}</p>
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        value={kpi.target}
                        onChange={(e) => {
                          setKpiData(kpiData.map(k => 
                            k.id === kpi.id ? {...k, target: e.target.value} : k
                          ));
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-center"
                        placeholder="目標値"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ KPI機能は現在開発中です。選択したKPIは将来的にデータベースに保存される予定です。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};