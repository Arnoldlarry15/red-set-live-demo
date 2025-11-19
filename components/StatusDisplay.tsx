
import React from 'react';
import { SimulationStatus } from '../types';

interface StatusDisplayProps {
  status: SimulationStatus;
  currentRound: number;
  totalRounds: number;
  estimatedCost: number;
}

const StatusPill: React.FC<{ status: SimulationStatus }> = ({ status }) => {
    const statusStyles: Record<SimulationStatus, string> = {
        Idle: 'bg-gray-500',
        Running: 'bg-green-600 animate-pulse',
        Paused: 'bg-amber-500',
        Completed: 'bg-blue-600',
        Error: 'bg-red-700',
    };
    return (
        <div className="flex items-center space-x-2">
            <span className={`h-3 w-3 rounded-full ${statusStyles[status]}`}></span>
            <span className="font-bold text-lg">{status}</span>
        </div>
    );
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, currentRound, totalRounds, estimatedCost }) => {
  return (
    <div className="bg-proto-dark border border-proto-gray rounded-lg p-4 shadow-md grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-gray-400">Status</span>
            <StatusPill status={status} />
        </div>
        <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-gray-400">Round</span>
            <p className="font-orbitron text-2xl font-bold">
                <span className={status === 'Running' ? 'text-proto-gold' : 'text-white'}>{currentRound}</span>
                <span className="text-gray-500 text-xl"> / {totalRounds}</span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center col-span-2 md:col-span-1">
            <span className="text-sm text-gray-400">Estimated Cost (sim)</span>
            <p className="font-orbitron text-2xl font-bold text-green-400">
                ${estimatedCost.toFixed(4)}
            </p>
        </div>
    </div>
  );
};

export default StatusDisplay;
