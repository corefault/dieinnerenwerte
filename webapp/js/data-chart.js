function dataChart(name, color, lower, upper) {
    var _vals = 0,
        _opts = {name: name, color: color, width: 2, min: lower, max: upper};
            
    this.initialize = function () {
        
        $('section').append ('<canvas id="chart-' + _opts.name + '"></canvas>');
        
        var chart = new SmoothieChart({grid:
                                        {fillStyle:'#fff',strokeStyle:'#fff',borderVisible:false},
                                        labels:{fillStyle:'#000',disabled:true},
                                    minValue:_opts.min, maxValue:_opts.max});
        _vals = new TimeSeries();
        chart.addTimeSeries(_vals, {lineWidth:_opts.width,strokeStyle:_opts.color});
        chart.streamTo(document.getElementById("chart-" + _opts.name), dataprovider._delay);
    },
            
    this.update = function(val) {
        _vals.append(new Date().getTime(), val);
    }
}