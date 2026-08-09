import React from 'react';
import { Search, Network, Columns } from 'lucide-react';
import { WorkflowStep, WorkflowStepId } from '../../types/research';

interface WorkflowTrackerProps {
  activeStep: WorkflowStepId;
  onSelectStep: (stepId: WorkflowStepId) => void;
}

const STEPS: WorkflowStep[] = [
  { id: 'discover', name: '1. Discover Literature', description: 'Semantic retrieval', iconName: 'Search' },
  { id: 'graph', name: '2. Knowledge Graph', description: 'Interactive network', iconName: 'Network' },
  { id: 'compare', name: '3. Compare & Synthesize', description: 'Side-by-side analysis', iconName: 'Columns' },
];

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  activeStep,
  onSelectStep
}) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#e7e5e0]">
      {STEPS.map((step) => {
        const isActive = activeStep === step.id;
        return (
          <button
            key={step.id}
            onClick={() => onSelectStep(step.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {step.id === 'discover' && <Search size={14} />}
            {step.id === 'graph' && <Network size={14} />}
            {step.id === 'compare' && <Columns size={14} />}
            <span>{step.name}</span>
          </button>
        );
      })}
    </div>
  );
};
