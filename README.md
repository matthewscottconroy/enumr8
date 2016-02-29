# enumr8
A javascript module for defining custom enum types and generating instances of that type.

##How to use
```
const createEnumType = require('enumr8');



//DAYS OF THE WEEK EXAMPLE/////////////////////////////////////////////////////

//define an enum type consisting of the days of the week
let Weekday = createEnumType(['Sunday',
                              'Monday',
                              'Tuesday',
                              'Wednesday',
                              'Thursday',
                              'Friday',
                              'Saturday']);

//retrieve first and last                               
console.log(Weekday.eFirst());
console.log(Weekday.eLast());

//retrieve the value of Friday
console.log(Weekday.Friday);

//get number of days in the week
console.log(Weeday.eLength)




let today = Weekday.eCreate('Tuesday');
console.log(today.getValue()); //Tuesday

today.increment();
console.log(today.getValue()); //Wednesday

today.add(3);
console.log(today.getValue()); //Saturday

today.add(2);
console.log("Today is now " + today.getValue());      //Monday

console.log("Yesterday was " + today.getPrevious());  //Sunday
console.log("Tomorrow is " + today.getNext());        //Tuesday

today.decrement();
console.log("Today is now " + today.getValue()); //Sunday

today.decrement();
console.log("Today is now " + today.getValue()); //Saturday

today.setByValue(Weekday.Thursday);
console.log("Today is now " + today.getValue()); //Thursday


//HEXADECIMAL EXAMPLE//////////////////////////////////////////////////////////

//define an enum type consisting of the symbols for hexadecimal
let HexadecimalDigit = createEnumType({   "0" : 0,
                                          "1" : 1,
                                          "2" : 2,
                                          "3" : 3,
                                          "4" : 4,
                                          "5" : 5,
                                          "6" : 6,
                                          "7" : 7,
                                          "8" : 8,
                                          "9" : 9,
                                          "a" : 10,
                                          "b" : 11,
                                          "c" : 12,
                                          "d" : 13,
                                          "e" : 14,
                                          "f" : 15}, "Hexadecimal", true);

let HexadecimalNumber =

function hexParser(hexString){

}

//TELLING TIME/////////////////////////////////////////////////////////////////

let Period = createEnumType(["AM", "PM"]);

let Hour = createEnumType(["12","1","2","3","4","5","6","7","8","9","10","11"]);

let Minute = createEnumType(["00","01","02","03","04","05","06","07","08","09",
                            "10","11","12","13","14","15","16","17","18","19",
                            "20","21","22","23","24","25","26","27","28","29",
                            "30","31","32","33","34","35","36","37","38","39",
                            "40","41","42","43","44","45","46","47","48","49",
                            "50","51","52","53","54","55","56","57","58","59"]);

let time = { "hour": Hour.eCreate(4),
             "minute": Minute.eCreate(20),
             "period": Period.eCreate("AM")
           };

//INCHES, FEET, YARDS/////////////////////////////////////////////////////////

let Inch = createEnumType({ "": 0,
                            "1 inch": 1,
                            "2 inches": 2,
                            "3 inches": 3,
                            "4 inches" : 4,
                            "5 inches" : 5,
                            "6 inches": 6,
                            "7 inches": 7,
                            "8 inches" : 8,
                            "9 inches" : 9,
                            "10 inches": 10,
                            "11 inches": 11
                          });
let Foot = createEnumType({ "": 0,
                            "1 foot": 1,
                            "2 feet": 2,
                          });



//DICE////////////////////////////////////////////////////////////////////////

let Dice = createEnumType({"One":1,"Two":2,"Three":3,"Four":4,"Five":5,"Six":6});

let blueDie = Dice.eCreate();
let greenDie = Dice.eCreate();

const SIX_CUBED = Math.pow(6,3);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function rollDie(die){
  die.setByIndex(getRandomInt(0,SIX_CUBED));
}

function printDiceTotal(die1, die2){
  console.log("Dice total is " + (die1.getValue() + die2.getValue()));
}

console.log(blueDie.getLabel()); //"One"
console.log(greenDie.getLabel()); //"One"

greenDie.increment();
console.log(greenDie.getLabel()); //"Two"

//roll Dice
rollDie(blueDie);
rollDie(greenDie);

console.log("The blue die is now " blueDie.getLabel() + ".");
console.log("The green die is now " greenDie.getLabel() + ".");

printDiceTotal(blueDie, greenDie);


//Caesar Cipher////////////////////////////////////////////////////////////////

let Alphabet = createEnumType(["a","b","c","d","e","f","g","h","i","j","k",
                              "l","m","n","o","p","q","r","s","t","u","v",
                              "w","x","y","z"]);

//functional cypher
function convertStrToEnum(str){


  return enum;
}

function convertEnumToStr(enum){

  return str;
}

function shiftMsg(enum, integer){

    return enum;
}

function cyphon(str, shiftVal){
  return convertEnumToStr(shiftMsg(converStrToEnum(str), shiftVal));
}

//Testing...
let encodedMsg = cyphon("Time flies like an arrow.", 4);
console.log(encodedMsg);


//object-oriented cypher
function cypher(message){
  let cyph = {}
  let enum = convertStringToEnum(message);
  let msg = message

  function getOriginalMessage(){
    return msg;
  }

  function shift(n){
      shiftMsg(enum, n);
  }

  function getEncryptedMessage(){
    return convertEnumToStr(enum);
  }

  cyph.getOriginalMessage = getOriginalMessage;
  cyph.shift = shift;
  cyph.getEncryptedMessage = getEncryptedMessage;

  return cyph;
}



let c = cypher("When all you have is a hammer, everything looks like a nail.");
console.log(c.getOriginalMessage());

c.shift(-27);
console.log(c.getEncryptedMessage());
console.log(c.getOriginalMessage());



```

##API
