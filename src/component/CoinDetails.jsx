import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import {
  Box,
  Container,
  HStack,
  RadioGroup,
  Radio,
  VStack,
  Image,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Progress,
  Button
} from "@chakra-ui/react";
import { apiServer } from "../index";
import axios from "axios";
import { useParams } from "react-router-dom";
import Chart from "./Chart";

const CoinDetails = () => {
  // get id by react-router-dom
  const params = useParams();

  const [coin, setCoin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  // for chart 
  const [days, setDays] = useState("24h");
  const [chartArray, setChartArray] = useState([]);



  const currencySymbol =
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  
  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "365d", "max"]

  const switchChartStats = (val) => {
    setDays(val)
    if (val === days) setLoading(false)
    else setLoading(true)
  }

  

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${apiServer}/coins/${params.id}`);

        const { data:chartData } = await axios.get(`${apiServer}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);

        setCoin(data);
        setChartArray(chartData.prices)
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchCoins();
  }, [params.id, days, currency]);

  if (Error)
    return <ErrorComponent message={"Error while fetching Coin Details"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box width={"full"} borderWidth={1}>
            <Chart arr={chartArray} currency={currencySymbol} days={days}/>
          </Box>
          {/* Button */}
          <HStack p="4" overflowX={"auto"}>
            {
              btns.map((i) => (
                <Button key={i} onClick={()=> switchChartStats(i)}>{i}</Button>
              ))
            }
          </HStack>


          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack>
              <Radio value={"inr"}>INR</Radio>
              <Radio value={"usd"}>USD</Radio>
              <Radio value={"eur"}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <VStack spacing={"4"} p="16" alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"center"} opacity={0.7}>
              Last Opdated On{" "}
              {Date(coin.market_data.last_updated).split("G")[0]}
            </Text>

            <Image
              src={coin.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />

            <Stat>
              <StatLabel>{coin.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coin.market_data.current_price[currency]}
              </StatNumber>

              <StatHelpText>
                <StatArrow
                  type={
                    coin.market_data.price_change_percentage_24h > 0
                      ? "increase"
                      : "decrease"
                  }
                />
                {coin.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>
            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.800"}
              color={"white"}
            >
              {`#${coin.market_cap_rank}`}
            </Badge>

            <CustomBar high={`${currencySymbol}${coin.market_data.high_24h[currency]}`} low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}/>

            <Box w={"full"} p="4">
              <Item title={"Max supply"} value={coin.market_data.max_supply}/>
              <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply}/>
              <Item title={"Market Cap"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}/>
              <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`}/>
              <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`}/>
            </Box>

          </VStack>
        </>
      )}
    </Container>
  );
};

const CustomBar = ({ high, low }) => {
  return (
    <VStack w={"full"}>
      <Progress value={50} colorScheme={"teal"} w={"full"}/>
      <HStack justifyContent={"space-between"} w={"full"}>
        <Badge children={low} colorScheme={"red"}/>
        <Text fontSize={"sm"}>24H Range</Text>
        <Badge children={high} colorScheme={"green"}/>
      </HStack>
    </VStack>
  )
}

const Item = ({ title, value }) => {
  return (
    <HStack justifyContent={"space-between"} w={"full"}>
      <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
      <Text>{value}</Text>

    </HStack>
  )
}

export default CoinDetails;
