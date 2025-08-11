import React, { useState, useEffect } from 'react';
import { Building2, Users, UserCircle2, Briefcase } from 'lucide-react';

export type ScopeType = 'organization' | 'division' | 'team' | 'user';

interface Entity {
  id: string;
  name: string;
}

interface HierarchySelectorProps {
  onScopeChange: (scopeType: ScopeType, scopeId: string) => void;
}

export const HierarchySelector: React.FC<HierarchySelectorProps> = ({ onScopeChange }) => {
  const [scopeType, setScopeType] = useState<ScopeType>('organization');
  const [scopeId, setScopeId] = useState<string>('');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const mockData: Record<ScopeType, Entity[]> = {
    organization: [{ id: 'org1', name: 'AI Business Platform Inc.' }],
    division: [
      { id: 'div1', name: '営業部門' },
      { id: 'div2', name: '開発部門' },
      { id: 'div3', name: 'マーケティング部門' }
    ],
    team: [
      { id: 'team1', name: '法人営業チーム' },
      { id: 'team2', name: 'フロントエンド開発チーム' },
      { id: 'team3', name: 'デジタルマーケティングチーム' }
    ],
    user: [
      { id: 'user1', name: '山田太郎' },
      { id: 'user2', name: '鈴木花子' },
      { id: 'user3', name: '佐藤健一' }
    ]
  };

  const scopeOptions = [
    { value: 'organization', label: '会社全体', icon: Building2 },
    { value: 'division', label: '事業部', icon: Briefcase },
    { value: 'team', label: 'チーム', icon: Users },
    { value: 'user', label: '個人', icon: UserCircle2 }
  ];

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEntities(mockData[scopeType]);
        if (mockData[scopeType].length > 0) {
          setScopeId(mockData[scopeType][0].id);
          onScopeChange(scopeType, mockData[scopeType][0].id);
        }
      } catch (error) {
        console.error('Failed to fetch entities:', error);
        // Fallback to organization view
        setScopeType('organization');
        setScopeId(mockData.organization[0].id);
        onScopeChange('organization', mockData.organization[0].id);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [scopeType]);

  const handleScopeTypeChange = (newScopeType: ScopeType) => {
    setScopeType(newScopeType);
  };

  const handleScopeIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newScopeId = event.target.value;
    setScopeId(newScopeId);
    onScopeChange(scopeType, newScopeId);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex rounded-md shadow-sm">
        {scopeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => handleScopeTypeChange(option.value as ScopeType)}
              className={`relative inline-flex items-center px-4 py-2 ${
                scopeType === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } text-sm font-medium border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="min-w-[200px]">
        <select
          value={scopeId}
          onChange={handleScopeIdChange}
          disabled={loading}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {loading ? (
            <option>読み込み中...</option>
          ) : (
            entities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};