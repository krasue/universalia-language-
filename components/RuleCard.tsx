import React from 'react';
import { UniversaliaRule } from '../types';

interface RuleCardProps {
  rule: UniversaliaRule;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-indigo-500 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-indigo-400 font-mono text-sm uppercase tracking-wider">{rule.category}</h4>
      </div>
      <h3 className="text-slate-100 font-semibold mb-2">{rule.title}</h3>
      <p className="text-slate-400 text-sm mb-3 leading-relaxed">
        {rule.description}
      </p>
      <div className="bg-slate-900/50 rounded px-3 py-2 border-l-2 border-indigo-500">
        <span className="text-xs text-slate-500 block mb-1">Example</span>
        <code className="text-sm font-mono text-indigo-300">{rule.example}</code>
      </div>
    </div>
  );
};
