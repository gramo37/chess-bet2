export default function TimeLeft(props: { timeLeft: string }) {
  const { timeLeft } = props;

  return (
    <div className="text-center">
      <p className="text-gray-400">Time Left: {timeLeft}</p>
    </div>
  );
}
