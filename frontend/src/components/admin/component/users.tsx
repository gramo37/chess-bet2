import React, { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import { usersProps } from "../schema";


export const Users: React.FC<usersProps> = ({ users }) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL"); 
  const [search,setSearch]=useState("");
  const [filterUsers,setFilterUsers]=useState(users);
  const user = usePersonStore((state) => state.user);
  
  // Function to handle user profile view
  function onViewProfile(id: string): void {
    console.log(id);
    window.location.href = `/player/${id}`;
  }

  // Filter users based on selected status and role
  const filteredUsers = users.filter((user) => {
    const statusMatch = statusFilter === "ALL" || user.status === statusFilter;
    const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
    const a = user.email.toLowerCase().includes(search.toLowerCase()) || user.name.toLowerCase().includes(search.toLowerCase());

    return statusMatch && roleMatch && a;
  });

  return (
    <div className="p-4 w-full">
      <div className="mb-4 flex w-full flex-wrap justify-between space-x-4 w-full">
        <div >
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="p-2 border border-gray-300 rounded mr-3"
          >
          <option value="ALL">All Users</option>
          <option value="ACTIVE">Active Users</option>
          <option value="SUSPENDED">Suspended Users</option>
          <option value="BANNED">Banned Users</option>
        </select>

        {(user&&user.role==="ADMIN")&&
        <select 
        value={roleFilter} 
        onChange={(e) => setRoleFilter(e.target.value)} 
        className="p-2 border border-gray-300 rounded"
        >
          <option value="ALL">All Roles</option>
          <option value="MODRATOR">Modrator</option>
          <option value="USER">User</option>
        </select>}
          </div>
          <input type="text" placeholder="Search user by Email or Name" value={search} onChange={(e)=>setSearch(e.target.value)} className="py-2 max-w-[60%] w-[500px] px-4 rounded" />
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
            <p className="font-semibold text-blue-500 inline cursor-pointer hover:underline" onClick={() => onViewProfile(user.id)}>View User</p>
          </div>
        ))}
      </div>
    </div>
  );
};
