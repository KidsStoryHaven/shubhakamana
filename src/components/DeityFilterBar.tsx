import React from 'react';
import { DeityId } from '../types';
import { DEITIES } from '../data/wallpapers';

interface DeityFilterBarProps {
  selectedDeity: DeityId;
  onSelectDeity: (id: DeityId) => void;
}

export const DeityFilterBar: React.FC<DeityFilterBarProps> = ({
  selectedDeity,
  onSelectDeity
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {DEITIES.map(deity => {
          const isSelected = selectedDeity === deity.id;
          return (
            <button
              key={deity.id}
              onClick={() => onSelectDeity(deity.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400/50'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>{deity.icon}</span>
              <span>{deity.nameHi}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
