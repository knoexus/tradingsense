import React from 'react'
import Lock from './Lock'

export const renderItemBasedOnLockState = (state, element, divExtraClasses, lockSize) => 
    !state ? element : 
    (
        <div className={`item-locked item-covered ${divExtraClasses ? divExtraClasses.join(' ') : ''}`}>
            <Lock size={lockSize}/>
        </div>
    )

