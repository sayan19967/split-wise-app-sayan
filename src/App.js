import logo from './logo.svg';
import './App.css';
import package_json from "../package.json";
import axios from 'axios';

import React, { Component } from 'react'
import { List, Modal, Button, Error, Form } from "./components";

// Assign the backend base url here
export const USD_TO_INR_EXCHANGE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/inr.json";
export const NODE_APP_URL = "";
export const ERROR_MESSAGE = "";
export let RESPONSE_FROM_API = {};
export let globalIdCounter = 1;
export const tableHeader = {
  _id: "No.",
  //serialNo: "No.",
  personName: "Person Name",
  amount: "Amount Paid",
  usdShare: "USD Share",
  inrShare: "INR Share"
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
        _id: "No.",
        //serialNo: "No.",
        personName: "Person Name",
        amount: "Amount Paid",
        usdShare: "USD Share",
        inrShare: "INR Share"
      }],
      error: undefined,
      showModal: false,
      formValues: {},
      formError: undefined,
      usdToInrRate: 1,
      usdToInrRatePlaceholder: 0,
      totalUSDDeduction: 0,
      totalINRDeduction: 0,
      usdToInrRateErrorMsg: null,
      totalUSDDeductionErrorMsg: null,
      totalINRDeductionErrorMsg: null,
      personCardAmountErrorMsg: null
    }
  }

  componentDidMount = async () => {
    //let response = await this.fetchData();
    let response = await this.fetchCurrentUSDToINRrate();
    let exchangeRateRoundedOff = this.truncateDecimals(response.inr, 2);
    this.setState({
      usdToInrRatePlaceholder: exchangeRateRoundedOff
    });
  };

  truncateDecimals = (number, digits) => {
    let multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  // Function to Show the Modal component
  showModalHandler = () => {
    // Your code goes here
    this.setState({
      showModal: true
    });
  }

  // Function to Hide the Modal component
  closeModalHandler = () => {
    // Your code goes here
    this.setState({
      showModal: false,
      formValues: {},
      formError: undefined,
      error: undefined
    });
  }

  // Handles all input entered in the form component
  // and stores the values in the state variable "formValues" of Object type
  // formValues is a key-value pair of input elements { name: "value", name1: "value1" }
  inputChangeHandler = async (e) => {
    let { name, value, type } = e.target;
    let { formValues } = this.state;
    formValues = { ...formValues, [name]: type === "number" ? parseFloat(value) : value };
    //console.log(e.target)
    this.setState({ formValues });
    //console.log(this.state.formValues)
  }

  inputRateOrDeductionChangeHandler = async (e) => {
    let { name, value, type } = e.target;
    let { formValues, data } = this.state;
    //formValues = { ...formValues, [name]: type === "number" ? parseInt(value) : value };
    console.log(e.target)
    console.log(value)
    if (this.validateIfStringHasDigitsOnly(value)) {
      value = (type === "number") ? parseFloat(value) : value;
      await this.setState({
        [name]: value,
        [name + "ErrorMsg"]: null
      });
      if (data.length > 1) {
        const newData = this.calculateUsdAndInrShare(data, formValues);
        // console.log("qqqqqqqqqqqqqqqqqq");
        // console.log(value);
        // console.log(newData);
        // console.log("qqqqqqqqqqqqqqqqqq");
        this.setState({
          data: [tableHeader, ...newData],
        });
      }
      //console.log(this.state)
    } else {
      console.log(value)
      await this.setState((prevState, props) => ({
        //[name]: prevState.usdToInrRate,
        [name + "ErrorMsg"]: "Please enter digits only!"
      }));
      console.log(this.state.usdToInrRate);
      console.log(this.state.usdToInrRateErrorMsg);
    }
  }

  inputCardPersonNameOnChangeHandler = async (e) => {
    const { id, type, value } = e.target, { data } = this.state;
    console.log("changed name " + value);
    console.log(data)
    data.every((item) => {
      console.log("item._id=" + item._id);
      console.log("id.split('-')[1]=" + id.split('-')[1]);
      if (item._id == id.split('-')[1]) {
        item.personName = value;
        console.log("inside if");
        return false;//break from this loop
      }
      return true;
    });
    console.log("after change");
    console.log(data)
    this.setState({
      data: data
    })
    // console.log("confirmation of state change")
    // console.log(this.state.data)
  }

  inputCardAmountOnChangeHandler = async (e) => {
    const { id, type, value } = e.target, { data, formValues } = this.state;
    console.log("changed amount " + value);
    console.log(data);
    if (this.validateIfStringHasDigitsOnly(value)) {
      data.every((item) => {
        console.log("item._id=" + item._id);
        console.log("id.split('-')[1]=" + id.split('-')[1]);
        if (item._id == id.split('-')[1]) {
          item.amount = parseFloat(value);
          console.log("inside if of inputCardAmountOnChangeHandler() every data loop")
          return false;//break from this loop
        }
        return true;
      });
      console.log("eeeeeeeeeeeeee")
      console.log(data)
      console.log("eeeeeeeeeeeee")
      const newData = this.calculateUsdAndInrShare(data, formValues);
      console.log("wwwwwwwwwwww")
      console.log(newData)
      console.log("wwwwwwwwwwww")
      this.setState({
        data: [tableHeader, ...newData],
        personCardAmountErrorMsg: null
      });
      // console.log("confirmation of state change")
      // console.log(this.state.data)
    } else {
      //console.log(value)
      await this.setState((prevState, props) => ({
        personCardAmountErrorMsg: "Please enter digits only!"
      }));
      console.log(data);
    }

  }

  removePersonHandler = (e, id) => {
    const { data, formValues } = this.state;
    //console.log("e.traget=");
    console.log(id);
    console.log(e)
    const dataAfterDeletion = data.filter((item) => {
      return (item._id == id || item._id == 'No.') ? false : true;
    });
    console.log("rrrrrrrrrr");
    console.log(dataAfterDeletion);
    console.log("rrrrrrrrrr");
    const newData = this.calculateUsdAndInrShare(dataAfterDeletion, formValues);
    this.setState({
      data: [tableHeader, ...newData]
    });
    // console.log("tttttttttt");
    // console.log(this.state.data);
    // console.log("tttttttttt");

  }

  // Fetch data from the api
  // use NODE_APP_URL variable for the url in fetch method
  // NODE_APP_URL variable is assigned in the top of this file (src/App.js).
  fetchCurrentUSDToINRrate = async () => {
    // Your code goes here
    // Fill up the code required for posting data to backend
    //let response = await axios.get(USD_TO_INR_EXCHANGE_URL);
    let response = await fetch(USD_TO_INR_EXCHANGE_URL);
    //console.log(response);
    response = await response.json();
    //console.log(response);
    return response;
    //console.log(response.data);

  };

  // SubmitHandler should be used to create a record i.e., to execute post request to backend
  // On success of post request close modal and fetch call fetchData method again.
  // On Error set the error message in the banner.
  submitHandler = async (e) => {
    e.preventDefault();
    //console.log(this.state.formValues)
    const { formValues, data } = this.state;
    //console.log(formValues);
    //console.log(data);
    if (formValues.personName == null || formValues.amount == null) {
      this.setState({ error: "Any of the form fields can not be empty!" });
    } else {
      formValues._id = globalIdCounter++;
      //formValues.serialNo = globalIdCounter++;
      formValues.usdShare = 0;
      formValues.inrShare = 0;
      //calculation for usd and inr share for individual
      let newData = this.calculateUsdAndInrShare(data, formValues);
      await this.setState({
        data: [tableHeader, ...newData]
      });
      await this.closeModalHandler();
      //console.log(this.state.data);
      //this.componentDidMount();
    }
  }

  calculateUsdAndInrShare = (data, formValues) => {
    let totalAmount, totalAmountAfterUsdDeduction, totalAmountAfterInrDeduction, newData;
    data = data.filter((item) => typeof item.amount === 'number');
    // console.log('----------');
    // console.log(data);
    // console.log('----------');
    if (typeof formValues?.amount === 'number') {
      data.push(formValues);
    }
    // console.log('----------');
    // console.log(data);
    // console.log('----------');
    totalAmount = data.reduce((prevAmount, currItem) => {
      //console.log(prevAmount);
      //console.log(currItem);
      return prevAmount + currItem.amount
    }, 0);
    totalAmountAfterUsdDeduction = totalAmount - this.state.totalUSDDeduction;
    totalAmountAfterInrDeduction = totalAmountAfterUsdDeduction * this.state.usdToInrRate - this.state.totalINRDeduction;
    console.log('************');
    console.log(totalAmountAfterUsdDeduction);
    console.log(this.state.usdToInrRate);
    console.log(this.state.totalINRDeduction);
    console.log(totalAmountAfterInrDeduction);
    console.log('************');
    newData = data.map((item) => {
      item.usdShare = this.truncateDecimals(totalAmountAfterUsdDeduction * (item.amount / totalAmount), 2);
      item.inrShare = this.truncateDecimals(totalAmountAfterInrDeduction * (item.amount / totalAmount), 2);
      return item;
    })
    console.log("--------------")
    console.log(newData)
    console.log("--------------")
    return newData;
  }

  validateIfStringHasDigitsOnly = (inStr) => {
    const re = /^[0-9.]+$/;
    return re.test(inStr);
  }

  render() {
    const { showModal, error, data, formError, usdToInrRate, totalUSDDeduction, totalINRDeduction,
      usdToInrRateErrorMsg, totalUSDDeductionErrorMsg, totalINRDeductionErrorMsg, personCardAmountErrorMsg,
      usdToInrRatePlaceholder } = this.state;
    //console.log('hola');
    //console.log(totalUSDDeduction);
    return (
      <div className='justify-space'>
        <div className="app-body">
          <Modal show={showModal} closeHandler={this.closeModalHandler}>
            {/* Your code goes here */}
            {/* Render the Form component here */}
            <Error message={error} />
            <Form onSaveHandler={this.submitHandler} inputOnChangeHandler={this.inputChangeHandler} ></Form>
          </Modal>
          <h2 className="app-title">{package_json.name.replace(/-/g, ' ')}</h2>
          <h5>&#x2022; Developed by Sayan Halder</h5>
          <Error message={error} />
          <div className="input-group">
            <table className='a'>
              <tbody className='a'>
                <tr >
                  <td className='a'><label >USD To INR Rate</label></td>
                  <td>
                    <input onChange={this.inputRateOrDeductionChangeHandler}
                      type="text" name="usdToInrRate"
                      title="usdToInrRate" placeholder={"Current Rate : " + usdToInrRatePlaceholder}
                      style={usdToInrRateErrorMsg == null ? null : ({ borderColor: "red" })}
                    />
                    {usdToInrRateErrorMsg == null ? null : (<p className='small-txt'>{usdToInrRateErrorMsg}</p>)}
                  </td>
                </tr>
                <tr>
                  <td className='a'><label >Total USD Deduction</label></td>
                  <td><input onChange={this.inputRateOrDeductionChangeHandler}
                    type="text" name="totalUSDDeduction"
                    title="totalUSDDeduction" placeholder="US$ 100.00"
                    style={totalUSDDeductionErrorMsg == null ? null : ({ borderColor: "red" })}
                  />
                    {totalUSDDeductionErrorMsg == null ? null : (<p className='small-txt'>{totalUSDDeductionErrorMsg}</p>)}
                  </td>
                </tr>
                <tr>
                  <td className='a'><label >Total INR Deduction</label></td>
                  <td><input onChange={this.inputRateOrDeductionChangeHandler}
                    type="text" name="totalINRDeduction"
                    title="totalINRDeduction" placeholder="₹ 100.00"
                    style={totalINRDeductionErrorMsg == null ? null : ({ borderColor: "red" })}
                  />{totalINRDeductionErrorMsg == null ? null : (<p className='small-txt'>{totalINRDeductionErrorMsg}</p>)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="footer-controls">
            {/* Your code goes here */}
            {/* Render a Button that will display the Modal */}
            <Button onClick={this.showModalHandler}>Add a new person</Button>
          </div>


        </div>
        <List data={data}
          cardPersonNameOnChangeHandler={this.inputCardPersonNameOnChangeHandler}
          cardAmountOnChangeHandler={this.inputCardAmountOnChangeHandler}
          removePersonHandler={this.removePersonHandler}
          personCardAmountErrorMsg={personCardAmountErrorMsg}
        />
      </div>
    )
  }
}

export default App;
