import { X, Clock, Type, Palette, Volume2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  is24Hour: boolean;
  setIs24Hour: (value: boolean) => void;
  fontSize: string;
  setFontSize: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (value: boolean) => void;
  tickSoundEnabled: boolean;
  setTickSoundEnabled: (value: boolean) => void;
}

const SettingsModal = ({
  isOpen,
  onClose,
  is24Hour,
  setIs24Hour,
  fontSize,
  setFontSize,
  theme,
  setTheme,
  ttsEnabled,
  setTtsEnabled,
  tickSoundEnabled,
  setTickSoundEnabled,
}: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900/90 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Time Format */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} /> Time Format
            </h3>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setIs24Hour(false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  !is24Hour
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                12 Hour
              </button>
              <button
                onClick={() => setIs24Hour(true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  is24Hour
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                24 Hour
              </button>
            </div>
          </div>

          {/* Appearance (Placeholder) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} /> Theme
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("blue")}
                className={`h-12 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 transition-all ${
                  theme === "blue"
                    ? "border-2 border-white shadow-lg transform scale-105"
                    : "border border-white/10 opacity-60 hover:opacity-100"
                }`}
                aria-label="Blue Theme"
              />
              <button
                onClick={() => setTheme("emerald")}
                className={`h-12 rounded-lg bg-gradient-to-br from-emerald-900 to-teal-900 transition-all ${
                  theme === "emerald"
                    ? "border-2 border-white shadow-lg transform scale-105"
                    : "border border-white/10 opacity-60 hover:opacity-100"
                }`}
                aria-label="Emerald Theme"
              />
              <button
                onClick={() => setTheme("rose")}
                className={`h-12 rounded-lg bg-gradient-to-br from-rose-900 to-pink-900 transition-all ${
                  theme === "rose"
                    ? "border-2 border-white shadow-lg transform scale-105"
                    : "border border-white/10 opacity-60 hover:opacity-100"
                }`}
                aria-label="Rose Theme"
              />
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> Font Size
            </h3>
            <div className="px-2">
              <input
                type="range"
                min="1"
                max="3"
                value={fontSize === "small" ? 1 : fontSize === "large" ? 3 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val === 1) setFontSize("small");
                  else if (val === 3) setFontSize("large");
                  else setFontSize("medium");
                }}
                className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* TTS */}
          <div className="space-y-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Volume2 size={18} />
                </div>
                <span className="font-medium">Hourly Announcement</span>
              </div>
              <button 
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${ttsEnabled ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${ttsEnabled ? "left-7" : "left-1"}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Clock size={18} />
                </div>
                <span className="font-medium">Ticking Sound</span>
              </div>
              <button 
                onClick={() => setTickSoundEnabled(!tickSoundEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tickSoundEnabled ? "bg-blue-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${tickSoundEnabled ? "left-7" : "left-1"}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/5"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
