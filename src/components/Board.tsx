import { useEffect, useRef, useState } from 'react';
import Column from './Column';
import Footer from './Footer';

const Board = () => {
	const [todos, setTodos] = useState(() => {
		const localTodos = window.localStorage.getItem('todos');
		return localTodos !== null ? JSON.parse(localTodos) : [];
	});
	const [inProgress, setInProgress] = useState(() => {
		const localInProgress = window.localStorage.getItem('inProgress');
		return localInProgress !== null ? JSON.parse(localInProgress) : [];
	});
	const [completed, setCompleted] = useState(() => {
		const localCompleted = window.localStorage.getItem('completed');
		return localCompleted !== null ? JSON.parse(localCompleted) : [];
	});

	const newCardModalRef = useRef(null);

	useEffect(() => {
		window.localStorage.setItem('todos', JSON.stringify(todos));
		window.localStorage.setItem('inProgress', JSON.stringify(inProgress));
		window.localStorage.setItem('completed', JSON.stringify(completed));
		// console.log(todos, inProgress, completed);
	}, [todos, inProgress, completed]);

	useEffect(() => {
		const detectCtrlEnter = (ev: KeyboardEvent) => {
			if (ev.ctrlKey && ev.key === 'Enter') {
				(newCardModalRef.current as unknown as HTMLDialogElement).showModal();
			}
		};

		window.addEventListener('keydown', detectCtrlEnter);

		return () => {
			window.removeEventListener('keydown', detectCtrlEnter);
		};
	}, []);

	const progressStatus = (id: number) => {
		let item;
		let inTodos = false;
		todos.forEach((todo: { id: number; text: string; completed: boolean }) => {
			if (todo.id === id) {
				inTodos = true;
				item = todo;
			}
		});
		inProgress.forEach((todo: { id: number; text: string; completed: boolean }) => {
			if (todo.id === id) {
				item = todo;
			}
		});

		if (inTodos) {
			setTodos(
				todos.filter((todo: { id: number; text: string; completed: boolean }) => todo.id !== id)
			);
			const newInProgress = [...inProgress];
			newInProgress.push(item);
			setInProgress(newInProgress);
		} else {
			setInProgress(
				inProgress.filter(
					(todo: { id: number; text: string; completed: boolean }) => todo.id !== id
				)
			);
			const newCompleted = [...completed];
			newCompleted.push(item);
			setCompleted(newCompleted);
		}
	};

	const regressStatus = (id: number) => {
		let item;
		let inInProgress = false;
		inProgress.forEach((todo: { id: number; text: string; completed: boolean }) => {
			if (todo.id === id) {
				inInProgress = true;
				item = todo;
			}
		});
		completed.forEach((todo: { id: number; text: string; completed: boolean }) => {
			if (todo.id === id) {
				item = todo;
			}
		});

		if (inInProgress) {
			setInProgress(
				inProgress.filter(
					(todo: { id: number; text: string; completed: boolean }) => todo.id !== id
				)
			);
			const newTodos = [...todos];
			newTodos.push(item);
			setTodos(newTodos);
		} else {
			setCompleted(
				completed.filter((todo: { id: number; text: string; completed: boolean }) => todo.id !== id)
			);
			const newInProgress = [...inProgress];
			newInProgress.push(item);
			setInProgress(newInProgress);
		}
	};

	const deleteCard = (id: number) => {
		const newTodos = [...todos];
		setTodos(newTodos.filter((todo) => todo.id !== id));
	};

	const completeCard = (id: number) => {
		const newCompleted = [...completed];
		newCompleted.forEach((todo) => {
			if (todo.id === id) {
				todo.completed = true;
			}
		});
		setCompleted(newCompleted);
	};

	const clear = () => {
		setTodos([]);
		setInProgress([]);
		setCompleted([]);
	};

	const openNewCardModal = () => {
		(newCardModalRef.current as unknown as HTMLDialogElement).showModal();
	};

	const cancelNewCardModal = () => {
		(newCardModalRef.current as unknown as HTMLDialogElement).close();
	};

	const createNewCardClickHandler = () => {
		(newCardModalRef.current as unknown as HTMLDialogElement).close();

		const newTodos = [...todos];
		const newTodo = {
			id: crypto.randomUUID(),
			text: (newCardModalRef.current as unknown as HTMLDialogElement).querySelector('input')?.value,
			completed: false
		};
		newTodos.push(newTodo);
		setTodos(newTodos);

		const input = (newCardModalRef.current as unknown as HTMLDialogElement).querySelector('input');
		if (input !== null) {
			input.value = '';
		}
	};

	const createNewCardKeyHandler: React.KeyboardEventHandler<HTMLInputElement> = (ev) => {
		const input = (newCardModalRef.current as unknown as HTMLDialogElement).querySelector('input');
		if (ev.key === 'Enter' && input !== null && input.value !== '') {
			(newCardModalRef.current as unknown as HTMLDialogElement).close();

			const newTodos = [...todos];
			const newTodo = {
				id: crypto.randomUUID(),
				text: (newCardModalRef.current as unknown as HTMLDialogElement).querySelector('input')
					?.value,
				completed: false
			};
			newTodos.push(newTodo);
			setTodos(newTodos);

			if (input !== null) {
				input.value = '';
			}
		}
	};

	return (
		<>
			<div className="flex flex-1 gap-4 bg-slate-200 p-4">
				<Column
					title="Todo"
					array={todos}
					progressStatus={progressStatus}
					regressStatus={regressStatus}
					deleteCard={deleteCard}
					completeCard={completeCard}
				/>

				<Column
					title="In Progress"
					array={inProgress}
					progressStatus={progressStatus}
					regressStatus={regressStatus}
					deleteCard={deleteCard}
					completeCard={completeCard}
				/>

				<Column
					title="Completed"
					array={completed}
					progressStatus={progressStatus}
					regressStatus={regressStatus}
					deleteCard={deleteCard}
					completeCard={completeCard}
				/>

				<button className="fixed bottom-4 rounded-full bg-slate-50 px-4 py-2" onClick={clear}>
					Clear
				</button>

				<button
					className="fixed bottom-4 right-4 rounded-full bg-slate-50 px-4 py-2"
					onClick={openNewCardModal}
				>
					New
				</button>

				<dialog
					className="rounded-xl bg-slate-500 backdrop:bg-slate-800 backdrop:opacity-70"
					ref={newCardModalRef}
				>
					<div className="flex flex-col gap-4  p-8">
						<h2>New Card</h2>
						<label htmlFor="cardTextInput">
							<p>Card Text:</p>
							<input
								id="cardTextInput"
								name="cardTextInput"
								type="text"
								onKeyUp={createNewCardKeyHandler}
							/>
						</label>
						<div className="grid grid-cols-2">
							<button onClick={cancelNewCardModal}>Cancel</button>
							<button onClick={createNewCardClickHandler}>Submit</button>
						</div>
					</div>
				</dialog>
			</div>
			<Footer />
		</>
	);
};

export default Board;
