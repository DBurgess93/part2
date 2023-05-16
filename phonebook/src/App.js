import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'artis hellas', key: 'artis hellas', number: 123123123 },
    { name: 'daniel burgess', key: 'daniel burgess', number: 932495948 },
    { name: 'terry terrison', key: 'terry terrison', number: 577438039 },
    { name: 'blob flerg', key: 'blob flerg', number: 768430358 },
    { name: 'swincy swashton', key: 'swinsy swashton', number: 437592302 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      key: newName
    }
    console.log(nameObject)
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilterText(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div> filter contacts:
        <input value={filterText} onChange={(handleFilterChange)} />
      </div>
      <h2>Add new</h2>
      <form
        onSubmit={
          persons.map((person) => person.name).includes(newName)
            ? () => alert(`${newName} is already in the phonebook`)
            : addContact
        }
      >
        <div>name:
          <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number:
          <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons
        .filter((person) => person.name.includes(filterText))
        .map(person => (
          <p key={person.key}>{person.name} - {person.number} </p>
        ))}
    </div>
  )
}

export default App
