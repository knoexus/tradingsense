import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { COMPANY_PROFILE_LOGO } from '../../../gql_queries/CompanyProfile__GQL'
import LockedItem from '../LockedItem'
import DefaultSkeleton from '../../skeletons/DefaultSkeleton'


export default function Logo({data, fid}) {
    const [lock, changeLock] = useState(true)
    const [needFetch, changeFetchNeeded] = useState(false)
    const logoUnlockTry = () => {
        changeLock(!lock)
        changeFetchNeeded(!needFetch)
    }

    const LI = <LockedItem unlockTry={logoUnlockTry}/>

    return (
        <div className="companyProfile-logo">
            { lock ? 
                LI
            : needFetch ? 
                <LogoGQL fid={fid} errorComponent={LI}></LogoGQL>
            :
                <LogoContent data={data}></LogoContent>
            }
        </div>
    )
}

const LogoGQL = ({fid, errorComponent}) => {
    const { loading, error, data } = useQuery(COMPANY_PROFILE_LOGO, {
        variables: { fid }
    })
    if (loading) return <LogoContent loading={loading}/>
    if (error) {
        console.error(error) // or handle
        return errorComponent
    }
    if (data) return <LogoContent data={data.company_profile.logo}/>
}

const LogoContent = ({loading, data}) => {
    return (
        <div className="companyProfile-content-item">
            { loading && <DefaultSkeleton/> }
            { data && <img alt={"Logo"} src={data}></img> }
        </div>
    )
}
