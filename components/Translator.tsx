import React, { useState, useRef } from 'react';
import { TranslationDirection, TranslationResponse } from '../types';
import { translateText, generateSpeech, playAudioBuffer } from '../services/geminiService';
import { ArrowPathIcon, SpeakerWaveIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

const Translator: React.FC = () => {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<TranslationDirection>(TranslationDirection.CN_TO_UNI);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await translateText(input, direction);
      setResult(data);
    } catch (err) {
      setError("翻译失败，请检查 API Key 或网络连接。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async () => {
    if (!result?.translated) return;
    setIsSpeaking(true);
    try {
      // If translating FROM Universalia, we read the original input.
      // If translating TO Universalia, we read the result.
      const textToSpeak = direction === TranslationDirection.CN_TO_UNI ? result.translated : input;
      
      const buffer = await generateSpeech(textToSpeak);
      playAudioBuffer(buffer);
    } catch (err) {
      console.error("Speech failed", err);
    } finally {
      setTimeout(() => setIsSpeaking(false), 2000); 
    }
  };

  const handleSwap = () => {
    setDirection(prev => prev === TranslationDirection.CN_TO_UNI ? TranslationDirection.UNI_TO_CN : TranslationDirection.CN_TO_UNI);
    setInput('');
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <span className={`flex-1 text-center sm:text-left font-mono ${direction === TranslationDirection.CN_TO_UNI ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
            中文 (Chinese)
          </span>
          <button 
            onClick={handleSwap}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-transform hover:rotate-180"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <span className={`flex-1 text-center sm:text-right font-mono ${direction === TranslationDirection.UNI_TO_CN ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
            Universalia
          </span>
        </div>

        <button
          onClick={handleTranslate}
          disabled={isLoading || !input.trim()}
          className={`w-full sm:w-auto px-8 py-2.5 rounded-lg font-semibold tracking-wide transition-all ${
            isLoading || !input.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
          }`}
        >
          {isLoading ? '正在翻译...' : '开始翻译'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col h-64 md:h-80 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700 text-xs font-mono text-slate-400 uppercase tracking-widest">
            {direction === TranslationDirection.CN_TO_UNI ? '输入 (Source)' : 'Universalia 输入'}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={direction === TranslationDirection.CN_TO_UNI ? "请输入中文内容..." : "请输入 Universalia 文本..."}
            className="flex-1 w-full bg-transparent p-4 text-slate-100 placeholder-slate-600 resize-none focus:outline-none text-lg font-light leading-relaxed"
          />
        </div>

        {/* Output Area */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col h-64 md:h-80 relative">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
              结果 (Result)
            </span>
            {result && (
              <div className="flex space-x-2">
                 {/* Only show TTS if the result is in Universalia (CN -> UNI), or if we want to read the input Universalia (UNI -> CN). 
                     Here we enable TTS for the Universalia part primarily. */}
                 {(direction === TranslationDirection.CN_TO_UNI) && (
                    <button 
                      onClick={handleSpeech}
                      disabled={isSpeaking}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                      title="朗读 Universalia"
                    >
                      {isSpeaking ? <SpeakerWaveIcon className="w-5 h-5 animate-pulse text-indigo-400"/> : <SpeakerWaveIcon className="w-5 h-5" />}
                    </button>
                 )}
                <button className="text-slate-400 hover:text-indigo-400 transition-colors" title="复制文本">
                  <DocumentDuplicateIcon className="w-5 h-5" onClick={() => navigator.clipboard.writeText(result.translated)} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : result ? (
              <div className="space-y-4">
                <div>
                    <h2 className="text-2xl text-white font-serif mb-1">{result.translated}</h2>
                    {direction === TranslationDirection.CN_TO_UNI && (
                         <p className="font-mono text-indigo-300 text-sm opacity-80">/{result.ipa}/</p>
                    )}
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-700/50">
                   <h3 className="text-xs font-bold text-slate-500 uppercase">词法分析 (Morphology)</h3>
                   <div className="flex flex-wrap gap-2">
                     {result.morphologyBreakdown.map((item, idx) => (
                       <span key={idx} className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded border border-slate-600">
                         {item}
                       </span>
                     ))}
                   </div>
                </div>

                 <div className="space-y-1 pt-2">
                   <h3 className="text-xs font-bold text-slate-500 uppercase">语法备注 (Grammar Notes)</h3>
                   <p className="text-sm text-slate-400 italic">
                     {result.grammarNotes}
                   </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                 <div className="w-16 h-1 bg-slate-700 rounded-full mb-2 opacity-20"></div>
                 <div className="w-10 h-1 bg-slate-700 rounded-full opacity-20"></div>
                 <p className="mt-4 text-sm font-mono">等待输入...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;