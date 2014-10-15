function dataChart() {
    var valsOxygen = 0,
        valsPulse = 0;

    this.initialize = function () {
        
        $('section').append ('<canvas id="chart" width="800" height="100"></canvas>');
        
        var chart = new SmoothieChart({grid:{fillStyle:'#fff',strokeStyle:'#fff',borderVisible:false},labels:{fillStyle:'#000',disabled:true},maxValue:180,minValue:0});
        valsOxygen = new TimeSeries();
        valsPulse = new TimeSeries();
        chart.addTimeSeries(valsOxygen, {lineWidth:1,strokeStyle:'#000080'});
        chart.addTimeSeries(valsPulse, {lineWidth:1,strokeStyle:'#800000'});
        chart.streamTo(document.getElementById("chart"), dataprovider._delay);
    },
            
    this.update = function(val) {
        valsOxygen.append(new Date().getTime(), val.oxygen);
        valsPulse.append(new Date().getTime(), val.pulse);
    }
}