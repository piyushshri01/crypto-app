import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { apiServer } from '../index'
import { Container, HStack } from '@chakra-ui/react'
import Loader from './Loader'
import ErrorComponent from './ErrorComponent'
import ExchangeCard from './ExchangeCard'


const Exchanges = () => {
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [Error, setError] = useState(false)


  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const { data } = await axios.get(`${apiServer}/exchanges`)
        setExchanges(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(true)
      }
    }

    fetchExchanges()
  }, [])

  if(Error) return <ErrorComponent message={"Error while fetching exchanges"}/>

  return (
    <Container maxW={"container.xl"}>
      {
        loading ? <Loader/> :
          <HStack wrap={"wrap"} justifyContent={'space-evenly'}>
            {exchanges.map((i) => (
              <ExchangeCard 
                key={i.id}
                name={i.name}
                img={i.image}
                rank={i.trust_score_rank}
                url={i.url}
                />
            ))}
          </HStack>
      }

    </Container>
  )
}

export default Exchanges