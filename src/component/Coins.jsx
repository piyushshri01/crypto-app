import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { apiServer } from '../index'
import { Container, HStack, Button, RadioGroup, Radio } from '@chakra-ui/react'
import Loader from './Loader'
import ErrorComponent from './ErrorComponent'
import CoinCard from './CoinCard'

const Coins = () => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [Error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [currency, setCurrency] = useState("inr")

  const currencySymbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  // for paginations
  const btns = new Array(132).fill(1);

  const changePage = (p) => {
    if(p === page){
      setLoading(false)
    }else{
      setLoading(true)
    }
    setPage(p)
  }

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${apiServer}/coins/markets?vs_currency=${currency}&page=${page}`)
        setCoins(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(true)
      }
    }

    fetchCoins()
  }, [currency, page])

  if(Error) return <ErrorComponent message={"Error while fetching Coins"}/>

  return (
    <Container maxW={"container.xl"}>
      {
        loading ? <Loader/> : (
        <>
          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>
          <HStack wrap={"wrap"} justifyContent={'space-evenly'}>
            {coins.map((i) => (
              <CoinCard 
                key={i.id}
                id = {i.id}
                name={i.name}
                img={i.image}
                symbol={i.symbol}
                price={i.current_price}
                currencySymbol={currencySymbol}
                />
            ))}
          </HStack>
          <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {
              btns.map((item, index) => (
                <Button key={index} bgColor={"blackAlpha.900"} color={"white"} onClick={()=> changePage(index+1)}>{index+1}</Button>
              ))
            }
          </HStack>
        </>)
      }

    </Container>
  )
}

export default Coins