import { useState, useEffect, useRef } from "react";
import { Clock, Settings } from "lucide-react";
import { formatHijriDate } from "../lib/hijri";
import SettingsModal from "./SettingsModal";
import AnalogClock from "./AnalogClock";

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Initialize state from localStorage
  const [clockMode, setClockMode] = useState<"digital" | "analog">(() => {
    const saved = localStorage.getItem("clockMode");
    return (saved === "analog" ? "analog" : "digital");
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    const saved = localStorage.getItem("is24Hour");
    return saved ? JSON.parse(saved) : false;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings state
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [dateFontSize, setDateFontSize] = useState(() => {
    const saved = localStorage.getItem("dateFontSize");
    return saved ? parseInt(saved) : 32;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "blue");
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    const saved = localStorage.getItem("ttsEnabled");
    return saved ? JSON.parse(saved) : false;
  });
  const [tickSoundEnabled, setTickSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("tickSoundEnabled");
    return saved ? JSON.parse(saved) : false;
  });
  
  const audioContextRef = useRef<any>(null);

  // Initialize AudioContext on user interaction to bypass autoplay policy
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }
      
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('mousedown', initAudio);
    window.addEventListener('touchstart', initAudio);
    window.addEventListener('keydown', initAudio);

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('mousedown', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("clockMode", clockMode);
    localStorage.setItem("is24Hour", JSON.stringify(is24Hour));
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("dateFontSize", dateFontSize.toString());
    localStorage.setItem("theme", theme);
    localStorage.setItem("ttsEnabled", JSON.stringify(ttsEnabled));
    localStorage.setItem("tickSoundEnabled", JSON.stringify(tickSoundEnabled));
  }, [clockMode, is24Hour, fontSize, theme, ttsEnabled, tickSoundEnabled]);

  // Play tick sound
  const playTick = () => {
    if (!tickSoundEnabled) return;
    
    try {
      // Ensure AudioContext exists
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }

      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      
      // Only play if running, otherwise try to resume (will work if user interacted)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
        // If still suspended, we can't play yet
        if (ctx.state === 'suspended') return;
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Soft tick sound - mechanical click style
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      
      // Envelope for a crisp click
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.005); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05); // Decay
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      playTick();
    }, 1000);

    return () => clearInterval(timer);
  }, [tickSoundEnabled]);

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
        {/* Clock Display */}
        <div className="text-center mb-12 w-full flex flex-col items-center">
          {clockMode === "digital" ? (
            <h1 className={`${getFontSizeClass()} font-bold tracking-tight mb-4 font-mono leading-none drop-shadow-2xl select-none transition-all duration-300`}>
              {formatTime()}
            </h1>
          ) : (
            <div className="mb-8 mt-4">
              <AnalogClock currentTime={currentTime} theme={theme} />
            </div>
          )}
          
          <p 
            className="text-gray-100 font-light mb-2 drop-shadow-md transition-all duration-300"
            style={{ fontSize: `${dateFontSize}px`, lineHeight: 1.2 }}
          >
            {formatGregorianDate()}
          </p>
          <p 
            className="text-gray-200 font-light drop-shadow-md transition-all duration-300"
            style={{ fontSize: `${Math.max(12, dateFontSize * 0.75)}px`, lineHeight: 1.2 }}
          >
            {getHijriDate()}
          </p>
        </div>

        {/* Quick Settings */}
        <div className="flex justify-center space-x-6 mb-8 opacity-40 hover:opacity-100 transition-opacity duration-300">
          {clockMode === "digital" && (
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            >
              <Clock size={20} />
              <span className="text-lg">{is24Hour ? "12h" : "24h"}</span>
            </button>
          )}

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
        dateFontSize={dateFontSize}
        setDateFontSize={setDateFontSize}
        theme={theme}
        setTheme={setTheme}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        tickSoundEnabled={tickSoundEnabled}
        setTickSoundEnabled={setTickSoundEnabled}
        clockMode={clockMode}
        setClockMode={setClockMode}
      />
    </div>
  );
}

export default Home;
