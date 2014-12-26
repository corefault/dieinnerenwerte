function dataWatch(parent, name, icon, lower, upper) {
    var opts = {element: parent, title: name, icon: icon, min: lower, max: upper, color:"#555"},
        vals = 0;

    this.initialize = function () {
        var source = $("#data-watch").html();
        var template = Handlebars.compile(source);

        var html = template(opts);

        // append to section
        $(opts.element).html(html);
        
        var chart = new SmoothieChart({grid:
                                        {fillStyle:'#fff',
                                         strokeStyle:'#fff',
                                         borderVisible:false},
                                        labels:{fillStyle:'#000',
                                                disabled:true},
                                    minValue:opts.min, maxValue:opts.max});
        vals = new TimeSeries();
        chart.addTimeSeries(vals, {lineWidth: 2,strokeStyle:opts.color});
        chart.streamTo(document.getElementById("chart-" + opts.title), dataprovider._delay);
    },
    this.update = function (val) {
        $(opts.element + " h1").html(val);
        
        vals.append(new Date().getTime(), val);

        if (val <= opts.min || val >= opts.max) {
            $(opts.element).addClass("alarm");
            ui.alarm();
        } else {
            $(opts.element).removeClass("alarm");
        }
    }

}
