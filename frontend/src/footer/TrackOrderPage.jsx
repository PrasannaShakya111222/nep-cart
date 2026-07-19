const TrackOrderPage = () => {
  return (
    <div
      className="
        min-h-screen
        p-8
        bg-white
        text-gray-900
        dark:bg-slate-950
        dark:text-white
        transition-colors
        duration-300
      "
    >
      <h1
        className="
          text-4xl
          font-bold
          text-emerald-600
          dark:text-emerald-400
          mb-6
        "
      >
        Track Order
      </h1>

      <p
        className="
          text-gray-600
          dark:text-gray-300
        "
      >
        Enter your order ID to track your package.
      </p>

      <input
        type="text"
        placeholder="Enter Order ID"
        className="
          mt-6
          w-full
          max-w-md
          p-3
          rounded-lg

          bg-gray-100
          text-gray-900
          border
          border-gray-300

          dark:bg-gray-800
          dark:text-white
          dark:border-gray-700

          placeholder:text-gray-500
          dark:placeholder:text-gray-400

          focus:outline-none
          focus:border-emerald-500

          transition-colors
          duration-300
        "
      />

      <button
        className="
          mt-4
          bg-emerald-600
          hover:bg-emerald-700
          dark:bg-emerald-500
          dark:hover:bg-emerald-600

          text-white

          px-6
          py-2
          rounded-lg

          transition-colors
          duration-300
        "
      >
        Track
      </button>
    </div>
  );
};

export default TrackOrderPage;
