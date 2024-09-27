import React, { useState } from "react";
import usePersonStore from "../../../contexts/auth";

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
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); // State to hold the selected status filter
  const [roleFilter, setRoleFilter] = useState<string>("ALL"); // State to hold the selected role filter
  const user = usePersonStore((state) => state.user);

  // Function to handle user profile view
  function onViewProfile(id: string): void {
    console.log(id);
    window.location.href = `/player/${id}`;
  }

  // Filter users based on selected status and role
  const filteredUsers = users.filter((user) => {
    const statusMatch = 
      statusFilter === "ALL" || user.status === statusFilter;
    const roleMatch = 
      roleFilter === "ALL" || user.role === roleFilter;
    return statusMatch && roleMatch;
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        {/* Status Filter */}
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        >
          <option value="ALL">All Users</option>
          <option value="ACTIVE">Active Users</option>
          <option value="SUSPENDED">Suspended Users</option>
        </select>

        {(user&&user.role==="ADMIN")&&
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        >
          <option value="ALL">All Roles</option>
          <option value="MODERATOR">Moderator</option>
          <option value="USER">User</option>
          {/* Add more roles as needed */}
        </select>}
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
