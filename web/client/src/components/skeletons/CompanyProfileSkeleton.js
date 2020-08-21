import React from 'react'
import DefaultSkeleton from './DefaultSkeleton'

export default function CompanyProfileSkeleton() {
    return (
        <div className="companyProfile">
            <div className="companyProfile-content">
                <div className="companyProfile-logo">
                    <div className="item-covered">
                        <DefaultSkeleton/>
                    </div>
                </div>
                <div className="companyProfile-info">
                    <div className="item-covered item-covered-companyProfile-content-name">
                        <DefaultSkeleton/>
                    </div>
                    <div className="item-covered item-covered-companyProfile-content-item-sector">
                        <DefaultSkeleton/> 
                    </div>
                </div>
            </div>
        </div>
    )
}
