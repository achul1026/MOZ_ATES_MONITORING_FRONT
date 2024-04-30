import {UI_TYPE,PieChartUI,LineChartUI} from "./ui.js";

const StatisticsControl = function(){
    "use strict";
    const _wrap = document.getElementById("statisticsContainer");
    const _control = this;
    const interval_events = null;
    let _uiType;
    let _ui = null

    this.generate = function({type, title}){
        _ui = new type();
        _ui.header(title ?? "Dashboard Item");
        _uiType = Object.getPrototypeOf(_ui.constructor).name;

        return this;
    }

    this.addAsideInHeader = function(html, eventname,callback) {
        const aside = document.createElement("div");
        aside.innerHTML = html;
        if(typeof callback === "function")
            _ui.headerAside(aside, eventname, callback);
        return this;
    }
    this.setTableData = function(obj = {
        data : [],
        headers : [],
        align: [],
        metadata : []
    }) {
        if(_ui.constructor.name !== "TableUI") return this;
        _ui.setTableData(obj)
        return this;
    }

    this.setChartData = function(id, chartData, width, axis){
        if(_uiType !== "ChartUI"){
            console.log("This UI is not Chart type");
            return this;
        }
        _ui.setChartData(chartData,width, id);
        if(axis) _ui.setAxis(axis);
        if(_uiType === "ChartUI") _ui.draw();
        return this;
    }
    this.setLoading = function(){
        _ui.loading();
    }
    this.setContent = function(html= "", width){
        _ui.addBody(html, width);
        return this;
    }

    this.setIntervalEvent = function(callback,interval=60*1000){
        if(typeof callback !== "function") return;
        _ui.interval(callback.bind(_ui), interval);
        return this;
    }
    this.startIntervalEvent = function(){
        _ui.start();
    }
    this.stopIntervalEvent = function(){
        _ui.stop();
    }

    this.append = function(w=1,h=1){
        _wrap.appendChild(_ui.get(w,h));
        _ui.doCallback();
        return _ui;
    }
}
const ctx = document.getElementById('myChart');

const statisticsControl = new StatisticsControl();

(function Enforcement(){
    const selects = `<select><option value="daily">Dailiy</option><option value="monthy">Monthly</option></select>`;
    (function enforcementSummary() {        
        const ui = statisticsControl.generate({
            type : UI_TYPE.TableUI,
            title : "실시간 단속건수"
        })
        .setIntervalEvent(function(){
            let todayTotal = parseInt(Math.random()*1000);
            let yesterdayTotal = parseInt(Math.random()*1000);
            const trendCount = todayTotal-yesterdayTotal;
            const trendUp = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>          
          `;
            const trendDown = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
          </svg>
          `;
            const trendMiddle = '-';
            let trend = '';
            if(trendCount === 0) {
                trend = trendMiddle;
            }else if(trendCount > 0) {
                trend = trendUp;
            }else if(trendCount < 0) {
                trend = trendDown;
            }
            let contents = `<div class="text-left w-full">
            <div>
                <p class="text-sm font-light">Total</p>
                <p class="text-6xl font-bold flex gap-2 items-end">
                    <span>${todayTotal}</span>
                    <span class="text-sm ${trendCount > 0 ? 'text-red-600' : 'text-green-600'}">${trend} ${parseInt(todayTotal-yesterdayTotal)}</span>
                </p>
            </div>
            <div>
            <p class="text-sm text-gray-500 mt-1">Yesterday : ${yesterdayTotal}</p>
            </div>
            
            </div>`;;
            this.addBody(contents, 200, "enforcementTotalCntWrap")
            this.setTableData({
                data : [{"a":"1","b":"2"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"}],
                headers : ["유형","건수"],
                metadata : ["a","b"],
                // align : ['center','center']
            }, "enforcementTotalByTypeWrap");
        },1000)
        // .addAsideInHeader(selects,"change", function(elem, ui){
        //     console.log(this,elem,ui)
        // })
        .append(3,1);
        ui.start();

    })();
    (function enforcementChart(){        
        const ui = statisticsControl.generate({
            type : UI_TYPE.LineChartUI,
            title : "시간대별 단속건수"
        }) 
        // .addAsideInHeader(selects,"change", function(elem, ui){
        //     console.log(this,elem,ui)
        // })
        .setChartData("enforcementChart",{
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
            label: 'Enforcement Count',
            borderWidth: 1
            }]
        })
        .setIntervalEvent(function(){
            this.updateChartData({
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                label: 'Enforcement Count',
                data: [parseInt(Math.random()*50), parseInt(Math.random()*50), parseInt(Math.random()*50), parseInt(Math.random()*50), parseInt(Math.random()*50), parseInt(Math.random()*50)],
                borderWidth: 1
                }]
            });
        },2000)
        .append(3,1);
        ui.start();
    })();
    (function enforcementTable(){
        const ui = statisticsControl.generate({
            type : UI_TYPE.TableUI,
            title : "table"
        })
        .setTableData({
            data : [{"a":"1","b":"2"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"}],
            headers : ["에이","비"],
            metadata : ["a","b"],
            align : ['left','center']
        })
        .append(3,1);
    })()
})();

