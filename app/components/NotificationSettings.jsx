"use client";
import React, { useState, useEffect } from 'react';

// VAPID Public Key - should match backend
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BFaip3G8l84m-VkODczkj2759AI5SPMnCGeYGTj-38GNfw2ikJIhkh1BPhtfPsvISeukD4BYA7rmnIk13fFTAgU";

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
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [notificationTime, setNotificationTime] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

            const response = await fetch('http://localhost:4000/api/notifications/subscribe', {
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

    // Subscribe to push notifications
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
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
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
                await fetch('http://localhost:4000/api/notifications/subscribe', {
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

    // Save notification preferences
    const savePreferences = async () => {
        const token = getAuthToken();
        if (!token) return;

        setIsLoading(true);
        setStatus("loading");

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await fetch('http://localhost:4000/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    notificationTime: notificationTime,
                    timezone: timezone
                })
            });

            if (response.ok) {
                setStatus("saved");
            } else {
                setStatus("error");
            }
        } catch (e) {
            console.error('Error saving preferences:', e);
            setStatus("error");
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

            const response = await fetch('http://localhost:4000/api/notifications/test', {
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
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
                    <button
                        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${isSubscribed
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading
                            ? 'Loading...'
                            : isSubscribed
                                ? 'Disable'
                                : 'Enable'}
                    </button>
                </div>

                {/* Notification Time Settings */}
                {isSubscribed && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <label className="block text-slate-600 text-sm font-medium mb-2">
                            Daily Study Reminder
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={notificationTime}
                                onChange={(e) => setNotificationTime(e.target.value)}
                                className="bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            <button
                                onClick={savePreferences}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm text-sm whitespace-nowrap disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Messages */}
                {status === 'success' && (
                    <p className="text-green-600 text-sm font-medium">
                        Done!
                    </p>
                )}
                {status === 'saved' && (
                    <p className="text-green-600 text-sm font-medium">Saved!</p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 text-sm font-medium">
                        Something went wrong.
                    </p>
                )}

                {/* Test Notification Button */}
                {isSubscribed && (
                    <div className="mt-2">
                        <button
                            onClick={sendTestNotification}
                            disabled={isLoading}
                            className="text-slate-500 hover:text-blue-600 text-sm font-medium underline transition-colors disabled:opacity-50"
                        >
                            Test Notification
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationSettings;
