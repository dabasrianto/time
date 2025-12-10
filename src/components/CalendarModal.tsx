import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatHijriDate } from "../lib/hijri";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal = ({ isOpen, onClose }: CalendarModalProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  if (!isOpen) return null;

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  // Total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate array of days for the calendar
  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
    );
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Format month and year
  const formatMonthYear = () => {
    return currentDate.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="jam-card w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {formatMonthYear()}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousMonth} className="jam-button">
            <ChevronLeft size={18} />
            Previous
          </button>
          <button onClick={goToNextMonth} className="jam-button">
            Next
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-gray-300 font-medium py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square p-1 text-center ${day ? "" : ""}`}
            >
              {day && (
                <div
                  className={`flex flex-col items-center justify-center h-full rounded-lg ${isToday(day) ? "bg-purple-700/50 border border-purple-500" : "hover:bg-white/10"}`}
                >
                  <span className="text-sm md:text-base">{day.getDate()}</span>
                  <span className="text-xs text-gray-400">
                    {formatHijriDate(day, "id-ID", true)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
