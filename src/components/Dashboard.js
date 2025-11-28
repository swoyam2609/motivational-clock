import React from 'react';
import Clock from './Clock';
import Quote from './Quote';

const Dashboard = ({ userName }) => {
    const getDateString = () => {
        const date = new Date();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        return `${dayName} ${dayNumber}`;
    };

    return (
        <div className="dashboard-container">
            <div className="top-right-info">
                <div className="date-display">{getDateString()}</div>
                <Quote />
            </div>
            <div className="center-content">
                <Clock />
            </div>
            <div className="bottom-right-name">
                {userName.toUpperCase()}
            </div>
        </div>
    );
};

export default Dashboard;
