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
                { Array.from(Array(8)).map((_, idx) =>
                    <div key={idx} className="item-covered item-covered-technicals-indicators-item">
                        <DefaultSkeleton/>
                    </div>
                )}
            </div>
        </div>
    )
}
