'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ARLearningPage = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const handleStartCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setPermissionGranted(true);
            setIsScanning(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have granted permission.");
        }
    };

    const handleStopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
        setPermissionGranted(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">

            {/* Background / Camera Feed */}
            <div className="absolute inset-0 z-0">
                {permissionGranted ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover bg-black"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        {/* Abstract tech background */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent" />
                            <div className="grid grid-cols-12 h-full w-full opacity-30">
                                {Array.from({ length: 48 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-blue-500/20" />
                                ))}
                            </div>
                        </div>

                        {/* Camera Offline Visual */}
                        <div className="relative z-10 flex flex-col items-center text-slate-500">
                            <div className="w-24 h-24 rounded-full border-2 border-slate-700 flex items-center justify-center mb-6 relative bg-slate-800/50 backdrop-blur-sm">
                                <div className="w-20 h-20 rounded-full border border-slate-600 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                {/* Decorative blips */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                            </div>
                            <h3 className="text-xl font-medium text-slate-300 mb-2">Camera Offline</h3>
                            <p className="text-sm text-slate-500">Initialize scanner to begin</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay UI */}
            <div className="relative z-20 flex-1 flex flex-col p-6">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/modules">
                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/5">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className="text-white text-sm font-medium tracking-wider">AR SCANNER</span>
                    </div>
                    <div className="w-10" /> {/* Spacer for balance */}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative">

                    {/* Scanning Frame */}
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 border-2 border-white/30 rounded-3xl overflow-hidden">
                        {/* Corner Markers */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                        {/* Scanning Animation */}
                        {isScanning && (
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-blue-400/80 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        )}

                        {/* Center Crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <div className="w-4 h-4 border border-white rounded-full" />
                        </div>
                    </div>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center max-w-xs"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {isScanning ? "Scanning Object..." : "Object Recognition"}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {isScanning
                                ? "Keep the object centered in the frame for better recognition."
                                : "Point your camera at everyday objects to learn their names in Mandarin."}
                        </p>
                    </motion.div>

                </div>

                {/* Bottom Controls */}
                <div className="mt-8 flex justify-center pb-8">
                    {!isScanning ? (
                        <button
                            onClick={handleStartCamera}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105 flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Start Camera
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button
                                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/20 transition-all"
                                onClick={handleStopCamera}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <button className="bg-white text-blue-900 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 transform hover:scale-105 transition-all border-4 border-blue-500/30 bg-clip-padding">
                                <div className="w-16 h-16 rounded-full border-2 border-blue-900/20" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ARLearningPage;
