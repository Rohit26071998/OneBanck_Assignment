var userID = 1;
var recipientID = 2;

var API_URL = `https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=${userID}&recipientId=${recipientID}`;

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var CHECK = '<i class="check">&#10003;  </i>';
var PAPER_CLIP = '<i class="check">&#128206;  </i>';


function onLoad() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.responseText);
            showCards(response.transactions);
        } else {
            // TODO: Handle API Error.
            
        }
    };
    xhr.open("GET", API_URL, true);
    xhr.send();
}

function getTime(date) {
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var result = hour;
    var ext = '';
    if (hour > 12) {
        ext = 'PM';
        hour = (hour - 12);
        result = hour;

        if (hour < 10) {
            result = "0" + hour;
        } else if (hour == 12) {
            hour = "00";
            ext = 'AM';
        }
    }
    else if (hour < 12) {
        result = ((hour < 10) ? "0" + hour : hour);
        ext = 'AM';
    } else if (hour == 12) {
        ext = 'PM';
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return `${result}:${minutes} ${ext}`;
}


function getDate(date) {
    var time = getTime(date);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${time}`;
}


function HorizontalLine(date) {
    var parent = document.createElement('div');
    parent.classList.add('hr');

    var dots = document.createElement('div');
    dots.classList.add('dot');

    var dots1 = document.createElement('div');
    dots1.classList.add('dot');

    var text = document.createElement('div');
    text.innerText = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    parent.appendChild(dots);
    parent.appendChild(text);
    parent.appendChild(dots1);
    return parent;
}

function getRow() {
    var row = document.createElement('div');
    row.classList.add('row');
    return row;
}



function TransactionId(id) {
    var parent = document.createElement('div');
    parent.classList.add('transactionId');
    var span = document.createElement('span');
    span.innerText = 'Transaction ID';

    var span1 = document.createElement('span');
    span1.innerText = id;

    parent.appendChild(span);
    parent.appendChild(span1);
    return parent;
}



function CancelButton(){
    var btns = document.createElement('div');
    btns.classList.add('btns');
    btns.innerHTML = '<input type="button" value="Cancel">';
    return btns;
}



function PayButtons(){
    var btns = document.createElement('div');
    btns.classList.add('btns');
    console.log('s')
    btns.innerHTML = '<input type="button" value="Pay">';
    btns.innerHTML += '<input type="button" value="Decline">';
    return btns;
}


function Card(transaction) {
    var card = document.createElement('div');
    card.classList.add('card');
    if (transaction.direction === 1) {
        card.classList.add('sent');
    }

    var info = document.createElement('div');
    info.classList.add('info');
    card.appendChild(info);

    var row = getRow();
    var amount = document.createElement('div');
    amount.classList.add('amount');
    amount.innerText = '₹ ' + transaction.amount;
    row.appendChild(amount);

    var status = document.createElement('div');
    status.classList.add('status');
    row.appendChild(status);

    info.appendChild(row);

    var row1 = getRow();

    var goto = document.createElement('div');
    goto.classList.add('goto');
    goto.innerHTML = '&gt;';

    if (transaction.status === 2) {
        row1.appendChild(TransactionId(transaction.id));
        status.innerHTML = CHECK + 'You Paid';
    }else if(transaction.status === 1){
        if(transaction.direction === 1 && transaction.type === 2){
            row1.appendChild(CancelButton());
            status.innerHTML = PAPER_CLIP + 'You Requested';
        }
        else if(transaction.direction === 2 && transaction.type === 2){
            row1.appendChild(PayButtons());
            status.innerHTML = PAPER_CLIP + 'Request Received';
        }
    }

    row1.appendChild(goto);
    info.appendChild(row1);

    
    var date = document.createElement('div');
    date.classList.add('date');
    date.innerText = getDate(new Date(transaction.startDate));

    card.appendChild(date);
    return card;
}

function showCards(transactions) {
    var prevDate = null;
    var container = document.getElementById('container');

    for (var transaction of transactions) {
        var startDate = new Date(transaction.startDate);

        if (prevDate == null ||
            !(startDate.getDate() === prevDate.getDate() && startDate.getMonth() === prevDate.getMonth() && startDate.getFullYear() === prevDate.getFullYear())) {
            container.appendChild(HorizontalLine(startDate));
        }

        container.appendChild(Card(transaction));

        prevDate = startDate;
    }
}