function DynamicChart (opts) {
   // options are
   // - id the id for the svg container
   // - parent the parent element for the container
   // - width the width
   // - height the height
   // - lower the lowerbound
   // - upper the upperbound
   // - point.r the radius to use for dots
   // - point.color the color to use for dots
   // - animate pixel in horizontal direction to shift
   // - line.color the color for polyline
   // - line.stroke the thickness for polyline
   
   var _main = opts,
       _points = [];
   
   this.addPoint = function(x, y) {
      _points.push ({x: x, y: y, r: _main.point.r, color: _main.point.color});
      this.finalize();
   },
           
   this.addValue = function(y) {
      var x = 0;
      if (_points.length > 0) {
         x = _points[_points.length-1].x + _main.animate;
      }
      _points.push ({x: x, y: y, r: _main.point.r, color: _main.point.color});
      this.finalize();
   },
      
   this.finalize = function () {
      $("#" + _main.id).remove();
      
      var buf = '<svg id="' + _main.id + '"';
      buf += ' height="' + _main.height + '" width="' + _main.width + '"';
      buf += ' viewBox="0 ' + _main.lower + ' ' + _main.width + ' ' + _main.upper + '">';
      var i;

      // lines
      var poly = '<polyline points="';
      var dots = '';
      var removeUpTo = -1;
      var reachedEnd = false;

      // only start removing if we have one page filled
      if (_points[_points.length - 1].x >= _main.width) {
         reachedEnd = true;
      }

      for (i = 0; i < _points.length; i++) {
         if (i > 0) {
            poly += ' ';
         }
         poly += _points[i].x + "," + _points[i].y;
         dots += '<circle cx="'+_points[i].x+'" cy="'+_points[i].y+'" r="'+_points[i].r+'" fill="'+_points[i].color+'" />'

         // animation
         if (reachedEnd === true) {
            _points[i].x -= _main.animate;
            if (_points[i].x <= 0) {
               removeUpTo = i + 1;
            }
         }
      }
      poly+='" style="stroke:'+_main.line.color+';stroke-width:'+_main.line.stroke+';fill:none" />';

      buf += poly;
      buf += dots;

      buf+="</svg>";

      if (removeUpTo !== -1) {
         _points.splice(0, removeUpTo);
      }

      $(_main.parent).append(buf);
   };
}
