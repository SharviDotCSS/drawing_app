const canvas = document.getElementById("canvas");
toolBtns = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color");
downloadImg = document.querySelector(".download-img");
sizeSlider = document.querySelector("#size-slider");
ctx = canvas.getContext("2d");
colorPicker = document.querySelector("#color-picker");
// get the save button element
const saveButton = document.getElementById('save-button');

let restore_array = [];
let index = -1;

let prevMouseX, prevMouseY, snapshot,
isDrawing = false;
selectedTool = "brush";
brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const drawline = (e) =>{
    ctx.beginPath(); // create a new path to draw line
    ctx.moveTo(prevMouseX, prevMouseY); // set starting point of the line
    ctx.lineTo(e.offsetX, e.offsetY); // set end point of the line
    ctx.stroke(); // draw the line
    
}

//working function
const drawPolygon = (e) => {
    const sides = 6;
    const centerX = e.offsetX;
    const centerY = e.offsetY;
    const distX = e.offsetX - prevMouseX;
    const distY = e.offsetY - prevMouseY;
    const radius = Math.sqrt(distX ** 2 + distY ** 2);
    const angle = (2 * Math.PI) / sides;
  
    ctx.beginPath();
    ctx.moveTo(centerX + radius, centerY);
  
    for (let i = 1; i <= sides; i++) {
      const x = centerX + radius * Math.cos(i * angle);
      const y = centerY + radius * Math.sin(i * angle);
      ctx.lineTo(x, y);
    }
  
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
  }

  const drawEllipse = (e) => {
    ctx.beginPath(); // creating new path to draw ellipse
    // getting horizontal and vertical radius for ellipse according to the mouse pointer
    let radiusX = Math.abs(e.offsetX - prevMouseX) / 2;
    let radiusY = Math.abs(e.offsetY - prevMouseY) / 2;
    let centerX = Math.min(e.offsetX, prevMouseX) + radiusX;
    let centerY = Math.min(e.offsetY, prevMouseY) + radiusY;
  
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI); // creating ellipse according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill ellipse else draw border ellipse
    
  }


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas
    
    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else if(selectedTool === "triangle"){
        drawTriangle(e);
    } else if(selectedTool === "Polygon"){
        drawPolygon(e);
    } else if(selectedTool === "line"){
        drawline(e);
    } else if(selectedTool === "ellipse"){
        drawEllipse(e);
    }
    
}

function stop(e){
    if(isDrawing){
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
    }
    e.preventDefault();
    
    // if(e.type != 'mouseout'){
    // restore_array.push(snapshot);
    // index += 1;
    // }
    // console.log(restore_array);

    if(e.type != 'mouseout'){
        if (restore_array.length === 0) {
            restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            index += 1;
        } else {
            restore_array.splice(index + 1, restore_array.length - index - 1);
            restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            index += 1;
        }
    }
}

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker as selected color 
    selectedColor = colorPicker.value;
    colorPicker.parentElement.click();
});

function change_color(element){
    selectedColor = element.style.background;

}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

downloadImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

// canvas.addEventListener("mousedown", startDraw);
// canvas.addEventListener("mousemove", drawing);
// canvas.addEventListener("mouseup", () => isDrawing = false);

// add event listeners to the canvas
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);



 function clear_canvas(){
    ctx.fillStyle = "#fff";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     ctx.fillRect(0, 0, canvas.width, canvas.height);
   
     restore_array = [];
     index = -1;
 }

 function undo_last(){
     if (index <= 0){
         clear_canvas();
     } else {
         index -= 1; 
         restore_array.pop();
         ctx.putImageData(restore_array[index], 0, 0,);
     }

 }//my undo funct

//chatgpt undo
// function undo_last() {
//     if (index < 1) {
//       clear_canvas();
//     } else {
//       index -= 2; // pop two items
//       restore_array.pop();
//       restore_array.pop();
//       ctx.putImageData(restore_array[index], 0, 0);
//     }
//   }
 
 //Save in gallery
 // add event listener to the save button
saveButton.addEventListener('click', () => {
    // get the image data from the canvas
    const imageData = canvas.toDataURL();
  
    // save the image data to local storage
    localStorage.setItem('saved-artwork', imageData);
  
    // open a new tab to display the saved artwork
    window.open('gallery.html');
  });
