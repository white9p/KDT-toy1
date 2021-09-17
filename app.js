const url = "https://syoon0624.github.io/json/test.json"
const reqObj = new XMLHttpRequest();
reqObj.open('GET',url);
reqObj.responseType="json";
reqObj.send();
reqObj.addEventListener('load', work);

const btnClose = document.querySelector("#management_layer");
const managementOpenBtn =document.querySelector("#management_open_btn");

btnClose.addEventListener("click", popUp);
managementOpenBtn.addEventListener("click",popUp);
function popUp(){
    if(btnClose.classList.contains("active")){
        btnClose.classList.remove("active");
    } else{
        btnClose.classList.add("active");
    }
    console.log(btnClose);
}
function work(){
    const moneyData =reqObj.response;
    react(moneyData);
    sumUpExpenditure(moneyData);
    sumUpDailyReport(moneyData);
}


function react(data){
    const dateGroups = transformList(data);
    

    const ol = document.querySelector('#account_book_list');
    for (let dateGroup of dateGroups) {
        const liElems = document.createElement('li')
        
        const div = document.createElement('div');
        div.classList.add("account_date");

        const spanDate = document.createElement('span');
        const strongTotal = document.createElement('strong');

        spanDate.textContent = dateGroup.date;
        strongTotal.textContent = `${dateGroup.amount.toLocaleString()}원 지출`;

        div.appendChild(spanDate);
        div.appendChild(strongTotal);

        const ul = document.createElement('ul');
        for (let bank of dateGroup.bankList) {
            const liElem = document.createElement('li');
            liElem.classList.add("expenditure_item")
            const span = document.createElement('span');
            const strong = document.createElement('strong');

            span.textContent = bank.history;
             if(bank.income === "out") {
                strong.textContent=bank.price.toLocaleString();
            }else {
                strong.textContent=`+ ${bank.price.toLocaleString()}`
                strong.classList.add("income_orange");
            }
            liElem.appendChild(span);
            liElem.appendChild(strong);
            ul.appendChild(liElem);
        }

        liElems.appendChild(div);
        liElems.appendChild(ul);

        ol.appendChild(liElems);
    }
}

function transformList(data){
    let resultList = [];
    
    let currentDate = '2021-09-01';
    let tempList = [];
    let amount = 0;

    for(let bank of data.bankList) {
        if (currentDate != bank.date) {
            const bankObject = {
                date : currentDate,
                amount : amount,
                bankList : tempList,
            }
            resultList.push(bankObject);
            currentDate = bank.date;
            tempList = [];
            amount = 0;
        }
        tempList.push(bank);
        amount += bank.price;
    }
    resultList.reverse();
   
    return resultList;
}

function sumUpExpenditure(moneyData) {
    const bankList = moneyData.bankList.filter(data => data.income == 'out');
    var classifyMap = new Map();
    for (let bank of bankList) {
        let key = bank.classify;
        let value = classifyMap.get(key);
        if (value) {
            value += bank.price;
        } else {
            value = bank.price;
        }
        classifyMap.set(key, value);
    }
    const labels =  Array.from(classifyMap).map(([name, value]) => (name));
    const data =  Array.from(classifyMap).map(([name, value]) => (value));

    var ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
            data: data,
            backgroundColor: [
                'red',
                'blue',
                'yellow',
                'green',
                'pink'
            ],
            hoverOffset: 5
            }]
        },
        });
}

function sumUpDailyReport(moneyData) {
    const labels = ['01','02','03','04','05','06','07'];
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    var ctx2 = document.getElementById('dailyReport').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: data,
        options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        });
}
