import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filterText, handleChange }) => {
  return (
    <div>
      filter contacts:
      <input value={filterText} onChange={handleChange} />
    </div>
  )
}

const Contact = ({ id, person }) => {
  return (
    <p key={id}> {person.name} - {person.number} </p>
  );
};

const Contacts = ({ persons, filterText }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.includes(filterText)
  );

  return (
    <div>
      <h2>Contacts</h2>
      {filteredPersons.map((person) => (
        <Contact key={person.id} id={person.id} person={person} />
      ))}
    </div>
  );
};

const NewContact = ({
  persons,
  newName,
  addContact,
  newNumber,
  handleNameChange,
  handleNumberChange
}) => {
  return (
    <div>
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
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

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
      <Filter filterText={filterText} handleChange={handleFilterChange} />
      <NewContact
        persons={persons}
        newName={newName}
        addContact={addContact}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <Contacts persons={persons} filterText={filterText} />

    </div>
  )
}

export default App
