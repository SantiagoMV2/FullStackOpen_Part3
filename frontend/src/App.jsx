import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons"
import Notification from "./components/Notification";

const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState(null)

  const repeatedName = persons.find((p) => p.name === newName);
  
  const filteredName = persons.filter((p) =>
    p.name.toLowerCase().includes(newFilter.toLowerCase()),
  );

  const listToShow =
    newFilter === ""
      ? persons
      : filteredName

  
  const handlePersonsChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  useEffect(() => {
    personService
    .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)       
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (repeatedName) {
      if (!window.confirm(`${repeatedName.name} is already been added to phonebook, replace the old number with a new one?`)) 
        return

      const updatedPerson ={
      ...repeatedName,
      number: personObject.number
      }
      personService
      .update(updatedPerson.id, updatedPerson)
      .then(returnPerson => {
        setPersons(persons.map(person => person.id !== updatedPerson.id ? person : returnPerson))
        setMessage(`Number ${repeatedName.number} updated to number ${updatedPerson.number} successfully`)
      })
      .catch(error => {
        setMessage({
          text: `Information of ${repeatedName.name} has already been removed from server`,
          type: "error"
        })
      setPersons(persons.filter(p => p.id !== repeatedName.id))
      })
    } else {
      personService
      .create(personObject)
      .then(returnPerson => {
        setPersons(persons.concat(returnPerson))
        setNewName("");
        setNewNumber("");
        setMessage({
          text: `Added ${personObject.name}`,
          type: "success"
        })
      })
    }
      setTimeout(() => {
        setMessage(null)
      }, 5000)

  };

  const deleteData = (id) => {
    if (!window.confirm("Do you want to delete this person's data?"))
      return
    
    personService
    .deletePerson(id)
    .then(() => {
      setPersons(persons.filter(p => p.id !== id))
    })
  }


  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonsChange={handlePersonsChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        newFilter={newFilter}
        persons={persons}
        listToShow={listToShow}
        onDelete = {deleteData}
      />
    </>
  );
};

export default App;
