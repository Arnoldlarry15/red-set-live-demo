
import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback } from 'react';
import { SimulationSettings, SimulationStatus, LogEntry } from './types';
import { TARGET_APIS, ATTACK_VECTORS, MAX_ROUNDS } from './constants';
import { generateRoundData } from './services/simulationService';
import Header from './components/Header';
import Controls from './components/Controls';
import StatusDisplay from './components/StatusDisplay';
import InteractionPane from './components/InteractionPane';
import SpotterLog from './components/SpotterLog';
import Footer from './components/Footer';

type State = {
  status: SimulationStatus;
  log: LogEntry[];
  currentRound: number;
  estimatedCost: number;
};

type Action =
  | { type: 'START_SIMULATION' }
  | { type: 'PAUSE_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'PROCESS_ROUND'; payload: LogEntry }
  | { type: 'RESET' };

const initialState: State = {
  status: 'Idle',
  log: [],
  currentRound: 0,
  estimatedCost: 0,
};

const initialSettings: SimulationSettings = {
  targetAPI: TARGET_APIS[0],
  attackVector: ATTACK_VECTORS[0],
  totalRounds: 10,
};

function simulationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_SIMULATION':
      return { ...state, status: 'Running' };
    case 'PAUSE_SIMULATION':
      return { ...state, status: 'Paused' };
    case 'STOP_SIMULATION':
      return { ...state, status: 'Completed' };
    case 'PROCESS_ROUND':
      const newLog = [action.payload, ...state.log]; // Prepend for efficiency
      const perRoundCost = 0.0015; // More realistic simulated cost
      return {
        ...state,
        log: newLog,
        currentRound: action.payload.round,
        estimatedCost: state.estimatedCost + perRoundCost + (Math.random() * 0.0005),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

type RoundPhase = 'IDLE' | 'SNIPER' | 'TARGET' | 'SPOTTER';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SimulationSettings>(initialSettings);

  const [state, dispatch] = useReducer(simulationReducer, initialState);
  const [roundPhase, setRoundPhase] = useState<RoundPhase>('IDLE');
  const [currentRoundData, setCurrentRoundData] = useState<LogEntry | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const successRoundRef = useRef<number | null>(null);

  const handleStop = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (state.status !== 'Completed' && state.status !== 'Idle') {
      dispatch({ type: 'STOP_SIMULATION' });
    }
  }, [state.status]);

  const handleStart = () => {
    if (state.status === 'Running') return;
    if (state.status === 'Completed' || state.status === 'Idle') {
      dispatch({ type: 'RESET' });
      // ~80% chance to have a success round
      if (Math.random() < 0.8) {
        // Success occurs in the last 30% of rounds
        const minRound = Math.ceil(settings.totalRounds * 0.7);
        const maxRound = settings.totalRounds;
        successRoundRef.current = Math.floor(Math.random() * (maxRound - minRound + 1)) + minRound;
      } else {
        successRoundRef.current = null; // No success this run
      }
    }
    dispatch({ type: 'START_SIMULATION' });
  };

  const handlePause = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    dispatch({ type: 'PAUSE_SIMULATION' });
  };

  const handleReset = () => {
    handleStop();
    successRoundRef.current = null;
    dispatch({ type: 'RESET' });
    setSettings(initialSettings);
  };

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (state.status !== 'Running') {
      if (roundPhase !== 'IDLE') setRoundPhase('IDLE');
      if (currentRoundData) setCurrentRoundData(null);
      return;
    }

    if (state.currentRound >= settings.totalRounds) {
      handleStop();
      return;
    }

    if (roundPhase === 'IDLE') {
      const isSuccessRound = state.currentRound + 1 === successRoundRef.current;
      const newRoundData = generateRoundData(state.currentRound, settings, isSuccessRound);
      setCurrentRoundData(newRoundData);
      setRoundPhase('SNIPER');
    } else if (roundPhase === 'SNIPER') {
      timeoutRef.current = window.setTimeout(() => setRoundPhase('TARGET'), 3000);
    } else if (roundPhase === 'TARGET') {
      timeoutRef.current = window.setTimeout(() => setRoundPhase('SPOTTER'), 2000);
    } else if (roundPhase === 'SPOTTER') {
      if (currentRoundData && state.log[0]?.round !== currentRoundData.round) {
        dispatch({ type: 'PROCESS_ROUND', payload: currentRoundData });
      }
      
      const isSuccess = currentRoundData?.round === successRoundRef.current;

      timeoutRef.current = window.setTimeout(() => {
        if (isSuccess) {
          handleStop();
        } else {
          setCurrentRoundData(null);
          setRoundPhase('IDLE');
        }
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [state.status, state.currentRound, roundPhase, settings, currentRoundData, handleStop]);

  const interactionData = useMemo(() => {
    if (state.status === 'Running' && currentRoundData) {
        return {
            round: currentRoundData.round,
            sniperPrompt: currentRoundData.sniperPrompt,
            targetResponse: (roundPhase === 'TARGET' || roundPhase === 'SPOTTER') ? currentRoundData.targetResponse : null,
        };
    }
    if (state.log.length > 0) {
        const lastEntry = state.log[0]; // Get the newest entry from the beginning of the array
        return {
            round: lastEntry.round,
            sniperPrompt: lastEntry.sniperPrompt,
            targetResponse: lastEntry.targetResponse,
        };
    }
    return null;
  }, [state.status, state.log, currentRoundData, roundPhase]);

  return (
    <div className="min-h-screen flex flex-col bg-proto-darker">
      <Header />
      <main className="flex-grow flex flex-col p-4 gap-4 min-h-0">
        {/* Top Section: Controls & Status */}
        <div className="flex-shrink-0 flex flex-col gap-4">
          <Controls
            settings={settings}
            setSettings={setSettings}
            status={state.status}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleReset}
            maxRounds={MAX_ROUNDS}
          />
          <StatusDisplay
            status={state.status}
            currentRound={state.currentRound}
            totalRounds={settings.totalRounds}
            estimatedCost={state.estimatedCost}
          />
        </div>
        
        {/* Bottom Section: Panes */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          <div className="lg:w-2/3 flex flex-col">
            <InteractionPane interaction={interactionData} status={state.status} />
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <SpotterLog log={state.log} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
