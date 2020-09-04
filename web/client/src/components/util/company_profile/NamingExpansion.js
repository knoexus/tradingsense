import React, { useState, Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { COMPANY_PROFILE_NAME_EXCHANGE_TICKER } from '../../../gql_queries/CompanyProfile__GQL'
import LockedItem from '../LockedItem'
import NamingExpansionSkeleton from '../../skeletons/company_profile/NamingExpansionSkeleton'


export default function NamingExpansion({data, fid}) {
    const [lock, changeLock] = useState(true)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = <LockedItem unlockTry={logoUnlockTry} extraClasses={['item-covered-companyProfile-content-item-name']}/>

    return (
        <Fragment>
            { lock ? 
                LI
            : needFetch ? 
                <NamingExpansionGQL fid={fid} errorComponent={LI}></NamingExpansionGQL>
            :
                <NamingExpansionContent data={data}></NamingExpansionContent>
            }
        </Fragment>
    )
}

const NamingExpansionGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_NAME_EXCHANGE_TICKER, {
        variables: { fid }
    })
    if (loading) return <NamingExpansionContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <NamingExpansionContent data={data.company_profile}/>
}

//handle error
const NamingExpansionContent = ({loading, data}) => {
    return (
        <Fragment>
            { loading && <NamingExpansionSkeleton/> }
            { data &&
                <div className="companyProfile-content-item">
                    <div className="companyProfile-content-item-name">
                        <h3>{data.name}</h3> 
                        <span>{data.exchange} / {data.ticker}</span>         
                    </div>                 
                </div>
            }
        </Fragment>
    )
}