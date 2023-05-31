import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [value, setValue] = useState('')
  const [countryInfo, setCountryInfo] = useState({})
  const [country, setCountry] = useState(null)

  useEffect(() => {
    console.log('effect run, country is now', country)

    if (country) {
      console.log('fetching country info')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
          setCountryInfo(response.data)
          console.log(response.data.languages)
        })
    }
  }, [country])

  const handleChange = (event) => {
    setValue(event.target.value)
    console.log(value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCountry(value)
    console.log(country)
  }

  const formatLanguages = () => {
    if (countryInfo.languages) {
      const languages = Object.values(countryInfo.languages)
      return languages.join(', ')
    }
    return ''
  }

  return (
    <div>
      <h1>Countries</h1>
      <form onSubmit={onSearch}>
        <input value={value} onChange={handleChange} />
        <button type="submit">get country info</button>
      </form>
      <div>
        <h2>Country Name: {country}</h2>
        <p>Country Capital: {countryInfo.capital}</p>
        <p>Country Area: {countryInfo.area}</p>
        <p>Languages: {formatLanguages()}</p>
        <p>{countryInfo.flag}</p>
      </div>
    </div>
  );
}

export default App;
