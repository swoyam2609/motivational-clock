import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete(name.trim());
        }
    };

    return (
        <div className="onboarding-container">
            <form onSubmit={handleSubmit} className="onboarding-form">
                <h1 className="onboarding-title">Hello, what's your name?</h1>
                <input
                    type="text"
                    className="onboarding-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Type your name here"
                    autoFocus
                />
            </form>
        </div>
    );
};

export default Onboarding;
