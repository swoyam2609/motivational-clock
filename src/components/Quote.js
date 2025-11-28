import React, { useState, useEffect } from 'react';
import { fetchQuote } from '../services/gemini';

const Quote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const getQuote = async () => {
            const newQuote = await fetchQuote();
            setQuote(newQuote);
        };

        getQuote(); // Initial fetch

        const interval = setInterval(() => {
            getQuote();
        }, 60000); // Fetch every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="quote-container">
            <p className="quote-text">{quote}</p>
        </div>
    );
};

export default Quote;
