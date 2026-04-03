const Persons = ({listToShow, onDelete}) => {
  return (
    <>
      <ul>
        {listToShow.map((p) => (
          <li key={p.id}>
            {p.name} - {p.number}
            <button onClick={() => onDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Persons;
