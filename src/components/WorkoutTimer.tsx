"use client";

import { PauseIcon, PlayIcon, TimerResetIcon } from "lucide-react";
import React from "react";
import { useWorkoutTimer } from "../hooks/useWorkoutTimer";
import type { WorkoutConfig } from "../lib/workoutConfig";
import { formatTime } from "../lib/workoutConfig";
import ExerciseCard from "./ExerciseCard";
import TimelineMarker from "./TimelineMarker";
import { Button } from "./ui/button";

interface WorkoutTimerProps {
	config: WorkoutConfig;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ config }) => {
	const {
		currentTime,
		isRunning,
		currentExercise,
		currentSeries,
		isResting,
		completedSeries,
		isFinished,
		progressPercentage,
		statusText,
		nextUpText,
		startTimer,
		pauseTimer,
		resetTimer,
	} = useWorkoutTimer(config);

	return (
		<div className='max-w-4xl mx-auto px-4  min-h-screen py-4'>
			<div className='rounded-lg shadow-lg p-6 mb-6 border border-gray-700'>
				<div className='text-4xl md:text-5xl text-center my-5 font-bold'>
					{formatTime(currentTime)}
				</div>

				<div className='flex justify-center gap-4 mb-5'>
					<Button
						onClick={startTimer}
						disabled={isRunning || isFinished}
						className={`py-2 px-4 md:py-3 md:px-6 rounded bg-emerald-600 text-base md:text-lg transition hover:bg-emerald-500 ${
							isRunning || isFinished ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						<PlayIcon />
					</Button>
					<Button
						onClick={pauseTimer}
						disabled={!isRunning}
						className={`py-2 px-4 md:py-3 md:px-6 rounded bg-amber-600 text-base md:text-lg transition hover:bg-amber-500 ${
							!isRunning ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						<PauseIcon />
					</Button>
					<Button
						onClick={resetTimer}
						className='py-2 px-4 md:py-3 md:px-6 rounded bg-rose-600 text-base md:text-lg transition hover:bg-rose-500'
					>
						<TimerResetIcon />
					</Button>
				</div>

				<div className='text-xl text-center font-bold '>{statusText}</div>
				<div className='text-base text-center  mt-2'>{nextUpText}</div>

				<TimelineMarker
					exercises={config.exercises}
					seriesPerExercise={config.seriesPerExercise}
					progressPercentage={progressPercentage}
					isResting={isResting}
					remainingTime={
						isResting
							? config.restDuration -
							  ((currentTime % (config.seriesDuration + config.restDuration)) -
									config.seriesDuration)
							: currentExercise < config.totalExercises &&
							  currentSeries < config.seriesPerExercise
							? config.seriesDuration -
							  (currentTime % (config.seriesDuration + config.restDuration))
							: 0
					}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8'>
				{config.exercises.map((exercise, i) => (
					<ExerciseCard
						key={i}
						title={exercise}
						seriesCount={config.seriesPerExercise}
						isActive={currentExercise === i}
						completedSeries={completedSeries[i]}
						currentSeries={currentSeries}
						isResting={isResting}
						seriesDuration={config.seriesDuration}
						restDuration={config.restDuration}
						currentTime={currentTime}
					/>
				))}
			</div>
		</div>
	);
};

export default WorkoutTimer;
