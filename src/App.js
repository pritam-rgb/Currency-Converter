import "./App.css";
import React, { useState, useEffect } from "react";
import { IoSwapVertical } from "react-icons/io5";
import Grid from "@material-ui/core/Grid";
import Converter from "./components/Converter";
import { accessKey } from "./assets/key";

function App() {
  const [currencyOptions, setCurrencyOptions] = React.useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${accessKey}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOptions([data?.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data?.rates[firstCurrency]);
      })
      .catch((err) => console.log(err));
    console.log("called");
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `http://api.exchangeratesapi.io/v1//latest?access_key=${accessKey}&base=${fromCurrency}&symbols=${toCurrency}`
      )
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates[toCurrency]);
        })
        .catch((err) => console.log(err));
    }
  }, [fromCurrency, toCurrency]);
  
  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  return (
    <>
      <h1>Sezzle Project</h1>
      <Grid
        container
        direction="column"
        justify="flex"
        alignItems="center"
        className="grid"
      >
        <h1>Currency Converter</h1>
        <Converter
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <div className="equals">
          <IoSwapVertical size="3rem" />
        </div>
        <Converter
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </Grid>
    </>
  );
}

export default App;
