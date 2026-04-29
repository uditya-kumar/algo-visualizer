import { useState, useCallback, useEffect, useRef } from 'react';

export type PlaybackSpeed = 0.5 | 1 | 2;

interface UsePlaybackOptions {
  totalSteps: number;
  onStepChange?: (step: number) => void;
}

export function usePlayback({ totalSteps, onStepChange }: UsePlaybackOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToStep = useCallback(
    (step: number) => {
      const clampedStep = Math.max(0, Math.min(step, totalSteps - 1));
      setCurrentStep(clampedStep);
      onStepChange?.(clampedStep);
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, totalSteps, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const play = useCallback(() => {
    if (currentStep >= totalSteps - 1) {
      goToStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, totalSteps, goToStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    goToStep(0);
  }, [goToStep]);

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = 1000 / speed;
      intervalRef.current = setInterval(() => {
        nextStep();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, nextStep]);

  // Reset when totalSteps changes (new visualization)
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [totalSteps]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'Home':
          e.preventDefault();
          goToStep(0);
          break;
        case 'End':
          e.preventDefault();
          goToStep(totalSteps - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, prevStep, nextStep, goToStep, totalSteps]);

  return {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    goToStep,
    nextStep,
    prevStep,
    play,
    pause,
    togglePlayPause,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: totalSteps > 1 ? currentStep / (totalSteps - 1) : 0,
  };
}
