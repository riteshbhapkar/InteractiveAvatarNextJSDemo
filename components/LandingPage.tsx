import { Button } from "@nextui-org/react";
import { useState } from "react";
import InteractiveAvatar from "./InteractiveAvatar";

export default function LandingPage() {
  const [showAvatar, setShowAvatar] = useState(false);

  if (showAvatar) {
    return <InteractiveAvatar onClose={() => setShowAvatar(false)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#1f8844]">
      <div className="relative">
        <div className="absolute inset-0 blur-[100px] bg-gradient-to-br from-[#1f8844] to-[#1f8844] opacity-30 rounded-full"></div>
        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1f8844] to-[#1f8844]">
            Ava Sales Call Secretary
          </h1>
          <p className="text-xl text-gray-300">
            Your AI-powered companion, ready to assist 24/7
          </p>
          <Button
            className="bg-gradient-to-r from-[#1f8844] to-[#1f8844] text-white text-lg px-8 py-6 rounded-full hover:shadow-lg hover:shadow-[#1f8844]/50 transition-all duration-300"
            size="lg"
            onClick={() => setShowAvatar(true)}
          >
            Talk to Ava
          </Button>
        </div>
      </div>
    </div>
  );
}
