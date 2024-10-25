import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [greeting, setGreeting] = useState<string | null>(null); // State to hold fetched data

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await fetch("/hello");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        setGreeting(data);
      } catch (error) {
        console.error("Error fetching greeting:", error);
        setGreeting("Failed to fetch greeting.");
      }
    };

    fetchGreeting();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code>.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {greeting && <p>{greeting}</p>} {/* Display the fetched greeting */}
      </header>
    </div>
  );
}

export default App;
