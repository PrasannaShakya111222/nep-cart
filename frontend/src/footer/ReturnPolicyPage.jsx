const ReturnPolicyPage = () => {
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
        Return Policy
      </h1>

      <p
        className="
          text-gray-600
          dark:text-gray-300
        "
      >
        Products can be returned within 7 days of delivery. Items must be unused
        and in original condition.
      </p>
    </div>
  );
};

export default ReturnPolicyPage;
