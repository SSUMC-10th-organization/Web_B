interface ListItem {
	id: number;
	text: string;
}
interface itemProps {
	list: ListItem;
	pressBtn(id: number): void;
	state: string; // 버튼이 todo인지 done인지 구분
}

function Item({ list, pressBtn, state }: itemProps) {
	return (
		<li key={list.id}>
			{list.text}
			<button type="button" onClick={() => pressBtn(list.id)}>
				{state}
			</button>
		</li>
	);
}

export default Item;
