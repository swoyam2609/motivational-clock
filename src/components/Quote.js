import React, { useState, useEffect, useRef } from 'react';
import { fetchQuote } from '../services/gemini';

const Quote = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(15);
    const quoteRef = useRef('');
    const REFRESH_INTERVAL = 15000; // 15 seconds

    useEffect(() => {
        quoteRef.current = quote;
    }, [quote]);

    useEffect(() => {
        const getQuote = async () => {
            const result = await fetchQuote(quoteRef.current);
            setQuote(result.quote);
            setAuthor(result.author);
            setTimeRemaining(15); // Reset countdown
        };

        getQuote(); // Initial fetch

        const quoteInterval = setInterval(() => {
            getQuote();
        }, REFRESH_INTERVAL);

        // Countdown timer
        const countdownInterval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    return 15; // Reset to 15 when it reaches 0
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
    const progress = ((15 - timeRemaining) / 15) * 100;
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
                <div className="quote-content">
                    <p className="quote-text">{quote}</p>
                    {author && <p className="quote-author">— {author}</p>}
                </div>
            </div>
        </div>
    );
};

export default Quote;
