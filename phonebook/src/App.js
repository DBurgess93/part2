import { useState, useEffect } from 'react'
import contactService from './services/contacts'

const Filter = ({ filterText, handleChange }) => {
  return (
    <div>
      filter contacts:
      <input value={filterText} onChange={handleChange} />
    </div>
  )
}

const Contact = ({ id, person, handleDelete }) => {
  const handleDeleteClick = (event) => {
    event.preventDefault();
    handleDelete(id);
  };
  return (
    <div>
      <p key={id}> {person.name} - {person.number} </p>
      <button onClick={handleDeleteClick} >delete</button>
    </div>
  );
};

const Contacts = ({ persons, filterText, handleDelete }) => {
  const filteredPersons = persons && persons.filter((person) =>
    person.name && person.name.includes(filterText)
  );

  return (
    <div>
      <h2>Contacts</h2>
      {filteredPersons && filteredPersons.map((person) => (
        <Contact key={person.id} id={person.id} person={person} handleDelete={handleDelete} />
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
    contactService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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
    contactService
      .create(nameObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, event) => {
    if (event) {
      event.preventDefault();
    }

    contactService
      .deleteContact(id)
      .then(() => {
        const updatedPersons = persons.filter(person => person.id !== id)
        setPersons(updatedPersons)
      })
      .catch(error => {
        console.log('Error deleting contact:', error)
      })
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
      <Contacts persons={persons} filterText={filterText} handleDelete={deletePerson} />

    </div>
  )
}

export default App
