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
  Smile
} from 'lucide-react';

type Message = {
  id: string;
  type: 'email' | 'chat' | 'call' | 'meeting';
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
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  labels?: string[];
};

export const MessageHub = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // モックデータ
  const messages: Message[] = [
    {
      id: '1',
      type: 'email',
      from: {
        name: '田中太郎',
        email: 'tanaka@example.com',
        avatar: 'T'
      },
      subject: '企画書のフィードバックについて',
      content: `お世話になっております。
先日送付させていただいた企画書について、いくつかフィードバックをいただけますでしょうか。
特に以下の点について、ご意見をいただけますと幸いです：

1. 予算配分の妥当性
2. スケジュールの実現可能性
3. リスク評価の十分性

よろしくお願いいたします。`,
      timestamp: '2025-03-15 10:30',
      isRead: false,
      isStarred: true,
      attachments: [
        { name: '企画書_v2.pdf', size: '2.4MB', type: 'pdf' }
      ],
      labels: ['重要', '企画']
    },
    {
      id: '2',
      type: 'chat',
      from: {
        name: '鈴木花子',
        avatar: 'S'
      },
      content: 'プロジェクトの進捗状況を確認したいのですが、15時頃お時間ありますか？',
      timestamp: '2025-03-15 09:45',
      isRead: true,
      isStarred: false,
      labels: ['プロジェクト']
    },
    {
      id: '3',
      type: 'call',
      from: {
        name: '佐藤健一',
        avatar: 'S'
      },
      content: '不在着信 (2回)',
      timestamp: '2025-03-15 09:15',
      isRead: true,
      isStarred: false
    },
    {
      id: '4',
      type: 'meeting',
      from: {
        name: '週次進捗会議',
        avatar: 'M'
      },
      subject: '週次進捗会議',
      content: '13:00-14:00 / 会議室A\n参加者: プロジェクトメンバー全員',
      timestamp: '2025-03-15 13:00',
      isRead: true,
      isStarred: false,
      labels: ['会議', '定例']
    }
  ];

  const getMessageTypeIcon = (type: Message['type']) => {
    switch(type) {
      case 'email': return <Mail className="h-5 w-5 text-blue-500" />;
      case 'chat': return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'call': return <Phone className="h-5 w-5 text-red-500" />;
      case 'meeting': return <Calendar className="h-5 w-5 text-purple-500" />;
    }
  };

  const getMessageTypeText = (type: Message['type']) => {
    switch(type) {
      case 'email': return 'メール';
      case 'chat': return 'チャット';
      case 'call': return '通話';
      case 'meeting': return '会議';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">メッセージ</h1>
          <p className="mt-1 text-sm text-gray-500">
            すべてのコミュニケーションを一元管理
          </p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* メッセージリスト */}
        <div className="w-1/3 bg-white shadow-sm rounded-lg overflow-hidden border-r">
          {/* 検索・フィルター */}
          <div className="p-4 border-b">
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
            <div className="mt-2 flex justify-between">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-4 w-4 mr-1.5 text-gray-400" />
                  フィルター
                  <ChevronDown className="ml-1.5 h-4 w-4 text-gray-400" />
                </button>
                
                {filterOpen && (
                  <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">メッセージタイプ</div>
                      {['すべて', 'メール', 'チャット', '通話', '会議'].map((type) => (
                        <div key={type} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`type-${type}`}
                            name={`type-${type}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-900">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* メッセージリスト */}
          <div className="overflow-y-auto h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedMessage === message.id ? 'bg-blue-50' : ''
                } ${!message.isRead ? 'bg-gray-50' : ''}`}
                onClick={() => setSelectedMessage(message.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {message.from.avatar}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{message.from.name}</p>
                        <span className="ml-2 flex-shrink-0">
                          {getMessageTypeIcon(message.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {message.subject || message.content}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex flex-col items-end">
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                    {message.isStarred && (
                      <Star className="h-4 w-4 text-yellow-400 mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* メッセージ詳細 */}
        <div className="flex-1 bg-white shadow-sm rounded-lg overflow-hidden ml-4">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* メッセージヘッダー */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {messages.find(m => m.id === selectedMessage)?.from.avatar}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {messages.find(m => m.id === selectedMessage)?.from.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {messages.find(m => m.id === selectedMessage)?.from.email}
                      </p>
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
                {messages.find(m => m.id === selectedMessage)?.subject && (
                  <h2 className="mt-2 text-lg font-medium text-gray-900">
                    {messages.find(m => m.id === selectedMessage)?.subject}
                  </h2>
                )}
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                  <span>{messages.find(m => m.id === selectedMessage)?.timestamp}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    {getMessageTypeIcon(messages.find(m => m.id === selectedMessage)?.type || 'email')}
                    <span className="ml-1">
                      {getMessageTypeText(messages.find(m => m.id === selectedMessage)?.type || 'email')}
                    </span>
                  </span>
                </div>
              </div>

              {/* メッセージ本文 */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">
                    {messages.find(m => m.id === selectedMessage)?.content}
                  </p>
                </div>

                {/* 添付ファイル */}
                {messages.find(m => m.id === selectedMessage)?.attachments && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">添付ファイル</h3>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      {messages.find(m => m.id === selectedMessage)?.attachments?.map((attachment) => (
                        <div
                          key={attachment.name}
                          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <div className="flex-1 min-w-0">
                            <a href="#" className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-sm text-gray-500">{attachment.size}</p>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 返信フォーム */}
              <div className="p-4 border-t">
                <div className="min-h-[100px] max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                  <div className="px-4 py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Paperclip className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Image className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <Smile className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="block w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                    rows={3}
                    placeholder="返信を入力..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Enterキーで送信、Shift + Enterで改行
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    送信
                  </button>
                </div>
              </div>
            </div>
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
  );
};