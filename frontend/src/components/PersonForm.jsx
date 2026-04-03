const PersonForm = (props) => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handlePersonsChange} />
          <br />
          number: <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
