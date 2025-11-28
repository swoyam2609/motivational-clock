import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        const strHours = hours < 10 ? '0' + hours : hours;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
        const strSeconds = seconds < 10 ? '0' + seconds : seconds;

        return {
            hours: strHours,
            minutes: strMinutes,
            seconds: strSeconds,
            ampm: ampm
        };
    };

    const { hours, minutes, seconds, ampm } = formatTime(time);

    return (
        <div className="clock-container">
            <span className="clock-time">
                {hours}
                <span className="clock-colon">
                    <span className="clock-colon-dot"></span>
                    <span className="clock-colon-dot"></span>
                </span>
                {minutes}
                <span className="clock-colon">
                    <span className="clock-colon-dot"></span>
                    <span className="clock-colon-dot"></span>
                </span>
                <span className="clock-seconds">{seconds}</span>
            </span>
            <span className="clock-ampm">{ampm}</span>
        </div>
    );
};

export default Clock;
