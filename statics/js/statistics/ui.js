import "../../libs/chartjs/chartjs.4.4.1.min.js"

class Loading {
    html = `<div class="p-4 space-y-4 animate-pulse">
                <div class="w-full h-32 bg-gray-200 rounded"></div>
                <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>`;
}

class StatisticsUI {
    interval_event = null;
    interval_callback = null;
    interval_time = 60*1000;
    wrapper = document.createElement("article");
    callbackStack = [];
    bodyInnerArray = [];
    searchQueryObject = {};

    constructor({dataUrl} = {}){
        this.url = dataUrl;
        this.wrapper.className = `shadow bg-white text-gray-800 flex flex-col rounded-md border border-gray-300`;
        this.body =  this.body ?? document.createElement("div");
        this.headerHtml = document.createElement("div");
        this.wrapper.appendChild(this.headerHtml);
        this.wrapper.appendChild(this.body);
        return this;
    }

    header(title){
        this.headerHtml.className = "sm:text-sm xl:text-sm px-6 py-3 flex flex-row justify-between h-auto border-b border-b-gray-300";
        const titleElement = document.createElement("span");
        titleElement.innerText = title;
        this.headerHtml.appendChild(titleElement);

    }

    headerAside(rightElement,eventName,callback) {
        this.headerHtml.appendChild(rightElement);
        if(typeof callback === "function") rightElement.addEventListener(eventName, callback.bind(rightElement,this));
    }
    clearBody(){
        this.body.innerHTML = "";
    }

    updateBody(index, html) {
        this.body.children[index]
    }
    addBody(html, width,id, callback){
        this.body.className = "sm:text-xs xl:text-sm px-6 py-6 flex flex-row h-full gap-2 overflow-auto"
        let bodyInner = document.getElementById(id);
        let exists = true;        
        if(bodyInner == null){
            bodyInner = document.createElement("div");
            bodyInner.className = "relative w-full flex items-center " + (width ? `max-w-[${width}px]` : "");
            exists = false;
            if(id) bodyInner.id = id;
            this.body.appendChild(bodyInner);
        }
        
        if(typeof html === "string"){
            bodyInner.innerHTML = html;
        }else{
            if(html.tagName === "CANVAS"){
                bodyInner.appendChild(html);
            }else{
                bodyInner.innerHTML = html.outerHTML;
            }
        }
        if(typeof callback === "function" ) this.callbackStack.push(callback.bind(this));
    }
    loading(){
        this.loadingElement = document.createElement('div');
        this.loadingElement.innerHTML = `<div class="animate-pulse flex space-x-4 px-6 py-6">
        <div class="rounded-full bg-slate-300 h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="h-4 bg-slate-300 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-4 bg-slate-300 rounded col-span-2"></div>
              <div class="h-4 bg-slate-300 rounded col-span-1"></div>
            </div>
            <div class="h-4 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>`;
        this.body.append(this.loadingElement);
    }

    // content(html, callback) {
    //     this.body.appendChild(html);
    //     callbackStack.push(callback.bind(this));
    // }

    footer(html, callback){
        this.footer = document.createElement("div");
        this.footer.className = ""
    }
    get(w=1,h=1){
        this.wrapper.classList.add(`col-span-${w}`);
        this.wrapper.classList.add(`row-span-${h}`);
        return this.wrapper;
    }
    interval(callback, interval){
        if(typeof callback !== "function") return;
        this.interval_callback = callback;
        this.interval_time = interval ?? 60*1000;
    }
    start(){
        this.stop();
        this.interval_callback();
        this.interval_event = setInterval(this.interval_callback, this.interval_time);
        // console.log(this.interval_event);
    }
    stop(){
        if(this.interval_event) clearInterval(this.interval_event);
    }
    doCallback(){
        for(const callback of this.callbackStack) {
            if(typeof callback === "function") callback();
        }
    }
}

export class CustomUI extends StatisticsUI {

}
class CardUI extends StatisticsUI {
    cardWrapper = document.createElement("div");
    card = document.createElement("div");
    cardBody = document.createElement("tbody");
    cardData = null;
    cardId = "";
    constructor(){
        super();
        this.cardWrapper.className = "overflow-y-auto  text-xs absolute top-0 right-0 left-0 bottom-0 flex flex-col gap-1";
        this.card.className = "w-full";
        this.cardBody.className = "flex flex-col gap-1";

        this.card.appendChild(this.cardBody);
        this.cardWrapper.appendChild(this.card);
        this.cardId = "card-"+parseInt(Math.random()*1000);
        this.card.id = this.cardId;
    }

