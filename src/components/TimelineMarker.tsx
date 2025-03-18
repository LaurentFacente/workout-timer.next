import { CheckIcon } from "lucide-react";

interface CircularProgressProps {
	exercises: string[];
	seriesPerExercise: number;
	progressPercentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
	exercises,
	seriesPerExercise,
	progressPercentage,
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
		<div className='flex flex-col md:flex-row justify-evenly items-center mt-8 gap-8'>
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

					{/* Text in center */}
					<text
						x='50%'
						y='50%'
						textAnchor='middle'
						fill='#e5e7eb'
						fontSize='36px'
						dy='12px'
					>
						{Math.round(progressPercentage)}%
					</text>
				</svg>
			</div>

			{/* Exercise markers */}
			<div
				className='flex flex-col gap-2 w-full md:w-auto pl-5 pr-5
'
			>
				{exercises.map((exercise, i) => {
					// Calculate if this exercise is fully completed
					const exerciseStartSeries = i * seriesPerExercise;
					const exerciseEndSeries = exerciseStartSeries + seriesPerExercise - 1;
					const isExerciseCompleted = exerciseEndSeries < completedSeries;

					return (
						<div key={i} className='flex items-center mb-2'>
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
								{isExerciseCompleted && <CheckIcon size={12} color='white' />}
							</div>
							<div
								className={`text-sm ${
									isExerciseCompleted ? "text-green-300" : "text-gray-300"
								}`}
							>
								{exercise}
							</div>
							<div className='ml-auto md:ml-16 text-xs text-gray-400'>
								{Array.from({ length: seriesPerExercise }).map((_, j) => {
									const seriesIndex = i * seriesPerExercise + j;
									const isCompleted = seriesIndex < completedSeries;
									const isCurrent = seriesIndex === completedSeries;

									return (
										<span
											key={j}
											className={`inline-block w-2 h-2 mx-1 rounded-full ${
												isCompleted
													? "bg-indigo-500"
													: isCurrent
													? "bg-blue-300 animate-pulse"
													: "bg-gray-700"
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
	);
};

export default CircularProgress;
