Number.prototype.maxDecimal = function(decimalLength){
  var re = new RegExp("(\\d+\\.\\d{" + decimalLength + "})(\\d)"),
  m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
  //return parseFloat(this.toFixed(decimalLength));
}
