import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { COMPANY_PROFILE_INDUSTRY} from '../../../gql_queries/CompanyProfile'
import LockedItem from '../LockedItem'
import DefaultSkeleton from '../../skeletons/DefaultSkeleton'


export default function Industry({data, fid}) {
    const [lock, changeLock] = useState(true)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = <LockedItem unlockTry={logoUnlockTry} extraClasses={['item-covered-companyProfile-content-sector']} lockSize={"xl"}/>

    return (
        <div className="companyProfile-content-item">
            { lock ? 
                LI
            : needFetch ? 
                <IndustryGQL fid={fid} errorComponent={LI}></IndustryGQL>
            :
                <IndustryContent data={data}></IndustryContent>
            }
        </div>
    )
}

const IndustryGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_INDUSTRY, {
        variables: { fid }
    })
    if (loading) return <IndustryContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <IndustryContent data={data.company_profile.finnhubIndustry}/>
}

//handle error
const IndustryContent = ({loading, data}) => {
    return (
        <div className="companyProfile-content-item">
            { loading && <DefaultSkeleton/> }
            { data && 
                <div className="companyProfile-content-item-sector">
                    <span>{data}</span>
                </div>
            }
        </div>
    )
}
