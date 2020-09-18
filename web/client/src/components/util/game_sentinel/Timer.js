import React, { useState, useEffect } from 'react'
import { useApolloClient, useQuery,  gql } from '@apollo/client'


export default function Timer() {
    const query = 
        gql`{
           wi @client
        }
        `
    const { data: { wi } } = useQuery(query)
    return (
        <div className="timer">
            <h3>{wi}</h3>
        </div>
    )
}
