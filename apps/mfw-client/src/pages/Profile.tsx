import React, { useState, useEffect } from 'react';

// Define the API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/users/1'; // Placeholder API

export default function Profile() {
  // State for storing fetched data, loading status, and any errors
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // The useEffect Hook runs side effects (like data fetching) after render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);

        // Throw an error if the response is not ok (e.g., 404, 500)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data); // Update state with fetched data
      } catch (e) {
        // Catch any errors during the fetch or JSON parsing
        setError(e.message);
      } finally {
        // Always set loading to false after the operation is complete
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchData();

    // The empty dependency array `[]` ensures this effect runs only **once** // after the initial render, mimicking componentDidMount in class components.
  }, []);

  // --- Conditional Rendering based on state ---

  if (isLoading) {
    return (
      <div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render the profile once data is successfully fetched
  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <>
          <p>Name: **{user.name}**</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
}
