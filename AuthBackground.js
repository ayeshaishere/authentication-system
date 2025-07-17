import React from 'react';

const AuthBackground = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700 opacity-90" />
      <div className="absolute inset-0 bg-[url('/abstract-background.png')] bg-cover bg-center mix-blend-overlay"></div>
    </div>
  );
};

export default AuthBackground;
