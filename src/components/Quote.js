import React, { useState, useEffect, useRef } from 'react';
import { fetchQuote } from '../services/gemini';

const Quote = () => {
    const [quote, setQuote] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(120);
    const quoteRef = useRef('');
    const REFRESH_INTERVAL = 120000; // 2 minutes

    useEffect(() => {
        quoteRef.current = quote;
    }, [quote]);

    useEffect(() => {
        const getQuote = async () => {
            const newQuote = await fetchQuote(quoteRef.current);
            setQuote(newQuote);
            setTimeRemaining(120); // Reset countdown
        };

        getQuote(); // Initial fetch

        const quoteInterval = setInterval(() => {
            getQuote();
        }, REFRESH_INTERVAL);

        // Countdown timer
        const countdownInterval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    return 120; // Reset to 120 when it reaches 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(quoteInterval);
            clearInterval(countdownInterval);
        };
    }, []);

    // Calculate progress percentage (0 to 100)
    const progress = ((120 - timeRemaining) / 120) * 100;
    const circumference = 2 * Math.PI * 12; // radius = 12 (larger circle)
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="quote-container">
            <div className="quote-with-progress">
                <div className="quote-progress-circle">
                    <svg width="28" height="28" viewBox="0 0 28 28">
                        <circle
                            cx="14"
                            cy="14"
                            r="12"
                            fill="none"
                            stroke="rgba(135, 206, 235, 0.2)"
                            strokeWidth="2"
                        />
                        <circle
                            cx="14"
                            cy="14"
                            r="12"
                            fill="none"
                            stroke="#87ceeb"
                            strokeWidth="2"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 14 14)"
                            opacity="0.7"
                        />
                    </svg>
                </div>
                <p className="quote-text">{quote}</p>
            </div>
        </div>
    );
};

export default Quote;
