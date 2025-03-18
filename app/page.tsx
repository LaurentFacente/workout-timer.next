import WorkoutTimer from "@/components/WorkoutTimer";
import { defaultWorkoutConfig } from "@/lib/workoutConfig";

export default function Home() {
	return (
		<div className='mx-auto max-w-3xl w-full px-4 sm:px6 lg:max-w-7xl lg:px-8'>
			<WorkoutTimer config={defaultWorkoutConfig} />
		</div>
	);
}
