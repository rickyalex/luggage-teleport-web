import * as moment from 'moment';
import axios from 'axios';

//Random Booking Id
export function BookingId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//For auto complete
export function inputProps(StateHotel, functionOnChange, placeHolder) {
    const input = {
        value: StateHotel,
        onChange: functionOnChange,
        placeholder: placeHolder,
        types: ['establishment']
    }

    return input;
}

//For Hotel Input Antd Styling
export function cssClasses(){
    const style = {
        input: 'ant-input',
        autocompleteContainer: 'ant-select-selection'
    }

    return style;
}

//Date disabled state, only allowing today and further
export function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

//Date disabled state, only allowing today and further
export function disabledHours(current) {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
}

//Date disabled state, only allowing today and further
export function disabledDropoffHours(current, pickuptime) {
  // Can not select days before today and today
  return current && current < moment(current).add(4, 'hours');
}

//Ordering data Ascending
export function OrderASC(data, dataType) {

    if (dataType === 'string') {
        data.sort(function (a, b) {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
    } else if (dataType === 'date') {
        data.sort(function (a, b) {
            //return new Date(parsedTime) - new Date(a.pickupDate);
            return moment(a.pickupDate, 'Do MMMM YYYY h:mmA').diff(moment(b.pickupDate, 'Do MMMM YYYY h:mmA'));
        });
    }
}

//Getting Payment Data
export function GetPayment() {
    const Payment = [
        {
            id: 1,
            name: "Credit Card"
        }
    ]

    return Payment;
}

//Status Update Option
export function getStatus(){
    const Status = [
        {
            id: 1,
            name: "Order being processed"
        },
        {
            id: 2,
            name: "On transit"
        },
        {
            id: 3,
            name: "Arrived at destination"
        }
    ]

    return Status;
}

export function sendEmail(param, param2){
        
        let myParam1 = param;
        let myParam2 = param2;
        
        let token = localStorage.getItem('token')
        let config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        axios.get(`https://el3ceo7dwe.execute-api.us-west-1.amazonaws.com/dev/handler/Corporate-get/${myParam1}/${myParam2}`, config)
        //axios.get(`https://83gcxj6xkj.execute-api.ap-southeast-1.amazonaws.com/dev/handler/Corporate-get/${myParam1}/${myParam2}`, config)        
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
}