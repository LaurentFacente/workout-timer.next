"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CircleIcon } from "lucide-react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// Sample data for demonstration
const data = [
	{ name: "Jan", visits: 1000, revenue: 240, customers: 340 },
	{ name: "Feb", visits: 1200, revenue: 290, customers: 380 },
	{ name: "Mar", visits: 1500, revenue: 350, customers: 420 },
	{ name: "Apr", visits: 1300, revenue: 270, customers: 390 },
	{ name: "May", visits: 1700, revenue: 390, customers: 450 },
	{ name: "Jun", visits: 2000, revenue: 450, customers: 510 },
];

const statsCards = [
	{
		title: "Revenus Totaux",
		value: "€1,990",
		change: "+12.5%",
		status: "positive",
	},
	{
		title: "Utilisateurs Actifs",
		value: "2,450",
		change: "+18.2%",
		status: "positive",
	},
	{
		title: "Taux de Conversion",
		value: "3.2%",
		change: "-0.4%",
		status: "negative",
	},
	{
		title: "Sessions Moyennes",
		value: "4.3 min",
		change: "+0.8%",
		status: "positive",
	},
];

export function Dashboard() {
	return (
		<div className='space-y-6 p-6'>
			<div className='flex items-center justify-between'>
				<h2 className='text-3xl font-bold'>Tableau de bord</h2>
				<div className='flex items-center space-x-2'>
					<p className='text-sm text-muted-foreground'>Dernière mise à jour:</p>
					<p className='text-sm font-medium'>Aujourdhui à </p>
				</div>
			</div>

			<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
				{statsCards.map((stat, index) => (
					<Card key={index}>
						<CardContent className='pt-6'>
							<div className='flex flex-col gap-1'>
								<p className='text-sm text-muted-foreground'>{stat.title}</p>
								<div className='flex items-baseline justify-between'>
									<h3 className='text-2xl font-bold'>{stat.value}</h3>
									<div
										className={`flex items-center text-sm ${
											stat.status === "positive"
												? "text-green-500"
												: "text-red-500"
										}`}
									>
										{stat.status === "positive" ? "↑" : "↓"} {stat.change}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid gap-4 grid-cols-1 lg:grid-cols-2'>
				<Card className='col-span-1'>
					<CardHeader className='pb-2'>
						<CardTitle>Aperçu des Performances</CardTitle>
						<CardDescription>Performance des derniers mois</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='h-80'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={data}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip />
									<Line type='monotone' dataKey='visits' stroke='#8884d8' />
									<Line type='monotone' dataKey='revenue' stroke='#82ca9d' />
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className='flex items-center justify-center mt-4 gap-4'>
							<div className='flex items-center gap-1'>
								<CircleIcon className='h-3 w-3 text-purple-500' />
								<span className='text-sm'>Visites</span>
							</div>
							<div className='flex items-center gap-1'>
								<CircleIcon className='h-3 w-3 text-green-500' />
								<span className='text-sm'>Revenus</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className='col-span-1'>
					<CardHeader className='pb-2'>
						<CardTitle>Évolution des Clients</CardTitle>
						<CardDescription>Croissance des nouveaux clients</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='h-80'>
							<ResponsiveContainer width='100%' height='100%'>
								<LineChart data={data}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip />
									<Line
										type='monotone'
										dataKey='customers'
										stroke='#ff7300'
										strokeWidth={2}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
