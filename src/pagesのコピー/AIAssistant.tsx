import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ChevronDown, 
  Settings,
  Sparkles,
  Lightbulb,
  FileText,
  BarChart,
  MessageSquare
} from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Suggestion = {
  id: string;
  title: string;
  icon: React.ElementType;
  prompt: string;
};

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'プロジェクト提案の作成',
      icon: FileText,
      prompt: 'プロジェクト提案書のテンプレートを作成してください。'
    },
    {
      id: '2',
      title: 'データ分析のサポート',
      icon: BarChart,
      prompt: '最近の売上データを分析して、重要なトレンドを教えてください。'
    },
    {
      id: '3',
      title: 'タスクの最適化',
      icon: Lightbulb,
      prompt: '現在のタスクリストを最適化する方法を提案してください。'
    },
    {
      id: '4',
      title: 'メール文章の作成',
      icon: MessageSquare,
      prompt: '顧客へのフォローアップメールの文章を作成してください。'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowSuggestions(false);

    // AIの応答をシミュレート
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `申し訳ありません。現在、AIアシスタントは開発中です。
実際の実装では、ここでOpenAI APIなどを使用して応答を生成します。

あなたのメッセージ: "${inputValue}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.prompt);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-gray-900">AIアシスタント</h2>
            <p className="text-sm text-gray-500">あなたの業務をサポートします</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 初期メッセージ */}
        {messages.length === 0 && showSuggestions && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">AIアシスタントへようこそ</h3>
            <p className="mt-2 text-sm text-gray-500">
              業務効率化のサポートやアドバイスを提供します。<br />
              以下のサンプルから始めるか、自由に質問してください。
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <suggestion.icon className="h-5 w-5 text-blue-500" />
                  <span className="ml-3 text-sm font-medium text-gray-900">{suggestion.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* メッセージリスト */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>
              <div className={`mx-2 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              } rounded-lg px-4 py-2`}>
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 入力中のインジケータ */}
        {isTyping && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-2 bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        {/* スクロール用の参照ポイント */}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力フォーム */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="メッセージを入力..."
            />
            {!inputValue && (
              <button
                type="button"
                onClick={() => setShowSuggestions(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              inputValue.trim() 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};