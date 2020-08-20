import React from 'react'

export default function Lock({size}) {
    return (
        <div className={`lock-icon lock-icon-${size ?? 'md'}`}>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64">
                <g>
                    <rect x="8" y="33" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="48" height="30"/>
                    <path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" d="M16,33V17c0-8.837,7.163-16,16-16s16,7.163,16,16
                        v16"/>
                    <circle fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" cx="32" cy="47" r="4"/>
                    <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="32" y1="51" x2="32" y2="55"/>
                </g>
            </svg>
        </div>
    )
}
