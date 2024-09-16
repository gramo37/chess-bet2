export default function TimeLeft(props: { timeLeft: string }) {
  const { timeLeft } = props;

  return (
    <div className="mb-4 text-center">
      <p className="text-gray-400">Time left: {timeLeft}</p>
    </div>
  );
}
