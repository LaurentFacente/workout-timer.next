// Configuration de la séance d'entraînement
export interface WorkoutConfig {
	totalExercises: number;
	seriesPerExercise: number;
	seriesDuration: number; // secondes
	restDuration: number; // secondes
	exercises: string[];
	remainingTime: number;
}

export const defaultWorkoutConfig: WorkoutConfig = {
	totalExercises: 6,
	seriesPerExercise: 4,
	seriesDuration: 30,
	restDuration: 120,
	remainingTime: 0,
	exercises: [
		"Exercice 1",
		"Exercice 2",
		"Exercice 3",
		"Exercice 4",
		"Exercice 5",
		"Exercice 6",
	],
};

// Calcul de la durée totale de la séance
export const calculateTotalDuration = (config: WorkoutConfig) => {
	return (
		config.totalExercises *
			config.seriesPerExercise *
			(config.seriesDuration + config.restDuration) -
		config.restDuration
	);
};

// Format du temps en MM:SS
export const formatTime = (timeInSeconds: number) => {
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = timeInSeconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
};
