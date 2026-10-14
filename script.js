import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
import {
    mergeAndFormatUsers,
    validateUser,
    filterUsers,
    sortUsers,
    findUser,
    getPercentage
} from './src/utils/teachers.js';

const finalUsersArray = mergeAndFormatUsers(randomUserMock, additionalUsers);
console.log("finalUsersArray: ");
console.log(finalUsersArray);

//task 2

const validUsers = finalUsersArray.filter(validateUser);
console.log("validUsers: ");
console.log(validUsers);

//task 3

const criteria = {
    country: "Germany",
    gender: "male"
};

const filteredUsers = filterUsers(finalUsersArray, criteria);
console.log("filteredUsers: ");
console.log(filteredUsers);

//task 4

const sortedByAgeDesc = sortUsers(finalUsersArray, 'age', 'desc');
console.log("sortedByAgeDesc: ");
console.log(sortedByAgeDesc);
const sortedByAgeAsc = sortUsers(finalUsersArray, 'age', 'asc');
console.log("sortedByAgeAsc: ");
console.log(sortedByAgeAsc);

//task 5

const foundUser = findUser(finalUsersArray, 'full_name', 'Norbert');
console.log("foundUser: ");
console.log(foundUser);

//task 6

const percentage = getPercentage(finalUsersArray, user => user.age > 30);
console.log("Percentage of users older than 30: ");
console.log(percentage);
