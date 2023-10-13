import React, { useEffect } from 'react'
import { ReactComponent as ChevRight } from '../svg/chev-right.svg'
import { ReactComponent as ChevLeft } from '../svg/chev-left.svg'
import { useSelector, useDispatch } from 'react-redux'
import { setIRSProviders, setDisplayNumbers, setCurrentPage } from '../redux/slice/IRSTableSlice'

const IRSTableGroup = () => {
  const { IRSProviders, foundMatches, displayNumbers, currentPage, currentLocation } = useSelector(
    state => state.IRSTable
  )
  const dispatch = useDispatch()

  const fetchData = async pageOffset => {
    console.log(`is end: ${displayNumbers.end} < ${foundMatches}`)
    console.log(`TYPES: ${typeof displayNumbers.end} < ${typeof foundMatches}`)
    console.log(displayNumbers.end < foundMatches)
    console.log(currentPage)
    try {
      const response = await fetch(
        `http://localhost:5000/api/scrape?state=${currentLocation.state}&zipCode=${currentLocation.zipCode}&page=${
          currentPage + pageOffset
        }`
      )
      if (response.ok) {
        const data = await response.json()
        dispatch(setIRSProviders(data.IRSProviders))
        dispatch(setDisplayNumbers(data.displayNumbers))
        dispatch(setCurrentPage(currentPage + pageOffset))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handlePrevPage = () => {
    fetchData(-1)
  }

  const handleNextPage = () => {
    fetchData(1)
  }

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData(0)
  }, [currentLocation.state, currentLocation.zipCode, currentPage])

  return (
    <div className='irs-table-group'>
      {foundMatches > 0 && (
        <>
          <h3>
            Found {foundMatches} Matching Items; Displaying {displayNumbers.start} - {displayNumbers.end}
          </h3>
          <table>
            <tbody>
              <tr>
                <th>Name of Business</th>
                <th>Address</th>
                <th>City/State/ZIP</th>
                <th>Point Of Contact</th>
                <th>Telephone</th>
                <th>Type of Service</th>
              </tr>

              {IRSProviders.map((d, i) => (
                <tr key={i}>
                  <th>{d.NameOfBusiness}</th>
                  <th>{d.Address}</th>
                  <th>{d.CityStateZIP}</th>
                  <th>{d.PointOfContact}</th>
                  <th>{d.Telephone}</th>
                  <th>{d.TypeOfService}</th>
                </tr>
              ))}
            </tbody>
          </table>
          {foundMatches >= 10 && (
            <div className='table-pager'>
              {displayNumbers.start >= 2 && (
                <button onClick={handlePrevPage}>
                  <ChevLeft />
                </button>
              )}

              {displayNumbers.end < foundMatches && (
                <button onClick={handleNextPage}>
                  <ChevRight />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default IRSTableGroup
