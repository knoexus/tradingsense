import React from 'react'
import DefaultSkeleton from './DefaultSkeleton'

export default function TechnicalsSkeleton() {
    return (
        <div className="technicals item-covered-technicals">
            <div className="technicals-title">
                <div className="item-covered item-covered-technicals-title">
                    <DefaultSkeleton/>
                </div>
            </div>
            <div className="technicals-datechanger">
                <div className="item-covered item-covered-technicals-datechanger">
                    <DefaultSkeleton/>
                </div>
            </div>
            <div className="technicals-indicators">
                <div className="item-covered item-covered-technicals-indicators">
                    <DefaultSkeleton/>
                </div>
            </div>
        </div>
    )
}
