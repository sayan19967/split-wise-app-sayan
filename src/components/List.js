import Card from "./Card";


// props:
//   data: consists of data records to be rendered
const List = ({ data, 
  cardPersonNameOnChangeHandler, 
  cardAmountOnChangeHandler, 
  removePersonHandler, 
  personCardAmountErrorMsg }) => {
  // console.log("+++++++++++++++++++");
  // console.log(data);
  // console.log("+++++++++++++++++++");
  //console.log(typeof props.data);
  //console.log(typeof []);
  //let matchList = Array.from(props.data);
  return (

    data?.length > 1 ? (<div className="list">
      {/* Your code goes here */}
      {/* Render the Card with required props here */
        data.map((item, index, arr) => {
          return (
            
            <Card
              key={item._id}
              _id={item._id}
              index={index}
              count={arr.length}
              //serialNo={item.serialNo}
              personName={item.personName}
              amount={item.amount}
              usdShare={item.usdShare}
              inrShare={item.inrShare}
              cardPersonNameOnChangeHandler={cardPersonNameOnChangeHandler}
              cardAmountOnChangeHandler={cardAmountOnChangeHandler}
              removePersonHandler={removePersonHandler}
              personCardAmountErrorMsg={personCardAmountErrorMsg}
            />
            
          )
        })
      }

    </div>) : null
  )
};


export default List;