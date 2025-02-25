import { Button } from "@nextui-org/react";
import { useState } from "react";
import InteractiveAvatar from "./InteractiveAvatar";

export default function LandingPage() {
  const [showAvatar, setShowAvatar] = useState(false);

  if (showAvatar) {
    return <InteractiveAvatar onClose={() => setShowAvatar(false)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-950">
      <div className="relative">
        <div className="absolute inset-0 blur-[100px] bg-gradient-to-br from-indigo-600 to-purple-600 opacity-30 rounded-full"></div>
        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Virtual Lead Assistant
          </h1>
          <p className="text-xl text-gray-300">
            Your AI-powered companion, ready to assist 24/7
          </p>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg px-8 py-6 rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
            size="lg"
            onClick={() => setShowAvatar(true)}
          >
            Talk to Agent
          </Button>
        </div>
      </div>
    </div>
  );
}