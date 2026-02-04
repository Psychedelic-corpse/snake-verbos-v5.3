import React from 'react';
import { CHARACTERS } from '../data/gameConfig';
import { CharacterId } from '../types';
import { motion } from 'framer-motion';

interface Props {
  onSelect: (id: CharacterId) => void;
}

export const CharacterSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">
        Spanish Verb 3D
      </h1>
      <p className="text-slate-400 mb-10">Select your adventurer</p>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        {CHARACTERS.map((char) => (
          <motion.button
            key={char.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(char.id)}
            className="flex-1 bg-slate-800 border-2 border-slate-700 hover:border-white rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors relative overflow-hidden group"
          >
            <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity`} style={{ backgroundColor: char.color }} />
            
            <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl shadow-xl"
                style={{ backgroundColor: char.color }}
            >
                {char.name[0]}
            </div>

            <div className="z-10">
                <h3 className="text-xl font-bold text-white">{char.name}</h3>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};