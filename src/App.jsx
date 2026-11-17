
import { useState } from "react";
import PhaseOne from "./PhaseOne";
import IndividualJourney from "./IndividualJourney";
import "./App.css";


function App() {
  const [participantId, setParticipantId] = useState("");
  const [consent, setConsent] = useState(false);
  const [started, setStarted] = useState(false);
  const [individual, setIndividual] = useState(false);

  function beginChallenge() {
    if (!participantId.trim() || !consent) return;
    setStarted(true);
  }

  if (started) {
    return individual ? <IndividualJourney key={participantId.trim()} participantId={participantId.trim()} /> : <PhaseOne key={participantId.trim()} participantId={participantId.trim()} onContinue={() => setIndividual(true)} />;
  }

  return (
    <main className="container">
      <div className="card">
        <div className="eyebrow">AFRICA ATTENTION LAB</div>

        <h1>Discover How You Think.</h1>

        <p className="subtitle">
          A 60-minute interactive experience exploring
          decision-making, adaptability, problem-solving,
          and collaboration.
        </p>

        <div className="phases">
          <div>01. Collaborative Challenge · 15 min</div>
          <div>02. Individual Challenges · 35 min</div>
          <div>03. Reflection & Debrief · 10 min</div>
        </div>

        <label htmlFor="participant">
          Participant ID
        </label>

        <input
          id="participant"
          type="text"
          placeholder="e.g. ILU-P01"
          value={participantId}
          onChange={(e) =>
            setParticipantId(e.target.value.toUpperCase())
          }
        />

        <label className="consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            I understand that this pilot records my challenge
            responses and interaction timings for research
            and learning purposes.
          </span>
        </label>

        <button
          onClick={beginChallenge}
          disabled={!participantId.trim() || !consent}
        >
          Begin Challenge →
        </button>

        <p className="footer">
          International Leadership University · Pilot 2027
        </p>
      </div>
    </main>
  );
}

export default App;

