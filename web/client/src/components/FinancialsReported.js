import React from 'react'

export default function FinancialsReported({ data: { accessNumber, startDate, endDate, quarter, year, report: { bs, cf, ic } }}) {
    const v = (type) => (
        <div>
            { type !== [] ? type.map((e, idx) => 
                <div key={idx}>
                    <h3>{e.label}</h3>
                    <p>Concept: {e.concept}</p>
                    <p>Value: {e.value} {e.unit}</p>
                </div>
            ) : null}
        </div>
    )
    return (
        <div>
            <h2>Financials Reported</h2>
            {v(bs)}
            {v(cf)}
            {v(ic)}
        </div>
    )
}
