import React, { useState, useEffect, useRef } from 'react';
import Clock from './Clock';
import Quote from './Quote';
import Timer from './Timer';
import TimerModal from './TimerModal';

const QuoteProgressBar = ({ timeRemaining }) => {
    const progress = ((15 - timeRemaining) / 15) * 100;
    const size = 24; // Base size, will scale with CSS
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="quote-progress-bar">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(135, 206, 235, 0.2)"
                    strokeWidth="3.5"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#87ceeb"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    opacity="0.7"
                />
            </svg>
        </div>
    );
};

const Dashboard = ({ userName }) => {
    const [isTimerMode, setIsTimerMode] = useState(false);
    const [timerDuration, setTimerDuration] = useState(null);
    const [showTimerModal, setShowTimerModal] = useState(false);
    const [isAlarmRinging, setIsAlarmRinging] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [quoteTimeRemaining, setQuoteTimeRemaining] = useState(15);
    const alarmIntervalRef = useRef(null);
    const audioContextRef = useRef(null);
    const activeOscillatorsRef = useRef([]);
    const isAlarmStoppedRef = useRef(false);

    const getDateString = () => {
        const date = new Date();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        return `${dayName} ${dayNumber}`;
    };

    const playAlarmSound = () => {
        // Don't play if alarm is stopped
        if (isAlarmStoppedRef.current) {
            return;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Check if context is closed
        if (audioContext.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Store reference to stop if needed
        activeOscillatorsRef.current.push({ oscillator, gainNode });

        // Clean up after sound finishes
        setTimeout(() => {
            activeOscillatorsRef.current = activeOscillatorsRef.current.filter(
                item => item.oscillator !== oscillator
            );
        }, 600);
    };

    const startContinuousAlarm = () => {
        isAlarmStoppedRef.current = false;
        setIsAlarmRinging(true);
        // Play immediately
        playAlarmSound();
        // Then play every 0.6 seconds
        alarmIntervalRef.current = setInterval(() => {
            playAlarmSound();
        }, 600);
    };

    const stopAlarm = () => {
        // Set flag to prevent new sounds
        isAlarmStoppedRef.current = true;

        // Stop the interval immediately
        if (alarmIntervalRef.current) {
            clearInterval(alarmIntervalRef.current);
            alarmIntervalRef.current = null;
        }

        // Immediately mute all active oscillators by setting gain to 0
        const currentTime = audioContextRef.current?.currentTime || 0;
        activeOscillatorsRef.current.forEach(({ oscillator, gainNode }) => {
            try {
                // Cancel any scheduled gain changes
                gainNode.gain.cancelScheduledValues(currentTime);
                // Immediately set gain to 0 to mute the sound
                gainNode.gain.setValueAtTime(0, currentTime);
                // Stop the oscillator
                if (oscillator.state !== 'finished' && oscillator.state !== 'stopped') {
                    oscillator.stop();
                }
            } catch (e) {
                // Oscillator might already be stopped or in an invalid state
                console.log('Error stopping oscillator:', e);
            }
        });
        activeOscillatorsRef.current = [];

        // Close audio context to ensure all sounds stop
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(() => { });
        }
        audioContextRef.current = null;

        setIsAlarmRinging(false);
        setIsTimerMode(false);
        setTimerDuration(null);
    };

    useEffect(() => {
        return () => {
            if (alarmIntervalRef.current) {
                clearInterval(alarmIntervalRef.current);
            }
        };
    }, []);

    const handleTimerComplete = () => {
        startContinuousAlarm();
    };

    const handleStartTimer = (totalSeconds) => {
        setTimerDuration(totalSeconds);
        setIsTimerMode(true);
    };

    const handleExitTimerMode = () => {
        setIsTimerMode(false);
        setTimerDuration(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(() => {
                // Fullscreen not supported or denied
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="dashboard-container">
            <div className="top-left-buttons">
                <button
                    className="fullscreen-button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    )}
                </button>

                {!isTimerMode && (
                    <button
                        className="timer-mode-button"
                        onClick={() => setShowTimerModal(true)}
                        title="Switch to Timer Mode"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </button>
                )}

                {isTimerMode && !isAlarmRinging && (
                    <button
                        className="exit-timer-button"
                        onClick={handleExitTimerMode}
                        title="Exit Timer Mode"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>

            {isAlarmRinging && (
                <div className="alarm-overlay">
                    <div className="alarm-content">
                        <div className="alarm-icon">🔔</div>
                        <h2 className="alarm-title">Timer Complete!</h2>
                        <button className="alarm-dismiss-button" onClick={stopAlarm}>
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <TimerModal
                isOpen={showTimerModal}
                onClose={() => setShowTimerModal(false)}
                onStartTimer={handleStartTimer}
            />

            <div className="top-right-info">
                <div className="date-with-progress">
                    <div className="date-display">{getDateString()}</div>
                    <QuoteProgressBar timeRemaining={quoteTimeRemaining} />
                </div>
                <Quote onTimeRemainingChange={setQuoteTimeRemaining} />
            </div>
            <div className="center-content">
                {isTimerMode && timerDuration ? (
                    <Timer
                        totalSeconds={timerDuration}
                        onComplete={handleTimerComplete}
                    />
                ) : (
                    <Clock />
                )}
            </div>
            <div className="bottom-right-name">
                {userName.toUpperCase()}
            </div>
        </div>
    );
};

export default Dashboard;
