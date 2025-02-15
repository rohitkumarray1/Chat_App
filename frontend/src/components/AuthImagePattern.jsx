const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-12 px-16">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
