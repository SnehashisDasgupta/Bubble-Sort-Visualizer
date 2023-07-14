const length_of_array=20;
const array = [];

init();

let audioCtx = null;

//to create sound for iterating in every indices of array
function playNote(freq){
    if (audioCtx == null){
        audioCtx=new(AudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1; //controls the volume of sound
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime+dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

// create array of bars randomly
function init(){

    for(let i=0; i<length_of_array; i++){
        array[i] = Math.random();
    }
    showBars();
}

// show the bars on screen
function showBars(move){
    // empty the screen before showing another array
    container.innerHTML="";
    for(let i=0; i<length_of_array; i++){
        const bar = document.createElement("div");
        bar.style.height = array[i]*100+"%";
        bar.classList.add("bar")

        // changing the colour of two indices of array which is being sorting
        if (move && move.indices.includes(i)){
            //colour of bar will be 'red' if its swapping and if only iterating in array without swapping then 'black'
            bar.style.backgroundColor = move.type=="swap"?"gray": "green";
        }
        container.appendChild(bar);
    }
}

// function to play the sorting process
function play(){
    //storing the values of array in copy array then doing the sorting function 
    const copy = [...array];
    //after sorting process is done , the sorted array is printed
    const moves = bubbbleSort(copy);
    animate(moves);
}

function animate(moves){
    if (moves.length== 0){
        showBars(); //it makes all bars the same colour after sorting
        return;
    }

    const move = moves.shift();
    //storing the indices of array in i and j
    const [i,j] = move.indices;

    if (move.type == "swap"){
        [array[i], array[j]] = [array[j], array[i]];//moves the values of the indices
    }
    //create different sound for different values
    playNote(200 + array[i]*500) // one sound for one bar
    playNote(200 + array[j]*500)// one sound for another bar

    showBars(move);
    // shows the update of sorting in every 100 mili-seconds.
    setTimeout(function(){
        animate(moves);
    }, 60);
}

//bubble sort algorithm
function bubbbleSort(array){
    // SWAP array to store current two elemets which are swapping.It will be used in doing animation
    const moves = [];
    
    for(let i=0; i<length_of_array; i++){
        for(let j=0; j<(length_of_array - i - 1); j++){
            moves.push({indices: [j, j+1], type: "compare"});

            if(array[j] > array[j+1]){
                //it shows which indices is involved in the move and what type of move it is. (SWAP)
                moves.push({indices: [j, j+1], type: "swap"});

                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
        }
    }
    return moves;
}


