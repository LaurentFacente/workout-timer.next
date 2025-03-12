import { ModeToggle } from "../theme/theme-mode-toggle";

export function Header() {
	return (
		<header className='flex justify-between items-center px-4 py-2 border-accent border-b'>
			<h1>Next starter kit</h1>
			<div className='flex-1'></div>
			<ModeToggle />
		</header>
	);
}
