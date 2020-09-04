import React from 'react'
import DefaultSkeleton from './DefaultSkeleton'
import LogoSkeleton from './company_profile/LogoSkeleton'
import IndustrySkeleton from './company_profile/IndustrySkeleton'
import NamingExpansionSkeleton from './company_profile/NamingExpansionSkeleton'

export default function CompanyProfileSkeleton() {
    return (
        <div>
            <div className="companyProfile-content">
                <LogoSkeleton/>
                <div className="companyProfile-info">
                    <NamingExpansionSkeleton/>
                    <IndustrySkeleton/>
                </div>
            </div>
        </div>
    )
}
