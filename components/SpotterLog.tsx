
import React, { useState, useMemo } from 'react';
import { LogEntry } from '../types';

const EffectivenessPill: React.FC<{ effectiveness: "Low" | "Medium" | "High" | "Critical" }> = ({ effectiveness }) => {
    const styles: Record<typeof effectiveness, { pill: string; text: string; label: string }> = {
        Low: { pill: 'bg-green-600/30', text: 'text-green-300', label: 'Low Effectiveness' },
        Medium: { pill: 'bg-amber-500/30', text: 'text-amber-300', label: 'Medium Effectiveness' },
        High: { pill: 'bg-red-600/30', text: 'text-red-400', label: 'High Effectiveness' },
        Critical: { pill: 'bg-red-700/50 animate-pulse', text: 'text-red-300 font-bold tracking-wider', label: 'CRITICAL VULNERABILITY' },
    };
    const style = styles[effectiveness];
    return (
        <div className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${style.pill} ${style.text}`}>
            {style.label}
        </div>
    );
};

const LogItem: React.FC<{ entry: LogEntry }> = ({ entry }) => {
    const isVulnerability = entry.effectiveness === 'Critical' || entry.effectiveness === 'High';
    
    return (
        <div className={`p-3 rounded-lg border-2 transition-colors duration-200 ${isVulnerability ? 'bg-red-900/30 border-proto-red shadow-lg shadow-red-900/30' : 'bg-proto-dark border-proto-gray hover:border-proto-red/50'}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="font-bold text-lg">Round {entry.round}</span>
                    <span className="text-xs text-gray-400 ml-2">{entry.timestamp}</span>
                </div>
                <EffectivenessPill effectiveness={entry.effectiveness} />
            </div>

            <h4 className="font-semibold text-md mb-2 text-gray-100">{entry.summary}</h4>
            
            <div className="text-sm text-gray-300 mb-3 bg-proto-darker p-3 rounded-md border border-gray-700">
                <p className="font-bold text-proto-gold mb-1">Spotter Analysis & Suggestion:</p>
                <p>{entry.suggestion}</p>
            </div>
            
            <div className="flex flex-wrap gap-1">
                {entry.tags.map(tag => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tag === 'Vulnerability' ? 'bg-proto-red-dark text-white font-bold' : 'bg-proto-gray text-gray-300'}`}>{tag}</span>
                ))}
            </div>
        </div>
    );
};


const SpotterLog: React.FC<{ log: LogEntry[] }> = ({ log }) => {
    const [filter, setFilter] = useState('');

    const filteredLog = useMemo(() => {
        if (!filter) return log;
        const lowercasedFilter = filter.toLowerCase();
        return log.filter(entry => 
            entry.summary.toLowerCase().includes(lowercasedFilter) ||
            entry.suggestion.toLowerCase().includes(lowercasedFilter) ||
            entry.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter))
        );
    }, [filter, log]);


    return (
        <div className="bg-proto-dark border border-proto-gray rounded-lg p-4 flex flex-col h-full shadow-md">
            <h2 className="text-xl font-orbitron font-bold mb-2 text-center">SPOTTER LOG</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filter log..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-proto-gray border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-proto-red focus:border-proto-red"
                />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-0 max-h-[30rem] flex flex-col-reverse">
                {filteredLog.length > 0 ? (
                     filteredLog.map(entry => <LogItem key={entry.id} entry={entry} />)
                ) : (
                    <div className="text-center text-gray-500 pt-10">No log entries yet.</div>
                )}
            </div>
        </div>
    );
};

export default SpotterLog;