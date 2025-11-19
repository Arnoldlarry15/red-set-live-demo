
import React from 'react';
import { SimulationSettings, SimulationStatus } from '../types';
import { TARGET_APIS, ATTACK_VECTORS } from '../constants';

interface ControlsProps {
  settings: SimulationSettings;
  setSettings: React.Dispatch<React.SetStateAction<SimulationSettings>>;
  status: SimulationStatus;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  maxRounds: number;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-proto-dark ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ settings, setSettings, status, onStart, onPause, onStop, maxRounds }) => {
    const isRunning = status === 'Running';
    const isPaused = status === 'Paused';

  return (
    <div className="bg-proto-dark border border-proto-gray rounded-lg p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Column 1: Target & Vector */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="target-api" className="block text-sm font-medium text-gray-300 mb-1">Target API</label>
                    <select
                        id="target-api"
                        value={settings.targetAPI}
                        onChange={(e) => setSettings(s => ({...s, targetAPI: e.target.value as any}))}
                        disabled={isRunning || isPaused}
                        className="w-full bg-proto-gray border border-gray-600 text-white rounded-md p-2 focus:ring-proto-red focus:border-proto-red"
                    >
                        {TARGET_APIS.map(api => <option key={api}>{api}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="attack-vector" className="block text-sm font-medium text-gray-300 mb-1">Attack Vector</label>
                    <select
                        id="attack-vector"
                        value={settings.attackVector}
                        onChange={(e) => setSettings(s => ({...s, attackVector: e.target.value as any}))}
                        disabled={isRunning || isPaused}
                        className="w-full bg-proto-gray border border-gray-600 text-white rounded-md p-2 focus:ring-proto-red focus:border-proto-red"
                    >
                        {ATTACK_VECTORS.map(vector => <option key={vector}>{vector}</option>)}
                    </select>
                </div>
            </div>

            {/* Column 2: Rounds */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="rounds" className="block text-sm font-medium text-gray-300 mb-1">Number of Rounds: <span className="font-bold text-proto-gold">{settings.totalRounds}</span></label>
                    <input
                        type="range"
                        id="rounds"
                        min="1"
                        max={maxRounds}
                        value={settings.totalRounds}
                        onChange={(e) => setSettings(s => ({...s, totalRounds: parseInt(e.target.value, 10)}))}
                        disabled={isRunning || isPaused}
                        className="w-full h-2 bg-proto-gray rounded-lg appearance-none cursor-pointer accent-proto-red"
                    />
                </div>
            </div>

            {/* Column 3: Action Buttons */}
            <div className="flex items-center justify-center md:col-span-2 lg:col-span-1 space-x-2">
                <Button
                    onClick={onStart}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>{isPaused ? 'Resume' : 'Start'}</span>
                </Button>
                <Button
                    onClick={onPause}
                    disabled={!isRunning}
                    className="bg-proto-red hover:bg-proto-red-dark text-white focus:ring-proto-red"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                </Button>
                <Button
                    onClick={onStop}
                    disabled={status === 'Idle'}
                    className="bg-proto-gold hover:bg-amber-600 text-proto-dark focus:ring-proto-gold"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
                    </svg>
                    <span>Reset</span>
                </Button>
            </div>
        </div>
    </div>
  );
};

export default Controls;
