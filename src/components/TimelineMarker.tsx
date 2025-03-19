import { formatTime } from "@/lib/workoutConfig";
import { CheckIcon } from "lucide-react";
import React from "react";

interface CircularProgressProps {
	exercises: string[];
	seriesPerExercise: number;
	progressPercentage: number;
	remainingTime: number;
	isResting: boolean; // Whether in rest or exercise mode
}

const CircularProgress: React.FC<CircularProgressProps> = ({
	exercises,
	seriesPerExercise,
	progressPercentage,
	isResting,
	remainingTime,
}) => {
	const totalSeries = exercises.length * seriesPerExercise;
	const completedSeries = Math.floor((progressPercentage / 100) * totalSeries);

	// Calculate circle dimensions
	const size = 200;
	const strokeWidth = 8;
	const radius = size / 2 - strokeWidth;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset =
		circumference - (progressPercentage / 100) * circumference;

	return (
		<div className='flex flex-col md:flex-row items-center mt-8 justify-evenly'>
			<div className='relative w-52 h-52'>
				{/* Background circle */}
				<svg className='w-full h-full' viewBox={`0 0 ${size} ${size}`}>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='transparent'
						stroke='#374151'
						strokeWidth={strokeWidth}
					/>

					{/* Progress circle */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill='transparent'
						stroke='#4f46e5'
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap='round'
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>

					{/* Time remaining */}
					<text
						x='50%'
						y='40%'
						textAnchor='middle'
						fill='#e5e7eb'
						fontSize='24px'
						dy='0'
					>
						{formatTime(remainingTime)}
					</text>

					{/* Current state (Rest or Exercise) */}
					<text
						x='50%'
						y='60%'
						textAnchor='middle'
						fill={isResting ? "#fdba74" : "#c7d2fe"}
						fontSize='16px'
						dy='0'
					>
						{isResting ? "Rest" : "Exercise"}
					</text>

					{/* Progress percentage */}
					<text
						x='50%'
						y='75%'
						textAnchor='middle'
						fill='#e5e7eb'
						fontSize='12px'
						dy='0'
					>
						{Math.round(progressPercentage)}% complete
					</text>
				</svg>
			</div>

			{/* Exercise markers */}
			<div className='w-auto flex'>
				<div className='flex flex-col gap-2 md:w-auto'>
					{exercises.map((exercise, i) => {
						// Calculate if this exercise is fully completed
						const exerciseStartSeries = i * seriesPerExercise;
						const exerciseEndSeries =
							exerciseStartSeries + seriesPerExercise - 1;
						const isExerciseCompleted = exerciseEndSeries < completedSeries;

						return (
							<div key={i} className='flex items-center mb-2 justify-evenly'>
								<div className='flex w-30'>
									<div
										className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
											isExerciseCompleted
												? "bg-green-600"
												: ((i * seriesPerExercise) / totalSeries) * 100 <=
												  progressPercentage
												? "bg-indigo-600"
												: "bg-gray-600"
										}`}
									>
										{isExerciseCompleted && (
											<CheckIcon size={12} color='white' />
										)}
									</div>
									<div
										className={`text-sm ${
											isExerciseCompleted ? "text-green-300" : "text-gray-300"
										}`}
									>
										{exercise}
									</div>
								</div>
								<div className='text-xs ml-16 text-gray-400'>
									{Array.from({ length: seriesPerExercise }).map((_, j) => {
										const seriesIndex = i * seriesPerExercise + j;
										const isCompleted = seriesIndex < completedSeries;
										const isCurrent = seriesIndex === completedSeries;

										return (
											<span
												key={j}
												className={`inline-block w-2 h-2 mx-1 rounded-full ${
													isCompleted
														? "bg-indigo-600" // Complété = bleu
														: isResting && isCurrent
														? "bg-orange-300 animate-pulse" // En repos et courant = orange avec pulse
														: isCurrent
														? "bg-blue-400 animate-pulse" // Courant (exercice) = bleu avec pulse
														: "bg-gray-400" // Cas par défaut = gris
												}`}
											/>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CircularProgress;
