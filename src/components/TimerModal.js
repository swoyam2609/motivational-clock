import React, { useState } from 'react';

const TimerModal = ({ isOpen, onClose, onStartTimer }) => {
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [seconds, setSeconds] = useState('0');

    if (!isOpen) return null;

    const adjustValue = (type, delta) => {
        const current = parseInt(type === 'hours' ? hours : type === 'minutes' ? minutes : seconds) || 0;
        const max = type === 'hours' ? 99 : 59;
        const min = 0;
        const newValue = Math.max(min, Math.min(max, current + delta));

        if (type === 'hours') setHours(String(newValue));
        else if (type === 'minutes') setMinutes(String(newValue));
        else setSeconds(String(newValue));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalSeconds =
            (parseInt(hours) || 0) * 3600 +
            (parseInt(minutes) || 0) * 60 +
            (parseInt(seconds) || 0);

        if (totalSeconds > 0) {
            onStartTimer(totalSeconds);
            setHours('0');
            setMinutes('0');
            setSeconds('0');
            onClose();
        }
    };

    const handleCancel = () => {
        setHours('0');
        setMinutes('0');
        setSeconds('0');
        onClose();
    };

    const TimeInput = ({ label, value, onChange, onIncrement, onDecrement, max }) => (
        <div className="timer-input-wrapper">
            <label className="timer-input-label">{label}</label>
            <div className="timer-input-container">
                <button
                    type="button"
                    className="timer-input-arrow timer-input-arrow-up"
                    onClick={onIncrement}
                    aria-label={`Increment ${label}`}
                >
                    ▲
                </button>
                <input
                    type="number"
                    min="0"
                    max={max}
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value === '' ? '0' : e.target.value;
                        onChange(val);
                    }}
                    className="timer-input"
                />
                <button
                    type="button"
                    className="timer-input-arrow timer-input-arrow-down"
                    onClick={onDecrement}
                    aria-label={`Decrement ${label}`}
                >
                    ▼
                </button>
            </div>
        </div>
    );

    return (
        <div className="timer-modal-overlay" onClick={handleCancel}>
            <div className="timer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="timer-modal-header">
                    <h2 className="timer-modal-title">Set Timer</h2>
                    <button
                        className="timer-modal-close"
                        onClick={handleCancel}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="timer-modal-form">
                    <div className="timer-input-group">
                        <TimeInput
                            label="Hours"
                            value={hours}
                            onChange={setHours}
                            onIncrement={() => adjustValue('hours', 1)}
                            onDecrement={() => adjustValue('hours', -1)}
                            max={99}
                        />
                        <div className="timer-separator">:</div>
                        <TimeInput
                            label="Minutes"
                            value={minutes}
                            onChange={setMinutes}
                            onIncrement={() => adjustValue('minutes', 1)}
                            onDecrement={() => adjustValue('minutes', -1)}
                            max={59}
                        />
                        <div className="timer-separator">:</div>
                        <TimeInput
                            label="Seconds"
                            value={seconds}
                            onChange={setSeconds}
                            onIncrement={() => adjustValue('seconds', 1)}
                            onDecrement={() => adjustValue('seconds', -1)}
                            max={59}
                        />
                    </div>
                    <div className="timer-modal-buttons">
                        <button type="button" onClick={handleCancel} className="timer-button timer-button-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="timer-button timer-button-start">
                            Start Timer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimerModal;

