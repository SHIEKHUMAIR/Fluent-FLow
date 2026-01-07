"use client";
import React, { useState, useEffect } from 'react';
import TimeSelectionModal from './TimeSelectionModal';

// VAPID Public Key - should match backend
// VAPID Public Key - fetches from backend now

// Convert VAPID key from base64 URL to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const NotificationSettings = () => {
    // Configuration for API URL
    const API_URL_LOCAL = "http://localhost:4000";
    const API_URL_DEPLOYED = "https://fluent-flow-backend.onrender.com";

    // Use environment variable first, then fallback to DEPLOYED
    const API_URL = API_URL_DEPLOYED;

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [notificationTime, setNotificationTime] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);

    // Get authentication token (check both localStorage and sessionStorage)
    const getAuthToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    // Sync subscription with backend
    const syncSubscription = async (subscription, showError = false) => {
        const token = getAuthToken();
        if (!token) {
            if (showError) {
                setStatus("error");
                alert("Please log in first to enable push notifications.");
            }
            return false;
        }

        try {
            const subscriptionData = subscription.toJSON ? subscription.toJSON() : subscription;

            const response = await fetch(`${API_URL}/api/notifications/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subscription: subscriptionData })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Failed to save subscription:', errorData);
                if (showError) {
                    setStatus("error");
                }
                return false;
            }

            console.log('Subscription synced with backend');
            return true;
        } catch (err) {
            console.error('Error syncing subscription:', err);
            if (showError) {
                setStatus("error");
            }
            return false;
        }
    };

    // Check browser support and existing subscription
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);

            // Check if already subscribed
            navigator.serviceWorker.ready
                .then(registration => {
                    console.log('Service Worker ready, checking subscription...');
                    return registration.pushManager.getSubscription();
                })
                .then(subscription => {
                    if (subscription) {
                        console.log('✅ Found existing subscription:', subscription);
                        setIsSubscribed(true);
                        // Sync with backend if user is logged in
                        const token = getAuthToken();
                        if (token) {
                            syncSubscription(subscription, false);

                            // Also fetch profile to get stored notification time
                            fetch(`${API_URL}/api/profile`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success && data.data && data.data.notificationTime) {
                                        setNotificationTime(data.data.notificationTime);
                                    }
                                })
                                .catch(err => console.error("Error fetching profile:", err));
                        }
                    } else {
                        console.log('No existing subscription found');
                        setIsSubscribed(false);
                    }
                })
                .catch(err => {
                    console.error('❌ Error checking subscription:', err);
                    setIsSubscribed(false);
                });
        } else {
            setIsSupported(false);
        }
    }, []);

    const subscribeUser = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("Please log in to enable notifications.");
            return;
        }

        if (!isSupported) return;

        setIsLoading(true);
        setStatus("loading");

        try {
            // Fetch VAPID Key from backend
            const keyResponse = await fetch(`${API_URL}/api/notifications/vapid-public-key`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!keyResponse.ok) {
                throw new Error("Failed to fetch VAPID public key");
            }

            const { publicKey } = await keyResponse.json();

            if (!publicKey) {
                throw new Error("VAPID public key not found in response");
            }

            let permission = Notification.permission;
            if (permission === 'default') {
                permission = await Notification.requestPermission();
            }

            if (permission !== 'granted') {
                alert("Notification permission required.");
                setIsLoading(false);
                setStatus("error");
                return;
            }

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                });
            } else {
                // Check if key matches? Hard to do with existing subscription. 
                // If we are here, we have a subscription. 
                // We should probably just sync it?
                // But if the key changed, the existing subscription is invalid for the *new* key.
                // However, we don't know if the key changed unless we compare. 
                // Ideally: Unsubscribe and Resubscribe to ensure we are on the latest key.
                // Let's force update if we are explicitly clicking "enable" (switch toggled on).

                // If the user *already* had a subscription, `useEffect` checked it.
                // `subscribeUser` is called when user toggles the switch ON.
                // So if they are toggling ON, we might want to ensure it's fresh.

                // Let's try to unsubscribe and resubscribe to be safe?
                // Or just trust `getSubscription`.
                // If the old one was created with a different key, `syncSubscription` will send it to backend.
                // Backend will store it. Attempts to send might fail if the key doesn't match the backend's *private* key.
                // Wait, Subscription is bound to the pair (public, private).
                // If the browser thinks it's valid, it means it's valid for *that* public key.
                // If we send it to the backend, and the backend uses a *different* private key (mismatch),
                // then sending will fail (403).

                // So, to fix the "mismatch", we MUST ensure the client subscription is created with the CURRENT backend public key.
                // The only way to ensure that is to unsubscribe and resubscribe if we can't validate the key.
                // Let's modify logic: If we have a subscription, we unsubscribe first, then resubscribe with new key.
                // This guarantees consistency.

                await subscription.unsubscribe();
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                });
            }

            const saved = await syncSubscription(subscription, true);

            if (saved) {
                setIsSubscribed(true);
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error('Failed to subscribe:', err);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    // Unsubscribe from push notifications
    const unsubscribeUser = async () => {
        setIsLoading(true);
        setStatus("loading");

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
            }

            const token = getAuthToken();
            if (token) {
                await fetch(`${API_URL}/api/notifications/subscribe`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).catch(err => console.error('Error removing subscription:', err));
            }

            setIsSubscribed(false);
            setStatus("");
        } catch (err) {
            console.error('Failed to unsubscribe:', err);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTimeModal = () => {
        setShowTimeModal(!showTimeModal);
    };

    const handleTimeSave = (newTime) => {
        setNotificationTime(newTime);
        savePreferences(newTime);
    };

    // Modified savePreferences to accept optional time override
    const savePreferences = async (timeOverride) => {
        const token = getAuthToken();
        if (!token) return;

        setIsLoading(true);
        setStatus("loading");

        const timeToSave = typeof timeOverride === 'string' ? timeOverride : notificationTime;

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await fetch(`${API_URL}/api/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    notificationTime: timeToSave,
                    timezone: timezone
                })
            });

            if (response.ok) {
                setStatus("saved");
                // Update local state if it was an override
                if (typeof timeOverride === 'string') {
                    setNotificationTime(timeOverride);
                }
            } else {
                setStatus("error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Send test notification
    const sendTestNotification = async () => {
        const token = getAuthToken();
        if (!token) return;

        setIsLoading(true);
        setStatus("loading");

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/api/notifications/test`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setStatus("success");
                alert("Test notification sent!");
            } else {
                setStatus("error");
                const data = await response.json();
                if (data.expired || data.notFound || data.invalid) {
                    setIsSubscribed(false);
                    alert("Subscription invalid. Please re-enable notifications.");
                }
            }
        } catch (e) {
            setStatus("error");
            console.error('Error sending test:', e);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Notification Settings</h3>

            <div className="flex flex-col gap-4">
                {/* Enable/Disable Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-slate-700 font-medium block">Push Notifications</span>
                        <span className="text-slate-500 text-sm">
                            {isSubscribed ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>


                    <label className="ff-toggle">
                        <input
                            type="checkbox"
                            checked={isSubscribed}
                            onChange={isSubscribed ? unsubscribeUser : subscribeUser}
                            disabled={isLoading}
                        />
                        <div className="ff-toggle-track">
                            <div className="ff-toggle-thumb"></div>
                        </div>
                    </label>
                </div>

                {/* Notification Time Settings - New Button Style */}
                {isSubscribed && (
                    <div className="mt-4 border-t border-slate-100 pt-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-slate-800 font-semibold mb-1">
                                    Daily Reminder
                                </label>
                                <p className="text-slate-500 text-sm">
                                    Currently set to <span className="text-blue-600 font-bold">
                                        {notificationTime ? new Date(`2000-01-01T${notificationTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : "Not set"}
                                    </span>
                                </p>
                            </div>

                            {/* New Set Timer Button */}
                            <button className="ff-button" onClick={() => setShowTimeModal(true)}>
                                <svg viewBox="0 0 448 512" className="ff-bell">
                                    <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                                </svg>
                                Set Timer
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Messages */}
                {status === 'success' && (
                    <p className="text-green-600 text-sm font-medium animate-pulse">
                        Notifications enabled!
                    </p>
                )}
                {status === 'saved' && (
                    <p className="text-green-600 text-sm font-medium">Preferences saved successfully!</p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 text-sm font-medium">
                        Something went wrong. Please try again.
                    </p>
                )}


            </div>

            <TimeSelectionModal
                isOpen={showTimeModal}
                onClose={() => setShowTimeModal(false)}
                onSave={handleTimeSave}
                initialTime={notificationTime}
            />
        </div>
    );
};

export default NotificationSettings;
