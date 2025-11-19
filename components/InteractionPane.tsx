import React from 'react';
import { SimulationStatus } from '../types';

interface InteractionData {
    round: number;
    sniperPrompt: string;
    targetResponse: string | null;
}

interface InteractionPaneProps {
  interaction: InteractionData | null;
  status: SimulationStatus;
}

const InteractionPane: React.FC<InteractionPaneProps> = ({ interaction, status }) => {
  const renderContent = () => {
    if (status === 'Idle' || !interaction) {
        return <div className="text-center text-gray-400">Simulation is idle. Press Start to begin.</div>;
    }

    return (
        <div className="space-y-4 w-full">
            <div>
                <h3 className="font-bold text-proto-red text-lg mb-2">SNIPER PROMPT (ROUND {interaction.round})</h3>
                <div 
                  key={`prompt-${interaction.round}`}
                  className="bg-proto-dark p-3 rounded-md text-sm text-gray-200 font-mono whitespace-pre-wrap min-h-[4rem] max-h-48 overflow-y-auto border border-gray-700 custom-scrollbar animate-fade-in"
                >
                    {interaction.sniperPrompt}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-proto-red text-lg mb-2">TARGET RESPONSE</h3>
                <div 
                  key={`response-${interaction.round}`}
                  className={`bg-proto-dark p-3 rounded-md text-sm font-mono whitespace-pre-wrap min-h-[4rem] max-h-48 overflow-y-auto border transition-colors duration-500 custom-scrollbar ${
                    interaction.targetResponse 
                    ? 'text-green-300 border-gray-700 animate-fade-in' 
                    : 'text-gray-600 border-gray-800'
                  }`}
                >
                    {interaction.targetResponse || '...'}
                </div>
            </div>
        </div>
    );
  };
  
  return (
    <div className="bg-proto-dark border border-proto-gray rounded-lg p-4 h-full flex flex-col shadow-md">
        <h2 className="text-xl font-orbitron font-bold mb-4 text-center">AGENT INTERACTION</h2>
        <div className="flex-grow flex items-center justify-center">
            {renderContent()}
        </div>
    </div>
  );
};

export default InteractionPane;