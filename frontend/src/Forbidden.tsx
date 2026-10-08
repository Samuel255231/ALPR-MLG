import React from 'react';

const Forbidden: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700">Page non trouvée</p>
    </div>
  );
}

export default Forbidden;
