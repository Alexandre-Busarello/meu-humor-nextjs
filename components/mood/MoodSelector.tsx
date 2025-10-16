import React from 'react';
import { getMoodEmoji, getMoodText } from '@/lib/utils/moodUtils';

interface MoodSelectorProps {
  selectedMood: number;
  onSelect: (score: number) => void;
  showLabel?: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect, showLabel = true }) => {
  return (
    <div className="w-full">
      {showLabel && (
        <h3 className="text-lg font-medium text-neutral-700 mb-3">Como você está se sentindo?</h3>
      )}
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-neutral-500">Muito mal</span>
        <span className="text-sm text-neutral-500">Excelente</span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        {[0, 1, 2, 3, 4, 5].map((score) => (
          <button
            type="button"
            key={score}
            className={`emoji-btn ${selectedMood === score ? 'emoji-btn-selected' : ''}`}
            onClick={() => onSelect(score)}
            aria-label={`Humor: ${getMoodText(score)}`}
          >
            {getMoodEmoji(score)}
          </button>
        ))}
      </div>
      
      {selectedMood !== -1 && (
        <p className="text-center text-neutral-600 font-medium">
          {getMoodText(selectedMood)}
        </p>
      )}
    </div>
  );
};

export default MoodSelector;

