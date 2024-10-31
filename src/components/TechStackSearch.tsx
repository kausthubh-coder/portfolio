import React, { useState, useMemo } from 'react';

interface TechItem {
  name: string;
  category: string;
  icon: string;
}

const techStack: TechItem[] = [
  { name: 'typescript', category: 'Language', icon: 'TS' },
  { name: 'nextjs', category: 'Framework', icon: 'N' },
  { name: 'svelte', category: 'Framework', icon: 'S' },
  { name: 'astro', category: 'Framework', icon: 'A' },
  { name: 'nodejs', category: 'Runtime', icon: 'JS' },
  { name: 'postgres', category: 'Database', icon: 'PG' },
  { name: 'supabase', category: 'Backend', icon: 'SB' },
  { name: 'python', category: 'Language', icon: 'PY' },
  { name: 'fastapi', category: 'Framework', icon: 'FA' },
  { name: 'django', category: 'Framework', icon: 'DJ' },
  // Add more tech items as needed
];

const TechStackSearch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => 
    Array.from(new Set(techStack.map(item => item.category))),
    []
  );

  const filteredTechStack = useMemo(() => 
    techStack.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedCategory || item.category === selectedCategory)
    ),
    [search, selectedCategory]
  );

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
      <input
        type="text"
        placeholder="Search technologies..."
        className="w-full p-2 mb-4 bg-[var(--bg-dark)] text-white rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-2 py-1 rounded ${!selectedCategory ? 'bg-[var(--bg-dark)] text-white' : 'bg-transparent text-[var(--text-secondary)]'}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`px-2 py-1 rounded ${selectedCategory === category ? 'bg-[var(--bg-dark)] text-white' : 'bg-transparent text-[var(--text-secondary)]'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTechStack.map(item => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-[var(--bg-dark)] rounded-full mb-2">
              {item.icon}
            </div>
            <span className="text-sm text-center">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackSearch;
