'use client';

import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { usePlayback, PlaybackSpeed } from '@/hooks/usePlayback';
import type { AlgoTrace, Structure } from '@/types/visualization';
import {
  ArrayView,
  StringView,
  StackView,
  HashMapView,
  LinkedListView,
  TreeView,
  GraphView,
  VariableView,
  MatrixView,
} from './structures';
import { cn } from '@/lib/utils';

interface VisualizerProps {
  trace: AlgoTrace;
}

export function Visualizer({ trace }: VisualizerProps) {
  const {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    goToStep,
    nextStep,
    prevStep,
    togglePlayPause,
    reset,
    isFirstStep,
    isLastStep,
    progress,
  } = usePlayback({ totalSteps: trace.steps.length });

  const step = trace.steps[currentStep];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate" title={trace.title}>
            {trace.title}
          </CardTitle>
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
            Step {currentStep + 1} / {trace.steps.length}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            disabled={isFirstStep && !isPlaying}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={prevStep}
            disabled={isFirstStep}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextStep}
            disabled={isLastStep}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 ml-4">
            {([0.5, 1, 2] as PlaybackSpeed[]).map((s) => (
              <Button
                key={s}
                variant={speed === s ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSpeed(s)}
                className="text-xs px-2"
              >
                {s}x
              </Button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <Slider
            value={[currentStep]}
            min={0}
            max={trace.steps.length - 1}
            step={1}
            onValueChange={([v]) => goToStep(v)}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            {trace.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i <= currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-6">
            {step?.structures.map((structure) => (
              <div key={structure.id} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {structure.label}
                </div>
                <StructureRenderer structure={structure} />
              </div>
            ))}
          </div>
        </div>

        {/* Step Description */}
        {step?.description && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{step.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StructureRenderer({ structure }: { structure: Structure }) {
  switch (structure.type) {
    case 'array':
      return <ArrayView structure={structure} />;
    case 'string':
      return <StringView structure={structure} />;
    case 'stack':
    case 'queue':
      return <StackView structure={structure} />;
    case 'hash-map':
      return <HashMapView structure={structure} />;
    case 'linked-list':
      return <LinkedListView structure={structure} />;
    case 'tree':
    case 'heap':
      return <TreeView structure={structure} />;
    case 'graph':
      return <GraphView structure={structure} />;
    case 'variable':
      return <VariableView structure={structure} />;
    case 'matrix':
      return <MatrixView structure={structure} />;
    default:
      return (
        <div className="text-sm text-muted-foreground italic">
          Unsupported structure type: {structure.type}
        </div>
      );
  }
}
