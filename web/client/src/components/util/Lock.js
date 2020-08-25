import React from 'react'

export default function Lock({size}) {
    return (
        <div className={`lock-icon lock-icon-${size ?? 'md'}`}>
            <svg viewBox="0 0 128 128" width="64px" height="64px">
                <path fill="#c7d6e2" d="M100,113H28c-2.761,0-5-2.239-5-5V56c0-2.761,2.239-5,5-5h72c2.761,0,5,2.239,5,5v52 C105,110.761,102.761,113,100,113z"/>
                <path fill="#e7ecf3" d="M28,51c-2.761,0-5,2.239-5,5v26h82V56c0-2.761-2.239-5-5-5H28z"/>
                <path fill="#f8e390" d="M97,39C97,20.775,82.225,6,64,6S31,20.775,31,39v12h12V39c0-11.598,9.402-21,21-21s21,9.402,21,21v12 h12V39z"/>
                <path fill="#f6e5ab" d="M64 65A17 17 0 1 0 64 99A17 17 0 1 0 64 65Z"/>
                <path fill="#cd928d" d="M64 74A8 8 0 1 0 64 90A8 8 0 1 0 64 74Z"/>
                <path fill="none" stroke="#444b54" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="6" d="M100,113H28 c-2.761,0-5-2.239-5-5V56c0-2.761,2.239-5,5-5h72c2.761,0,5,2.239,5,5v52C105,110.761,102.761,113,100,113z"/>
                <path fill="none" stroke="#444b54" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="6" d="M47.75 77C47.264 78.581 47 80.26 47 82c0 9.389 7.611 17 17 17s17-7.611 17-17-7.611-17-17-17c-1.74 0-3.419.264-5 .75M43 42v-3c0-11.598 9.402-21 21-21s21 9.402 21 21v3"/>
                <path fill="none" stroke="#444b54" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="6" d="M31,42 v-3C31,20.775,45.775,6,64,6s33,14.775,33,33v3"/>
            </svg>
        </div>
    )
}
