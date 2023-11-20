function redirectToPage() {
  window.location.href = "payment";
}

// -------------------------------------
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}
function getCookie(name) {
  var cookieName = name + "=";
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }
  return null;
}

const row = [];
$(document).ready(function () {
  const table = $('#tablaHorarios').DataTable({
      paging: false,
      ordering: false,
      info: false,
      searching: false
  });

  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = today.getDay(); 
  
  for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDay + i) % 7; 
      table.column(i).header().innerHTML = `${daysOfWeek[dayIndex]} ${today.getDate() + i }`;
  }
  for (let index = 0; index < addData().length; index++) {
    const element = addData()[index ];
    table.row.add( element ).draw();    
  }
});

function generateTimeSlots(startHour, endHour, intervals) {
  const timeSlots = [];
  for (let hour = startHour; hour < endHour; hour++) {
      for (const interval of intervals) {
          const minutes = hour * 60 + interval;
          const formattedHour = Math.floor(minutes / 60).toString().padStart(2, '0');
          const formattedMinute = (minutes % 60).toString().padStart(2, '0');
          timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
  }
  return timeSlots;
}

function generateOrderedRandomNumbers() {
  const numberOfNumbers = Math.floor(Math.random() * 4); // Generate 3 to 5 numbers
  const randomNumbers = [];

  for (let i = 0; i < numberOfNumbers; i++) {
      let randomNum;

      do {
          randomNum = Math.floor(Math.random() * 24); // Generate a number between 0 and 15
      } while (randomNumbers.includes(randomNum)); // Ensure the number is unique

      randomNumbers.push(randomNum);
  }

  return randomNumbers.sort((a, b) => a - b); // Sort the numbers in ascending order
}

function addData(){
  timeSlots = generateTimeSlots(8, 16, [0, 30, 45]);
  data = [];
  for (let i = 0; i < 7; i++) {
    orderedRandomNumbers = generateOrderedRandomNumbers();
    column= [];
    for (let index = 0; index < orderedRandomNumbers.length; index++) {
      const element = orderedRandomNumbers[index];
      
      column.push( `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#appointment">${timeSlots[element]}</button></div>` );
    }
    data.push(column);
    for (let index =  column.length; index < 4 ; index++) {
      column.push( "" );
    }
  }
  
  return transposeMatrix(data);
}

function transposeMatrix(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  // Inicializa una nueva matriz transpuesta
  const transposedMatrix = Array.from({ length: numCols }, () => []);

  for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
          // Intercambia los valores entre la matriz original y la matriz transpuesta
          transposedMatrix[col][row] = matrix[row][col];
      }
  }

  return transposedMatrix;
}