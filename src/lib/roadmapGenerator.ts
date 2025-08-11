// 各ステージの型を定義
export interface RoadmapStage {
    id: number;
    name: string;
    description: string;
    status: 'completed' | 'current' | 'locked'; // 完了、現在、未着手
    icon: string; // ステージのアイコン（絵文字）
    kpis?: string[]; // このステージで重要なKPI（オプション）
  }
  
  // 事業フェーズに応じてロードマップを生成する関数
  export function generateRoadmap(
    businessPhase: 'PSF' | 'PMF' | 'Scale',
    projectProgress: number = 0 // プロジェクト全体の進捗率 (0-100)
  ): RoadmapStage[] {
    let stages: Omit<RoadmapStage, 'status'>[] = [];
  
    switch (businessPhase) {
      case 'PSF':
        stages = [
          { 
            id: 1, 
            name: '顧客課題の定義', 
            description: '誰のどんな課題を解決するのかを明確にする。',
            icon: '🛖',
            kpis: ['顧客インタビュー数', '課題の深刻度スコア']
          },
          { 
            id: 2, 
            name: 'ソリューション仮説検証', 
            description: '解決策のアイデアを顧客にぶつけ、検証する。',
            icon: '🏕️',
            kpis: ['仮説検証テスト数', 'ソリューション受容率']
          },
          { 
            id: 3, 
            name: 'MVP(最小実用製品)の構築', 
            description: '仮説を検証するための最小限の製品を作る。',
            icon: '🏘️',
            kpis: ['MVP機能完成率', '開発リードタイム']
          },
          { 
            id: 4, 
            name: '初期ユーザー獲得', 
            description: '熱量の高い最初のユーザーを見つけ、フィードバックを得る。',
            icon: '🏪',
            kpis: ['初期ユーザー数', 'ユーザーフィードバック数']
          },
          { 
            id: 5, 
            name: 'PSF達成確認', 
            description: 'Problem-Solution Fitが達成されたかを総合的に評価する。',
            icon: '🏛️',
            kpis: ['顧客満足度', 'リピート利用率']
          }
        ];
        break;
        
      case 'PMF':
        stages = [
          { 
            id: 1, 
            name: '製品価値の最適化', 
            description: 'ユーザーが本当に価値を感じる機能に集中し、製品を磨き上げる。',
            icon: '🏘️',
            kpis: ['機能利用率', 'ユーザー滞在時間']
          },
          { 
            id: 2, 
            name: '成長指標の確立', 
            description: '持続的な成長を測る指標を定義し、改善サイクルを構築する。',
            icon: '🏬',
            kpis: ['月間成長率', 'リテンション率']
          },
          { 
            id: 3, 
            name: 'スケーラブルな獲得チャネル構築', 
            description: '効率的に顧客を獲得できる仕組みを作る。',
            icon: '🏢',
            kpis: ['顧客獲得単価', 'チャネル別成約率']
          },
          { 
            id: 4, 
            name: '収益モデルの検証', 
            description: '持続可能なビジネスモデルを確立する。',
            icon: '🏦',
            kpis: ['月次経常収益', '顧客生涯価値']
          },
          { 
            id: 5, 
            name: 'PMF達成確認', 
            description: 'Product-Market Fitが達成されたかを総合的に評価する。',
            icon: '🏛️',
            kpis: ['NPS', '有機的成長率']
          }
        ];
        break;
        
      case 'Scale':
        stages = [
          { 
            id: 1, 
            name: '組織体制の強化', 
            description: 'スケールに耐えうる組織構造とプロセスを構築する。',
            icon: '🏰',
            kpis: ['従業員満足度', '採用成功率']
          },
          { 
            id: 2, 
            name: '技術インフラの拡張', 
            description: '大規模なユーザー増加に対応できる技術基盤を整備する。',
            icon: '🏭',
            kpis: ['システム稼働率', 'レスポンス時間']
          },
          { 
            id: 3, 
            name: 'マーケット拡大', 
            description: '新しい市場セグメントや地域への展開を図る。',
            icon: '🌐',
            kpis: ['市場シェア', '新規市場での成約率']
          },
          { 
            id: 4, 
            name: '収益の多角化', 
            description: '複数の収益源を確立し、事業の安定性を高める。',
            icon: '💎',
            kpis: ['収益多様性指数', '主力事業依存度']
          },
          { 
            id: 5, 
            name: '持続的成長の実現', 
            description: '長期的に成長し続けられる事業基盤を完成させる。',
            icon: '👑',
            kpis: ['年間成長率', '市場ポジション']
          }
        ];
        break;
        
      default:
        stages = [
          { 
            id: 1, 
            name: '事業フェーズの定義', 
            description: 'まず、どの事業フェーズに取り組むかを明確にしましょう。',
            icon: '❓',
            kpis: []
          }
        ];
    }
  
    // 進捗率に応じて各ステージのステータスを決定する
    const totalStages = stages.length;
    const completedStages = Math.floor(totalStages * (projectProgress / 100));
    
    return stages.map((stage, index) => {
      let status: 'completed' | 'current' | 'locked';
      
      if (index < completedStages) {
        status = 'completed';
      } else if (index === completedStages && projectProgress > 0) {
        status = 'current';
      } else if (index === 0 && projectProgress === 0) {
        status = 'current'; // 最初のステージは進捗0%でも現在として扱う
      } else {
        status = 'locked';
      }
      
      return { ...stage, status };
    });
  }
  
  // ステータスに応じたスタイルを取得するヘルパー関数
  export function getStageStatusColor(status: 'completed' | 'current' | 'locked') {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          border: 'border-green-500',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'current':
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-500',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      case 'locked':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-600',
          icon: 'text-gray-400'
        };
    }
  }
  
  // フェーズ名を日本語に変換するヘルパー関数
  export function getPhaseDisplayName(phase: 'PSF' | 'PMF' | 'Scale') {
    switch (phase) {
      case 'PSF':
        return '課題解決フィット検証';
      case 'PMF':
        return 'プロダクトマーケットフィット検証';
      case 'Scale':
        return 'スケールアップ';
      default:
        return '不明なフェーズ';
    }
  }