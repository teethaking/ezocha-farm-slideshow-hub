import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot, X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FloatingFarmBot = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const navigate = useNavigate();

  const handleToggle = () => {
    if (isMinimized) {
      navigate('/farm-bot');
    } else {
      setIsMinimized(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMinimized ? (
        <Button
          onClick={handleToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce"
          size="icon"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-80 h-96 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Farm Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p className="text-gray-600 mb-4">Get expert farming advice</p>
              <Button
                onClick={handleToggle}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};