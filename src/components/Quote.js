import React, { useState, useEffect, useRef } from 'react';
import { fetchQuote } from '../services/gemini';

const Quote = ({ onTimeRemainingChange }) => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
    const [isVisible, setIsVisible] = useState(true);
    const quoteHistoryRef = useRef([]); // Store up to 50 quotes
    const MAX_HISTORY_SIZE = 50;
    const REFRESH_INTERVAL = 120000; // 2 minutes (120 seconds)

    useEffect(() => {
        if (onTimeRemainingChange) {
            onTimeRemainingChange(timeRemaining);
        }
    }, [timeRemaining, onTimeRemainingChange]);

    useEffect(() => {
        const getQuote = async () => {
            // Fade out
            setIsVisible(false);

            // Wait for fade out animation
            setTimeout(async () => {
                // Get previous quotes list (max 50)
                const previousQuotes = quoteHistoryRef.current;
                
                const result = await fetchQuote(previousQuotes);
                
                // Add new quote to history
                const newQuote = result.quote;
                quoteHistoryRef.current.push(newQuote);
                
                // Maintain max size of 50 - remove oldest if exceeds
                if (quoteHistoryRef.current.length > MAX_HISTORY_SIZE) {
                    quoteHistoryRef.current.shift(); // Remove oldest quote
                }
                
                setQuote(result.quote);
                setAuthor(result.author);
                setTimeRemaining(120); // Reset countdown to 2 minutes

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
                    return 120; // Reset to 120 seconds (2 minutes) when it reaches 0
                }
                return Math.max(0, newValue);
            });
        }, 100); // Update every 100ms instead of 1000ms

        return () => {
            clearInterval(quoteInterval);
            clearInterval(countdownInterval);
        };
    }, []);

    // Calculate progress percentage (0 to 100) - based on 120 seconds
    const progress = ((120 - timeRemaining) / 120) * 100;
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
