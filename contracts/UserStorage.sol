// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserStorage {
    struct User {
        bytes32 userHash;
        string username;
        string firstName;
        string lastName;
        string image;
        string addressInfo;
        string number;
    }

    mapping(address => User) private users;
    mapping(address => bool) private registered;
    mapping(string => bool) private usernames;

    function storeUser(
        address user,
        bytes32 userHash,
        string memory username
    ) public {
        require(!registered[user], "User already exists");
        require(!usernames[username], "Username already taken");

        users[user].userHash = userHash;
        users[user].username = username;
        registered[user] = true;
        usernames[username] = true;
    }

    function updateUser(
        address user,
        string memory firstName,
        string memory lastName,
        string memory image,
        string memory addressInfo,
        string memory number
    ) public {
        require(registered[user], "User does not exist");
        User storage userInfo = users[user];
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
        userInfo.image = image;
        userInfo.addressInfo = addressInfo;
        userInfo.number = number;
    }

    function getUser(address user) public view returns (User memory) {
        require(registered[user], "User does not exist");
        return users[user];
    }

    function isRegistered(address user) public view returns (bool) {
        return registered[user];
    }

    function isUsernameTaken(string memory username) public view returns (bool) {
        return usernames[username];
    }
}
