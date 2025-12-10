import { useState, useEffect } from "react";
import { Clock, Settings } from "lucide-react";
import { formatHijriDate } from "../lib/hijri";
import SettingsModal from "./SettingsModal";

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Initialize state from localStorage
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem("is24Hour");
    return saved ? JSON.parse(saved) : false;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings state
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "blue");
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    const saved = localStorage.getItem("ttsEnabled");
    return saved ? JSON.parse(saved) : false;
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("is24Hour", JSON.stringify(is24Hour));
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("theme", theme);
    localStorage.setItem("ttsEnabled", JSON.stringify(ttsEnabled));
  }, [is24Hour, fontSize, theme, ttsEnabled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // TTS Logic
  useEffect(() => {
    if (!ttsEnabled) return;

    const checkTime = () => {
      const now = new Date();
      // Announce every 30 minutes
      if ((now.getMinutes() === 0 || now.getMinutes() === 30) && now.getSeconds() === 0) {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const text = `It is ${hours} ${minutes === 0 ? "o'clock" : minutes}`;
        
        window.speechSynthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    };

    const ttsTimer = setInterval(checkTime, 1000);
    return () => clearInterval(ttsTimer);
  }, [ttsEnabled]);

  // Format time based on 12/24 hour preference
  const formatTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");

    if (!is24Hour) {
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes}:${seconds} ${period}`;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
  };

  // Format Gregorian date
  const formatGregorianDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return currentTime.toLocaleDateString("id-ID", options);
  };

  // Get Hijri date
  const getHijriDate = () => {
    return formatHijriDate(currentTime, "id-ID");
  };

  // Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case "emerald":
        return "from-emerald-900 to-teal-900";
      case "rose":
        return "from-rose-900 to-pink-900";
      default:
        return "from-blue-900 to-indigo-900";
    }
  };

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-[10vw]";
      case "large":
        return "text-[20vw]";
      default:
        return "text-[15vw]";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getThemeClasses()} text-white flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000`}>
      <div className="w-full flex flex-col items-center justify-center z-10">
        {/* Digital Clock Display */}
        <div className="text-center mb-12 w-full">
          <h1 className={`${getFontSizeClass()} font-bold tracking-tight mb-4 font-mono leading-none drop-shadow-2xl select-none transition-all duration-300`}>
            {formatTime()}
          </h1>
          <p className="text-3xl md:text-5xl text-gray-100 font-light mb-2 drop-shadow-md">
            {formatGregorianDate()}
          </p>
          <p className="text-2xl md:text-4xl text-gray-200 font-light drop-shadow-md">
            {getHijriDate()}
          </p>
        </div>

        {/* Quick Settings */}
        <div className="flex justify-center space-x-6 mb-8 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <Clock size={20} />
            <span className="text-lg">{is24Hour ? "12h" : "24h"}</span>
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <Settings size={20} />
            <span className="text-lg">Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />
    </div>
  );
}

export default Home;
