import React, { useState, useEffect } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://testapi.com/users");
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
