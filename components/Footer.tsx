
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-proto-dark border-t border-proto-gray px-4 py-2 text-center text-xs text-gray-400">
      <p className="font-semibold">Demo v0.1 (Simulated)</p>
      <p className="font-bold text-proto-gold mt-1">
        Demo — no real API calls, no exploit payloads. For educational and design purposes only.
      </p>
    </footer>
  );
};

export default Footer;
