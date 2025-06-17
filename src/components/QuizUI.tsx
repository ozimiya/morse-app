interface Props {
    items: string[];
    onStart: () => void;
    onSelect: (item: string) => void;
    display: string;
  }
  
  const QuizUI = ({ items, onStart, onSelect, display }: Props) => (
    <div className="quiz">
      <button onClick={onStart}>スタート</button>
      <div className="question">{display}</div>
      <div className="options">
        {items.map((item) => (
          <button key={item} onClick={() => onSelect(item)}>{item}</button>
        ))}
      </div>
    </div>
  );
  