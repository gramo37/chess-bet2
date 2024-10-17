const WhoAreWe = () => {
  return (
    <section className="flex flex-col md:flex-row items-center w-screen py-12 px-6 bg-black">
      {/* Text Section */}
      <div className="md:w-1/2 md:pr-6 mb-8 md:mb-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-500 mb-6">
          Who Are We?
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          We are passionate chess enthusiasts and tech innovators committed to bringing an electrifying twist to the timeless chess game. At ProChesser, we believe in the power of intellect and reward, crafting an online platform where every player can thrive, learn, and earn. You can join classes to improve your game or play matches to win money.
        </p>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2">
        <img
          src='/KQChessimage.jpg'
          alt="Chess King and Queen"
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default WhoAreWe;
