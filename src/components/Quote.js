import React, { useState, useEffect, useRef } from 'react';
import { fetchQuote } from '../services/gemini';

const Quote = ({ onTimeRemainingChange }) => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(15);
    const [isVisible, setIsVisible] = useState(true);
    const quoteRef = useRef('');
    const REFRESH_INTERVAL = 15000; // 15 seconds

    useEffect(() => {
        if (onTimeRemainingChange) {
            onTimeRemainingChange(timeRemaining);
        }
    }, [timeRemaining, onTimeRemainingChange]);

    useEffect(() => {
        quoteRef.current = quote;
    }, [quote]);

    useEffect(() => {
        const getQuote = async () => {
            // Fade out
            setIsVisible(false);

            // Wait for fade out animation
            setTimeout(async () => {
                const result = await fetchQuote(quoteRef.current);
                setQuote(result.quote);
                setAuthor(result.author);
                setTimeRemaining(15); // Reset countdown

                // Fade in
                setIsVisible(true);
            }, 300); // Match CSS transition duration
        };

        getQuote(); // Initial fetch

        const quoteInterval = setInterval(() => {
            getQuote();
        }, REFRESH_INTERVAL);

        // Smooth countdown timer - update every 100ms for smoother animation
        const countdownInterval = setInterval(() => {
            setTimeRemaining((prev) => {
                const newValue = prev - 0.1;
                if (newValue <= 0) {
                    return 15; // Reset to 15 when it reaches 0
                }
                return Math.max(0, newValue);
            });
        }, 100); // Update every 100ms instead of 1000ms

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
            <div className={`quote-content ${isVisible ? 'quote-visible' : 'quote-hidden'}`}>
                <p className="quote-text">{quote}</p>
                {author && <p className="quote-author">— {author}</p>}
            </div>
        </div>
    );
};

export default Quote;
