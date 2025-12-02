import React from 'react';
import Translator from './components/Translator';
import { RuleCard } from './components/RuleCard';
import { UNIVERSALIA_RULES } from './constants';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CubeTransparentIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Universalia <span className="font-light text-indigo-400">CLE</span></h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
             <span className="text-xs font-mono text-slate-500">v1.1.0-cn</span>
             <div className="h-4 w-px bg-slate-800"></div>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">System Online</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            先进计算语言学引擎
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            专为 <span className="text-indigo-400 font-semibold">Universalia</span> 人造语言打造的高精度中文神经网络翻译引擎。
            <br/>
            具备严格的音韵学规则遵守与形态合成能力。
          </p>
        </div>

        {/* Translation Engine */}
        <section className="mb-16">
          <Translator />
        </section>

        {/* Rules Grid */}
        <section>
          <div className="flex items-center space-x-4 mb-6">
            <h3 className="text-xl font-bold text-white">核心语言协议 (Core Protocol)</h3>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSALIA_RULES.map((rule, index) => (
              <RuleCard key={index} rule={rule} />
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-800 bg-slate-900 mt-20 py-8">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              技术驱动: Google Gemini Models (Pro & Flash TTS)
            </p>
            <p className="text-slate-600 text-xs mt-2 font-mono">
              Universalia Language Specification ID: UNI-2025-X-CN
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;