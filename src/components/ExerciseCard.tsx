import React from "react";
import { Card, CardHeader } from "./ui/card";

interface ExerciseCardProps {
	title: string;
	seriesCount: number;
	isActive: boolean;
	completedSeries: boolean[];
	currentSeries: number;
	isResting: boolean;
	seriesDuration: number;
	restDuration: number;
	currentTime: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
	title,
	seriesCount,
	isActive,
	completedSeries,
	currentSeries,
	isResting,
	seriesDuration,
	restDuration,
	currentTime,
}) => {
	return (
		<div
			className={`rounded-lg shadow-lg p-4 transition-all ${
				isActive ? "border-2 border-indigo-500" : "border border-gray-700"
			}`}
		>
			<CardHeader className='mt-0 mb-4 text-center pb-2 border-b border-gray-700 font-medium'>
				{title}
			</CardHeader>
			<div className='grid grid-cols-2 gap-3'>
				{Array.from({ length: seriesCount }).map((_, index) => {
					const isActiveCard = isActive && currentSeries === index;
					const isCompleted = completedSeries[index];

					let progressHeight = "0%";

					if (isCompleted) {
						progressHeight = "100%";
					} else if (isActiveCard) {
						const totalTimePerSet = seriesDuration + restDuration;
						const timeInCurrentSet = currentTime % totalTimePerSet;

						if (isResting) {
							// Calculer la progression du repos
							const restProgress =
								((timeInCurrentSet - seriesDuration) / restDuration) * 100;
							progressHeight = `${restProgress}%`;
						} else {
							// Calculer la progression de la série
							const seriesProgress = (timeInCurrentSet / seriesDuration) * 100;
							progressHeight = `${seriesProgress}%`;
						}
					}

					return (
						<Card
							key={index}
							className={`relative bg-gray-200 dark:bg-gray-700 rounded-md p-2 text-center flex items-center justify-center font-medium  h-16 overflow-hidden ${
								isActiveCard && isResting ? "resting" : ""
							} ${isActiveCard && !isResting ? "active" : ""} ${
								isCompleted ? "completed" : ""
							}`}
						>
							<div
								className={`absolute bottom-0 left-0 w-full transition-all duration-500 z-0 ${
									isCompleted
										? "bg-emerald-600"
										: isActiveCard && isResting
										? "bg-amber-600"
										: "bg-indigo-600"
								} ${isActiveCard && !isResting ? "animate-pulse" : ""}`}
								style={{ height: progressHeight, opacity: 0.8 }}
							></div>
							<div className='relative z-10'>Série {index + 1}</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default ExerciseCard;
