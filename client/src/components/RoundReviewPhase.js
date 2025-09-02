import { useEffect, useMemo, useState } from "react";

const RoundReviewPhase = ({ relays }) => {
  const [currentRelayIndex, setCurrentRelayIndex] = useState(0);

  // Memoize currentRelay so it's stable
  const currentRelay = useMemo(() => {
    return relays[currentRelayIndex];
  }, [relays, currentRelayIndex]);

  useEffect(() => {
    if (!currentRelay) return;

    const timer = setTimeout(() => {
      // Auto move to next sequence inside the relay
      setCurrentRelayIndex((prev) =>
        prev < relays.length - 1 ? prev + 1 : prev
      );
    }, 3000); // adjust delay per sequence

    return () => clearTimeout(timer);
  }, [currentRelay, relays.length]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Round Review</h2>
      {currentRelay ? (
        <div className="fade-in p-4 border rounded shadow">
          {currentRelay.sequence.map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
        </div>
      ) : (
        <p>Loading relays...</p>
      )}
    </div>
  );
};

export default RoundReviewPhase;
