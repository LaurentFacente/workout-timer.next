"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WorkoutConfig, calculateTotalDuration } from "../lib/workoutConfig";

interface WorkoutTimerState {
	currentTime: number;
	isRunning: boolean;
	currentExercise: number;
	currentSeries: number;
	isResting: boolean;
	completedSeries: boolean[][];
	isFinished: boolean;
}

export function useWorkoutTimer(config: WorkoutConfig) {
	const totalDuration = calculateTotalDuration(config);
	const [state, setState] = useState<WorkoutTimerState>({
		currentTime: 0,
		isRunning: false,
		currentExercise: 0,
		currentSeries: 0,
		isResting: false,
		completedSeries: Array(config.totalExercises)
			.fill(0)
			.map(() => Array(config.seriesPerExercise).fill(false)),
		isFinished: false,
	});

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const startTimer = useCallback(() => {
		if (state.isRunning) return;

		setState((prev) => ({ ...prev, isRunning: true }));

		timerRef.current = setInterval(() => {
			setState((prev) => {
				const currentTime = prev.currentTime + 1;

				// Calcul de la position actuelle dans la séance
				const totalTimePerSet = config.seriesDuration + config.restDuration;
				const totalSets = config.totalExercises * config.seriesPerExercise;
				const currentSet = Math.floor(currentTime / totalTimePerSet);

				if (currentSet >= totalSets) {
					// Séance terminée
					if (timerRef.current) clearInterval(timerRef.current);
					return {
						...prev,
						currentTime,
						isRunning: false,
						isFinished: true,
					};
				}

				const prevExercise = prev.currentExercise;
				const prevSeries = prev.currentSeries;
				const prevIsResting = prev.isResting;

				const currentExercise = Math.floor(
					currentSet / config.seriesPerExercise
				);
				const currentSeries = currentSet % config.seriesPerExercise;

				// Déterminer si on est en phase de repos ou d'exercice
				const timeInCurrentSet = currentTime % totalTimePerSet;
				const isResting = timeInCurrentSet >= config.seriesDuration;

				// Copier le tableau des séries complétées
				const completedSeries = [...prev.completedSeries];

				// Marquer la série comme complétée si on vient de passer de l'exercice au repos
				if (
					!prevIsResting &&
					isResting &&
					prevExercise === currentExercise &&
					prevSeries === currentSeries
				) {
					completedSeries[currentExercise][currentSeries] = true;
				}

				// Si on vient de passer à une nouvelle série/exercice, marquer la précédente comme complétée
				if (prevExercise !== currentExercise || prevSeries !== currentSeries) {
					if (
						prevExercise < config.totalExercises &&
						prevSeries < config.seriesPerExercise
					) {
						completedSeries[prevExercise][prevSeries] = true;
					}
				}

				return {
					...prev,
					currentTime,
					currentExercise,
					currentSeries,
					isResting,
					completedSeries,
				};
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [config, state.isRunning]);

	const pauseTimer = useCallback(() => {
		if (!state.isRunning) return;

		if (timerRef.current) clearInterval(timerRef.current);
		setState((prev) => ({ ...prev, isRunning: false }));
	}, [state.isRunning]);

	const resetTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		setState({
			currentTime: 0,
			isRunning: false,
			currentExercise: 0,
			currentSeries: 0,
			isResting: false,
			completedSeries: Array(config.totalExercises)
				.fill(0)
				.map(() => Array(config.seriesPerExercise).fill(false)),
			isFinished: false,
		});
	}, [config.seriesPerExercise, config.totalExercises]);

	// Nettoyage lors du démontage du composant
	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	// Calcul des informations d'état
	const progressPercentage = (state.currentTime / totalDuration) * 100;

	let statusText = "Prêt à commencer";
	let nextUpText = `${config.exercises[0]} - Série 1`;

	if (state.isRunning || state.currentTime > 0) {
		if (state.isFinished) {
			statusText = "Séance terminée!";
			nextUpText = "Félicitations!";
		} else if (state.isResting) {
			const nextExercise =
				state.currentSeries === config.seriesPerExercise - 1
					? state.currentExercise + 1
					: state.currentExercise;
			const nextSeries =
				state.currentSeries === config.seriesPerExercise - 1
					? 0
					: state.currentSeries + 1;

			if (nextExercise < config.totalExercises) {
				statusText = `Repos`;
				nextUpText = `Prochain: ${config.exercises[nextExercise]} - Série ${
					nextSeries + 1
				}`;
			} else {
				statusText = `Repos - Dernière série`;
				nextUpText = `Séance terminée après cette série`;
			}
		} else {
			statusText = `${config.exercises[state.currentExercise]} - Série ${
				state.currentSeries + 1
			}`;

			const totalTimePerSet = config.seriesDuration + config.restDuration;
			const timeInCurrentSet = state.currentTime % totalTimePerSet;
			const remainingTime = config.seriesDuration - timeInCurrentSet;

			nextUpText = `En cours: ${remainingTime}s restantes`;
		}
	}

	return {
		currentTime: state.currentTime,
		isRunning: state.isRunning,
		currentExercise: state.currentExercise,
		currentSeries: state.currentSeries,
		isResting: state.isResting,
		completedSeries: state.completedSeries,
		isFinished: state.isFinished,
		progressPercentage,
		statusText,
		nextUpText,
		startTimer,
		pauseTimer,
		resetTimer,
	};
}
