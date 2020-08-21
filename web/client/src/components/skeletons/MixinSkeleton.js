import React from 'react'
import CompanyProfileSkeleton from './CompanyProfileSkeleton'
import QuotesChartSkeleton from './QuotesChartSkeleton'
import TechnicalsSkeleton from './TechnicalsSkeleton'

export default function MixinSkeleton() {
    return (
        <div className="mixinCard">
            <CompanyProfileSkeleton/>
            <QuotesChartSkeleton/>
            <TechnicalsSkeleton/>
        </div>
    )
}
