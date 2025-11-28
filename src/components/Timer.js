import React, { useState, useEffect } from 'react';

const Timer = ({ totalSeconds, onComplete }) => {
    const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning || timeRemaining <= 0) {
            if (timeRemaining <= 0 && onComplete) {
                onComplete();
            }
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeRemaining, onComplete]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return {
                hours: hours < 10 ? `0${hours}` : `${hours}`,
                minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
                seconds: secs < 10 ? `0${secs}` : `${secs}`,
            };
        } else {
            return {
                hours: null,
                minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
                seconds: secs < 10 ? `0${secs}` : `${secs}`,
            };
        }
    };

    const { hours, minutes, seconds } = formatTime(timeRemaining);
    const percentage = (timeRemaining / totalSeconds) * 100;
    
    // Determine color based on percentage
    let timeColor = '#87ceeb'; // Default light blue
    if (percentage < 10) {
        timeColor = '#ff4444'; // Red
    } else if (percentage < 40) {
        timeColor = '#ffaa00'; // Yellow
    }

    return (
        <div className="timer-container">
            <div className="timer-time" style={{ color: timeColor }}>
                {hours && (
                    <>
                        {hours}
                        <span className="clock-colon" style={{ color: timeColor }}>
                            <span className="clock-colon-dot" style={{ backgroundColor: timeColor }}></span>
                            <span className="clock-colon-dot" style={{ backgroundColor: timeColor }}></span>
                        </span>
                    </>
                )}
                {minutes}
                <span className="clock-colon" style={{ color: timeColor }}>
                    <span className="clock-colon-dot" style={{ backgroundColor: timeColor }}></span>
                    <span className="clock-colon-dot" style={{ backgroundColor: timeColor }}></span>
                </span>
                {seconds}
            </div>
        </div>
    );
};

export default Timer;

