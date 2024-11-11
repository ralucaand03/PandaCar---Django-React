import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from "react-icons/fa";
import './SignupForm.css';  // Import the regular CSS file

const SignupForm = () => {
    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');
    const [dob, setDob] = useState('');

    // Generate the list of days, months, and years for the select options
    const days = Array.from({ length: 31 }, (_, i) => i + 1);  // Days 1-31
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const years = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i);  // Last 120 years

    // Effect to update the formatted date when any part of the date changes
    useEffect(() => {
        if (dobDay && dobMonth && dobYear) {
            setDob(`${dobDay}/${dobMonth}/${dobYear}`);
        }
    }, [dobDay, dobMonth, dobYear]);

    return (
        <div className='signup-container'>
            <div className='signup-wrapper'>
                <form action="">
                    <h1>Sign Up</h1>

                    <div className='signup-input-box'>
                        <input type="text" placeholder='Name' required />
                    </div>
                    <div className='signup-input-box'>
                        <input type="text" placeholder='Username' required />
                    </div>
                    <div className='signup-input-box'>
                        <input type="email" placeholder='Email' required />
                    </div>
                    <div className='signup-input-box'>
                        <input type="text" placeholder='Phone Number' required />
                    </div>

                    {/* Date of Birth Select Fields on the same row */}
                    <div className='dob-row'>
                        <div className='dob-label'>
                            <p>Date of Birth</p>
                        </div>

                        <div className='dob-fields'>
                            <select 
                                value={dobDay} 
                                onChange={(e) => setDobDay(e.target.value)} 
                                required
                            >
                                <option value="">Day</option>
                                {days.map(day => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        
                            <select 
                                value={dobMonth} 
                                onChange={(e) => setDobMonth(e.target.value)} 
                                required
                            >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        
                            <select 
                                value={dobYear} 
                                onChange={(e) => setDobYear(e.target.value)} 
                                required
                            >
                                <option value="">Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div> 
                    </div>

                    <div className='signup-input-box'>
                        <input type="password" placeholder='Password' required />
                        <FaLock className='signup-icon' />
                    </div>
                    <div className='signup-input-box'>
                        <input type="password" placeholder='Confirm Password' required />
                        <FaLock className='signup-icon' />
                    </div>

                    <button className='signup-button' type='submit'>Sign Up</button>

                    <div className='signup-register-link'>
                        <p>Already have an account? <a href='/login'>Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