(function Accident(){
    const selects = `<select><option value="daily">Dailiy</option><option value="monthy">Monthly</option></select>`;
    (function accidentSummary() {
        let contents = `
        <div class="text-center text-2xl font-bold">874건</div>
        `;
        const ui = statisticsControl.generate({
            type : UI_TYPE.TableUI,
            title : "실시간 단속건수"
        }) 
        .setContent(contents, 100)
        .setTableData({
            data : [{"a":"1","b":"2"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"}],
            headers : ["유형","건수"],
            metadata : ["a","b"],
            // align : ['center','center']
        })
        .addAsideInHeader(selects,"change", function(elem, ui){
            console.log(this,elem,ui)
        })
        .append(2,1);
    })();
    (function accidentChart(){        
        const ui = statisticsControl.generate({
            type : UI_TYPE.LineChartUI,
            title : "시간대별 단속건수"
        }) 
        .addAsideInHeader(selects,"change", function(elem, ui){
            console.log(this,elem,ui)
        })
        .setChartData("accidentChart",{
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
            label: 'Accident Count',
            borderWidth: 1
            }]
        })
        .append(3,1);
    })();
    (function accidentTable(){
        const ui = statisticsControl.generate({
            type : UI_TYPE.TableUI,
            title : "table"
        })
        .setTableData({
            data : [{"a":"1","b":"2"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"}],
            headers : ["에이","비"],
            metadata : ["a","b"],
            align : ['left','center']
        })
        .append(3,1);
    })()
})();

(function Fine(){
    let contents = `
        <div class="font-bold">
            <div class="text-center">총액(납부/총액)</div>
            <div class="text-center text-2xl ">874,213 / 1,123,401</div>
        </div>
        `;
    const ui = statisticsControl.generate({
        type : UI_TYPE.BarChartUI,
        title : "범칙금 납부 현황"
    }) 
    .setChartData("findChart",{
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
        label: 'Find Count',
        borderWidth: 1
        }]
    },'y')
    .setContent(contents)
    .append(3,1);
})();

(function Facility(){
    const ui = statisticsControl.generate({
        type : UI_TYPE.TableUI,
        title : "시설물 현황"
    })
    .setTableData({
        data : [{"a":"1","b":"2"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"},{"a":"2","b":"33"}],
        headers : ["유형","아이디","상태"],
        metadata : ["a","b","a"],
        align : ['left','center']
    })
    .append(3,1);
})();

(function Server(){
    let contents = `
        <div class="font-bold">
            <div class="text-center">총액(납부/총액)</div>
            <div class="text-center text-2xl ">874,213 / 1,123,401</div>
        </div>
        `;
    const ui = statisticsControl.generate({
        type : UI_TYPE.CustomUI,
        title : "시설물 현황"
    })
    .setContent(contents)
    .append(2,1);
})();

// setTimeout(() => {
//     ui1.updateChartData({
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//         label: '# of Votes',
//         data: [12, 89, 3, 5, 2],
//         borderWidth: 1
//         },{
//         label: '# of Votes22',
//         data: [33, 566, 13, 315, 213, 5513],
//         borderWidth: 1
//         }]
//     })
// }, 1500)

// setTimeout(() => {
//     console.log("222")
//     ui1.updateChartData({
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//         label: '# of Votes',
//         data: [12, 89, 3, 5, 2],
//         borderWidth: 1
//         }]
//     })
// }, 3500)
