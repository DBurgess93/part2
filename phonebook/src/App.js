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

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }
  return (
    <div style={style}>
      {message}
    </div>
  )
}

const Contact = ({ id, person, handleDelete }) => {
  const handleDeleteClick = (event) => {
    event.preventDefault();
    handleDelete(id);
  };
  return (
    <ul>
      <li key={id}>
        {person.name} - {person.number}
        <button onClick={handleDeleteClick} >delete</button>
      </li>

    </ul>
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
        onSubmit={addContact}
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
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: '5',
    padding: '10',
    marginBottom: '10'
  }

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20',
    borderStyle: 'solid',
    borderRadius: '5',
    padding: '10',
    marginBottom: '10'
  }

  useEffect(() => {
    contactService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addContact = (event) => {
    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
      key: newName
    };

    const existingContact = persons.find(person => person.name === newName);

    if (existingContact) {
      const confirmUpdate = window.confirm(`${newName} already exists. Do you want to update the number to ${newNumber}?`);
      if (confirmUpdate) {
        // Update the existing contact
        contactService
          .update(existingContact.id, nameObject)
          .then(updatedContact => {
            setPersons(persons.map(person =>
              person.id === existingContact.id ? updatedContact : person
            ));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`${existingContact.name} has been updated`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 3000)
          })
          .catch(error => {
            console.log('Error updating contact:', error);
            setErrorMessage(`${existingContact.name} has already been removed`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          });
      }
    }
    else {
      // Create a new contact
      contactService
        .create(nameObject)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`${newName} has been added`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000);
          console.log(successMessage)
        })
        .catch(error => {
          console.log('Error creating contact:', error);
        });
    }
  };

  const deletePerson = (id, event) => {
    if (event) {
      event.preventDefault();
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this contact?')
    if (!confirmDelete) {
      return
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
      <h1>Phonebook</h1>
      <Filter filterText={filterText} handleChange={handleFilterChange} />
      <Notification message={successMessage} style={successStyle} />
      <Notification message={errorMessage} style={errorStyle} />
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
