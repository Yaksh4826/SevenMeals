// app/components/TextLogo.jsx
export function AnimatedLogo({ className = "" }) {
  return (
    <div
      className={`font-bold ${className} tracking-tight flex items-center select-none`}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
    >
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes dotBlink {
          0%, 85%, 100% { opacity: 1; }
          90% { opacity: 0.2; }
        }
        @keyframes starShine {
          0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
          40%, 60% { opacity: 1; transform: scale(1) rotate(15deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
        }
        .logo-text { color: #dc2626; animation: gentleFloat 3.5s ease-in-out infinite; display: inline-block; }
        .logo-dot  { color: #dc2626; display: inline-block; animation: dotBlink 4s ease-in-out infinite; }
        .logo-star {
          position: absolute;
          top: -4px;
          right: -12px;
          width: 14px;
          height: 14px;
          animation: starShine 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      <span className="logo-text">7Meals</span>
      <span className="logo-dot">.</span>

      <svg className="logo-star" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2 C12 2 12.8 7.5 14.5 9.5 C16.5 11.2 22 12 22 12 C22 12 16.5 12.8 14.5 14.5 C12.8 16.5 12 22 12 22 C12 22 11.2 16.5 9.5 14.5 C7.5 12.8 2 12 2 12 C2 12 7.5 11.2 9.5 9.5 C11.2 7.5 12 2 12 2 Z"
          fill="#dc2626"
        />
      </svg>
    </div>
  );
}