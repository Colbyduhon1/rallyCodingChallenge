const VALID_WORDS = require('./dictionary.json');
const UPPERCASE_LETTERS = [];

//Store UpperCase Letters for adding characters to string
for (var i = 0; i < 26; i++){
	var char = String.fromCharCode(65 + i);
	UPPERCASE_LETTERS.push(char);
}

//Checks dictionary if word exists
function isValidWord(string) {
  return VALID_WORDS.hasOwnProperty(string);
}

function isAnagram(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  [str1, str2] = makeAnagram(str1, str2);

  return str1 === str2;
}


function makeAnagram(str1, str2) {  
  str1 = str1.split('').sort().join('');
  str2 = str2.split('').sort().join('');

  return [str1, str2];
}

function findStartIndexDifferentChar(str1, str2) {
  for (var i = 0; i < str1.length; i++) {
    if (str1.charAt(i) !== str2.charAt(i)) {
      return i;
    }
  }
}
function findLowestDistanceCosts(costs, str1, str2){
	checkValidInput(costs, str1, str2);
	str1 = str1.toUpperCase();
	str2 = str2.toUpperCase();


  let addCost = costs[0];
  let deleteCost = costs[1];
  let changeCost = costs[2];
  let anagramCost = costs[3];
  let lowestCost = Number.POSITIVE_INFINITY;
  //Recursive function that changes the strings till matching (if valid words exist)
  function transformString(curstr1, curstr2, curCost, curCache) {
    // Base case
    if (curCost >= lowestCost) {
      return;
    } else if (curstr1 === curstr2) {
        lowestCost = Math.min(lowestCost, curCost); 
        return;
    }
    
    curCache[curstr1] = curstr1;
    let newstr1;

    //Add letter to string where needed and if valid word exists recursive call with added cost
    if (curstr1.length < curstr2.length) {
    	   let index = findStartIndexDifferentChar(curstr1, curstr2);
            for (let i = index; i < curstr1.length; i++) {
              for (let letter of UPPERCASE_LETTERS) {
                newstr1 = curstr1.slice(0, i) + letter + curstr1.slice(i);
                if (isValidWord(newstr1) && newstr1 !== curstr1 && !curCache.hasOwnProperty(newstr1)) { 
                  transformString(newstr1, curstr2, curCost + addCost, curCache);            
                }
              }
          }
       //Add letter to end of string if no addition 'within' the string
       for (let letter of UPPERCASE_LETTERS) {
          newstr1 = curstr1 + letter;
          if (isValidWord(newstr1)) { 
            transformString(newstr1, curstr2, curCost + addCost, curCache);
          }
        }
    } 
    //Delete letter from string and if valid word exists recursive call with deletion cost
    else if (curstr1.length > curstr2.length) {
        	for (let i = 0; i < curstr1.length; i++) {
        		newstr1 = curstr1.substr(0, i) + curstr1.substr(i + 1);
        		if (isValidWord(newstr1)) {
          			transformString(newstr1, curstr2, curCost + deleteCost, curCache);
        		}
      		}
    } else {
    //Check if anagram of string exists and add anagramCost
        if (isAnagram(curstr1, curstr2)) { 
          [curstr1, curstr2] = makeAnagram(curstr1, curstr2);
          transformString(curstr1, curstr2, curCost + anagramCost, curCache);
        } else {
            //Change letter of string 
            let index = findStartIndexDifferentChar(curstr1, curstr2);
            for (let i = index; i < curstr1.length; i++) {
              for (let letter of UPPERCASE_LETTERS) {
                newstr1 = curstr1.substr(0, i) + letter + curstr1.substr(i + 1);
                if (isValidWord(newstr1) && newstr1 !== curstr1 && !curCache.hasOwnProperty(newstr1)) { 
                  transformString(newstr1, curstr2, curCost + changeCost, curCache);            
                }
              }
            }
            return;
        }
    }
  }

  transformString(str1, str2, 0, {});
  return lowestCost === Number.POSITIVE_INFINITY ? -1 : lowestCost;
}


function checkValidInput(costs, str1, str2) {
  if (arguments.length !== 3) {
    throw new Error('Error! Please enter 3 arguments.');
  } else if (!isValidWord(str1) || !isValidWord(str2)) {
      throw new Error('Error! Strings must be words in dictionary.');
  } else if (typeof str1 !== 'string' || typeof str2 !== 'string') {
      throw new Error('Error! Please enter 2 strings as arguments.');
  } else if (costs.length !== 4) {
      throw new Error('Error! Costs array must have 4 values.');
  } else if (str1.length < 3 || str2.length < 3) {
    throw new Error('Error! Strings must be at least 3 characters in length.');
  } else if (!Array.isArray(costs)) {
      throw new Error('Error! Costs argument must be an array.');
  }
  return true;
}



let testData = [
  [[1,3,1,5], 'HEALTH', 'HANDS', 7],
  [[1,9,1,3], 'TEAM', 'MATE', 3],
  [[7,1,5,2], 'OPHTHALMOLOGY', 'GLASSES', -1],
  [[1,2,3,4], 'MONKEY', 'MONKEY', 0],
  [[1,2,3,4], 'CAT', 'FATE', 4],
  [[1,3,2,4], 'BAT', 'BAIT', 1],
  [[2,3,1,4], 'MAT', 'MATH', 2],
  [[1,2,3,4], 'TOOTH', 'TEETH', -1],
  [[1,2,3,4], 'BROOK', 'BOOK', 2],
  [[2,4,2,5], 'HAT', 'BAT', 2]
];

function runTests(tests) {
  console.log('RUNNING TEST SUITE');

  let total = 0;
  let passed = 0;

  tests.forEach((test) => {
    total += 1;

    let costs = test[0];
    let start = test[1];
    let end = test[2];
    let expected = test[3];
    let actual = findLowestDistanceCosts(costs, start, end);

    console.log(`\n${total}: Start Word: ${start}, End Word: ${end}, Expected Output: ${expected}, Actual Output: ${actual}`);
    
    if (actual === expected) {
      passed += 1;
      console.log('TEST PASSED');
    } else {
      console.log('TEST FAILED');
    }
  });
	if(passed === total){
		console.log('ALL TESTS PASSED');
	}
}

//ERROR HANDLING:
//console.log(findLowestDistanceCosts([1,2,3,4],'COOK'));
//console.log(findLowestDistanceCosts([1,2,3,4], 'MICKY', 'MOUSE'));
//console.log(findLowestDistanceCosts([1,2,3,4], 1, 'COOK'));
//console.log(findLowestDistanceCosts([1,2,3], 'BOOK', 'COOK'));
//console.log(findLowestDistanceCosts([1,2,3,4], 'BO', 'BOB'));
//console.log(findLowestDistanceCosts(1, 'COOP', 'COOK'));


runTests(testData);

