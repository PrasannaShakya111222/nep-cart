const HelpCenterPage = () => {
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
        Help Center
      </h1>

      <p
        className="
          text-gray-600
          dark:text-gray-300
        "
      >
        Need help with your NepCart account or orders? Our support team is here
        to assist you.
      </p>

      <div className="mt-6 space-y-3">
        <p className="text-gray-700 dark:text-gray-200">📦 Order problems</p>

        <p className="text-gray-700 dark:text-gray-200">💳 Payment issues</p>

        <p className="text-gray-700 dark:text-gray-200">
          🚚 Delivery questions
        </p>

        <p className="text-gray-700 dark:text-gray-200">
          🔄 Returns and refunds
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
