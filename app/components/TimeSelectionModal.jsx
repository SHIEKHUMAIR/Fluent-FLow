
import React, { useState, useEffect } from 'react';

const TimeSelectionModal = ({ isOpen, onClose, onSave, initialTime = "09:00" }) => {
    const [selectedHour, setSelectedHour] = useState("09");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [period, setPeriod] = useState("AM"); // AM or PM
    const [isClosing, setIsClosing] = useState(false);

    // Initialize state from initialTime prop
    useEffect(() => {
        if (initialTime) {
            const [h, m] = initialTime.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                let hour12 = h;
                let p = "AM";

                if (h >= 12) {
                    p = "PM";
                    if (h > 12) hour12 = h - 12;
                }
                if (h === 0) hour12 = 12;

                setSelectedHour(String(hour12).padStart(2, '0'));
                setSelectedMinute(String(m).padStart(2, '0'));
                setPeriod(p);
            }
        }
    }, [initialTime, isOpen]);

    const handleSave = () => {
        let h = parseInt(selectedHour);
        let m = parseInt(selectedMinute);

        if (isNaN(h) || h < 1 || h > 12) h = 12; // Default to 12 if invalid
        if (isNaN(m) || m < 0 || m > 59) m = 0;

        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;

        const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        onSave(timeString);
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Match animation duration
    };

    const handleHourChange = (e) => {
        let val = e.target.value;
        if (val.length > 2) val = val.slice(0, 2);

        // Allow typing, validate on blur strictly
        setSelectedHour(val);

        // Auto move to minutes if length is 2 and valid? 
        // Simple UX: just let them type.
    };

    const handleHourBlur = () => {
        let h = parseInt(selectedHour);
        if (isNaN(h) || h < 1) h = 1;
        if (h > 12) h = 12;
        setSelectedHour(String(h).padStart(2, '0'));
    };

    const handleMinuteChange = (e) => {
        let val = e.target.value;
        if (val.length > 2) val = val.slice(0, 2);
        setSelectedMinute(val);
    };

    const handleMinuteBlur = () => {
        let m = parseInt(selectedMinute);
        if (isNaN(m) || m < 0) m = 0;
        if (m > 59) m = 59;
        setSelectedMinute(String(m).padStart(2, '0'));
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

            <div className={`relative w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl p-8 
                      shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
                      border border-white/40 overflow-hidden transform transition-all duration-300 ${isOpen && !isClosing ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

                {/* Ambient gradient - subtler */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-transparent pointer-events-none" />

                {/* Header */}
                <h2 className="text-center text-slate-800 font-bold text-2xl mb-2 relative z-10">Set Daily Reminder</h2>
                <p className="text-center text-slate-500 text-sm mb-8 relative z-10">Type or select when to remember</p>

                {/* Time Picker Container */}
                <div className="relative mb-8 flex items-center justify-center gap-2 h-48">

                    {/* Hours Input */}
                    <div className="flex flex-col items-center z-10 w-24">
                        <span className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Hour</span>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={selectedHour}
                            onChange={handleHourChange}
                            onBlur={handleHourBlur}
                            className="w-full bg-slate-50 text-center text-5xl font-bold text-slate-800 rounded-2xl border border-transparent hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all py-4"
                        />
                    </div>

                    <span className="flex items-center text-4xl font-light text-slate-300 pb-8">:</span>

                    {/* Minutes Input */}
                    <div className="flex flex-col items-center z-10 w-24">
                        <span className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Minute</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={selectedMinute}
                            onChange={handleMinuteChange}
                            onBlur={handleMinuteBlur}
                            className="w-full bg-slate-50 text-center text-5xl font-bold text-slate-800 rounded-2xl border border-transparent hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all py-4"
                        />
                    </div>

                    {/* AM/PM Toggle */}
                    <div className="flex flex-col items-center z-10 w-16 ml-2 h-[120px] justify-between">
                        <button
                            onClick={() => setPeriod("AM")}
                            className={`flex flex-1 w-full items-center justify-center rounded-xl transition-all duration-200 mb-2 font-bold text-lg ${period === 'AM' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            AM
                        </button>
                        <button
                            onClick={() => setPeriod("PM")}
                            className={`flex flex-1 w-full items-center justify-center rounded-xl transition-all duration-200 font-bold text-lg ${period === 'PM' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            PM
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 px-4 rounded-xl bg-blue-900 text-white font-bold shadow-lg hover:bg-blue-800 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        Save Time
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeSelectionModal;
