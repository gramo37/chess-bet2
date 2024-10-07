import { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import { usersProps, user as UserType } from "../schema";
import { IoMdRefresh } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { BACKEND_URL } from "../../../constants/routes";

export const Users = ({ users }: usersProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [filterSearchUsers, setFilterSearchUsers] = useState(users);
  const loggedInUser = usePersonStore((state) => state.user); // Renamed to loggedInUser to avoid conflict

  // Filter users based on selected status and role
  const filteredUsers = users.filter((user) => {
    const statusMatch = statusFilter === "ALL" || user.status === statusFilter;
    const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
    const searchMatch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase());

    return statusMatch && roleMatch && searchMatch;
  });
  console.log(filteredUsers)

  // Fetch player from server based on search query
  const data = async () => {
    const url = `${BACKEND_URL}/admin/usersemail/${search.trim()}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
        },
      });
      if (!response.ok) {
        throw new Error("Player not found");
      }
      const data = await response.json();
      console.log(data);
      setFilterSearchUsers([data]);
    }catch(e:any){
    console.log('error',e);
alert(e.message??"Something Happenend");
  }
  };


  return (
    <div className="w-full">
      <div className="mb-4 flex w-full gap-4 flex-wrap items-center justify-between">
  {/* Filters Section */}
  <div className="w-full md:w-auto flex flex-col gap-2 md:flex-row">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="p-2 border border-gray-300 rounded w-full md:w-auto"
    >
      <option value="ALL">All Users</option>
      <option value="ACTIVE">Active Users</option>
      <option value="SUSPENDED">Suspended Users</option>
      <option value="BANNED">Banned Users</option>
    </select>

    {loggedInUser && loggedInUser.role === "ADMIN" && (
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full md:w-auto"
      >
        <option value="ALL">All Roles</option>
        <option value="MODERATOR">Moderator</option>
        <option value="USER">User</option>
      </select>
    )}
  </div>

  {/* Search Section */}
  <div className="w-full md:w-auto flex items-center justify-start md:justify-end gap-2">
    <input
      type="text"
      placeholder="Search by Email"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="py-2 px-4 border border-gray-300 rounded w-full md:w-[300px]"
    />
    
    <button
      onClick={() => {
        if (!search) {
          alert("Enter player ID or email");
          return;
        }
        data();
      }}
      className="bg-yellow-600 py-2 px-4 text-white hover:bg-yellow-500 rounded"
    >
      <FaSearch />
    </button>
    
    <button
      onClick={() => {
        setFilterSearchUsers(users);
        setSearch("");
      }}
      className="bg-yellow-600 py-2 px-4 text-white hover:bg-yellow-500 rounded"
    >
      <IoMdRefresh />
    </button>
  </div>
</div>

      <div className="space-y-4">
        {filterSearchUsers.map((user) => (
          <UserComponent key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

type UserProps = {
  user: UserType;
};

const UserComponent = ({ user }: UserProps) => {
  // Function to handle user profile view
  function onViewProfile(id: string): void {
    console.log(id);
    window.location.href = `/player/${id}`;
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between flex-wrap-reverse">
        <div className="">
          <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
          <p className="text-gray-700">
            Email:
            <a
              className="text-yellow-600 hover:underline"
              href={`mailto:${user.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              {user.email}
            </a>
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            Role: <span className="font-medium text-gray-800">{user.role}</span>
          </p>
          <p className="text-gray-600">
            Status:{" "}
            <span
              className={user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}
            >
              {user.status}
            </span>
          </p>
        </div>
      </div>
      <p
        className="font-semibold text-yellow-600 inline cursor-pointer hover:underline"
        onClick={() => onViewProfile(user.id)}
      >
        View User
      </p>
    </div>
  );
};
