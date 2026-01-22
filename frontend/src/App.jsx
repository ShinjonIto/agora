import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/hello/")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, [])
  return (
    <div>
      <p className="hello">{message}んにちは</p>
    </div>
  );
}

export default App;