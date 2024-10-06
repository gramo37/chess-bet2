import usePersonStore from "../contexts/auth";



export default function NavBar(){
  const user = usePersonStore((state) => state.user);
    
    return <nav className="bg-white w-full shadow-md">
    <div className="flex justify-between  items-center max-w-7xl mx-auto p-4">
    <a href="/" className="text-black relative hover:text-yellow-500 transition-colors duration-300">
  <span className="text-2xl font-extrabold">Prochesser</span>
  <span className="block text-sm font-medium absolute -bottom-3 -right-3 text-gray-500">Gamer</span>
</a>
  
      <div className="space-x-4">
        {!user ? (
          <>
            <a
              href="/login"
              className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
            >
              Signup
            </a>
          </>
        ) : (
          <>
            {user?.role === 'USER' && (
              <a
                href="/account"
                className="text-black text-lg font-medium hover:text-yellow-500 transition-colors duration-300"
              >
                Account
              </a>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-yellow-400"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  </nav>
  
}