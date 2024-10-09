import { useState } from "react";
import usePersonStore from "../../../contexts/auth";
import { user } from "../schema";
import { IoMdRefresh } from "react-icons/io";
import { FaSearch} from "react-icons/fa";
import { BACKEND_URL } from "../../../constants/routes";
import axios from "axios";
import fetchData, { fetchUsersTypeData } from "../fetch/fetchdata";

type UsersProps = {
  users: user[];
  setUsers: (arg:any) => void;
};

export const Users = ({ users, setUsers }: UsersProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [filterSearchUsers, setFilterSearchUsers] = useState(users);
  const loggedInUser = usePersonStore((state) => state.user); // Use more descriptive variable
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

const GetSuspendedBannedUsers = async ()=>{
  if(statusFilter==='ALL'){
    setFilterSearchUsers(users);
    return;
  }
const data =await fetchUsersTypeData(statusFilter);
setFilterSearchUsers(data);
}

const GetModrators = async ()=>{
const data = await fetchUsersTypeData('modrators');
setFilterSearchUsers(data);
}

  // Fetch user by email
  const fetchUserByEmail = async () => {
    const url = `${BACKEND_URL}/admin/usersemail/${search.trim()}`;
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for authorization
        },
      });

      if (response.status !== 200) {
        throw new Error("Player not found");
      }

      const data = response.data;
      setFilterSearchUsers([data]);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      alert(error.message ?? "Something went wrong");
    }
  };

  // Load more users for pagination
  const loadMoreUsers = async () => {
    setIsLoadingMore(true);
    const data = await fetchData("users", page + 1);
    setPage((prevPage) => prevPage + 1);
    setUsers((prevUsers: any) => [...prevUsers, ...data]);
    setFilterSearchUsers([...users, ...data]);
    setSearch("");
    setStatusFilter("ALL");
    setHasMore(data.length > 0); // If no more users, stop loading
    setIsLoadingMore(false);
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
            <option value="suspended">Suspended Users</option>
            <option value="banned">Banned Users</option>
          </select>
          <button onClick={GetSuspendedBannedUsers} className="bg-yellow-600 py-2 px-4 text-white hover:bg-yellow-500 rounded">
            Get by status
          </button>
          {loggedInUser?.role === "ADMIN" && (
            <button onClick={GetModrators} className="bg-yellow-600 py-2 px-4 text-white hover:bg-yellow-500 rounded">
            Get Modrators
          </button>
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
              fetchUserByEmail();
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
        {users&&filterSearchUsers.map((user) => (
          <UserComponent key={user.id} user={user} />
        ))}
      </div>

      {isLoadingMore && <p className="text-white text-xl m-3">Loading more games...</p>}

      {hasMore && !isLoadingMore && (
        <button
          onClick={loadMoreUsers}
          className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded"
        >
          Load More
        </button>
      )}

      {!hasMore && <p className="text-white text-xl m-3">No more users</p>}
    </div>
  );
};

type UserProps = {
  user: user;
};

const UserComponent = ({ user }: UserProps) => {
  // Handle user profile view
  const onViewProfile = (id: string) => {
    console.log(id);
    window.location.href = `/player/${id}`;
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between flex-wrap-reverse">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
          <p className="text-gray-700">
            Email:
            <a
              className="text-yellow-600 hover:underline"
              href={`mailto:${user.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
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
