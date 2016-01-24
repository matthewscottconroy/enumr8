'use strict';


function Enum(source, nameOrIsWrapped1, nameOrIsWrapped2, compare) {


  /////////////Initializations///////////////////////////////////////////////////////////////////////////////////////////

  var enumTypeDefinition = {};

  var typeName = "";
  var isWrapped = true;

  var labels = []; //a list of the property names in order
  var values = []; //a list of the property values in order
  var dictionary = {};

  var testEquality = null;


  ////////////////Resolve 2nd, 3rd, and 4th optional parameters///////////////////////////////////////////////////////////
  (function() {
    var nameOrIsWrapped1_type = typeof nameOrIsWrapped1;
    var nameOrIsWrapped2_type = typeof nameOrIsWrapped2;
    var compare_type = typeof compare;

    if (nameOrIsWrapped1_type === "boolean") {
      isWrapped = nameOrIsWrapped1;

      if (nameOrIsWrapped2_type === "string") {
        typeName = nameOrIsWrapped2;
      } else if (!nameOrIsWrapped2) {
        //placeholder to prevent exception from throwing for the case of an omitted optional parameter or a null parameter
      } else {
        throw "A string was expected for your third parameter. Enum type was not constructed.";
      }
    } else if (nameOrIsWrapped1_type === "string") {
      typeName = nameOrIsWrapped1;

      if (nameOrIsWrapped2_type === "boolean") {
        isWrapped = nameOrIsWrapped2;
      } else if (!nameOrIsWrapped2) {
        //placeholder to prevent exception from throwing for the case of an omitted optional parameter or a null parameter
      } else {
        throw "A boolean was expected for your third parameter. Enum type was not constructed.";
      }
    } else if (!nameOrIsWrapped1) {
      if (nameOrIsWrapped2_type === "boolean") {
        isWrapped = nameOrIsWrapped2;
      } else if (nameOrIsWrapped2_type === "string") {
        typeName = nameOrIsWrapped2;
      } else if (!nameOrIsWrapped2) {
        //placeholder to prevent exception from throwing for the case of an omitted optional parameter or a null parameter
      } else {
        throw "A string, boolean, or omission was expected for your third parameter. Enum type was not constructed.";
      }
    }

    if (compare_type === "function") {
      if (compare.length === 2) {
        testEquality = compare;
      } else {
        throw "Your equality function must take two parameters. Enum type was not constructed.";
      }
    } else if (!compare) {

    } else {
      throw "The fourth parameter must be a function that accepts two objects and returns a boolean indicating if the objects are equal. Enum type was not constructed.";
    }
  })();



  ////////////////Construct the data structures enum relies on from source////////////////////////////////////////////////////////////////////////////
  (function() {
    if (source.constructor === Array) {
      if (source.length === 0) {
        throw "The first argument cannot have zero elements. Enum type was not successfully created.";
      }

      if (typeof source[0] === "object") { //if source is formatted: [{userlabel:"userValue"},{userlabel2:"userValue"},{userlabel3:"userValue"},...]
        for (var i = 0; i < source.length; i++) {
          var label = Object.getOwnPropertyNames(source[i])[0];
          var value = source[i][label];

          labels.push(label);
          values.push(value);
          dictionary[label] = value;
        }
      } else { //if source is formated: ["userValue", "userValue", "userValue",...]
        for (var iter = 0; iter < source.length; iter++) {
          labels.push(source[iter]);
          values.push(source[iter]);
          dictionary[source[iter]] = source[iter];
        }
      }
    } else if (typeof source === "object" && source !== null) { //if source is formatted: {userlabel : "userValue", userlabel : "userValue", userLabel : "userValue"}
      dictionary = source;
      labels = Object.getOwnPropertyNames(source);

      for (var lbl in source) {
        values.push(source[lbl]);
      }
    } else {
      throw "You must supply a first parameter that is either an array or a filled object. Enum type was not successfully created.";
    }
  })();









  /*Enum Definition properties////////////////////////////////////////////////////////////////////
   *
   *
   */ //////////////////////////////////////////////////////////////////////////////////////////////

  function eLabelOfValue(value) {
    return labels[eIndexOfValue(value)];
  }

  function eLabelOfIndex(index) {

    var returnValue = null;

    if (isInteger(index)) {
      if (isWrapped === false) {
        if (index > 0 && index < labels.length) {
          return labels[index];
        } else {
          throw "Enum index was not gotten in eGetValueByIndex() call. The index was outside the range of possible values. " +
          "If you were expecting cyclical indexing, consider redefining your Enum definition setting the second or " +
          "third parameter of the constructor to true. You can also omit the boolean parameter for the same effect.";
        }
      } else {
        returnValue = labels[(labels.length + (index % labels.length)) % labels.length]; //wrap around
      }
    } else {
      throw "Index parameter must be an integer. Index was not set.";
    }

    return returnValue;
  }

  function eValue(numberOrLabel) {
    var returnValue = null;

    if (isInteger(numberOrLabel)) {
      returnValue = eValueOfIndex(numberOrLabel);
    } else if (typeof numberOrLabel === "string") {
      returnValue = eValueOfLabel(numberOrLabel);
    } else {
      throw "The parameter for eValue() must be a number or a string. Enum value was not returned.";
    }

    return returnValue;
  }

  function eValueOfIndex(index) {
    if (isInteger(index)) {
      if (isWrapped === false) {
        if (index > 0 && index < labels.length) {
          return values[index];
        } else {
          throw "Enum index was not gotten in eGetValueByIndex() call. The index was outside the range of possible values. " +
          "If you were expecting cyclical indexing, consider redefining your Enum definition setting the second or " +
          "third parameter of the constructor to true. You can also omit the boolean parameter for the same effect.";
        }
      } else {
        return values[(labels.length + (index % labels.length)) % labels.length]; //wrap around
      }
    } else {
      throw "Index parameter must be an integer. Index was not set.";
    }
  }

  function eIndexOfLabel(label) {
    if (typeof label !== "string") {
      throw "The parameter of eIndexOfLabel() must be of type string. Index was not returned.";
    }

    var result = labels.indexOf(label);

    if (result === -1) {
      throw "Label was not found in Enum Definition in call to eIndexOfLabel().";
    }

    return result;
  }

  function eIndexOfValue(value) {
    //YOU"RE WORKING HERE/////////////////////////////////////////////////////////
    //return values.indexOf(value);
    var returnValue = null;

    if (testEquality !== null) { //if the equality parameter was passed to the constructor

      var result = false;

      for (var i = 0; i < values.length; i++) {
        result = testEquality(value, values[i]);

        if (result === true) {
          returnValue = i;
        }
      }

      if (result === false) {
        throw "Could not get index of value in the call to eIndexOfValue(), value was not found. Ensure that an object meeting the criteria" +
        " of your equality parameter exists in the Enum definition " +
        "and that the criteria of your equality function is behaving as you intend it to.";
      }
    } else {
      var index = values.indexOf(value);

      if (index !== -1) {
        returnValue = index;
      } else {
        throw "Could not get index of value in the call to eIndexOfValue(), value was not found. If your value is an object(non-primitive),  " +
        "please note that setByValue() determines value equivalence using === which compares objects by reference. " +
        "If it was not your intention to test that your object was the same instance as the value for the Enum, please" +
        "make sure that you include (or included) a compare function parameter (the 4th one) to test equality in your Enum definition.";
      }
    }

    return returnValue;
  }

  function eFirst() {
    return values[0];
  }

  function eLast() {
    return values[values.length - 1];
  }

  function eInverse(numberOrLabel) {
    if (isInteger(numberOrLabel)) {
      return eValueOfIndex(-numberOrLabel);
    } else if (typeof numberOrLabel === "string") {
      return eValueOfIndex(-eIndexOfLabel(numberOrLabel));
    } else {
      throw "The parameter for eValue() must be a number or a string. Enum value was not returned.";
    }
  }









  /*//////This function generates an instance of the Enum definition////////////////////////
   *
   *
   */ ////////////////////////////////////////////////////////////////////////////////////////

  function eCreate(initializationValue) {
    var enumObject = {};
    var iterator = 0;

    //initialize object///////////////////////
    (function() {
      if (isInteger(initializationValue)) {
        setByIndex(initializationValue);
      } else if (typeof initializationValue === "string") {
        setByLabel(initializationValue);
      } else if (!initializationValue) {
        iterator = 0;
      } else {
        throw "Enum instance not created using eCreate() due to an incorrectly-typed initialization parameter." +
        " You can only assign new instances by enum index (Number) or enum label (String). " +
        "If you need to assign the instance a particular value, please call the instance's setByValue() method.";
      }
    })();

    function increment() {
      iterator++;

      if (iterator > labels.length - 1) {
        if (isWrapped === true) {
          iterator = 0;
        } else {
          throw "Enum cannot be incremented beyond the maximum index. Increment failed. Did you intend to construct an enum type with wrap around set to true?";
        }
      }
    }

    function decrement() {
      iterator--;

      if (iterator < 0) {
        if (isWrapped === true) {
          iterator = labels.length - 1;
        } else {
          throw "Enum cannot be decremented beyond the minimum index. Decrement failed. Did you intend to construct an enum type with wrap around set to true?";
        }
      }
    }

    function setToNext() {
      increment();
    }

    function setToPrevious() {
      decrement();
    }

    function getTypeName() {
      return typeName;
    }

    function getDefinition() {
      return enumTypeDefinition;
    }

    function getDictionary() {
      return dictionary;
    }

    function getLabel() {
      return labels[iterator];
    }

    function setByLabel(label) {
      var index = labels.indexOf(label);

      if (index !== -1) {
        iterator = index;
      } else {
        throw "Could not setByLabel(), label was not found.";
      }
    }

    function getValue() {
      return values[iterator];
    }

    function setByValue(value) {

      if (testEquality !== null) { //if the equality parameter was passed to the constructor

        var result = false;

        for (var i = 0; i < values.length; i++) {
          result = testEquality(value, values[i]);

          if (result === true) {
            iterator = i;
            break;
          }
        }

        if (result === false) {
          throw "Could not setByValue(), value was not found. Ensure that an object meeting the criteria" +
          " of your equality parameter exists in the Enum definition " +
          "and that the criteria of your equality function is behaving as you intend it to.";
        }
      } else {
        var index = values.indexOf(value);

        if (index !== -1) {
          iterator = index;
        } else {
          throw "Could not setByValue(), value was not found. If your value is an object(non-primitive),  " +
          "please note that setByValue() determines value equivalence using === which compares objects by reference. " +
          "If it was not your intention to test that your object was the same instance as the value for the Enum, please" +
          "make sure that you include (or included) a compare function parameter (the 4th one) to test equality in your Enum definition.";
        }
      }
    }

    function getIndex() {
      return iterator;
    }

    function setByIndex(index) {
      if (isInteger(index)) {
        if (isWrapped === false) {
          if (index > 0 && index < labels.length) {
            iterator = index;
          } else {
            throw "Enum index was not set in setByIndex() call. The index was outside the range of possible values. " +
            "If you were expecting cyclical indexing, consider redefining your Enum definition setting the second or " +
            "thrid parameter to true. You can also omit the boolean parameter for the same effect.";
          }
        } else {
          iterator = (labels.length + (index % labels.length)) % labels.length; //wrap around
        }
      } else {
        throw "Index parameter must be an integer. Index was not set.";
      }
    }

    function add(index) {
      if (isInteger(index)) {
        setByIndex(iterator + index);
      } else {
        throw "The value to add must be an integer.";
      }
    }

    function subtract(index) {
      if (isInteger(index)) {
        setByIndex(iterator - index);
      } else {
        throw "The value to subtract must be an integer.";
      }
    }

    function multiply(index) {
      if (isInteger(index)) {
        setByIndex(index * iterator);
      } else {
        throw "The value to multiply must be an integer.";
      }
    }

    function getInverse() {
      return eInverse(iterator);
    }

    function invert() {
      setByIndex(-iterator);
    }

    function getPrevious() {
      var previous = iterator - 1;

      if (previous < 0) {
        if (isWrapped === true) {
          previous = labels.length - 1;
        } else {
          throw "There is no previous. getPrevious() failed. Did you intend to construct an enum type with wrap around set to true?";
        }
      }

      return values[previous];
    }

    function getNext() {
      var next = iterator + 1;

      if (next > labels.length - 1) {
        if (isWrapped === true) {
          next = 0;
        } else {
          throw "There is no next. getNext() failed. Did you intend to construct an enum type with wrap around set to true?";
        }
      }
      return values[next]; //need to do wrap around
    }

    function setToFirst() {
      iterator = 0;
    }

    function setToLast() {
      iterator = values.length - 1;
    }



    enumObject.increment = increment;
    enumObject.decrement = decrement;
    enumObject.setToNext = setToNext;
    enumObject.setToPrevious = setToPrevious;
    enumObject.getTypeName = getTypeName;
    enumObject.getDefinition = getDefinition;
    enumObject.getDictionary = getDictionary;
    enumObject.getLabel = getLabel;
    enumObject.setByLabel = setByLabel;
    enumObject.getValue = getValue;
    enumObject.setByValue = setByValue;
    enumObject.getIndex = getIndex;
    enumObject.setByIndex = setByIndex;
    enumObject.add = add;
    enumObject.subtract = subtract;
    enumObject.multiply = multiply;
    enumObject.getInverse = getInverse;
    enumObject.invert = invert;
    enumObject.getPrevious = getPrevious;
    enumObject.getNext = getNext;
    enumObject.setToFirst = setToFirst;
    enumObject.setToLast = setToLast;

    Object.freeze(enumObject);

    return enumObject;
  }



  //Attach Enum Definition Properties

  enumTypeDefinition.eType = typeName;
  enumTypeDefinition.eWrapped = isWrapped;
  enumTypeDefinition.eLabels = labels;
  enumTypeDefinition.eValues = values;
  enumTypeDefinition.eDictionary = dictionary;
  enumTypeDefinition.eLength = labels.length;


  enumTypeDefinition.eLabelOfValue = eLabelOfValue;
  enumTypeDefinition.eLabelOfIndex = eLabelOfIndex;
  enumTypeDefinition.eValue = eValue;
  enumTypeDefinition.eValueOfIndex = eValueOfIndex;
  enumTypeDefinition.eIndexOfLabel = eIndexOfLabel;
  enumTypeDefinition.eIndexOfValue = eIndexOfValue;
  enumTypeDefinition.eFirst = eFirst;
  enumTypeDefinition.eLast = eLast;
  enumTypeDefinition.eInverse = eInverse;
  enumTypeDefinition.eCreate = eCreate;






  //////////////////////////////Freeze all the data and generate enum properties from dictionary/////////////////////////////////////////////
  (function() {
    for (var key in dictionary) {
      if (enumTypeDefinition.hasOwnProperty(key)) {
        throw "Enum labels cannot have the same name as reserved Enum properties: " +
        "eType, eWrapped, eLabels, eValues, eDictionary, eLength, eLabelByIndex, " +
        "eLabelByValue, eValue, eIndexOfLabel, eIndexOfValue, eCreate, or inherited others. Enum type was not created.";
      }

      enumTypeDefinition[key] = dictionary[key];
    }

    deepFreeze(enumTypeDefinition);
  })();

  return enumTypeDefinition;
}





/*/////Utility Functions//////////////////////////////////////////////////////////////////////////////////////////
 *
 *
 */ ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function deepFreeze(obj) {
  if (typeof obj === 'object') {
    Object.freeze(obj);

    for (var property in obj) {
      deepFreeze(obj[property]);
    }
  }
}

function isInteger(x) {
  return (typeof x === 'number') && (x % 1 === 0);
}


module.exports = Enum;
