
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  X, 
  ChevronRight,
  ChevronLeft,
  Settings,
  Hash,
  MessageSquare,
  Calculator as CalcIcon
} from 'lucide-react';
import { STANDARD_BUTTONS, SCIENTIFIC_BUTTONS } from './constants';
import { Calculation, CalculatorMode, ButtonConfig } from './types';
import { solveMathProblem } from './services/gemini';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('prime-calc-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('prime-calc-history', JSON.stringify(history));
  }, [history]);

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleNegate = () => {
    if (display === '0') return;
    setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
  };

  const evaluate = useCallback((exp: string) => {
    try {
      const sanitized = exp
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(');

      const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

      const resultValue = new Function(`
        const factorial = ${factorial.toString()};
        return ${sanitized};
      `)();

      const finalResult = Number.isInteger(resultValue) 
        ? resultValue.toString() 
        : parseFloat(resultValue.toFixed(8)).toString();

      const newCalc: Calculation = {
        id: Date.now().toString(),
        expression: exp,
        result: finalResult,
        timestamp: Date.now()
      };

      setHistory(prev => [newCalc, ...prev].slice(0, 100));
      setDisplay(finalResult);
      setExpression('');
    } catch (err) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1200);
    }
  }, []);

  const handleButtonClick = (btn: ButtonConfig) => {
    if (btn.value === 'clear') return handleClear();
    if (btn.value === 'negate') return handleNegate();
    if (btn.value === '=') {
      if (!expression && display === '0') return;
      evaluate(expression + display);
      return;
    }

    if (btn.type === 'operator') {
      setExpression(prev => prev + display + ' ' + btn.value + ' ');
      setDisplay('0');
    } else if (btn.type === 'scientific') {
      setExpression(prev => prev + btn.value);
      setDisplay('0');
    } else {
      setDisplay(prev => (prev === '0' || prev === 'Error') ? btn.value : prev + btn.value);
    }
  };

  const handleQuerySolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setIsQuerying(true);
    try {
      const data = await solveMathProblem(queryInput);
      const newCalc: Calculation = {
        id: Date.now().toString(),
        expression: data.expression,
        result: data.result,
        timestamp: Date.now(),
        isAi: true
      };
      setHistory(prev => [newCalc, ...prev]);
      setDisplay(data.result);
      setQueryInput('');
      setMode('standard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] p-4 font-sans text-gray-200">
      
      {/* Main Container: Mimics a professional desktop app or high-end tablet interface */}
      <div className="w-full max-w-[900px] flex flex-col md:flex-row bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a] calc-shadow h-[650px]">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-16 bg-[#141414] border-r border-[#2a2a2a] flex flex-col items-center py-6 gap-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black mb-4">
            <Hash className="w-6 h-6" />
          </div>
          
          <nav className="flex md:flex-col gap-4">
            <button 
              onClick={() => { setMode('standard'); setShowHistory(false); }}
              className={`p-3 rounded-xl transition-colors ${mode === 'standard' && !showHistory ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <CalcIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setMode('scientific'); setShowHistory(false); }}
              className={`p-3 rounded-xl transition-colors ${mode === 'scientific' && !showHistory ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setMode('ai'); setShowHistory(false); }}
              className={`p-3 rounded-xl transition-colors ${mode === 'ai' && !showHistory ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl transition-colors ${showHistory ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#181818]">
          
          {/* Main Display / History Panel Toggle */}
          <div className={`flex-1 flex flex-col ${showHistory ? 'hidden' : 'flex'}`}>
            
            {/* Header */}
            <header className="px-8 pt-8 flex items-center justify-between">
              <h1 className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
                {mode === 'ai' ? 'Query Solver' : mode.toUpperCase() + ' MODE'}
              </h1>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </header>

            {/* Readout */}
            <div className="px-8 py-6 text-right flex flex-col justify-end min-h-[160px] border-b border-[#252525]">
              <div className="text-gray-600 font-mono text-lg overflow-hidden whitespace-nowrap">
                {expression || ' '}
              </div>
              <div className="text-6xl font-medium font-mono tracking-tight text-white mt-2">
                {display}
              </div>
            </div>

            {/* Input Section */}
            <div className="flex-1 p-6 flex flex-col">
              {mode === 'ai' ? (
                <div className="h-full flex flex-col justify-center max-w-md mx-auto w-full">
                  <h2 className="text-xl font-medium mb-4">Input mathematical query</h2>
                  <form onSubmit={handleQuerySolve} className="space-y-4">
                    <textarea
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      placeholder="e.g. Solve 2x + 5 = 15 or What is 12% of 450?"
                      className="w-full h-32 bg-[#202020] border border-[#333] rounded-xl p-4 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-600 resize-none font-mono text-sm"
                    />
                    <button
                      type="submit"
                      disabled={isQuerying || !queryInput.trim()}
                      className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isQuerying ? "Processing..." : "Solve Equation"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 h-full">
                  {/* Scientific Overlay if needed or just grid adjustment */}
                  <div className="col-span-4 grid grid-cols-4 gap-2">
                    {mode === 'scientific' && SCIENTIFIC_BUTTONS.map((btn, idx) => (
                      <button
                        key={`sci-${idx}`}
                        onClick={() => handleButtonClick(btn)}
                        className="h-10 rounded-lg bg-[#252525] hover:bg-[#333] text-gray-400 font-medium text-xs transition-colors btn-shadow"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  
                  {STANDARD_BUTTONS.map((btn, idx) => (
                    <button
                      key={`std-${idx}`}
                      onClick={() => handleButtonClick(btn)}
                      style={{ gridColumn: btn.span ? `span ${btn.span}` : 'auto' }}
                      className={`
                        flex items-center justify-center rounded-xl text-lg font-medium transition-all btn-shadow
                        ${btn.variant === 'primary' ? 'bg-white text-black hover:bg-gray-200' : ''}
                        ${btn.variant === 'accent' ? 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]' : ''}
                        ${btn.variant === 'secondary' ? 'bg-[#202020] text-gray-400 hover:bg-[#2a2a2a]' : ''}
                        ${btn.variant === 'danger' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : ''}
                        ${!btn.variant ? 'bg-[#222] text-gray-200 hover:bg-[#282828]' : ''}
                        ${mode === 'scientific' ? 'h-12' : 'h-16'}
                      `}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History Panel (Full content overlay) */}
          <div className={`absolute inset-0 bg-[#181818] z-20 flex flex-col transition-transform duration-300 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
              <button onClick={() => setShowHistory(false)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-widest">History</span>
              </button>
              {history.length > 0 && (
                <button onClick={() => setHistory([])} className="text-red-500/50 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700">
                  <HistoryIcon className="w-8 h-8 mb-4 opacity-20" />
                  <p className="text-sm">No recent calculations</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="border-b border-[#252525] pb-4 last:border-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-gray-600 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      {item.isAi && <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">RESOLVED</span>}
                    </div>
                    <div className="text-gray-500 font-mono text-sm truncate">{item.expression}</div>
                    <div className="text-2xl font-mono text-white mt-1">= {item.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Discreet Footer */}
      <div className="fixed bottom-6 text-[10px] text-gray-700 flex gap-4 uppercase tracking-[2px]">
        <span>PrimeCalc Engine</span>
        <span>Build 0824</span>
        <span>Local Execution</span>
      </div>
    </div>
  );
};

export default App;
