import React, { useState } from 'react';
import { 
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  MoreVertical,
  Send,
  Paperclip,
  Image,
  Smile,
  Brain,
  Edit3,
  AlertTriangle,
  Hash,
  Users
} from 'lucide-react';

type Message = {
  id: string;
  type: 'email' | 'chat' | 'call' | 'meeting';
  platform?: 'slack' | 'gmail' | 'teams';
  from: {
    name: string;
    avatar?: string;
    email?: string;
  };
  subject?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  hasAiReply: boolean;
  aiReply?: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  labels?: string[];
};

export function MessageHub() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // ダミーメッセージデータ（AI返信機能付き）
  const messages: Message[] = [
    {
      id: '1',
      type: 'chat',
      platform: 'slack',
      from: {
        name: '田中太郎',
        email: 'tanaka@example.com',
        avatar: 'T'
      },
      content: '明日の会議資料、確認お願いします',
      timestamp: '2時間前',
      isRead: false,
      isStarred: true,
      priority: 'urgent',
      hasAiReply: true,
      aiReply: '確認いたします。修正点があれば明日午前中にお伝えします。',
      labels: ['重要', '会議']
    },
    {
      id: '2',
      type: 'email',
      platform: 'gmail',
      from: {
        name: 'クライアントA',
        email: 'client@example.com',
        avatar: 'C'
      },
      subject: '提案書の件でご相談があります',
      content: `お世話になっております。
先日お送りいただいた提案書について、いくつか確認したい点があります。
お時間のある時にご連絡いただけますでしょうか。`,
      timestamp: '3時間前',
      isRead: true,
      isStarred: false,
      priority: 'high',
      hasAiReply: true,
      aiReply: 'お疲れ様です。明日14時以降でお電話させていただけますでしょうか。',
      labels: ['クライアント']
    },
    {
      id: '3',
      type: 'chat',
      platform: 'teams',
      from: {
        name: '佐藤さん',
        avatar: 'S'
      },
      content: '来月のイベント企画、進捗いかがですか？',
      timestamp: '昨日',
      isRead: true,
      isStarred: false,
      priority: 'medium',
      hasAiReply: true,
      aiReply: '企画案を来週月曜日にお送りします。',
      labels: ['プロジェクト']
    }
  ];

  const channels = [
    { id: 'all', name: 'すべて', icon: MessageSquare, count: messages.length },
    { id: 'slack', name: 'Slack', icon: Hash, count: messages.filter(m => m.platform === 'slack').length },
    { id: 'gmail', name: 'Gmail', icon: Mail, count: messages.filter(m => m.platform === 'gmail').length },
    { id: 'teams', name: 'Teams', icon: Users, count: messages.filter(m => m.platform === 'teams').length },
  ];

  const filteredMessages = selectedChannel === 'all' 
    ? messages 
    : messages.filter(m => m.platform === selectedChannel);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getChannelIcon = (platform?: string) => {
    switch(platform) {
      case 'slack': return <Hash className="h-4 w-4 text-purple-500" />;
      case 'gmail': return <Mail className="h-4 w-4 text-red-500" />;
      case 'teams': return <Users className="h-4 w-4 text-blue-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">メッセージハブ</h1>
          <p className="mt-1 text-sm text-gray-500">
            すべてのコミュニケーションを一元管理・AI返信で効率化
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg px-4 py-2 border border-purple-200">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">AI効率化</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              自動返信: 8件 | 時間節約: 2.5時間
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* サイドバー */}
        <div className="w-64 bg-white shadow-sm rounded-lg overflow-hidden border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">チャンネル</h2>
            <nav className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedChannel === channel.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <channel.icon className="h-4 w-4" />
                    <span>{channel.name}</span>
                  </div>
                  {channel.count > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                      {channel.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* 検索 */}
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="メッセージを検索"
              />
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex">
          {/* メッセージリスト */}
          <div className="w-1/3 bg-gray-50 border-r overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedMessage === message.id ? 'bg-blue-50' : ''
                } ${!message.isRead ? 'bg-white' : ''}`}
                onClick={() => setSelectedMessage(message.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {message.from.avatar}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{message.from.name}</p>
                        {getChannelIcon(message.platform)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.subject || message.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {message.priority === 'urgent' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            緊急
                          </span>
                        )}
                        {message.hasAiReply && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            <Brain className="h-3 w-3" />
                            AI返信案あり
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                    {message.isStarred && (
                      <Star className="h-4 w-4 text-yellow-400 mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* メッセージ詳細 */}
          <div className="flex-1 bg-white">
            {selectedMessage ? (
              <MessageDetail 
                message={messages.find(m => m.id === selectedMessage)!}
                replyText={replyText}
                setReplyText={setReplyText}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">メッセージを選択</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    左のリストからメッセージを選択してください
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// メッセージ詳細コンポーネント
function MessageDetail({ message, replyText, setReplyText }: any) {
  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
              {message.from.avatar}
            </div>
            <div>
              <p className="font-medium text-gray-900">{message.from.name}</p>
              {message.from.email && (
                <p className="text-sm text-gray-500">{message.from.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Star className="h-5 w-5 text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        {message.subject && (
          <h2 className="mt-3 text-lg font-medium text-gray-900">{message.subject}</h2>
        )}
      </div>

      {/* 本文 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
        </div>

        {/* AI返信案 */}
        {message.hasAiReply && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">AI返信案</span>
              <span className="text-xs text-gray-600">（文脈を理解して生成）</span>
            </div>
            <p className="text-gray-700 mb-4">{message.aiReply}</p>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="h-4 w-4 mr-1" />
                送信
              </button>
              <button className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 className="h-4 w-4 mr-1" />
                編集
              </button>
              <button className="px-3 py-1.5 text-gray-600 text-sm hover:text-gray-800">
                後で
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 返信フォーム */}
      <div className="p-4 border-t">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <button className="p-1 rounded hover:bg-gray-200">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-1 rounded hover:bg-gray-200">
                <Image className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-1 rounded hover:bg-gray-200">
                <Smile className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
          <textarea
            className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none resize-none"
            rows={3}
            placeholder="返信を入力..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Enterキーで送信、Shift + Enterで改行
          </span>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Send className="h-4 w-4 mr-1" />
            送信
          </button>
        </div>
      </div>
    </div>
  );
}