import { useEffect, useState } from 'react';

function App() {
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    fetch('/api/athletes')
      .then((r) => r.json())
      .then(setAthletes)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>StatSlam Athletes</h1>
      <ul>
        {athletes.map((a) => (
          <li key={a._id || a.id}>{a.name} {a.team ? `(${a.team})` : ''}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;