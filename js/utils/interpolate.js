((global) => {

  global.interpolate = (input, output, value) => {  
    if (value <= input.from) {
      return output.from;
    } else if (value >= input.to) {
      return output.to;
    } else {
      return ((value - input.from) / (input.to - input.from)) * (output.to - output.from) + output.from;
    }
  };

})(window);
