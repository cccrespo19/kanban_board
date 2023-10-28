interface CardProps {
	card: {
		id: number;
		text: string;
		status: string;
	};
	progressStatus: (id: number) => void;
	regressStatus: (id: number) => void;
}

const Card = ({ card, progressStatus, regressStatus }: CardProps) => {
	return (
		<p className="relative rounded-xl bg-orange-100 p-2 dark:bg-red-100">
			{card.text}
			<button
				className="absolute left-0 top-0 h-full w-[50%] rounded-l-xl bg-orange-200 opacity-0 hover:opacity-90 focus:opacity-90"
				onClick={() => regressStatus(card.id)}
			>
				{'<'}
			</button>
			<button
				className="absolute right-0 top-0 h-full w-[50%] rounded-r-xl bg-orange-200 opacity-0 hover:opacity-90 focus:opacity-90"
				onClick={() => progressStatus(card.id)}
			>
				{'>'}
			</button>
		</p>
	);
};

export default Card;
