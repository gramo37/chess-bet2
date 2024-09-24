import React, { useState } from "react";

type user = {
  email: string;
  id: string;
  name: string;
  role: string;
  status: string;
};

type usersProps = {
  users: user[];
};

export const Users: React.FC<usersProps> = ({ users }) => {
  const [filter, setFilter] = useState<string>("ALL"); // State to hold the selected filter

  // Function to handle user profile view
  function onViewProfile(id: string): void {
    console.log(id);
    window.location.href = `/player/${id}`;
  }

  // Filter users based on selected status
  const filteredUsers = users.filter((user) => {
    if (filter === "ACTIVE") return user.status === "ACTIVE";
    if (filter === "SUSPENDED") return user.status === "SUSPENDED";
    return true; // If "ALL" is selected, return all users
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        {/* Filter options */}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        >
          <option value="ALL">All Users</option>
          <option value="ACTIVE">Active Users</option>
          <option value="SUSPENDED">Suspended Users</option>
        </select>
      </div>
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-md shadow-md">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                <p className="text-gray-700">Email: 
                  <a className="text-blue-500 hover:underline" href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer"> {user.email}</a>
                </p>
              </div>
              <div>
                <p className="text-gray-600">Role: <span className="font-medium text-gray-800">{user.role}</span></p>
                <p className="text-gray-600">Status: 
                  <span className={user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}>{user.status}</span>
                </p>
              </div>
            </div>
            <p className="font-semibold text-blue-500 cursor-pointer hover:underline" onClick={() => onViewProfile(user.id)}>View User</p>
          </div>
        ))}
      </div>
    </div>
  );
};
