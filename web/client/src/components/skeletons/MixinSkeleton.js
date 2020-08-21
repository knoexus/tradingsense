import React from 'react'
import CompanyProfileSkeleton from './CompanyProfileSkeleton'
import QuotesChartSkeleton from './QuotesChartSkeleton'

export default function MixinSkeleton() {
    return (
        <div className="mixinCard">
            <CompanyProfileSkeleton/>
            <QuotesChartSkeleton/>
        </div>
    )
}