    setCardData({
        data,
        headers,
        align = [],
        metadata,
    }, id){
        let rows = [];
        const exists = document.getElementById(this.tableId);
        rows = data.map((d)=>{
            let obj = {};
            for(const key of metadata){
                obj[key] = d[key];
            }
            return obj;
        });
        if(exists){
            this.cardBody.innerHTML = "";
        }
        this.cardData = rows;
        for(const row of rows) {
            const item = document.createElement("div");
            item.className = 'flex flex-col gap-1';
            let colIdx = 0;
            for(const col in row) {
                const text = document.createElement("p");
                text.className = "border-b border-b-gray-100 px-1 py-1";
                const span = document.createElement("span");
                if(typeof align[colIdx] !== "undefined") {
                    text.classList.add("text-"+align[colIdx]);
                }else{
                    text.classList.add("text-center");
                }
                span.innerText = row[col];
                text.appendChild(span);
                item.appendChild(text);
                colIdx++;
            }
            
            this.tableBody.appendChild(tr);
        }
        this.table.appendChild(this.tableBody);
        
        if(!exists){
            let headerTR = document.createElement("tr");
            for(const headText of headers) {
                const th = document.createElement("th");
                th.className = "px-1 py-1"
                th.innerText = headText;
                headerTR.appendChild(th);
            }
            this.tableHead.appendChild(headerTR);
        }

        this.addBody(this.tableWrapper, null, id);
    }
}
class TableUI extends StatisticsUI {
    tableWrapper = document.createElement("div");
    table = document.createElement("table");
    tableHead = document.createElement("thead");
    tableBody = document.createElement("tbody");
    tableRows = [];
    tableData = null;
    tableId = "";
    constructor(){
        super();
        this.tableWrapper.className = "overflow-y-auto  text-xs absolute top-0 right-0 left-0 bottom-0";
        this.table.className = "w-full table-fixed";
        this.tableHead.className = "bg-gray-100 sticky top-0";
        this.tableBody.className = "overflow-y-auto";

        this.table.appendChild(this.tableHead);
        this.table.appendChild(this.tableBody);
        this.tableWrapper.appendChild(this.table);
        this.tableId = "table-"+parseInt(Math.random()*1000);
        this.table.id = this.tableId;
    }

    setTableData({
        data,
        headers,
        align = [],
        metadata,
    }, id){
        let rows = [];
        const exists = document.getElementById(this.tableId);
        rows = data.map((d)=>{
            let obj = {};
            for(const key of metadata){
                obj[key] = d[key];
            }
            return obj;
        });
        if(exists){
            this.tableBody.innerHTML = "";
        }
        this.tableData = rows;
        for(const row of rows) {
            const tr = document.createElement("tr");
            let colIdx = 0;
            for(const col in row) {
                const td = document.createElement("td");
                td.className = "border-b border-b-gray-100 px-1 py-1";
                const span = document.createElement("span");
                if(typeof align[colIdx] !== "undefined") {
                    td.classList.add("text-"+align[colIdx]);
                }else{
                    td.classList.add("text-center");
                }
                span.innerText = row[col];
                td.appendChild(span);
                tr.appendChild(td);
                colIdx++;
            }
            
            this.tableBody.appendChild(tr);
        }
        this.table.appendChild(this.tableBody);
        
        if(!exists){
            let headerTR = document.createElement("tr");
            for(const headText of headers) {
                const th = document.createElement("th");
                th.className = "px-1 py-1"
                th.innerText = headText;
                headerTR.appendChild(th);
            }
            this.tableHead.appendChild(headerTR);
        }

        this.addBody(this.tableWrapper, null, id);
    }
}

class ChartUI extends StatisticsUI {
    added_element_classes = "";
    canvas = document.createElement("canvas");
    chartBoddyId = "";
    chart = null;
    width = null;
    chart_option = {
        options: {
            maintainAspectRatio: false,
            scales : {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize:1,
                    }
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true
                },
                title: {
                    display: false
                }
            }
        }
    };
    chart_data = {};
    constructor(){
        super();
    }
    setLegned({position = "top",display = true}){
        this.chart_option.options.plugins.legend.position = position;
        this.chart_option.options.plugins.legend.display = display;
    }
    setAxis(axis = 'y'){
        this.chart_option.options.indexAxis = axis;
    }
    
    setChartData(data, width, id){
        if(this.chart) {
            console.error("Use updateChartData method.");
            return;
        }
        this.chartBoddyId = id;
        this.width = width;
        this.chart_option.data = data;
        // this.chart_option = Object.assign(this.chart_option, data);
    }
    replaceChartData(data) {
        this.chart.data = data;
        this.chart.update();
    }
    updateChartData(data) {
        if(!this.chart) {
            console.error("The chart has not been created yet.");
            return;
        }
        let idx = 0;
        if(data.labels)
            this.chart.data.labels = data.labels

        const currentLength = this.chart.data.datasets.length;
        for(const dataset of data.datasets){
            if(typeof this.chart.data.datasets[idx] === "undefined"){
                this.chart.data.datasets[idx] = dataset;
            }else{
                this.chart.data.datasets[idx].data = dataset.data;
            }
            idx++;
        }
        for(idx; idx < currentLength;idx++){
            this.chart.data.datasets.splice(idx,1);
        }
        this.chart.update();
    }
    draw(direct = false){
        this.addBody(this.canvas, this.width, this.chartBoddyId);
        if(direct){
            window.requestAnimationFrame(() => {
                console.log("clientwidth",this.canvas.clientWidth);
                this.chart = new Chart(this.canvas, this.chart_option);
            })
        }else {
            this.callbackStack.push(()=>{
                window.requestAnimationFrame(() => {
                    console.log("clientwidth",this.canvas.clientWidth);
                    this.chart = new Chart(this.canvas, this.chart_option);
                })
            });
        }

    }
}

export class PieChartUI extends ChartUI {
    constructor(){
        super();
        this.chart_option.type = "pie";
        delete this.chart_option.options.scales;
        this.chart_option.options.plugins.legend.position = 'right';
    }
}
export class LineChartUI extends ChartUI {
    constructor(){
        super();
        this.chart_option.type = "line";
        this.chart_option.scales = {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            },
        }
    }
}
export class BarChartUI extends ChartUI {
    constructor(){
        super();
        this.chart_option.type = "bar";
        this.chart_option.scales = {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            },
        }
    }
}
export const UI_TYPE = {
    "PieChartUI" : PieChartUI,
    "LineChartUI" : LineChartUI,
    "BarChartUI" : BarChartUI,
    "TableUI" : TableUI,
    "CustomUI" : CustomUI
};