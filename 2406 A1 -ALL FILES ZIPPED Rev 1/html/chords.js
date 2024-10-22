/*
These functions handle parsing the chord-pro text format
*/

function parseChordProFormat(chordProLinesArray, transposedByNSemitones){
  //add the lines of text to html <p> elements
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = '' //clear the html
  let lyrics = ""
  let chords = ""
  let check = true;
  let num=0;// this number is to keep the spacing in between the chords and lyrics proper
  for (let i = 0; i < chordProLinesArray.length; i++){
    let line = chordProLinesArray[i]
    textDiv.innerHTML = textDiv.innerHTML + `<p>${chords}</p>`+`<p>${lyrics}<p>`
    //console.log(chords+"\n"+lyrics);
    lyrics = ""
    chords = ""
    num = 0;
    for(let letter of line){
      if(letter=="["){
        check = false;
        num = 0;
        if (transposedByNSemitones==0){
          chords += '<span class="chord">';
        }
        else{
          chords += '<span class="TransposedChord">';
        }
      }
      else if(letter=="]"){
        check = true;
        chords += '</span>';
      }
      if(check==true){
        if(letter=="["||letter=="]"){
        }
        else{
          lyrics += letter;
          --num;
          if (num<0){
            chords += " ";
          }
        }
      }
      else if(check==false){
        if(letter=="["||letter=="]"){
        }
        else{
          chords+=letter;
          ++num;
        }
      }
    }
  }
}

function TransposeUp(chordProLinesArray, transposedByNSemitones){
  //['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab'];
  const semitones = {"A": 0, "A#": 1, "Bb": 1, "B": 2, "C": 3, "C#": 4, "Db": 4, "D": 5,"D#": 6, "Eb": 6, "E": 7, "F": 8, "F#": 9, "Gb": 9, "G": 10, "G#": 11, "Ab": 11};
  let isChord = false;
  let chord="";
  let isMinor = false;
  let isChordEqu = false;
  let checkNum = 0;
  let counter = 0;
  for (let i = 0; i < chordProLinesArray.length; i++){
    var line = chordProLinesArray[i];
    for(let j = 0; j < line.length; j++){
      if (isMinor==true){
        line = line.split('');
        line[j]="";
        line = line.join('');
        isMinor = false;
      }
      if (isChord==true){
        if(line[j+1]=="#"||line[j+1] == "b"){
          chord = line[j]+line[j+1]
          isMinor = true;
        }
        else{
          chord = line[j];
        }
        counter = 0;
        checkNum = 0;
        for (var x in semitones){
          counter=counter+1;
          if(isChordEqu==true&&checkNum!=semitones[x]||counter==17){
            if (counter==17){
              line = line.split('');
              line[j]="A";
              line = line.join('');
              isChord = false;
              isChordEqu = false;
              break;
            }
            else{
              line = line.split('');
              line[j] = x;
              line = line.join('');
              isChord = false;
              isChordEqu = false;
              break;
            }
          }
          if (chord==x){
            isChordEqu = true;
            checkNum = semitones[x]
          }
        }
      }
      if (line[j] == "["||line[j] == "/"){
        isChord=true;
      }
    }
    chordProLinesArray[i] = line;
  }
  parseChordProFormat(chordProLinesArray, transposedByNSemitones);
  return chordProLinesArray;
}

function TransposeDown(chordProLinesArray, transposedByNSemitones){
  //['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab'];
  const semitones = {"A": 0, "A#": 1, "Bb": 1, "B": 2, "C": 3, "C#": 4, "Db": 4, "D": 5,"D#": 6, "Eb": 6, "E": 7, "F": 8, "F#": 9, "Gb": 9, "G": 10, "G#": 11, "Ab": 11};
  let isChord = false;
  let chord="";
  let isMinor = false;
  let checkNum = 0;
  let previous = "G#";
  let Chordb = false;
  let checkForb = 0;
  for (let i = 0; i < chordProLinesArray.length; i++){
    var line = chordProLinesArray[i];
    for(let j = 0; j < line.length; j++){
      if (isMinor==true){
        line = line.split('');
        line[j]="";
        line = line.join('');
        isMinor = false;
      }
      if (isChord==true){
        if(line[j+1]=="#"||line[j+1] == "b"){
          chord = line[j]+line[j+1]
          isMinor = true;
          if(line[j+1]=="b"){
            Chordb=true;
          }
        }
        else{
          chord = line[j];
        }
        checkForb=0;
        checkNum = -1;
        previous = "G#";
        for (var x in semitones){
          if (chord==x){
            line = line.split('');
            line[j] = previous;
            line = line.join('');
            isChord = false;
            Chordb = false;
            break;
          }
          if (checkNum!=semitones[x]&&Chordb==false){
            checkNum = semitones[x];
            previous = x;
          }
          if(checkNum!=semitones[x]&&Chordb==true){
            if(x=="A#"||x=="C#"||x=="D#"||x=="F#"||x=="G#"){
            }
            else{
              checkNum = semitones[x];
              previous = x;
            }
          }
        }
      }
      if (line[j] == "["||line[j] == "/"){
        isChord=true;
      }
    }
    chordProLinesArray[i] = line;
  }
  parseChordProFormat(chordProLinesArray, transposedByNSemitones);
  return chordProLinesArray;
}