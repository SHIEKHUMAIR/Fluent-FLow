'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ARLearningPage = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const containerRef = useRef(null);
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);

    // Circle size controls the focus area (in pixels on screen)
    const CIRCLE_SIZE = 500;

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
            setResult(null);
            setCapturedImage(null);
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have granted permission.");
        }
    };

    const captureImage = async () => {
        if (!videoRef.current || !containerRef.current) return;

        setIsAnalyzing(true);
        const video = videoRef.current;
        const container = containerRef.current;

        // Calculate crop coordinates
        const videoW = video.videoWidth;
        const videoH = video.videoHeight;
        const containerW = container.clientWidth;
        const containerH = container.clientHeight;

        const videoAspect = videoW / videoH;
        const containerAspect = containerW / containerH;

        let scale;
        // Object-fit: cover logic
        if (containerAspect > videoAspect) {
            // Container is wider than video (relatively) -> video is fitted by width, top/bottom cropped
            // Actually if container is wider, we scale video up to match container width. 
            // Height will be larger.
            scale = containerW / videoW;
        } else {
            // Container is taller -> video fitted by height, sides cropped
            scale = containerH / videoH;
        }

        // The circle is centered in the container.
        // We want the corresponding region in the video source.
        // Circle size on screen is CIRCLE_SIZE.
        const regionSizeInSource = CIRCLE_SIZE / scale;

        // Center of video source
        const centerX = videoW / 2;
        const centerY = videoH / 2;

        const cropX = centerX - (regionSizeInSource / 2);
        const cropY = centerY - (regionSizeInSource / 2);

        const canvas = document.createElement("canvas");
        // We want the output to be square, matching the crop
        canvas.width = regionSizeInSource;
        canvas.height = regionSizeInSource;

        const ctx = canvas.getContext("2d");

        // Draw only the cropped region
        ctx.drawImage(
            video,
            cropX, cropY, regionSizeInSource, regionSizeInSource, // Source x, y, w, h
            0, 0, canvas.width, canvas.height                 // Dest x, y, w, h
        );

        // Set captured image for display
        const imageUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageUrl);

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append("file", blob, "capture.jpg");

            // Configuration for AR Module URL
            const API_URL_LOCAL = "http://localhost:7860/analyze";
            const API_URL_DEPLOYED = "https://shiekhumair-ar-object-detector.hf.space/analyze";

            // Toggle this to switch between local and deployed versions
            const API_URL = API_URL_DEPLOYED;

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                console.log("Analysis Result:", data);
                setResult(data);
            } catch (error) {
                console.error("Error analyzing image:", error);
                setError("Unable to connect to the server. Please check your internet connection or try again later.");
            } finally {
                setIsAnalyzing(false);
            }
        }, "image/jpeg");
    };

    const handleStopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
        setPermissionGranted(false);
        setResult(null);
        setCapturedImage(null);
        setError(null);
    };

    const resetScan = () => {
        setResult(null);
        setCapturedImage(null);
        setIsAnalyzing(false);
        setError(null);
    };

    const handlePlay = async (chineseText) => {
        if (!chineseText) return;
        const utterance = new SpeechSynthesisUtterance(chineseText);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;

        const voices = window.speechSynthesis.getVoices();
        const chineseVoice = voices.find(
            (v) =>
                v.lang.toLowerCase().includes("zh-cn") ||
                v.name.toLowerCase().includes("chinese") ||
                v.name.toLowerCase().includes("xiaoxiao") ||
                v.name.toLowerCase().includes("huihui")
        );
        if (chineseVoice) utterance.voice = chineseVoice;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Effect to attach stream to video element when it becomes available
    useEffect(() => {
        if (permissionGranted && videoRef.current && streamRef.current && !capturedImage) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [permissionGranted, capturedImage]);


    return (
        <div ref={containerRef} className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">

            {/* Background / Camera Feed */}
            <div className="absolute inset-0 z-0">
                {capturedImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        {/* Show the clipped rounded image to match the circle view */}
                        <img
                            src={capturedImage}
                            alt="Captured"
                            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                            className="rounded-full object-cover border-4 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        />
                    </div>
                ) : permissionGranted ? (
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

            {/* Dark Overlay with Circular Hole */}
            {isScanning && !capturedImage && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* 
                       Using a large box-shadow on a centered element is a performant way to create a 'hole' 
                     */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                        style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                    >
                        {/* Scanning beam animation inside the circle */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full rounded-full overflow-hidden opacity-50"
                        >
                            <motion.div
                                className="w-full h-[20%] bg-blue-500/30 blur-md absolute top-[-20%]"
                                animate={{ top: ['-20%', '120%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-sm font-medium mt-[180px]">
                        Align object in circle
                    </div>
                </div>
            )}

            {/* Overlay UI */}
            <div className="relative z-20 flex-1 flex flex-col p-6 pointer-events-none">
                {/* Navbar needs pointer-events-auto */}
                <div className="flex items-center justify-between mb-8 pointer-events-auto">
                    <Link href="/dashboard">
                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/5">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </Link>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className="text-white text-sm font-medium tracking-wider">AR SCANNER</span>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Main Content Area - Just for messages/results */}
                <div className="flex-1 flex flex-col items-center justify-center relative pointer-events-auto">

                    {/* Instructions */}
                    {!result && !error && !capturedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-24 text-center max-w-xs"
                        >
                            <h3 className="text-2xl font-bold text-white mb-2 shadow-black drop-shadow-lg">
                                {isAnalyzing ? "Analyzing..." : (isScanning ? "" : "Object Recognition")}
                            </h3>
                        </motion.div>
                    )}

                    {/* Error Card Overlay */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute bottom-24 left-0 right-0 mx-4 bg-red-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-red-500/40 z-50 text-center"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-red-800/50 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">Analysis Failed</h3>
                                <p className="text-red-100 text-sm mb-4 leading-relaxed">{error}</p>
                                <button
                                    onClick={resetScan}
                                    className="bg-white text-red-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Result Card Overlay */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute bottom-24 left-0 right-0 mx-4 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40 z-50"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-3xl font-extrabold text-blue-900">{result.chinese}</h2>
                                        <button
                                            onClick={() => handlePlay(result.chinese)}
                                            className="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition-colors"
                                            aria-label="Play pronunciation"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15l-2.829 2.828A2 2 0 002 19.243V21h1.586a1 1 0 001.414-.586l11.002-4.401a.998.998 0 000-1.854l-11.002-4.401a1 1 0 00-1.414.586z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">{result.pinyin}</p>
                                    <h3 className="text-xl font-bold text-slate-800">{result.object}</h3>
                                </div>
                                <button onClick={resetScan} className="p-1 bg-slate-100 rounded-full hover:bg-slate-200">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="w-full h-px bg-slate-200 my-3" />
                            <p className="text-slate-600 italic">"{result.sentence}"</p>
                        </motion.div>
                    )}

                </div>

                {/* Bottom Controls needs pointer-events-auto */}
                <div className="mt-8 flex justify-center pb-8 pointer-events-auto">
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
                        <div className="flex gap-4 items-center">
                            {/* Stop Camera Button */}
                            <button
                                className={`bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/20 transition-all ${capturedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleStopCamera}
                                disabled={Boolean(capturedImage)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Capture Button */}
                            {!capturedImage && (
                                <button
                                    onClick={captureImage}
                                    disabled={isAnalyzing}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/30 transform hover:scale-105 transition-all border-4 border-white/30 bg-clip-padding ${isAnalyzing ? 'bg-gray-400' : 'bg-white'}`}
                                >
                                    <div className={`w-16 h-16 rounded-full border-2 ${isAnalyzing ? 'border-gray-300 animate-pulse' : 'border-blue-900/20'}`} />
                                </button>
                            )}

                            {capturedImage && !result && !error && (
                                <div className="h-20 flex items-center justify-center">
                                    <div className="text-white text-sm animate-pulse font-medium">Processing...</div>
                                </div>
                            )}

                            <div className="w-12" /> {/* Spacer for balance */}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ARLearningPage;
