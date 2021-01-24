(function(){
    if( location.hash ) {
        const errorLinesPart = location.hash.match(/errorLines=([\d,]+)/u);
        if( errorLinesPart ) {
            const lineNrs = errorLinesPart[1].split(',');
            for( const lineNr of lineNrs ) {
                document.querySelector(`#lineNumber${lineNr}`).classList.add('error-line');
            }
        }
        
        const lineNumberPart = location.hash.match(/lineNumber([\d]+)/u);
        if( lineNumberPart ) {
            document.querySelector(`#lineNumber${lineNumberPart[1]}`).classList.add('active');
        }
    }
  //
  // if (location.hash) {
  //   // ``[ ] . ' " @`` are not valid in DOM id. so must escape these.
  //   var id = location.hash.replace(/([\[\].'"@$])/g, '\\$1');
  //   var line = document.querySelector(id);
  //   if (line) line.classList.add('active');
  // }
})();
