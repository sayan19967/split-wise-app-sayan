import Button from "./Button";

// Card component renders each record in "data.records" from the api
// consists of table, thead, tbody elements along with tr, th, td
// props:
//   deleteHandler: a function that deletes the record
//   _id: _id from the api 
//   index: each row index 
//   count: count from the api
//   venue: venue key from the api
//   team1: team1 key from the api
//   team2: team2 key from the api
//   date: date key from the api. Make sure to render it in format "Day Mon DD YYYY" ex: "Sun Jun 23 2021"

const Card = ({
  _id,
  index,
  count,
  personName,
  amount,
  serialNo,
  usdShare,
  inrShare,
  cardPersonNameOnChangeHandler,
  cardAmountOnChangeHandler,
  removePersonHandler
}) => {
  //console.log("hola inside card");
  //<span className="a">{item.value}</span>
  //<input className="a" value={item.value} />
  const arr = [{ _id, val: personName }, { _id, val: amount }];
  //console.log(arr)
  let counter = 0;
  let eleList = arr.map((item) => {
    if (item._id === 'No.') {
      //console.log(item._id + " " + item.val);
      //counter++;
      return <span key={`header_col-${counter}`} id={`header_col-${++counter}`} className="a">{item.val}</span>;
    } else {
      //console.log(item._id + " " + item.val)
      if (typeof item.val === 'number') {
        return <input key={`amount-${item._id}`} id={`amount-${item._id}`} type='number'
          className="a" value={item.val} onChange={cardAmountOnChangeHandler} />;
      } else {
        return <input key={`name-${item._id}`} id={`name-${item._id}`} type='text' className="a"
          value={item.val} onChange={cardPersonNameOnChangeHandler} />;
      }
    }
  });
  let closeElement = (_id === 'No.') ? (null) : (
    <Button onClick={(event) => removePersonHandler(event, _id)} className="btn-delete"
    id={_id}
    >&#x2715;</Button>
  )
  //console.log(eleList)
  return (
    <div className="card">
      <div>
        <span className="a">
          {_id == 'No.' ? _id : index}
        </span>
        {eleList}
        <span className="b">
          {usdShare}
        </span>
        <span className="b">
          {inrShare}
        </span>
        <span className="b">
          {closeElement}
        </span>
      </div><br />
    </div>
  );
}

/**
 * <div className="card-header">
        <span>
          <span className="small-txt">Match </span>
          {index}
          <span className="small-txt"> of </span>
          {count}
        </span>
      </div>
      <span id="teams">
        {personName}
        <span className="small-txt"> vs </span>
        {amount}
      </span>
 */

export default Card;