import React, { Component } from "react";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import {
  Card,
  CardBody,
  Row,
  Col,
  CardColumns,
  CardHeader,
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Table,
  Label,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import * as baseConstants from "../../constants";

import { DateTimePicker } from "react-widgets";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { thisTypeAnnotation } from "@babel/types";
import { log } from "util";
import "react-widgets/dist/css/react-widgets.css";

Moment.locale("en");
momentLocalizer();
const brandInfo = getStyle("--info");

const months = ["January", "February", "March", "April", "May", "June", "July"];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const cardChartData2 = {
  labels: months,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: brandInfo,
      borderColor: "rgba(255,255,255,.55)",
      data: [1, 18, 9, 17, 34, 22, 11]
    }
  ]
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: "transparent",
          zeroLineColor: "transparent"
        },
        ticks: {
          fontSize: 2,
          fontColor: "transparent"
        }
      }
    ],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5
        }
      }
    ]
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4
    }
  }
};
const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
};
class Graph extends Component {
  constructor(props) {
    super(props);
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let toDate = new Date(year, month + 1, day);
    this.state = {
      data: null,
      fromDate: new Date(),
      clientName: [],
      clientGroup: [],
      toDate,
      showGrup: false,
      fields: {
        from_date: "",
        toDate: "",
        cName: ""
      },
      lineData: { labels: ["jan", "march"], datasets: [] },
      mainData: {},
      selectedTop: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            borderColor: "",
            data: [],
            value: ""
          }
        ]
      },
      reshudledCount: 0,
      totalInterviewsCount: 0,
      scheduledCount: 0,
      onholdCount: 0,
      selectedCount: 0,
      rejectedCount: 0,
      msgTodate:"Select Greater than fromDate",
      flagTodate:false,
      msgFrom:"Select Leass than Todate",
      falgFrom:false
    };
  }

  drawchart = (lineColor, data, labale) => {
    let obj = {
      label: labale,
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: lineColor,
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data
    };
    let lineData = {
      ...this.state.lineData
    };
    lineData.datasets.push(obj);
    this.setState({ lineData: { ...lineData } });
  };
  componentDidMount() {
    let { accessToken, tokenType } = this.props.userSession;
    this.setState(
      {
        accessToken: accessToken,
        tokenType: tokenType
      },
      () => {
        this.getaDataApi("/skills/all", "skill");
        this.getaDataApi("/client/all", "client");
        this.getaDataApi("/dashboard/all", "mainData");
      }
    );
  }

  drowGraph = () => {
    const SELECTED = this.state.mainData.Selected;
    const REJECTED = this.state.mainData.Rejected;
    const SCHEDULED = this.state.mainData.Scheduled;
    const ONHOLD = this.state.mainData.Onhold;
    const RESCHEDULED = this.state.mainData.Rescheduled;
    const CANCELLED = this.state.mainData.Cancelled;
    let xBoar = [],
      tempMonth = [],
      selectdData = [],
      rescheduledData = [],
      cancelledData = [],
      rejectedData = [],
      scheduledData = [],
      onholdData = [],
      weekBar = [],
      dataWeekBar = [];
    let dateFrom = new Date(
      this.state.mainData.StartDate
        ? this.state.mainData.StartDate
        : this.state.mainData.StarDate
    );
    let dateTo = new Date(
      this.state.mainData.EnDate
        ? this.state.mainData.EnDate
        : this.state.mainData.EndDate
    );
    var startDate = Moment(dateFrom);
    var endDate = Moment(dateTo);
    var format = "DD/MM/YYYY";
    let MonthCount = Math.ceil(
      Moment(new Date(endDate.add(1, "days"))).diff(
        new Date(startDate),
        "months",
        true
      )
    );
    if (MonthCount > 3) {
      var result = [];
      while (startDate.isBefore(endDate)) {
        result.push(startDate.format("YYYY-MM-01"));
        startDate.add(1, "month");
      }
      result.map(d => {
        let tempDate = new Date(d);
        let text = month[tempDate.getMonth()] + " " + tempDate.getFullYear();
        xBoar.push(text);
        tempMonth.push(month[tempDate.getMonth()]);
      });
      let dd = this.state.lineData;
      dd.labels = xBoar;
      this.setState({
        lineData: { ...dd }
      });
      // if (Array.isArray(emptyArray) && emptyArray.length)
      selectdData = (Array.isArray(SELECTED) && SELECTED.length) ? this.getData(SELECTED, xBoar): 0;
      rejectedData = (Array.isArray(REJECTED) && REJECTED.length) ?this.getData(REJECTED, xBoar): 0;
      scheduledData = (Array.isArray(SCHEDULED) && SCHEDULED.length) ? this.getData(SCHEDULED, xBoar):0;
      onholdData = (Array.isArray(ONHOLD) && ONHOLD.length) ?this.getData(ONHOLD, xBoar): 0;
      rescheduledData = (Array.isArray(RESCHEDULED) && RESCHEDULED.length) ? this.getData(RESCHEDULED, xBoar):0;
      cancelledData = (Array.isArray(CANCELLED) && CANCELLED.length) ?this.getData(CANCELLED, xBoar):0;
    } else {
      let dates = this.numberOfWeeks(startDate, endDate);
      let coutnt = 0,
        sdate,
        edate;
      dates.map((date, index) => {
        if (coutnt == 0) sdate = Moment(date).format("YYYY/MM/DD");

        if (coutnt == 7) {
          edate = Moment(date).format("YYYY/MM/DD");
          selectdData.push(
            SELECTED.length > 0 ? this.getDataWeekly(sdate, edate, SELECTED) : 0
          );
          rejectedData.push(
            REJECTED.length > 0 ? this.getDataWeekly(sdate, edate, REJECTED) : 0
          );
          scheduledData.push(
            SCHEDULED.length > 0
              ? this.getDataWeekly(sdate, edate, SCHEDULED)
              : 0
          );
          onholdData.push(
            ONHOLD.length > 0 ? this.getDataWeekly(sdate, edate, ONHOLD) : 0
          );
          cancelledData.push(
            CANCELLED.length > 0
              ? this.getDataWeekly(sdate, edate, CANCELLED)
              : 0
          );
          rescheduledData.push(
            RESCHEDULED.length > 0
              ? this.getDataWeekly(sdate, edate, RESCHEDULED)
              : 0
          );
          let check = Moment(sdate, "YYYY/MM/DD");
          let check1 = Moment(edate, "YYYY/MM/DD");
          let obj =
            month[check.format("M") - 1] +
            " " +
            check.format("D") +
            " TO " +
            month[check1.format("M") - 1] +
            " " +
            check1.format("D");
          weekBar.push(obj);
          coutnt = 0;
        } else {
          coutnt++;
          edate = Moment(date).format("YYYY/MM/DD");
        }
      });
      if (coutnt != 0) {
        let check = Moment(sdate, "YYYY/MM/DD");
        let check1 = Moment(edate, "YYYY/MM/DD");
        let obj =
          month[check.format("M") - 1] +
          " " +
          check.format("D") +
          " TO " +
          month[check1.format("M") - 1] +
          " " +
          check1.format("D");
        weekBar.push(obj);
        selectdData.push(
          SELECTED.length > 0 ? this.getDataWeekly(sdate, edate, SELECTED) : 0
        );
        rejectedData.push(
          REJECTED.length > 0 ? this.getDataWeekly(sdate, edate, REJECTED) : 0
        );
        scheduledData.push(
          SCHEDULED.length > 0 ? this.getDataWeekly(sdate, edate, SCHEDULED) : 0
        );
        onholdData.push(
          ONHOLD.length > 0 ? this.getDataWeekly(sdate, edate, ONHOLD) : 0
        );
        cancelledData.push(
          CANCELLED.length > 0 ? this.getDataWeekly(sdate, edate, CANCELLED) : 0
        );
        rescheduledData.push(
          RESCHEDULED.length > 0
            ? this.getDataWeekly(sdate, edate, RESCHEDULED)
            : 0
        );
      }
      let dd = this.state.lineData;
      dd.labels = weekBar;
      this.setState(
        {
          lineData: { ...dd }
        });
    }
    this.drawchart("#5cb85c", selectdData, "SELECTED");
    this.drawchart("#d9534f", rejectedData, "REJECTED");
    this.drawchart("#f0ad4e", scheduledData, "SCHEDULED");
    this.drawchart("#337ab7", onholdData, "ONHOLD");
    this.drawchart("#E6FF33", rescheduledData, "RESCHEDULED");
    this.drawchart("#D733FF", cancelledData, "CANCELLED");
  };
  lastday = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  numberOfWeeks = (startDate, endDate) => {
    var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  };
  getData = (mainObject1, monthList) => {
    let temp = [],
      temp1 = [],
      monthtemp = [];
    monthList.map(d => temp1.push(0));
    mainObject1.map(data => {
      let currentmonth = new Date(data.date).getMonth();
      let countMonth = 0;
      mainObject1.map(data1 => {
        if (currentmonth == new Date(data1.date).getMonth()) {
          countMonth++;
        }
      });
      let currentMontheExternal = month[new Date(data.date).getMonth()];
      let flag = 0;
      temp.push({
        count: countMonth,
        month: currentMontheExternal,
        fullYear:
          currentMontheExternal + " " + new Date(data.date).getFullYear()
      });
    });
    monthList.map((dexternal, index) => {
      temp.map(d => {
        if (d.fullYear == dexternal) {
          temp1[index] = d.count;
        }
      });
    });
    return temp1;
  };
  getDataWeekly = (dateFrom, dateTo, data) => {
    let countinterview = 0;

    data.map(d => {
      let dd = new Date(d.date);
      let current =
        dd.getFullYear() +
        "/" +
        (dd.getMonth() + 1) +
        "/" +
        (dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate());
      if (Moment(current).isBetween(dateFrom, dateTo, null, "[]")) {
        countinterview++;
      }
    });
    return countinterview;
  };

  headerGraph = (titel, lsitBar, dataList, objName) => {
    let obj = {};
    obj = {
      labels: lsitBar,
      datasets: {
        label: titel,
        backgroundColor: brandInfo,
        borderColor: "rgba(255,255,255,.55)",
        data: dataList,
        value: 50.3
      }
    };

    this.setState({
      [objName]: { ...obj }
    });
  };
  handleChange = event => {
    let fields = {
      ...this.state.fields,
      ...{ [event.target.name]: event.target.value }
    };
    this.setState({
      fields: { ...fields }
    });

    if ([event.target.name] == "cName") {
      this.changeClientName([event.target.value]);
    }
  };
  changeClientName = k => {
    let tempData = [];
    this.state.clientGroupList.map(data => {
      if (k == data.clientId) {
        tempData.push({ id: data.id, name: data.name });
      }
    });
    let data = this.sortArrayObj(tempData);
    if(data.length>0){
    this.setState({
      clientGroup: data,
      showGrup: true
    });
  }else{
    this.setState({
      showGrup: false
    });
  }
  };


  sortArrayObj = (data, name) => {
    let k = data.sort(function(a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return k;
  };
  formSubmit = () => {
    let { accessToken, tokenType } = this.props.userSession;
    let { fromDate, toDate } = this.state;
    var fromDate1 = Moment(fromDate);
    var toDate1 = Moment(toDate);
    fromDate = Moment(fromDate).format("DD/MM/YYYY 00:00:00");
    toDate = Moment(toDate).format("DD/MM/YYYY 23:59:59");
    let flag1=0,flag=0;  
    console.log("data",fromDate1.isBefore(toDate1));
    if(!fromDate1.isBefore(toDate1)){
        this.setState({"flagTodate":true});
        flag1=1;
      }else{
        this.setState({"flagTodate":false});
        flag1=0
      }
        if(!toDate1.isAfter(fromDate1)){
        this.setState({"falgFrom":true});
        flag=1;
      }else{
        this.setState({"falgFrom":false});
        flag=0
      }
    if((flag==0) && (flag1==0)){
    let fields = {
      ...this.state.fields,
      ...{ from_date: fromDate, toDate: toDate }
    };
    this.setState(
      {
        fields: { ...fields }
      },
      () => {
        let param = `?toDate=${this.state.fields.toDate}&fromDate=${this.state.fields.from_date}`;
        if (this.state.fields.cName) {
          param += "&clientId=" + this.state.fields.cName;
        }
        if (this.state.fields.groupName) {
          param += "&clientGroupId=" + this.state.fields.groupName;
        }
        axios
          .get(
            baseConstants.BASE_URL + "/dashboard/all" + param,

            {
              headers: {
                Authorization: tokenType + " " + accessToken,
                ContentType: "application/json"
              }
            }
          )
          .then(res => {
            this.setState(
              {
                mainData: res.data,
                lineData: { labels: [], datasets: [] },
                totalInterviewsCount:
                  res.data.TotalInterviewsCount > 0
                    ? res.data.TotalInterviewsCount
                    : 0,
                scheduledCount:
                  res.data.SCHEDULED_COUNT > 0 ? res.data.SCHEDULED_COUNT : 0,
                onholdCount:
                  res.data.ONHOLD_COUNT > 0 ? res.data.ONHOLD_COUNT : 0,
                selectedCount:
                  res.data.SELECTED_COUNT > 0 ? res.data.SELECTED_COUNT : 0,
                rejectedCount:
                  res.data.REJECTED_COUNT > 0 ? res.data.REJECTED_COUNT : 0,
                reshudledCount:
                  res.data.RESCHEDULED_COUNT > 0
                    ? res.data.RESCHEDULED_COUNT
                    : 0,
                cancelledCount:
                  res.data.CANCELLED_COUNT > 0 ? res.data.CANCELLED_COUNT : 0
              },
              () => {
                this.drowGraph();
              }
            );
          })
          .catch(error => {
            console.log(" eroorr");
          });
      }
    );
  }
  };
  DateTimeChange = (e, parm) => {
    // var fromDate = Moment(this.state.fromDate);
    // var toDate = Moment(this.state.toDate);
    // let flag=0,flag1=0;

    // if(parm=="toDate"){
      // if(fromDate.isAfter(e)){
      //   this.setState({"flagTodate":true});
      //   flag1=1;
      // }else{
      //   this.setState({"flagTodate":false});
      //   flag1=0
      // }
    // }
    // if(parm=="fromDate"){
      // if(toDate.isBefore(e)){
      //   this.setState({"falgFrom":true});
      //   flag=1;
      // }else{
      //   this.setState({"falgFrom":false});
      //   flag=0
      // }
    // }
    
    // if(!toDate.isAfter(fromDate)){
    //   // if(fromDate > toDate ){
    //     this.setState({"falgFrom":true});
    //     flag=1;
    //   }else{
    //     this.setState({"flagTodate":false});
    //   }
    // if((flag==0) && (flag1 ==0)){
    this.setState({
      [parm]: e
    });
  // }
  };

  getaDataApi = (concatUrl, setdata) => {
    let tempName = setdata;
    let url = baseConstants.BASE_URL + concatUrl;
    axios
      .get(url, {
        headers: {
          Authorization: this.state.tokenType + " " + this.state.accessToken,
          ContentType: "application/json"
        }
      })
      .then(res => {
        if ("client" == tempName) {
          let clientGroupList = [],
            clientName = [];
          res.data.map(d => {
            clientName.push({ id: d.id, name: d.clientName });
            d.clientGroups.map(clientg => {
              clientGroupList.push({
                id: clientg.id,
                name: clientg.groupName,
                clientId: d.id
              });
            });
          });

          clientName = this.sortArrayObj(clientName);
          this.setState({
            clientGroupList: clientGroupList,
            clientName: clientName
          });
        } else {
          this.setState(
            {
              [tempName]: res.data,
              totalInterviewsCount:
                res.data.TotalInterviewsCount > 0
                  ? res.data.TotalInterviewsCount
                  : 0,
              scheduledCount:
                res.data.SCHEDULED_COUNT > 0 ? res.data.SCHEDULED_COUNT : 0,
              onholdCount:
                res.data.ONHOLD_COUNT > 0 ? res.data.ONHOLD_COUNT : 0,
              selectedCount:
                res.data.SELECTED_COUNT > 0 ? res.data.SELECTED_COUNT : 0,
              rejectedCount:
                res.data.REJECTED_COUNT > 0 ? res.data.REJECTED_COUNT : 0,
              reshudledCount:
                res.data.RESCHEDULED_COUNT > 0 ? res.data.RESCHEDULED_COUNT : 0,
              cancelledCount:
                res.data.CANCELLED_COUNT > 0 ? res.data.CANCELLED_COUNT : 0
            },
            () => {
              if ("mainData" == setdata) {
                this.drowGraph();
              }
            }
          );
        }
      })
      .catch(error => {
        console.log("error ==>", error);
      });
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody className="dashboard-table">
            <Form className="customForm">

            <Row>
              <div class="container-header">
              {/* <Col md={4}> */}
              <div class="block">
              <div class="contaner-date-piker">
                  <Label className="customFormLabel">From Date</Label>
                  <DateTimePicker
                    className="dateTimePicker"
                    defaultValue={new Date()}
                    value={this.state.fromDate}
                    onChange={e => {
                      this.DateTimeChange(e, "fromDate");
                    }}
                    time={false}
                    />
                    </div>
               <p class="error-msg">{ this.state.falgFrom?this.state.msgFrom:''}</p>
          
               </div>
                    {/* </Col>
                              <Col md={4}> */}
               <div class="block">
                 <div class="contaner-date-piker">
                  <Label className="customToLabel">To Date</Label>
                  <DateTimePicker
                    className="dateTimePicker"
                    value={this.state.toDate}
                    defaultValue={new Date()}
                    onChange={e => {
                      this.DateTimeChange(e, "toDate");
                    }}
                    time={false}
                  />
                  </div>
                    <p class="error-msg"> { this.state.flagTodate?this.state.msgTodate:''}</p>
             </div>
                    {/* </Col>
                              <Col md={4}> */}
               <div class="block">
                  <Label className="graphLabel" htmlFor="name">
                    Client Name
                  </Label>
                  <Input
                    type="select"
                    name="cName"
                    id="cName"
                    className="graphSelect"
                    onChange={this.handleChange}
                  >
                    <option value="">Please select</option>
                    {this.state.clientName.map((value, key) => {
                      return (
                        <option key={key} value={value.id}>
                          {value.name}
                        </option>
                      );
                    })}
                  </Input>
                  </div>
                  {/* </Col> */}
                {this.state.showGrup ? (
                  // <Col md={4}>
                  <div class="block">
                  
                      <Label className="graphLabel" htmlFor="name">
                      Client Group Name 
                  </Label>
                      <Input
                        type="select"
                        name="groupName"
                        id="groupName"
                        className="graphGrupName"
                        onChange={this.handleChange}
                      >
                        <option value="">Please select</option>
                        {this.state.clientGroup.map((value, key) => {
                          return (
                            <option key={key} value={value.id}>
                              {value.name}
                            </option>
                          );
                        })}
                      </Input>
                    </div>
                      // </Col>
                ) : (
                  ""
                  )}
                            {/* <Col md={4}> */}
         <div class="block">
                  <Button className="submit" onClick={this.formSubmit}>
                    Submit
                  </Button>
              </div>
                  {/* </Col> */}
              </div>
              </Row>
            </Form>
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>Total interview</CardHeader>
                  <CardBody>
                    <Progress
                      value={
                        (this.state.totalInterviewsCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      Total Number of Interviews{" "}
                      {this.state.totalInterviewsCount}
                    </Progress>
                    <Progress
                      color="success"
                      value={
                        (this.state.scheduledCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      {" "}
                      Total Number of Scheduled Interviews{" "}
                      {this.state.scheduledCount}
                    </Progress>
                    <Progress
                      color="warning"
                      value={
                        (this.state.reshudledCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      {" "}
                      Total Number of Rescheduled Interviews{" "}
                      {this.state.reshudledCount}
                    </Progress>
                    <Progress
                      color="info"
                      value={
                        (this.state.onholdCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      Total Number of Onhold Interviews {this.state.onholdCount}
                    </Progress>
                    <Progress
                      color="warning"
                      value={
                        (this.state.selectedCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      {" "}
                      Total Number of Selected Interviews{" "}
                      {this.state.selectedCount}
                    </Progress>
                    <Progress
                      color="danger"
                      value={
                        (this.state.cancelledCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      {" "}
                      Total Number of Cancelled Interviews{" "}
                      {this.state.cancelledCount}
                    </Progress>
                    <Progress
                      color="danger"
                      value={
                        (this.state.rejectedCount /
                          this.state.totalInterviewsCount) *
                        100
                      }
                    >
                      {" "}
                      Total Number of Rejected Interviews{" "}
                      {this.state.rejectedCount}
                    </Progress>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                {/* <CardColumns className="cols-12"> */}
                <Card>
                  <CardHeader>Visualization of all interview</CardHeader>
                  <CardBody>
                    <div className="chart-wrapper">
                      <Line data={this.state.lineData} options={options} />
                    </div>
                  </CardBody>
                </Card>

                {/* </CardColumns> */}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    userSession: state.session.user
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Graph);
