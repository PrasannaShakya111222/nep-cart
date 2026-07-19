const TermsPage = () => {
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
        Terms & Conditions
      </h1>

      <p
        className="
          text-gray-600
          dark:text-gray-300
        "
      >
        By using NepCart, you agree to our terms, policies, and service
        conditions.
      </p>
    </div>
  );
};

export default TermsPage;
