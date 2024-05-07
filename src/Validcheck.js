
const lineConnections = {0:[[0,100],[1,101]]}
const horizotalTopLine = {
    0: [[0,1],[3,4]],  // Key is 0, value is an array [1, 2, 3]
    1: [[1,2],[2,3]],  // Key is 1, value is an array [4, 5, 6]
    2: [[1,3],[4,5]],  // Key is 2, value is an array [7, 8, 9]
};

const horizotalBottomLine = {
    0: [[0,1],[3,4]],  // Key is 0, value is an array [1, 2, 3]
    1: [[1,2],[2,3]],  // Key is 1, value is an array [4, 5, 6]
    2: [[1,3],[4,5]],  // Key is 2, value is an array [7, 8, 9]
};
  
function isHorizontalValidConnection(lineConnections, horizontalTopLine, horizontalBottomLine) {
    // Transform lineConnections to a similar structure as horizontalTopLine and horizontalBottomLine
    const transformedLines = {};
    const topNodeIds  = [];
    const bottomNodeIds = [];
    const expectedKey = Object.keys(lineConnections)[0]; 
    for (const key in lineConnections) {
      topNodeIds = lineConnections[key].map(pair => pair[0]);
      bottomNodeIds = lineConnections[key].map(pair => pair[1]);
      transformedLines[key] = [topNodeIds, bottomNodeIds];
    }

    for (const key in horizontalLineData) {
        const arrays = horizontalLineData[key];
        for (const arr of arrays) {
          if (arr[0] === topNodeIds[0] && arr[1] === topNodeIds[1]) {
            if(key == expectedKey){
                //do nothing
            }
            else{
                //change the color 
            }
          }
          else if(arr[0] === topNodeIds[1] && arr[1] === topNodeIds[0]){
            return false;
          }
        }
    }

      for (const arr of arrays) {
        if (arr[0] === bottomNodeIds[0] && arr[1] === bottomNodeIds[1]) {
          if(key == expectedKey){
              //do nothing
          }
          else{
              //change the color 
          }
        }
        else if(arr[0] === bottomNodeIds[1] && arr[1] === bottomNodeIds[0]){
          return false;
        }
      }
}